const Ingredients = {
    Apple: "apple",
    Broccoli: "broccoli",
    Cabbage: "cabbage",
    Carrot: "carrot",
    Cheese: "cheese",
    Chicken: "chicken",
    Cucumber: "cucumber",
    Egg: "egg",
    Fish: "fish",
    Meat: "meat",
    Melon: "melon",
    Milk: "milk",
    Nuts: "nuts",
    Onion: "onion",
    Pineapple: "pineapple",
    Pumpkin: "pumpkin",
    Tomato: "tomato",
    Watermelon: "watermelon"
} as const

type Ingredient = typeof Ingredients[keyof typeof Ingredients]

function translateIngredient(ingredient: Ingredient) {
    switch (ingredient) {
        case Ingredients.Apple:
            return "яблоко"

        case Ingredients.Broccoli:
            return "броколи"

        case Ingredients.Cabbage:
            return "капуста"

        case Ingredients.Carrot:
            return "морковка"

        case Ingredients.Cheese:
            return "сыр"

        case Ingredients.Chicken:
            return "курица"

        case Ingredients.Cucumber:
            return "огурец"

        case Ingredients.Egg:
            return "яйцо"

        case Ingredients.Fish:
            return "рыба"

        case Ingredients.Meat:
            return "мясо"

        case Ingredients.Melon:
            return "дыня"

        case Ingredients.Milk:
            return "молоко"

        case Ingredients.Nuts:
            return "орешки"

        case Ingredients.Onion:
            return "лук"

        case Ingredients.Pineapple:
            return "ананас"

        case Ingredients.Pumpkin:
            return "тыква"

        case Ingredients.Tomato:
            return "томат"

        case Ingredients.Watermelon:
            return "арбуз"
    }
}

export { Ingredient, Ingredients, translateIngredient }
