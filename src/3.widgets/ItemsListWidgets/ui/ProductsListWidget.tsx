import { ListProductWrapper } from "@entities/ListItemWrappers"
import { usePageSize } from "@shared/contexts"
import { PageSizes } from "@shared/enums"
import { ListProduct } from "@shared/facades"
import { ExError } from "@shared/helpers"
import { useAppSelector, useSmallWidgetWidth } from "@shared/hooks"
import {
	Ingredient,
	Ingredients,
	translateIngredient,
} from "@shared/model/types/enums"
import MultiSelect from "@shared/ui/MultiSelect"
import { FC, useMemo, useState } from "react"
import { ProductFilterData } from "../types"
import FoldableItem from "@shared/ui/FoldableItem"
import PriceSlider from "@shared/ui/PriceSlider"
import CountInput from "@shared/ui/Inputs/countInput"
import { SearchInput } from "@shared/ui/Inputs"

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
		if (pageSize < PageSizes.Medium) {
			return 1
		} else if (pageSize < PageSizes.Medium) {
			return 2
		} else if (pageSize < PageSizes.Large) {
			return 2
		} else if (pageSize < PageSizes.XL) {
			return 2
		} else if (pageSize < PageSizes.XXL) {
			return 2
		}
	}, [pageSize])

	const [filterData, setFilterData] = useState<ProductFilterData>({
		includeIngredients: new Array(),
		excludeIngredients: new Array(),
		minPrice: undefined,
		maxPrice: undefined,
		query: "",
	})

	const displayedProducts = useMemo(
		() =>
			products
				?.filter(
					(product) =>
						product.price.price <=
							(filterData.maxPrice || Infinity) &&
						product.price.price >= (filterData.minPrice || 0),
				)
				.filter((product) => {
					if (filterData.includeIngredients.length == 0) {
						return true
					}

					return [...new Set(product.itemInfo.ingredients)]
						.map((ingredient) =>
							filterData.includeIngredients.includes(ingredient),
						)
						.reduce((prev, curr) => prev || curr)
				})
				.filter(
					(product) =>
						![...new Set(product.itemInfo.ingredients)]
							.map((ingredient) =>
								filterData.excludeIngredients.includes(
									ingredient,
								),
							)
							.reduce((prev, curr) => prev || curr),
				),
		[products, filterData],
	)

	const searchWidth = useSmallWidgetWidth()

	return (
		<div className="flex flex-col w-full items-center">
			<SearchInput
				width={`${searchWidth}vw`}
				onChange={(value) =>
					setFilterData((prev) => ({ ...prev, query: value }))
				}
			></SearchInput>

			<div className="flex flex-col sm:flex-row items-center sm:items-start">
				<div>
					<div className="w-[16rem] sm:w-[20rem] flex flex-col items-stretch p-2 sm:p-4">
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
												(ingredient) =>
													ingredient != val,
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
												(ingredient) =>
													ingredient != val,
											),
									})
								}
							/>
						</FoldableItem>

						<FoldableItem
							width="100%"
							contentAlign="stretch"
							contentPadding="1rem"
							title="Цена"
						>
							<div className="mx-2">
								{useMemo(
									() => (
										<PriceSlider
											value={[
												filterData.minPrice || 0,
												filterData.maxPrice || 1,
											]}
											width={
												pageSize >=
												PageSizes.SmallMedium
													? (() => ({
															value: "100%",
														}))()
													: (() => ({
															value: "100%",
														}))()
											}
											min={minPrice}
											max={maxPrice}
											onValueChanged={([min, max]) => {
												{
													setFilterData((prev) => ({
														...prev,
														minPrice: min,
														maxPrice: max,
													}))
												}
											}}
										/>
									),
									[pageSize, filterData],
								)}
							</div>

							<div className="flex flex-row justify-center items-center h-8">
								<p>От: </p>
								<CountInput
									controls={false}
									initial={minPrice}
									value={filterData.minPrice}
									minValue={minPrice}
									maxValue={maxPrice}
									onChange={(value) => {
										setFilterData((prev) => ({
											...prev,
											minPrice: value,
										}))
									}}
								/>
							</div>

							<div className="flex flex-row justify-center items-center h-8 mb-4">
								<p>До: </p>
								<CountInput
									controls={false}
									initial={maxPrice}
									value={filterData.maxPrice}
									minValue={minPrice}
									maxValue={maxPrice}
									onChange={(value) => {
										setFilterData((prev) => ({
											...prev,
											maxPrice: value,
										}))
									}}
								/>
							</div>
						</FoldableItem>
					</div>
				</div>
				<div className="flex flex-col items-center">
					<div
						className="grid p-6"
						style={{
							gridTemplateColumns: `repeat(${columns}, 1fr)`,
						}}
					>
						{displayedProducts?.map((product) => (
							<ListProductWrapper
								product={product}
								key={product.id.id}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}

export { ProductsListWidget }
