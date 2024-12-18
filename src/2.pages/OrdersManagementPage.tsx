import Header from "@widgets/Header"
import OrdersManagerWidget from "@widgets/OrdersManagerWidget"
import { FC } from "react"

const OrdersManagementPage: FC = () => {
	return (
		<>
			<Header />
			<div className="bg-zinc-900">
				<OrdersManagerWidget />
			</div>
		</>
	)
}

export default OrdersManagementPage
