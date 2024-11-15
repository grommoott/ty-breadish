const ListProductsSortOrders = {
    DearFirst: "dearFirst",
    CheapFirst: "cheapFirst",
    RatedFirst: "ratedFirst",
    RatedLast: "ratedLast"
} as const

const translatedListProductsSortOrders = new Map([
    ["dearFirst", "Сначала дорогие"],
    ["cheapFirst", "Сначала дешёвые"],
    ["ratedFirst", "Сначала хорошие"],
    ["ratedLast", "Сначала плохие"]
])

type ListProductsSortOrder = typeof ListProductsSortOrders[keyof typeof ListProductsSortOrders]

export { ListProductsSortOrders, translatedListProductsSortOrders, ListProductsSortOrder }
