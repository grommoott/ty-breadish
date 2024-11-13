import BasketWidget from "@widgets/BasketWidget"
import Header from "@widgets/Header"
import { FC } from "react"

const BasketPage: FC = () => {
	return (
		<>
			<Header />

			<div className="bg-zinc-900">
				<BasketWidget />
			</div>
		</>
	)
}

export default BasketPage
