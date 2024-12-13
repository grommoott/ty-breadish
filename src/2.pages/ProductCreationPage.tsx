import Header from "@widgets/Header"
import { ProductChangeForm } from "@widgets/ItemChangeForm"
import { FC } from "react"

const ProductCreationPage: FC = () => {
	return (
		<>
			<Header />

			<div className="bg-zinc-900">
				<ProductChangeForm />
			</div>
		</>
	)
}

export default ProductCreationPage
