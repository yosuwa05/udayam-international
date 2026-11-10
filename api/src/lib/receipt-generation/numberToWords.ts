/**
 * Converts a numeric amount to Indian currency words format.
 * Example: 12600 -> "Rupees Twelve Thousand Six Hundred Only."
 * Example: 31500 -> "Rupees Thirty-One Thousand Five Hundred Only."
 */
export function numberToWordsIndian(amount: number): string {
    if (isNaN(amount) || amount === 0) return "Rupees Zero Only."

    const a = [
        "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
        "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
        "Seventeen", "Eighteen", "Nineteen"
    ]
    const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"]

    const inWords = (num: number): string => {
        let str = ""
        if (num >= 10000000) {
            str += inWords(Math.floor(num / 10000000)) + " Crore "
            num %= 10000000
        }
        if (num >= 100000) {
            str += inWords(Math.floor(num / 100000)) + " Lakh "
            num %= 100000
        }
        if (num >= 1000) {
            str += inWords(Math.floor(num / 1000)) + " Thousand "
            num %= 1000
        }
        if (num >= 100) {
            str += inWords(Math.floor(num / 100)) + " Hundred "
            num %= 100
        }
        if (num > 0) {
            if (num < 20) {
                str += a[num] + " "
            } else {
                str += b[Math.floor(num / 10)] + (num % 10 !== 0 ? "-" + a[num % 10] : "") + " "
            }
        }
        return str.trim()
    }

    const whole = Math.floor(Math.abs(amount))
    const fraction = Math.round((Math.abs(amount) - whole) * 100)

    let result = "Rupees " + inWords(whole)
    if (fraction > 0) {
        result += " and " + inWords(fraction) + " Paise"
    }
    result += " Only."
    return result
}

