const ReviewsSortOrders = {
    NewFirst: "newFirst",
    OldFirst: "oldFirst",
    LikedFirst: "likedFirst",
    RatedFirst: "ratedFirst",
    UnratedFirst: "unratedFirst"
} as const

const translatedReviewsSortOrder = new Map<string, string>([
    ["newFirst", "Сначала новые"],
    ["oldFirst", "Сначала старые"],
    ["likedFirst", "Сначала популярные"],
    ["ratedFirst", "Сначала хорошие"],
    ["unratedFirst", "Сначала плохие"],
])

type ReviewsSortOrder = typeof ReviewsSortOrders[keyof typeof ReviewsSortOrders]

export { ReviewsSortOrder, ReviewsSortOrders, translatedReviewsSortOrder }
