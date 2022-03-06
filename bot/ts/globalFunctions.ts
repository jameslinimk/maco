const capital = (string: string) => string.charAt(0).toUpperCase() + string.slice(1)
const formatMoney = (money: number) => money.toLocaleString("en-US", { style: "currency", currency: "USD" }).slice(0, -3)
const random = (min: number, max: number) => Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min)

export {
    capital,
    formatMoney,
    random
}