const PageSizes = {
    ExtraSmall: 300,
    IPhone: 375,
    Small: 420,
    SmallMedium: 640,
    Medium: 768,
    Large: 1024,
    XL: 1280,
    XXL: 1536
}


type PageSize = typeof PageSizes[keyof typeof PageSizes]

export { PageSizes, PageSize }
