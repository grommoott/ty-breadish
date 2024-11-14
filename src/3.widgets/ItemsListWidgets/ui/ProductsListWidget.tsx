import { ListProductWrapper } from "@entities/ListItemWrappers"
import { usePageSize } from "@shared/contexts"
import { PageSizes } from "@shared/enums"
import { ListProduct } from "@shared/facades"
import { ExError } from "@shared/helpers"
import { useAppSelector } from "@shared/hooks"
import {
	Ingredient,
	Ingredients,
	translateIngredient,
} from "@shared/model/types/enums"
import MultiSelect from "@shared/ui/MultiSelect"
import { FC, useEffect, useMemo, useState } from "react"
import { ProductFilterData } from "../types"
import FoldableItem from "@shared/ui/FoldableItem"
import PriceSlider from "@shared/ui/PriceSlider"

const ProductsListWidget: FC = () => {
	const productsSerialized = useAppSelector((state) => state.products)
	const products = useMemo(
		() =>
			productsSerialized.data
				?.map((product) => {
					const result = ListProduct.parse(product)

					if (result instanceof ExError) {
						return
					}

					return result
				})
				.filter((product) => product != undefined),
		[productsSerialized],
	)

	const minPrice = useMemo(() => {
		let buffer = Infinity

		products?.forEach((product) => {
			if (product.price.price < buffer) {
				buffer = product.price.price
			}
		})

		return buffer
	}, [products])

	const maxPrice = useMemo(() => {
		let buffer = -Infinity

		products?.forEach((product) => {
			if (product.price.price > buffer) {
				buffer = product.price.price
			}
		})

		return buffer
	}, [products])

	const pageSize = usePageSize()
	const columns = useMemo(() => {
		if (pageSize < PageSizes.Small) {
			return 1
		} else {
			return 2
		}
	}, [pageSize])

	const [filterData, setFilterData] = useState<ProductFilterData>({
		includeIngredients: new Array(),
		excludeIngredients: new Array(),
		minPrice: undefined,
		maxPrice: undefined,
	})

	return (
		<div className="flex flex-row w-full">
			<div>
				<div className="w-[16rem] sm:w-[20rem] flex flex-col items-stretch p-2 sm:p-4">
					<h1 className="text-center text-2xl">Фильтры</h1>

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
								setFilterData({
									...filterData,
									includeIngredients:
										filterData.includeIngredients.concat(
											val as Ingredient,
										),
								})
							}
							onDelete={(val) =>
								setFilterData({
									...filterData,
									includeIngredients:
										filterData.includeIngredients.filter(
											(ingredient) => ingredient != val,
										),
								})
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
								setFilterData({
									...filterData,
									excludeIngredients:
										filterData.excludeIngredients.concat(
											val as Ingredient,
										),
								})
							}
							onDelete={(val) =>
								setFilterData({
									...filterData,
									excludeIngredients:
										filterData.excludeIngredients.filter(
											(ingredient) => ingredient != val,
										),
								})
							}
						/>
					</FoldableItem>

					<h1 className="text-2xl text-center pt-4">Цена</h1>

					<PriceSlider
						width="100%"
						min={minPrice}
						max={maxPrice}
						onValueChanged={([min, max]) => {
							setFilterData((prev) => ({
								...prev,
								minPrice: min,
								maxPrice: max,
							}))
						}}
					/>
				</div>
			</div>
			<div className="flex flex-col items-center">
				<div
					className="grid p-6"
					style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
				>
					{products?.map((product) => (
						<ListProductWrapper
							product={product}
							key={product.id.id}
						/>
					))}
				</div>
			</div>
		</div>
	)
}

export { ProductsListWidget }
