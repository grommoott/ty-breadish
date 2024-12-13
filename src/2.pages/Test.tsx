import OrdersListWidget from "@widgets/OrdersListWidget"
import { ReactElement } from "react"

export default function Test(): ReactElement {
	return (
		<div className="flex flex-col items-center bg-zinc-900">
			<OrdersListWidget />
		</div>
	)
}
