import puppeteer from "puppeteer"
import path from "path"
import { toWords } from 'to-words';
const FALLBACK = "-"

function formatDate(date: unknown, fallback: string = FALLBACK): string {
    if (!date) return fallback
    const d = new Date(date as string | number | Date)
    if (isNaN(d.getTime())) return fallback
    const dd = String(d.getDate()).padStart(2, "0")
    const mm = String(d.getMonth() + 1).padStart(2, "0")
    return `${dd} / ${mm} / ${d.getFullYear()}`
}

export interface IReceiptVoucherData {
    payment: any
    booking: any
    customer?: any
    pkg?: any
    allPayments?: any[]
}

export async function generateReceiptVoucherPDF(data: IReceiptVoucherData): Promise<Buffer> {
    const { payment, booking, customer, pkg, allPayments } = data
    console.log(data, "datadatadatadatadata")
    const templatePath = path.join(process.cwd(), "src/templates/receipt-voucher.html")
    let htmlContent = await Bun.file(templatePath).text()

    const rvNumber =
        payment.receiptVoucherNumber ||
        "UI / UVH / RV / 26-27 / 00001"

    const paymentDate = formatDate(payment.createdAt || new Date())
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
        FALLBACK

    const stateCode =
        customerState.toLowerCase().includes("tamil") ? "33" : (customer?.stateCode || "33")
    const placeOfSupply = `${customerState} (Code: ${stateCode})`

    // Package details
    const pkgTitle = pkg?.title || "Tour Package"
    const pkgDuration =
        pkg?.durationDays
            ? ` – ${pkg.durationDays} Days & ${pkg.durationNights || (pkg.durationDays - 1)} Nights`
            : ""
    const packageTitle = `${pkgTitle}${pkgDuration}`

    const travelDate = formatDate(booking.travellerInfo?.travelDate)

    // Payment Stage determination
    let paymentStage = payment.stageLabel || "Payment"
    if (payment.stage === 1) {
        paymentStage = "First Payment (Booking Advance)"
    } else if (payment.stage === 2) {
        paymentStage = "Second Payment"
    } else if (payment.stage === 3) {
        paymentStage = "Third Payment (Final Payment)"
    }

    // Amounts & Tax calculations
    const paidAmount = Number(payment.amount) || 0
    const gstRate = pkg?.gstPercentage ?? booking.pricingDetails?.gstPercentage ?? 5
    const taxableAmount = Math.round((paidAmount * 100) / (100 + gstRate))
    const totalTax = paidAmount - taxableAmount

    const isIntraState = stateCode === "33" || customerState.toLowerCase().includes("tamil")
    let taxRowsHtml = ""

    if (isIntraState) {
        const halfRate = (gstRate / 2).toFixed(1).replace(/\.0$/, "")
        const cgstAmount = Math.round(totalTax / 2)
        const sgstAmount = totalTax - cgstAmount

        taxRowsHtml = `
            <tr>
                <td>CGST @ ${halfRate} %</td>
                <td class="amount">₹ ${cgstAmount.toLocaleString("en-IN")}</td>
            </tr>
            <tr>
                <td>SGST @ ${halfRate} %</td>
                <td class="amount">₹ ${sgstAmount.toLocaleString("en-IN")}</td>
            </tr>
        `
    } else {
        taxRowsHtml = `
            <tr>
                <td>IGST @ ${gstRate} %</td>
                <td class="amount">₹ ${totalTax.toLocaleString("en-IN")}</td>
            </tr>
        `
    }

    const totalPackageValue = Number(booking.pricingDetails?.finalAmount) || paidAmount

    // Cumulative paid calculation
    let cumulativePaid = paidAmount
    if (Array.isArray(allPayments) && allPayments.length > 0) {
        // Sum payments created up to this payment
        const thisCreated = new Date(payment.createdAt || Date.now()).getTime()
        cumulativePaid = allPayments
            .filter((p: any) => p.status === "SUCCESS" && new Date(p.createdAt || 0).getTime() <= thisCreated)
            .reduce((sum: number, p: any) => sum + (Number(p.amount) || 0), 0)
        if (cumulativePaid === 0) {
            cumulativePaid = booking.paymentDetails?.totalPaidAmount || paidAmount
        }
    } else if (booking.paymentDetails?.totalPaidAmount) {
        cumulativePaid = booking.paymentDetails.totalPaidAmount
    }

    const balancePayable = Math.max(0, totalPackageValue - cumulativePaid)

    const paymentMode =
        payment.bookingPayload?.paymentMode ||
        (payment.razorpayPaymentId ? "Razorpay (UPI / Card / Net Banking)" : "UPI / Online")

    const transactionId = payment.razorpayPaymentId || payment.razorpayOrderId || FALLBACK
    const amountInWords = toWords(paidAmount)

    // Substitute placeholders
    const replacements: Record<string, string> = {
        rvNumber,
        date: paymentDate,
        bookingReference,
        customerName,
        customerAddress,
        customerState,
        customerGstin,
        packageTitle,
        travelDate,
        paymentStage,
        taxableAmount: taxableAmount.toLocaleString("en-IN"),
        taxRowsHtml,
        totalAmountReceived: paidAmount.toLocaleString("en-IN"),
        totalPackageValue: totalPackageValue.toLocaleString("en-IN"),
        totalPaymentsReceived: cumulativePaid.toLocaleString("en-IN"),
        balancePayable: balancePayable.toLocaleString("en-IN"),
        paymentMode,
        transactionId,
        placeOfSupply,
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
