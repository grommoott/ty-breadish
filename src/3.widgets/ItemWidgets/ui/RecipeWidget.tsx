import { Recipe } from "@shared/facades"
import { FC } from "react"
import ItemWidgetBase from "./ItemWidgetBase"
import RecipeWrapper from "@entities/RecipeWrapper"

interface RecipeWidgetProps {
	recipe?: Recipe
}

const RecipeWidget: FC<RecipeWidgetProps> = ({ recipe }) => {
	return (
		<ItemWidgetBase<Recipe>
			item={recipe}
			itemWrapper={(item) => <RecipeWrapper recipe={item} />}
		/>
	)
}

export { RecipeWidget }
