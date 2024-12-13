import OrderWrapper from "@entities/OrderWrapper"
import DeleteOrderButton from "@features/DeleteOrderButton"
import { Order } from "@shared/facades"
import { ExError } from "@shared/helpers"
import { useDefaultWidgetWidth } from "@shared/hooks"
import Loading from "@shared/ui/Loading"
import { FC, useEffect, useState } from "react"

const OrdersListWidget: FC = () => {
	const width = useDefaultWidgetWidth()
	const [orders, setOrders] = useState<Array<Order>>()
	const [isLoading, setLoading] = useState(false)

	useEffect(() => {
		;(async () => {
			setLoading(true)
			const response = await Order.getList()

			if (response instanceof ExError) {
				console.error(response)
				setLoading(false)
				return
			}

			setOrders(response)
			setLoading(false)
		})()
	}, [])

	return (
		<div className="flex flex-col items-center">
			<div
				className="flex flex-col items-center m-4"
				style={{ width: `${width}vw` }}
			>
				{orders?.map((order) => (
					<OrderWrapper
						order={order}
						deleteButton={(onDelete) => (
							<DeleteOrderButton
								order={order}
								onDelete={onDelete}
							/>
						)}
						key={order.id.id}
					/>
				))}

				{isLoading && (
					<div className="m-4 p-4 bg-[var(--dark-color)] rounded-3xl">
						<Loading />
					</div>
				)}
			</div>
		</div>
	)
}

export default OrdersListWidget
