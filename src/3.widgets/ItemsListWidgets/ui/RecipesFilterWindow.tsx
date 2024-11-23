import { FC, useState } from "react"
import { FiltersWindowProps, RecipeFilterData } from "../types"
import ItemFilterWindowBase from "./ItemFilterWindowBase"
import { AccentButton } from "@shared/ui/Buttons"

interface RecipeFilterWindowProps
	extends FiltersWindowProps<RecipeFilterData> {}

const RecipesFilterWindow: FC<RecipeFilterWindowProps> = ({
	initialFilterData,
	setInitialFilterData,
}) => {
	const [filterData, setFilterData] = useState(initialFilterData)

	const setFilterDataWrapper = (
		callback: (prev: RecipeFilterData) => RecipeFilterData,
	) => {
		setFilterData(callback)
		setInitialFilterData(callback)
	}

	return (
		<ItemFilterWindowBase
			setFilterData={setFilterDataWrapper}
			filterData={filterData}
			additionalFilters={(_, setFilterDataWrapper) => (
				<AccentButton
					onClick={() =>
						setFilterDataWrapper(() => ({
							includeIngredients: new Array(),
							excludeIngredients: new Array(),
							cookingMethods: new Array(),
							query: "",
						}))
					}
				>
					Сбросить фильтры
				</AccentButton>
			)}
		/>
	)
}

export default RecipesFilterWindow
