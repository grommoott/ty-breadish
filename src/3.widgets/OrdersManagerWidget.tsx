import OrderManagerWrapper from "@entities/OrderManagerWrapper"
import ChangeOrderStateButton from "@features/ChangeOrderButton"
import { Order } from "@shared/facades"
import { ExError } from "@shared/helpers"
import { useDefaultWidgetWidth, useNotification } from "@shared/hooks"
import { BakeryId } from "@shared/model/types/primitives"
import { ValidatedInput } from "@shared/ui/Inputs"
import Loading from "@shared/ui/Loading"
import { FC, useEffect, useState } from "react"

interface OrdersManagerWidgetProps {}

const OrdersManagerWidget: FC<OrdersManagerWidgetProps> = () => {
	const [bakeryId, setBakeryId] = useState<BakeryId>()
	const [isOrdersLoading, setOrdersLoading] = useState(false)
	const [orders, setOrders] = useState<Array<Order>>()

	const width = useDefaultWidgetWidth()

	const notificate = useNotification()

	useEffect(() => {
		;(async () => {
			if (bakeryId == undefined) {
				return
			}

			setOrdersLoading(true)
			const response = await Order.getByBakery(bakeryId)

			if (response instanceof ExError) {
				console.error(response)
				notificate("Произошла ошибка")
				setOrdersLoading(false)
				return
			}

			setOrders(response)
			setOrdersLoading(false)
		})()
	}, [bakeryId])

	return (
		<div className="flex flex-col items-center w-full m-4 gap-4">
			<ValidatedInput
				margin="0 0"
				width={`${width}vw`}
				onChange={(value) => setBakeryId(new BakeryId(value))}
				validator={(value) => {
					if (Number(value) == undefined) {
						return "Id пекарни должен представлять число"
					}

					return ""
				}}
				placeholder="Введите Id пекарни"
			/>

			{isOrdersLoading ? (
				<div className="m-2 p-4 rounded-3xl bg-[var(--dark-color)]">
					<Loading />
				</div>
			) : (
				<div
					className="flex flex-col items-center"
					style={{ width: `${width}vw` }}
				>
					{orders?.length == 0 && (
						<p className="text-center text-zinc-700">
							У этой пекарни пока нет заказов
						</p>
					)}

					{orders?.map((order) => (
						<OrderManagerWrapper
							order={order}
							changeOrderButton={(
								order,
								setChanged,
								getSelectedState,
								getReadyDate,
							) => (
								<ChangeOrderStateButton
									order={order}
									setChanged={setChanged}
									getSelectedState={getSelectedState}
									getReadyDate={getReadyDate}
									className="w-full m-0"
								/>
							)}
							key={order.id.id}
						/>
					))}
				</div>
			)}
		</div>
	)
}

export default OrdersManagerWidget
