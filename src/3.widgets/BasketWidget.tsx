import BasketProductWrapper from "@entities/BasketProductWrapper"
import { Product } from "@shared/facades"
import { ExError } from "@shared/helpers"
import { useAppSelector } from "@shared/hooks"
import { ProductId } from "@shared/model/types/primitives"
import { AccentButton } from "@shared/ui/Buttons"
import { FC, useEffect, useState } from "react"

const BasketWidget: FC = () => {
	const basket = useAppSelector((state) => state.basket)
	const [products, setProducts] = useState<Array<Product>>()
	const [renderedProducts, setRenderedProducts] = useState<Array<Product>>()

	const [price, setPrice] = useState<number>()

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
			<p className="text-3xl text-zinc-700 p-4 m-2 bg-[var(--dark-color)] rounded-3xl">
				Корзина пуста
			</p>
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
