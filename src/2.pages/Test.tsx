import { Product } from "@shared/facades"
import { ExError } from "@shared/helpers"
import { ProductId } from "@shared/model/types/primitives"
import Header from "@widgets/Header"
import ProductWidget from "@widgets/ProductWidget"
import { ReactElement, useEffect, useState } from "react"

export default function Test(): ReactElement {
	const [product, setProduct] = useState<Product>()

	useEffect(() => {
		;(async () => {
			const response = await Product.fromId(new ProductId(2))

			if (response instanceof ExError) {
				console.error(response)
				return response
			}

			setProduct(response)
		})()
	}, [])

	return (
		<>
			<Header />

			<div className="bg-zinc-900 flex flex-col items-center justify-center">
				<ProductWidget product={product} />
			</div>
		</>
	)
}
