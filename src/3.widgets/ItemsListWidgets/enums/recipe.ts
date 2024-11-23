const ListRecipesSortOrders = {
    RatedFirst: "ratedFirst",
    RatedLast: "ratedLast"
} as const

const translatedListRecipesSortOrders = new Map([
    ["ratedFirst", "Сначала хорошие"],
    ["ratedLast", "Сначала плохие"]
])

type ListRecipesSortOrder = typeof ListRecipesSortOrders[keyof typeof ListRecipesSortOrders]

export { ListRecipesSortOrders, translatedListRecipesSortOrders, ListRecipesSortOrder }
