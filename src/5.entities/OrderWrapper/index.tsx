import { Order, Product } from "@shared/facades"
import { ExError } from "@shared/helpers"
import Loading from "@shared/ui/Loading"
import { FC, ReactNode, useEffect, useMemo, useState } from "react"
import OrderProduct from "./ui/OrderProduct"
import {
	CourierOrderState,
	OrderTypes,
	PaymentStatuses,
	PickUpOrderState,
	translateCourierOrderState,
	translateOrderType,
	translatePickUpOrderState,
} from "@shared/model/types/enums"

interface OrderWrapperProps {
	order: Order
	deleteButton: (onDelete: () => void) => ReactNode
}

const OrderWrapper: FC<OrderWrapperProps> = ({ order, deleteButton }) => {
	const [isLoading, setLoading] = useState(false)
	const [products, setProducts] = useState<Array<Product>>()
	const [isCanceled, setCanceled] = useState(false)

	useEffect(() => {
		;(async () => {
			setLoading(true)

			const response = await order.getProducts()

			if (response instanceof ExError) {
				console.error(response)
				setLoading(false)
				return
			}

			setProducts(response)
			setLoading(false)
		})()

		setCanceled(
			order.paymentStatus == PaymentStatuses.Refunded ||
				order.paymentStatus == PaymentStatuses.Canceled,
		)
	}, [])

	const status = useMemo(() => {
		if (isCanceled) {
			return "Заказ отменён"
		}

		switch (order.orderType) {
			case OrderTypes.PickUp:
				return translatePickUpOrderState(
					order.orderInfo.state as PickUpOrderState,
				)

			case OrderTypes.Courier:
				return translateCourierOrderState(
					order.orderInfo.state as CourierOrderState,
				)
		}
	}, [order, isCanceled])

	return (
		<div className="m-2 p-4 rounded-3xl bg-[var(--dark-color)] flex flex-col items-center w-full">
			<h2 className="text-3xl text-center m-2">
				Ожидаемое время готовности{" "}
				<span className="text-[var(--main-color)]">
					{order.readyMoment.moment == -1 ? (
						"неизвестно"
					) : (
						<>
							<span className="text-white"> - </span>
							{new Date(
								order.readyMoment.moment,
							).toLocaleString()}
						</>
					)}
				</span>
			</h2>

			<h3 className="text-2xl text-center m-2">
				Способ доставки:{" "}
				<span className="text-[var(--main-color)]">
					"{translateOrderType(order.orderType)}"
				</span>
			</h3>

			{/* <h3 className="text-2xl text-center m-2"> */}
			{/*              Адрес доставки: */}
			{/* 	<span className="text-[var(--main-color)]"> */}
			{/* 	</span> */}
			{/* </h3> */}

			<h2 className="text-2xl text-center m-2 text-zinc-600">{status}</h2>

			{products?.map((product) => (
				<OrderProduct
					product={product}
					count={order.orderInfo.productCounts[product.id.id]}
					key={product.id.id}
				/>
			))}

			{isLoading && (
				<div className="m-2">
					<Loading />
				</div>
			)}

			{!isCanceled && deleteButton(() => setCanceled(true))}
		</div>
	)
}

export default OrderWrapper
