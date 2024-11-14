import { Product } from "@shared/facades"
import { ExError } from "@shared/helpers"
import { ProductId } from "@shared/model/types/primitives"
import Header from "@widgets/Header"
import { ProductWidget } from "@widgets/ItemWidgets"
import { FC, useEffect, useState } from "react"
import { useParams } from "react-router-dom"

type ProductPageParams = {
	id: string
}

const ProductPage: FC = () => {
	const params = useParams<ProductPageParams>()

	const [product, setProduct] = useState<Product>()

	useEffect(() => {
		;(async () => {
			if (!params.id) {
				return
			}

			const response = await Product.fromId(new ProductId(params.id))

			if (response instanceof ExError) {
				console.error(response)
				return
			}

			setProduct(response)
		})()
	}, [])

	return (
		<>
			<Header />

			<div className="bg-zinc-900">
				<ProductWidget product={product} />
			</div>
		</>
	)
}

export default ProductPage
