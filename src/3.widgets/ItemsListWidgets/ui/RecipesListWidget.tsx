import {
	useAppSelector,
	usePopupWindow,
	useSmallWidgetWidth,
} from "@shared/hooks"
import { SearchInput } from "@shared/ui/Inputs"
import { FC, useEffect, useMemo, useState } from "react"
import { RecipeFilterData } from "../types"
import { AccentButton } from "@shared/ui/Buttons"
import RecipesFilterWindow from "./RecipesFilterWindow"
import ListBox from "@shared/ui/ListBox"
import {
	ListRecipesSortOrder,
	ListRecipesSortOrders,
	translatedListRecipesSortOrders,
} from "../enums"
import { usePageSize } from "@shared/contexts"
import { PageSizes } from "@shared/enums"
import { ListRecipeWrapper } from "@entities/ListItemWrappers"
import { ListRecipe, OwnedUser } from "@shared/facades"
import { ExError } from "@shared/helpers"
import NewItemButton from "./NewItemButton"

const RecipesListWidget: FC = () => {
	const popupWindow = usePopupWindow()

	const pageSize = usePageSize()

	const columns = useMemo(() => {
		if (pageSize < PageSizes.SmallMedium) {
			return 1
		} else if (pageSize < PageSizes.Medium) {
			return 2
		} else if (pageSize < PageSizes.Large) {
			return 2
		} else if (pageSize < PageSizes.XL) {
			return 3
		} else if (pageSize < PageSizes.XXL) {
			return 4
		} else {
			return 5
		}
	}, [pageSize])

	const [filterData, setFilterData] = useState<RecipeFilterData>(() => {
		const data = sessionStorage.getItem("recipesFilterData")

		let result = {
			includeIngredients: new Array(),
			excludeIngredients: new Array(),
			cookingMethods: new Array(),
			query: "",
			onlyFeatured: false,
		}

		if (data != null) {
			try {
				result = JSON.parse(data)
			} catch (e) {}
		}

		return result
	})

	useEffect(() => {
		sessionStorage.setItem("recipesFilterData", JSON.stringify(filterData))
	}, [filterData])

	const [sortOrder, setSortOrder] = useState<ListRecipesSortOrder>(
		ListRecipesSortOrders.RatedFirst,
	)

	const recipesSerialized = useAppSelector((state) => state.recipes)
	const recipes = useMemo(
		() =>
			recipesSerialized.data
				?.map((recipe) => {
					const result = ListRecipe.parse(recipe)

					if (result instanceof ExError) {
						return
					}

					return result
				})
				.filter((product) => product != undefined),
		[recipesSerialized],
	)

	const filteredRecipes = useMemo(
		() =>
			recipes
				?.filter(
					(recipe) =>
						!filterData.onlyFeatured ||
						OwnedUser.instance?.featured?.findIndex(
							(val) => val.target.id == recipe.itemId.id,
						) != -1,
				)
				.filter((recipe) => {
					if (filterData.cookingMethods.length == 0) {
						return true
					}

					return recipe.itemInfo.cookingMethod
						.map((method) =>
							filterData.cookingMethods.includes(method),
						)
						.reduce((prev, cur) => prev || cur)
				})
				.filter((recipe) => {
					if (filterData.includeIngredients.length == 0) {
						return true
					}

					return filterData.includeIngredients
						.map((ingredient) =>
							recipe.itemInfo.ingredients.includes(ingredient),
						)
						.reduce((prev, curr) => prev && curr)
				})
				.filter(
					(recipe) =>
						!recipe.itemInfo.ingredients
							.map((ingredient) =>
								filterData.excludeIngredients.includes(
									ingredient,
								),
							)
							.reduce((prev, curr) => prev || curr),
				)
				.filter(
					(recipe) =>
						recipe.name
							.toLowerCase()
							.indexOf(filterData.query.toLowerCase().trim()) !=
						-1,
				),
		[recipes, filterData],
	)

	const sortedRecipes = useMemo(() => {
		switch (sortOrder) {
			case ListRecipesSortOrders.RatedFirst:
				return filteredRecipes?.sort(
					(a, b) => b.avgRate.avgRate - a.avgRate.avgRate,
				)

			case ListRecipesSortOrders.RatedLast:
				return filteredRecipes?.sort(
					(a, b) => a.avgRate.avgRate - b.avgRate.avgRate,
				)
		}
	}, [filteredRecipes, sortOrder])

	const searchWidth = useSmallWidgetWidth()

	return (
		<div className="flex flex-col w-full items-center">
			<div
				className="flex flex-col sm:flex-row items-center sm:items-center"
				style={{
					width: `${searchWidth}vw`,
				}}
			>
				<SearchInput
					margin="1rem 0"
					width="100%"
					onChange={(value) =>
						setFilterData((prev) => ({ ...prev, query: value }))
					}
				/>

				<AccentButton
					className="w-full sm:w-min"
					onClick={() =>
						popupWindow(() => (
							<RecipesFilterWindow
								initialFilterData={filterData}
								setInitialFilterData={setFilterData}
							/>
						))
					}
				>
					Фильтры
				</AccentButton>
			</div>

			<div className="flex flex-col md:flex-row items-center mt-4">
				<h2 className="text-2xl">Порядок сортировки </h2>

				<ListBox
					items={translatedListRecipesSortOrders}
					defaultValue={{
						key: ListRecipesSortOrders.RatedFirst,
						value: translatedListRecipesSortOrders.get(
							ListRecipesSortOrders.RatedFirst,
						) as string,
					}}
					onChange={(value) =>
						setSortOrder(value as ListRecipesSortOrder)
					}
				/>
			</div>

			<div className="flex flex-col items-center">
				<div
					className="grid p-6"
					style={{
						gridTemplateColumns: `repeat(${columns}, 1fr)`,
					}}
				>
					<NewItemButton
						text="Создать рецепт"
						navigatePath="/recipes/create"
					/>

					{sortedRecipes?.map((recipe) => (
						<ListRecipeWrapper
							recipe={recipe}
							key={recipe.id.id}
						/>
					))}
				</div>

				{sortedRecipes?.length == 0 && recipes?.length != 0 && (
					<p className="m-4 p-4 rounded-3xl bg-[var(--dark-color)] text-zinc-700 text-center w-60">
						Рецептов, соответствующих заданным фильтрам нет :(
					</p>
				)}
			</div>
		</div>
	)
}

export { RecipesListWidget }
