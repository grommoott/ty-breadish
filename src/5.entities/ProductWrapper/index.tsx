import { minusImage, plusImage } from "@assets/ui"
import { Product } from "@shared/facades"
import { useAppDispatch, useAppSelector } from "@shared/hooks"
import basketSlice from "@shared/store/slices/basketSlice"
import { Button, SimpleButton } from "@shared/ui/Buttons"
import Loading from "@shared/ui/Loading"
import { FC, ReactNode, useEffect, useState } from "react"
import NumberInput from "./ui/NumberInput"
import Star from "@shared/ui/Star"
import { translateCookingMethod } from "@shared/model/types/enums/itemInfo/cookingMethod"
import Tag from "@shared/ui/Tag"
import { translateIngredient } from "@shared/model/types/enums/itemInfo/ingredient"
import { usePageSize } from "@shared/contexts"
import { PageSizes } from "@shared/enums"
import { ItemType, ItemTypes } from "@shared/model/types/enums"
import { ItemId } from "@shared/model/types/primitives"

interface ProductWrapperProps {
	product?: Product
	featuredButton?: (itemId: ItemId, itemType: ItemType) => ReactNode
}

const ProductWrapper: FC<ProductWrapperProps> = ({
	product,
	featuredButton = () => {},
}) => {
	if (!product) {
		return (
			<div className="p-4 bg-[var(--dark-color)] rounded-3xl">
				<Loading />
			</div>
		)
	}

	const basket = useAppSelector((state) => state.basket)
	const pageSize = usePageSize()
	const [width, setWidth] = useState(50)
	const dispatch = useAppDispatch()

	const setCountInBasket = (count?: number) => {
		if (count == undefined) {
			return
		}

		if (count <= 0) {
			dispatch(basketSlice.actions.removeProduct(product.id.id))
			dispatch(
				basketSlice.actions.setProduct({
					productId: product.id.id,
					count: 0,
				}),
			)
		}

		dispatch(
			basketSlice.actions.setProduct({ productId: product.id.id, count }),
		)
	}

	const incrementCountInBasket = () => {
		const count = basket[product.id.id]

		if (count == undefined) {
			return
		}

		setCountInBasket(count + 1)
	}

	const decrementCountInBasket = () => {
		const count = basket[product.id.id]

		if (count == undefined) {
			return
		}

		setCountInBasket(count - 1)
	}

	useEffect(() => {
		if (pageSize > PageSizes.XXL) {
			setWidth(40)
		} else if (pageSize > PageSizes.XL) {
			setWidth(50)
		} else if (pageSize > PageSizes.Medium) {
			setWidth(60)
		} else if (pageSize > PageSizes.SmallMedium) {
			setWidth(75)
		} else if (pageSize > PageSizes.Small) {
			setWidth(90)
		}
	}, [pageSize])

	return (
		<div
			className="flex flex-col bg-[var(--dark-color)] p-4 rounded-3xl"
			style={{ width: `${width}vw` }}
		>
			<div className="flex flex-col sm:flex-row gap-2 sm:gap-16 items-center sm:items-stretch justify-center sm:justify-between">
				<div className="p-2 rounded-3xl bg-zinc-900">
					<img
						src={product.imageLink}
						className="w-60 sm:w-80 object-cover drop-shadow-2xl"
					/>
				</div>

				<div className="flex flex-col items-center sm:items-end flex-1">
					<div className="flex flex-row items-center gap-4">
						<h1 className="text-3xl ml-2">{product.name}</h1>
						<>{featuredButton(product.itemId, ItemTypes.Product)}</>
					</div>

					<p className="text-[var(--main-color)] text-3xl text-end">
						{product.price.price}₽
					</p>

					<div className="flex flex-row items-center">
						{[0, 1, 2, 3, 4].map((val) => (
							<Star
								fillRatio={product.avgRate.avgRate - val}
								key={val}
							/>
						))}
						<div className="w-1" />
						<p>{product.avgRate.avgRate.toFixed(1)}</p>
					</div>

					<div className="flex-1" />

					<div className="flex flex-col items-center">
						{basket[product.id.id] ? (
							<>
								<div className="flex flex-row items-center">
									<SimpleButton
										onClick={decrementCountInBasket}
									>
										<img
											src={minusImage}
											className="size-8"
										/>
									</SimpleButton>

									<NumberInput
										value={basket[product.id.id] || 0}
										setValue={setCountInBasket}
										predicate={(val) =>
											val > 0 && val % 1 == 0
										}
									/>

									<SimpleButton>
										<img
											onClick={incrementCountInBasket}
											src={plusImage}
											className="size-8"
										/>
									</SimpleButton>
								</div>

								<p className="text-2xl">
									К оплате:{" "}
									<span className="text-[var(--main-color)]">
										{(basket[product.id.id] || 1) *
											product.price.price}
										₽
									</span>
								</p>
							</>
						) : (
							<Button
								onClick={() =>
									dispatch(
										basketSlice.actions.setProduct({
											productId: product.id.id,
											count: 1,
										}),
									)
								}
							>
								В корзину
							</Button>
						)}
					</div>
				</div>
			</div>
			<div className="p-2 mt-4">
				<h1 className="text-2xl">Описание</h1>
				<p>{product.description}</p>
			</div>

			<div className="p-2">
				<h1 className="text-2xl">Информация</h1>

				<div className="flex flex-row flex-wrap items-center">
					<p className="mr-1">Способ приготовления:</p>
					<Tag>
						{(() => {
							const method = translateCookingMethod(
								product.itemInfo.cookingMethod,
							)

							return method[0].toUpperCase() + method.slice(1)
						})()}
					</Tag>
				</div>

				<div style={{ height: "0.25rem" }} />

				<div className="flex flex-row flex-wrap items-center">
					<p className="mr-1">Ингредиенты:</p>
					{product.itemInfo.ingredients.map((val) => (
						<Tag>
							{(() => {
								const ingredient = translateIngredient(val)

								return (
									ingredient[0].toUpperCase() +
									ingredient.slice(1)
								)
							})()}
						</Tag>
					))}
				</div>

				<div style={{ height: "0.25rem" }} />

				<div className="flex flex-row flex-wrap items-center">
					<p className="mr-1">Питательность на 100г:</p>
					<Tag>Белки: {product.itemInfo.pfc.protein}г</Tag>
					<Tag>Жиры: {product.itemInfo.pfc.fat}г</Tag>
					<Tag>Угреводы: {product.itemInfo.pfc.carbs}г</Tag>
					<Tag>{product.itemInfo.pfc.kkal}ккал</Tag>
				</div>

				<div style={{ height: "0.25rem" }} />

				<div className="flex flex-row flex-wrap items-center">
					<p className="mr-1">Масса:</p>
					<Tag>{product.itemInfo.mass}г</Tag>
				</div>
			</div>
		</div>
	)
}

export default ProductWrapper
