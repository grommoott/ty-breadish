const ListRecipesSortOrders = {
    DearFirst: "dearFirst",
    CheapFirst: "cheapFirst",
    RatedFirst: "ratedFirst",
    RatedLast: "ratedLast"
} as const

const translatedListRecipesSortOrders = new Map([
    ["dearFirst", "Сначала дорогие"],
    ["cheapFirst", "Сначала дешёвые"],
    ["ratedFirst", "Сначала хорошие"],
    ["ratedLast", "Сначала плохие"]
])

type ListRecipesSortOrder = typeof ListRecipesSortOrders[keyof typeof ListRecipesSortOrders]

export { ListRecipesSortOrders, translatedListRecipesSortOrders, ListRecipesSortOrder }
