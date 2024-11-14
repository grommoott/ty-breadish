import { Product } from "@shared/facades"
import {
	useAppDispatch,
	useAppSelector,
	useDefaultWidgetWidth,
} from "@shared/hooks"
import basketSlice from "@shared/store/slices/basketSlice"
import { Button } from "@shared/ui/Buttons"
import Loading from "@shared/ui/Loading"
import { FC, ReactNode } from "react"
import Star from "@shared/ui/Star"
import { translateCookingMethod } from "@shared/model/types/enums/itemInfo/cookingMethod"
import Tag from "@shared/ui/Tag"
import { translateIngredient } from "@shared/model/types/enums/itemInfo/ingredient"
import { ItemType, ItemTypes } from "@shared/model/types/enums"
import { ItemId } from "@shared/model/types/primitives"
import CountInput from "@shared/ui/Inputs/countInput"

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
	const width = useDefaultWidgetWidth()
	const dispatch = useAppDispatch()

	const setCountInBasket = (count?: number) => {
		if (count == undefined) {
			return
		}

		if (count <= 0) {
			dispatch(basketSlice.actions.removeProduct(product.id.id))
			return
		}

		dispatch(
			basketSlice.actions.setProduct({ productId: product.id.id, count }),
		)
	}

	return (
		<div
			className="flex flex-col bg-[var(--dark-color)] p-4 rounded-3xl my-4"
			style={{ width: `${width}vw` }}
		>
			<div className="flex flex-col sm:flex-row gap-2 sm:gap-16 items-center sm:items-stretch justify-center sm:justify-between">
				<div className="p-2 rounded-3xl bg-zinc-900 h-min">
					<img
						src={product.imageLink}
						className="w-60 sm:w-80 object-cover drop-shadow-2xl"
					/>
				</div>

				<div className="flex flex-col items-center sm:items-end flex-1">
					<div className="flex flex-row items-center gap-4">
						<h1
							className="text-3xl ml-2"
							style={{ overflowWrap: "anywhere" }}
						>
							{product.name}
						</h1>
						<div>
							<>
								{featuredButton(
									product.itemId,
									ItemTypes.Product,
								)}
							</>
						</div>
					</div>

					<p className="text-[var(--main-color)] text-3xl text-end">
						{product.price.price}₽
					</p>

					<div className="flex flex-row items-center">
						{product.avgRate.avgRate == -1 ? (
							<p className="text-zinc-700">Нет отзывов</p>
						) : (
							<>
								{[0, 1, 2, 3, 4].map((val) => {
									return (
										<Star
											fillRatio={
												product.avgRate.avgRate - val
											}
											key={val}
										/>
									)
								})}

								<p className="text ml-2">
									{product.avgRate.avgRate.toFixed(1)}
								</p>
							</>
						)}
					</div>

					<div className="flex-1" />

					<div className="flex flex-col items-center">
						{basket[product.id.id] ? (
							<CountInput
								onChange={setCountInBasket}
								initial={basket[product.id.id]}
							/>
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
					{product.itemInfo.cookingMethod.map((method) => {
						const translated = translateCookingMethod(method)

						return (
							<Tag key={method}>
								{translated[0].toUpperCase() +
									translated.slice(1)}
							</Tag>
						)
					})}
				</div>

				<div style={{ height: "0.25rem" }} />

				<div className="flex flex-row flex-wrap items-center">
					<p className="mr-1">Ингредиенты:</p>
					{product.itemInfo.ingredients.map((val) => (
						<Tag key={val}>
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
