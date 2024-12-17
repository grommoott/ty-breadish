import OrderManagerWrapper from "@entities/OrderManagerWrapper"
import ChangeOrderStateButton from "@features/ChangeOrderButton"
import { Order } from "@shared/facades"
import { ExError } from "@shared/helpers"
import { useDefaultWidgetWidth, useNotification } from "@shared/hooks"
import { BakeryId } from "@shared/model/types/primitives"
import Checkbox from "@shared/ui/Checkbox"
import { ValidatedInput } from "@shared/ui/Inputs"
import Loading from "@shared/ui/Loading"
import { FC, useEffect, useMemo, useState } from "react"

interface OrdersManagerWidgetProps {}

const OrdersManagerWidget: FC<OrdersManagerWidgetProps> = () => {
	const [bakeryId, setBakeryId] = useState<BakeryId>()
	const [isOrdersLoading, setOrdersLoading] = useState(false)
	const [orders, setOrders] = useState<Array<Order>>()

	const width = useDefaultWidgetWidth()

	const notificate = useNotification()

	const [hideCompleted, setHideCompleted] = useState(true)

	const filteredOrders = useMemo(
		() =>
			orders?.filter(
				(order) =>
					order.orderInfo.state != "completed" || !hideCompleted,
			),
		[orders, hideCompleted],
	)

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
				validator={async (value) => {
					if (Number.isNaN(parseInt(value))) {
						return "Id пекарни должен представлять число"
					}

					return ""
				}}
				placeholder="Введите Id пекарни"
			/>

			<div className="flex flex-row items-center gap-2">
				<Checkbox
					defaultValue={true}
					onValueChanged={setHideCompleted}
					children="Скрыть выполненные"
				/>
			</div>

			{isOrdersLoading ? (
				<div className="m-2 p-4 rounded-3xl bg-[var(--dark-color)]">
					<Loading />
				</div>
			) : (
				<div
					className="flex flex-col items-center"
					style={{ width: `${width}vw` }}
				>
					{orders == undefined && (
						<p className="text-center text-zinc-700 w-80">
							Введите id пекарни, для которой хотите увидеть
							заказы
						</p>
					)}

					{filteredOrders?.length == 0 && (
						<p className="text-center text-zinc-700">
							У этой пекарни пока нет заказов
						</p>
					)}

					{filteredOrders?.map((order) => (
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
