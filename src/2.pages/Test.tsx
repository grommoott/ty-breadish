import Header from "@widgets/Header"
import { ProductsListWidget } from "@widgets/ItemsListWidgets"
import { ReactElement } from "react"

export default function Test(): ReactElement {
	return (
		<>
			<Header />

			<div className="bg-zinc-900">
				<ProductsListWidget />
			</div>
		</>
	)
}
