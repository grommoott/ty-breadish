import { ListProductWrapper } from "@entities/ListItemWrappers"
import { usePageSize } from "@shared/contexts"
import { PageSizes } from "@shared/enums"
import { ListProduct } from "@shared/facades"
import { ExError } from "@shared/helpers"
import {
	useAppSelector,
	usePopupWindow,
	useSmallWidgetWidth,
} from "@shared/hooks"
import { FC, useEffect, useMemo, useState } from "react"
import { ProductsFilterData } from "../types"
import { SearchInput } from "@shared/ui/Inputs"
import { AccentButton } from "@shared/ui/Buttons"
import ProductsFiltersWindow from "./ProductsFiltersWindow"
import ListBox from "@shared/ui/ListBox"
import {
	ListProductsSortOrder,
	ListProductsSortOrders,
	translatedListProductsSortOrders,
} from "../enums"
import NewItemButton from "./NewItemButton"

const ProductsListWidget: FC = () => {
	const popupWindow = usePopupWindow()

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

	useEffect(() => {
		setFilterData((prev) => ({ ...prev, minPrice }))
	}, [minPrice])

	useEffect(() => {
		setFilterData((prev) => ({ ...prev, maxPrice }))
	}, [maxPrice])

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

	const [filterData, setFilterData] = useState<ProductsFilterData>(() => {
		const data = sessionStorage.getItem("productsFilterData")

		let result = {
			includeIngredients: new Array(),
			excludeIngredients: new Array(),
			cookingMethods: new Array(),
			minPrice: undefined,
			maxPrice: undefined,
			query: "",
		}

		if (data != null) {
			try {
				result = JSON.parse(data)
			} catch (e) {}
		}

		return result
	})

	useEffect(() => {
		sessionStorage.setItem("productsFilterData", JSON.stringify(filterData))
	}, [filterData])

	const [sortOrder, setSortOrder] = useState<ListProductsSortOrder>(
		ListProductsSortOrders.RatedFirst,
	)

	const filteredProducts = useMemo(
		() =>
			products
				?.filter(
					(product) =>
						product.price.price <=
							(filterData.maxPrice || Infinity) &&
						product.price.price >= (filterData.minPrice || 0),
				)
				.filter((product) => {
					if (filterData.cookingMethods.length == 0) {
						return true
					}

					return product.itemInfo.cookingMethod
						.map((method) =>
							filterData.cookingMethods.includes(method),
						)
						.reduce((prev, cur) => prev || cur)
				})
				.filter((product) => {
					if (filterData.includeIngredients.length == 0) {
						return true
					}

					return filterData.includeIngredients
						.map((ingredient) =>
							product.itemInfo.ingredients.includes(ingredient),
						)
						.reduce((prev, curr) => prev && curr)
				})
				.filter(
					(product) =>
						!product.itemInfo.ingredients
							.map((ingredient) =>
								filterData.excludeIngredients.includes(
									ingredient,
								),
							)
							.reduce((prev, curr) => prev || curr),
				)
				.filter(
					(product) =>
						product.name
							.toLowerCase()
							.indexOf(filterData.query.toLowerCase().trim()) !=
						-1,
				),
		[products, filterData],
	)

	const sortedProducts = useMemo(() => {
		switch (sortOrder) {
			case ListProductsSortOrders.RatedFirst:
				return filteredProducts?.sort(
					(a, b) => b.avgRate.avgRate - a.avgRate.avgRate,
				)

			case ListProductsSortOrders.RatedLast:
				return filteredProducts?.sort(
					(a, b) => a.avgRate.avgRate - b.avgRate.avgRate,
				)

			case ListProductsSortOrders.DearFirst:
				return filteredProducts?.sort(
					(a, b) => b.price.price - a.price.price,
				)

			case ListProductsSortOrders.CheapFirst:
				return filteredProducts?.sort(
					(a, b) => a.price.price - b.price.price,
				)
		}
	}, [sortOrder, filteredProducts])

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
							<ProductsFiltersWindow
								initialFilterData={filterData}
								setInitialFilterData={setFilterData}
								minPrice={minPrice}
								maxPrice={maxPrice}
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
					items={translatedListProductsSortOrders}
					defaultValue={{
						key: ListProductsSortOrders.RatedFirst,
						value: translatedListProductsSortOrders.get(
							ListProductsSortOrders.RatedFirst,
						) as string,
					}}
					onChange={(value) =>
						setSortOrder(value as ListProductsSortOrder)
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
						text="Создать продукт"
						navigatePath="/products/create"
					/>

					{sortedProducts?.map((product) => (
						<ListProductWrapper
							product={product}
							key={product.id.id}
						/>
					))}
				</div>

				{sortedProducts?.length == 0 && products?.length != 0 && (
					<p className="m-4 p-4 rounded-3xl bg-[var(--dark-color)] text-zinc-700 text-center w-60">
						Продуктов, соответствующих заданным фильтрам нет :(
					</p>
				)}
			</div>
		</div>
	)
}

export { ProductsListWidget }
