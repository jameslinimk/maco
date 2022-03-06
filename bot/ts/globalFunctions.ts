const capital = (string: string) => string.charAt(0).toUpperCase() + string.slice(1)
const formatMoney = (money: number) => money.toLocaleString("en-US", { style: "currency", currency: "USD" }).slice(0, -3)

export {
    capital,
    formatMoney
}