import { Recipe } from "@shared/facades"
import { FC } from "react"
import ItemWidgetBase from "./ItemWidgetBase"
import RecipeWrapper from "@entities/RecipeWrapper"
import FeaturedButton from "@features/FeaturedButton"

interface RecipeWidgetProps {
	recipe?: Recipe
}

const RecipeWidget: FC<RecipeWidgetProps> = ({ recipe }) => {
	return (
		<ItemWidgetBase<Recipe>
			item={recipe}
			itemWrapper={(item) => (
				<RecipeWrapper
					recipe={item}
					featuredButton={(itemId, itemType) => (
						<FeaturedButton
							itemId={itemId}
							itemType={itemType}
						/>
					)}
				/>
			)}
		/>
	)
}

export { RecipeWidget }
