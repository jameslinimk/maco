import moment from "moment"

const capital = (string: string) => string.charAt(0).toUpperCase() + string.slice(1)
const formatMoney = (money: number, link = true) => {
	const moneyString = money.toLocaleString("en-US", { style: "currency", currency: "USD" }).slice(0, -3)
	return (link) ? `[${moneyString}](https://example.com/)` : moneyString
}
/**
 * Pick a random **integer** between min and max (inclusive)
 */
const random = (min: number, max: number) => Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min)
const defaultMomentFormat = (date?: Date) => moment(date).format("ha & M/D/YY")
const wait = (time = 2000) => new Promise<"wait">((res) => setTimeout(() => res("wait"), time))
const formatNumber = (number: number) => number.toLocaleString("en-US")

export {
	capital,
	formatMoney,
	random,
	defaultMomentFormat,
	wait,
	formatNumber
}

