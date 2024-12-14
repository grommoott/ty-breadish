import Header from "@widgets/Header"
import OrdersListWidget from "@widgets/OrdersListWidget"
import { FC } from "react"

const OrdersListPage: FC = () => {
	return (
		<>
			<Header />
			<div className="bg-zinc-900">
				<OrdersListWidget />
			</div>
		</>
	)
}

export default OrdersListPage
