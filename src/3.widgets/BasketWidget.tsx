import BasketProductWrapper from "@entities/BasketProductWrapper"
import { Product } from "@shared/facades"
import { ExError } from "@shared/helpers"
import { useAppSelector } from "@shared/hooks"
import { ProductId } from "@shared/model/types/primitives"
import { AccentButton, SimpleButton } from "@shared/ui/Buttons"
import { FC, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const BasketWidget: FC = () => {
	const basket = useAppSelector((state) => state.basket)
	const [products, setProducts] = useState<Array<Product>>()
	const [renderedProducts, setRenderedProducts] = useState<Array<Product>>()

	const [price, setPrice] = useState<number>()
	const navigate = useNavigate()

	useEffect(() => {
		;(async () => {
			const promises = Object.keys(basket)
				.map((key) => new ProductId(key))
				.map(async (id) => await Product.fromId(id))

			await Promise.all(promises)

			const result = new Array<Product>()

			promises.forEach((promise) =>
				promise.then((response) => {
					if (!(response instanceof ExError)) {
						result.push(response)
					}
				}),
			)

			await Promise.resolve()
			setProducts(result)
		})()
	}, [])

	useEffect(() => {
		setRenderedProducts(
			products?.filter((product) => basket[product.id.id] != undefined),
		)

		setPrice(
			products
				?.map(
					(product) =>
						(basket[product.id.id] || 0) * product.price.price,
				)
				.concat(0)
				.reduce((prev, cur) => prev + cur),
		)
	}, [basket, products])

	if (price == 0) {
		return (
			<div className="flex flex-col items-center">
				<div className="flex flex-col items-center p-4 m-4 bg-[var(--dark-color)] rounded-3xl">
					<p className="text-4xl text-[var(--main-color)]">
						Корзина пуста
					</p>

					<p className="text-zinc-800 max-w-80 text-center py-4">
						Однако, вы можете это исправить, перейдя в наш магазин
					</p>

					<SimpleButton
						className="py-4"
						onClick={() => navigate("/shop")}
					>
						<p className="text-zinc-800">Перейти в магазин</p>
					</SimpleButton>
				</div>
			</div>
		)
	}

	return (
		<div className="p-4 m-2 flex flex-col lg:flex-row justify-center items-center lg:items-start">
			<div className="flex flex-col items-stretch">
				{renderedProducts?.map((product) => (
					<BasketProductWrapper
						product={product}
						key={product.id.id}
					/>
				))}
			</div>
			<div className="bg-[var(--dark-color)] m-2 p-4 rounded-3xl flex flex-col items-center">
				<p className="text-3xl">
					Итого:{" "}
					<span className="text-[var(--main-color)]">{price}₽</span>
				</p>
				<AccentButton>Перейти к оплате</AccentButton>
			</div>
		</div>
	)
}

export default BasketWidget
