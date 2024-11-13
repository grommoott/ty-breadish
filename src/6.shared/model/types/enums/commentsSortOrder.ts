const CommentsSortOrders = {
    NewFirst: "newFirst",
    OldFirst: "oldFirst",
    LikedFirst: "likedFirst"
} as const

const translatedCommentsSortOrders = new Map<string, string>([
    ["newFirst", "Сначала новые"],
    ["oldFirst", "Сначала старые"],
    ["likedFirst", "Сначала популярные"]
])

type CommentsSortOrder = typeof CommentsSortOrders[keyof typeof CommentsSortOrders]

export { CommentsSortOrder, CommentsSortOrders, translatedCommentsSortOrders }
