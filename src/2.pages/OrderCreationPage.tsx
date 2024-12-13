import Header from "@widgets/Header"
import { OrderCreationForm } from "@widgets/OrderCreationForm"
import { FC } from "react"

const OrderCreationPage: FC = () => {
	return (
		<>
			<Header />
			<div className="bg-zinc-900 flex flex-col items-center">
				<OrderCreationForm />
			</div>
		</>
	)
}

export default OrderCreationPage
