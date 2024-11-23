import Header from "@widgets/Header"
import { ProductsListWidget } from "@widgets/ItemsListWidgets"
import { FC } from "react"

const ProductsListPage: FC = () => {
	return (
		<>
			<Header />

			<div className="bg-zinc-900">
				<ProductsListWidget />
			</div>
		</>
	)
}

export default ProductsListPage
