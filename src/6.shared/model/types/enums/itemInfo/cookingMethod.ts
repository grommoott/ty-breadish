const CookingMethods = {
    Boiled: "boiled",
    Fried: "fried",
    Baked: "baked"
} as const

type CookingMethod = typeof CookingMethods[keyof typeof CookingMethods]

function translateCookingMethod(method: CookingMethod) {
    switch (method) {
        case CookingMethods.Boiled:
            return "варёный"

        case CookingMethods.Fried:
            return "жареный"

        case CookingMethods.Baked:
            return "печёный"
    }
}

export { CookingMethod, CookingMethods, translateCookingMethod }
