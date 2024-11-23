import { ReactNode } from "react"
import { ItemFilterDataBase } from "../types"
import FoldableItem from "@shared/ui/FoldableItem"
import MultiSelect from "@shared/ui/MultiSelect"
import {
	CookingMethod,
	CookingMethods,
	Ingredient,
	Ingredients,
	translateCookingMethod,
	translateIngredient,
} from "@shared/model/types/enums"

interface ItemFilterWindowBaseProps<T> {
	filterData: T
	setFilterData: (callback: (value: T) => T) => void
	additionalFilters?: (
		filterData: T,
		setFilterDataWrapper: (callback: (value: T) => T) => void,
	) => ReactNode
}

const ItemFilterWindowBase = <T extends ItemFilterDataBase>({
	filterData,
	setFilterData,
	additionalFilters = () => "",
}: ItemFilterWindowBaseProps<T>) => {
	return (
		<div className="flex flex-col items-center w-[18rem] sm:w-[24rem] overflow-y-scroll overflow-x-hidden pr-6">
			<h1 className="text-center text-3xl pb-2 text-[var(--main-color)]">
				Фильтры
			</h1>

			<FoldableItem
				width="100%"
				contentAlign="stretch"
				contentPadding="2rem"
				title="Включая ингредиенты"
			>
				<MultiSelect
					selectedValues={filterData.includeIngredients}
					values={Object.values(Ingredients)}
					translator={(val) => {
						const translated = translateIngredient(
							val as Ingredient,
						)

						return (
							translated[0].toUpperCase() +
							translated.substring(1)
						)
					}}
					onSelect={(val) =>
						setFilterData((prev) => ({
							...prev,
							includeIngredients:
								filterData.includeIngredients.concat(
									val as Ingredient,
								),
						}))
					}
					onDelete={(val) =>
						setFilterData((prev) => ({
							...prev,
							includeIngredients:
								filterData.includeIngredients.filter(
									(ingredient) => ingredient != val,
								),
						}))
					}
				/>
			</FoldableItem>

			<FoldableItem
				width="100%"
				contentAlign="stretch"
				contentPadding="2rem"
				title="Исключая ингредиенты"
			>
				<MultiSelect
					selectedValues={filterData.excludeIngredients}
					values={Object.values(Ingredients)}
					translator={(val) => {
						const translated = translateIngredient(
							val as Ingredient,
						)

						return (
							translated[0].toUpperCase() +
							translated.substring(1)
						)
					}}
					onSelect={(val) =>
						setFilterData((prev) => ({
							...prev,
							excludeIngredients:
								filterData.excludeIngredients.concat(
									val as Ingredient,
								),
						}))
					}
					onDelete={(val) =>
						setFilterData((prev) => ({
							...prev,
							excludeIngredients:
								filterData.excludeIngredients.filter(
									(ingredient) => ingredient != val,
								),
						}))
					}
				/>
			</FoldableItem>

			<FoldableItem
				width="100%"
				contentAlign="stretch"
				contentPadding="1rem"
				title="Способ приготовления"
			>
				<MultiSelect
					selectedValues={filterData.cookingMethods}
					values={Object.values(CookingMethods)}
					translator={(val) => {
						const translated = translateCookingMethod(
							val as CookingMethod,
						)

						return (
							translated[0].toUpperCase() +
							translated.substring(1)
						)
					}}
					onSelect={(val) =>
						setFilterData((prev) => ({
							...prev,
							cookingMethods: filterData.cookingMethods.concat(
								val as CookingMethod,
							),
						}))
					}
					onDelete={(val) =>
						setFilterData((prev) => ({
							...prev,
							cookingMethods: filterData.cookingMethods.filter(
								(ingredient) => ingredient != val,
							),
						}))
					}
				/>
			</FoldableItem>

			{additionalFilters(filterData, setFilterData)}
		</div>
	)
}

export default ItemFilterWindowBase
