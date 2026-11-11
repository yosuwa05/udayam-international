import puppeteer from "puppeteer"
import path from "path"
import { numberToWordsIndian } from "./numberToWords"

const FALLBACK = "-"

function formatDate(date: unknown, fallback: string = FALLBACK): string {
    if (!date) return fallback
    const d = new Date(date as string | number | Date)
    if (isNaN(d.getTime())) return fallback
    const dd = String(d.getDate()).padStart(2, "0")
    const mm = String(d.getMonth() + 1).padStart(2, "0")
    return `${dd} / ${mm} / ${d.getFullYear()}`
}

export interface ITaxInvoiceData {
    booking: any
    payments: any[]
    customer?: any
    pkg?: any
    invoiceDate?: Date
}

export async function generateTaxInvoicePDF(data: ITaxInvoiceData): Promise<Buffer> {
    const { booking, payments, customer, pkg, invoiceDate } = data

    const templatePath = path.join(process.cwd(), "src/templates/tax-invoice.html")
    let htmlContent = await Bun.file(templatePath).text()

    const invoiceNumber =
        booking.taxInvoiceNumber ||
        "UI / UVH / TI / 26-27 / 00001"

    const formattedInvoiceDate = formatDate(invoiceDate || new Date())
    const bookingReference =
        booking.bookingConfirmationNumber ||
        booking.bookingNumber ||
        FALLBACK

    const customerName =
        booking.travellerInfo?.fullName ||
        customer?.name ||
        customer?.fullName ||
        "Customer"

    const travellerAddrParts = [
        booking.travellerInfo?.address,
        booking.travellerInfo?.landmark ? `Near ${booking.travellerInfo.landmark}` : "",
        booking.travellerInfo?.pincode ? `PIN: ${booking.travellerInfo.pincode}` : "",
    ].filter(Boolean)
    const customerAddress =
        travellerAddrParts.length > 0
            ? travellerAddrParts.join(", ")
            : (customer?.address || FALLBACK)

    const customerState =
        booking.travellerInfo?.state ||
        customer?.state ||
        "Tamil Nadu"

    const customerGstin =
        customer?.gstin ||
        booking.travellerInfo?.gstin ||
        "[If applicable] -"

    const stateCode =
        customerState.toLowerCase().includes("tamil") ? "33" : (customer?.stateCode || "33")
    const placeOfSupply = `${customerState} (Code: ${stateCode})`

    // Package description
    const pkgTitle = pkg?.title || "Tour Package"
    const pkgDuration =
        pkg?.durationDays
            ? ` – ${pkg.durationDays} Days & ${pkg.durationNights || (pkg.durationDays - 1)} Nights`
            : ""
    const packageTitle = `${pkgTitle}${pkgDuration}`

    const travelDate = formatDate(booking.travellerInfo?.travelDate)

    // Number of travellers calculation
    let numberOfTravellers = `${booking.travellerInfo?.numberOfPersons || 1} Persons`
    if (Array.isArray(booking.travellerInfo?.travellers) && booking.travellerInfo.travellers.length > 0) {
        const adults = booking.travellerInfo.travellers.filter((t: any) => (t.age || 0) >= 12).length
        const children = booking.travellerInfo.travellers.filter((t: any) => (t.age || 0) < 12).length
        if (adults > 0 && children > 0) {
            numberOfTravellers = `${adults} Adult${adults > 1 ? "s" : ""} + ${children} Child${children > 1 ? "ren" : ""}`
        } else if (adults > 0) {
            numberOfTravellers = `${adults} Adult${adults > 1 ? "s" : ""}`
        }
    }

    // Amounts & Tax calculations
    const finalAmount = Number(booking.pricingDetails?.finalAmount) || 0
    const gstRate = pkg?.gstPercentage ?? booking.pricingDetails?.gstPercentage ?? 5
    const taxableValue =
        booking.pricingDetails?.originalAmount ||
        Math.round((finalAmount * 100) / (100 + gstRate))
    const totalTaxAmount = finalAmount - taxableValue

    const isIntraState = stateCode === "33" || customerState.toLowerCase().includes("tamil")
    let taxRowsHtml = ""

    if (isIntraState) {
        const halfRate = (gstRate / 2).toFixed(1).replace(/\.0$/, "")
        const cgstAmount = Math.round(totalTaxAmount / 2)
        const sgstAmount = totalTaxAmount - cgstAmount

        taxRowsHtml = `
            <tr>
                <td>CGST</td>
                <td>${halfRate}%</td>
                <td class="amount-col">₹${cgstAmount.toLocaleString("en-IN")}</td>
            </tr>
            <tr>
                <td>SGST</td>
                <td>${halfRate}%</td>
                <td class="amount-col">₹${sgstAmount.toLocaleString("en-IN")}</td>
            </tr>
        `
    } else {
        taxRowsHtml = `
            <tr>
                <td>IGST</td>
                <td>${gstRate}%</td>
                <td class="amount-col">₹${totalTaxAmount.toLocaleString("en-IN")}</td>
            </tr>
        `
    }

    // Payment references
    const successPayments = (payments || []).filter((p: any) => p.status === "SUCCESS")
    const paymentsReceived = successPayments.reduce(
        (sum: number, p: any) => sum + (Number(p.amount) || 0),
        0
    )
    const balancePayable = Math.max(0, finalAmount - paymentsReceived)

    const rvList = successPayments
        .map((p: any) => p.receiptVoucherNumber)
        .filter(Boolean)

    let receiptVoucherReferences = "-"
    if (rvList.length === 1) {
        receiptVoucherReferences = rvList[0]
    } else if (rvList.length === 2) {
        receiptVoucherReferences = `${rvList[0]} & ${rvList[1]}`
    } else if (rvList.length > 2) {
        const last = rvList[rvList.length - 1]
        const initial = rvList.slice(0, -1).join(" , ")
        receiptVoucherReferences = `${initial} & ${last}`
    }

    const amountInWords = numberToWordsIndian(finalAmount)

    const replacements: Record<string, string> = {
        invoiceNumber,
        invoiceDate: formattedInvoiceDate,
        bookingReference,
        customerName,
        customerAddress,
        customerState,
        customerGstin,
        placeOfSupply,
        packageTitle,
        travelDate,
        numberOfTravellers,
        taxableValue: taxableValue.toLocaleString("en-IN"),
        taxRowsHtml,
        totalTaxRate: `${gstRate}%`,
        totalTaxAmount: totalTaxAmount.toLocaleString("en-IN"),
        totalInvoiceValue: finalAmount.toLocaleString("en-IN"),
        paymentsReceived: paymentsReceived.toLocaleString("en-IN"),
        balancePayable: balancePayable.toLocaleString("en-IN"),
        receiptVoucherReferences,
        companyUpiId: "udayam@okaxis",
        amountInWords,
    }

    for (const [key, value] of Object.entries(replacements)) {
        htmlContent = htmlContent.split(`{{${key}}}`).join(value)
    }

    const browser = await puppeteer.launch({
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu",
            "--no-zygote",
            "--single-process",
        ],
    })

    try {
        const page = await browser.newPage()
        await page.setContent(htmlContent, { waitUntil: "load" })
        await page.evaluateHandle("document.fonts.ready")
        const pdfUint8Array = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: { top: "15mm", bottom: "15mm", left: "15mm", right: "15mm" },
        })
        return Buffer.from(pdfUint8Array)
    } finally {
        await browser.close()
    }
}

