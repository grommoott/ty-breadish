import { FC, useEffect, useMemo, useState } from "react"
import { FiltersWindowProps, ProductsFilterData } from "../types"
import FoldableItem from "@shared/ui/FoldableItem"
import PriceSlider from "@shared/ui/PriceSlider"
import CountInput from "@shared/ui/Inputs/countInput"
import { AccentButton } from "@shared/ui/Buttons"
import ItemFilterWindowBase from "./ItemFilterWindowBase"

interface ProductsFiltersWindowProps
	extends FiltersWindowProps<ProductsFilterData> {
	minPrice: number
	maxPrice: number
}

const ProductsFiltersWindow: FC<ProductsFiltersWindowProps> = ({
	initialFilterData,
	setInitialFilterData,
	minPrice,
	maxPrice,
}) => {
	const [filterData, setFilterData] = useState(initialFilterData)

	const setFilterDataWrapper = (
		callback: (prev: ProductsFilterData) => ProductsFilterData,
	) => {
		setFilterData(callback)
		setInitialFilterData(callback)
	}

	useEffect(() => {
		setFilterData((prev) => ({ ...prev, minPrice, maxPrice }))
	}, [minPrice, maxPrice])

	return (
		<ItemFilterWindowBase
			setFilterData={setFilterDataWrapper}
			filterData={filterData}
			additionalFilters={(filterData, setFilterDataWrapper) => (
				<>
					<FoldableItem
						width="100%"
						contentAlign="stretch"
						contentPadding="1rem"
						title="Цена"
					>
						<div className="px-2 flex flex-col items-center w-full">
							{useMemo(
								() => (
									<PriceSlider
										value={[
											filterData.minPrice || 0,
											filterData.maxPrice || 1,
										]}
										width={(() => ({
											value: "100%",
										}))()}
										min={minPrice}
										max={maxPrice}
										onValueChanged={([min, max]) =>
											setFilterDataWrapper((prev) => ({
												...prev,
												minPrice: min,
												maxPrice: max,
											}))
										}
									/>
								),
								[minPrice, maxPrice, filterData],
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
									setFilterDataWrapper((prev) => ({
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
									setFilterDataWrapper((prev) => ({
										...prev,
										maxPrice: value,
									}))
								}}
							/>
						</div>
					</FoldableItem>

					<AccentButton
						onClick={() =>
							setFilterDataWrapper(() => ({
								includeIngredients: new Array(),
								excludeIngredients: new Array(),
								cookingMethods: new Array(),
								minPrice,
								maxPrice,
								query: "",
							}))
						}
					>
						Сбросить фильтры
					</AccentButton>
				</>
			)}
		/>
	)
}

export default ProductsFiltersWindow
