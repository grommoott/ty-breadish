import { Order, Product, User } from "@shared/facades"
import { ExError } from "@shared/helpers"
import Loading from "@shared/ui/Loading"
import {
	FC,
	ReactNode,
	SetStateAction,
	useEffect,
	useMemo,
	useState,
} from "react"
import OrderManagerProduct from "./ui/OrderManagerProduct"
import {
	CourierOrderState,
	CourierOrderStates,
	OrderTypes,
	PickUpOrderState,
	PickUpOrderStates,
	translateCourierOrderState,
	translatePickUpOrderState,
} from "@shared/model/types/enums"
import ListBox from "@shared/ui/ListBox"
import { Dispatch } from "react"
import DateTimePicker from "@shared/ui/DateTimePicker"

interface OrderManagerWrapperProps {
	order: Order
	changeOrderButton: (
		order: Order,
		setChanged: Dispatch<SetStateAction<boolean>>,
		getSelectedState: () => CourierOrderState | PickUpOrderState,
		getReadyMoment: () => Date,
	) => ReactNode
}

const OrderManagerWrapper: FC<OrderManagerWrapperProps> = ({
	order,
	changeOrderButton,
}) => {
	const [user, setUser] = useState<User>()
	const [isUserLoading, setUserLoading] = useState(true)

	const [products, setProducts] = useState<Array<Product>>()
	const [isProductsLoading, setProductsLoading] = useState(true)

	const [selectedState, setSelectedState] = useState<
		CourierOrderState | PickUpOrderState
	>(order.orderInfo.state)

	const [readyMoment, setReadyMoment] = useState<Date>(
		new Date(order.readyMoment.moment),
	)

	const [isChanged, setChanged] = useState(false)

	useEffect(() => {
		;(async () => {
			setUserLoading(true)
			const response = await User.fromId(order.from)

			if (response instanceof ExError) {
				console.error(response)
				setUserLoading(false)
				return
			}

			setUserLoading(false)
			setUser(response)
		})()
		;(async () => {
			setProductsLoading(true)
			const response = await order.getProducts()

			if (response instanceof ExError) {
				console.error(response)
				setProductsLoading(false)
				return
			}

			setProductsLoading(false)
			setProducts(response)
		})()
	}, [])

	const listBox = useMemo(() => {
		switch (order.orderType) {
			case OrderTypes.PickUp:
				return (
					<ListBox
						items={
							new Map(
								Object.values(PickUpOrderStates).map((val) => [
									val,
									translatePickUpOrderState(val),
								]),
							)
						}
						onChange={(value) => {
							setSelectedState(value as PickUpOrderState)
							setChanged(true)
						}}
						defaultValue={{
							key: order.orderInfo.state,
							value: translatePickUpOrderState(
								order.orderInfo.state as PickUpOrderState,
							),
						}}
					/>
				)

			case OrderTypes.Courier:
				return (
					<ListBox
						items={
							new Map(
								Object.values(CourierOrderStates).map((val) => [
									val,
									translateCourierOrderState(val),
								]),
							)
						}
						onChange={(value) => {
							setSelectedState(value as CourierOrderState)
							setChanged(true)
						}}
						defaultValue={{
							key: order.orderInfo.state,
							value: translateCourierOrderState(
								order.orderInfo.state as CourierOrderState,
							),
						}}
					/>
				)

			default:
				return <></>
		}
	}, [order, setSelectedState, setChanged])

	return (
		<div className="m-2 p-4 rounded-3xl bg-[var(--dark-color)] flex flex-col items-start gap-2 w-full">
			<div className="flex flex-col lg:flex-row justify-around w-full my-2 items-center gap-2">
				<div className="flex flex-row items-center gap-4">
					{isUserLoading ? (
						<Loading />
					) : (
						<>
							{user == undefined ? (
								<p className="text-red-500">
									Произошла ошибка во время загрузки
									пользователя
								</p>
							) : (
								<>
									<img
										src={user.avatarLink}
										className="size-12 rounded-full"
									/>
									<p className="text-[var(--main-color)] text-2xl">
										{user.username}
									</p>
								</>
							)}
						</>
					)}
				</div>

				<p className="text-2xl text-center">
					Тип доставки:{" "}
					<span className="text-[var(--main-color)]">
						{(() => {
							switch (order.orderType) {
								case OrderTypes.Courier:
									return "Курьер"

								case OrderTypes.PickUp:
									return "Самовывоз"
							}
						})()}
					</span>
				</p>
			</div>

			<div className="flex flex-col items-center w-full gap-2">
				{isProductsLoading ? (
					<Loading />
				) : (
					<>
						{products == undefined ? (
							<p className="text-red-500">
								Произошла ошибка во время загрузки списка
								продуктов
							</p>
						) : (
							<>
								{products.map((product) => (
									<OrderManagerProduct
										product={product}
										count={
											order.orderInfo.productCounts[
												product.id.id
											]
										}
										key={product.id.id}
									/>
								))}
							</>
						)}
					</>
				)}
			</div>

			<div className="flex flex-col lg:flex-row items-center justify-around w-full my-4 gap-4 px-4">
				<div className="flex flex-col sm:flex-row items-center">
					<p className="text-xl mr-2 text-[var(--main-color)]">
						Состояние
					</p>
					{listBox}
				</div>
				<div className="flex flex-col sm:flex-row items-center">
					<p className="text-xl mr-2 text-[var(--main-color)]">
						Дата и время готовности
					</p>
					<DateTimePicker
						defaultValue={readyMoment}
						onChange={(value) => {
							setReadyMoment(value)
							setChanged(true)
						}}
					/>
				</div>
			</div>

			{isChanged &&
				changeOrderButton(
					order,
					setChanged,
					() => selectedState,
					() => readyMoment,
				)}
		</div>
	)
}

export default OrderManagerWrapper
