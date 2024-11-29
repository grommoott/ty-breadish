import {
	useAppSelector,
	useDefaultWidgetWidth,
	useNotification,
} from "@shared/hooks"
import {
	CourierOrderStates,
	OrderType,
	OrderTypes,
} from "@shared/model/types/enums"
import { AccentButton, SimpleButton } from "@shared/ui/Buttons"
import { motion } from "framer-motion"
import { FC, useEffect, useMemo, useRef, useState } from "react"
import PickUpOrderForm from "./PickUpOrderForm"
import CourierOrderForm from "./CourierOrderForm"
import { useNavigate } from "react-router-dom"
import { ErrorData, FormData } from "../types"
import { CourierOrderInfo, ProductId } from "@shared/model/types/primitives"
import { ExError, requiredFieldValidator } from "@shared/helpers"
import { bakeryIdValidator, orderTypeValidator } from "../helpers"
import { Order } from "@shared/facades"

const OrderCreationForm: FC = () => {
	const [currentOrderType, setCurrentOrderType] = useState<OrderType>()

	const basketObject = useAppSelector((state) => state.basket)
	const basket = useMemo(
		() =>
			Array.from(
				Object.entries(basketObject).filter(
					(val) => val[1] != undefined,
				),
			),
		[basketObject],
	)

	const width = useDefaultWidgetWidth()
	const formRef = useRef(null)
	const navigator = useNavigate()

	const notificate = useNotification()

	const [isLoading, setLoading] = useState(false)

	const [formData, setFormData] = useState<FormData>({
		productIds: basket.map(([id, _]) => new ProductId(id)),
		productCounts: (() => {
			const productCounts: { [id: string]: number } = {}

			basket.forEach(([id, count]) => {
				if (count == 0 || count == undefined) {
					return
				}

				productCounts[id] = count
			})

			return productCounts
		})(),
	})

	const [errorData, setErrorData] = useState<ErrorData>({
		courierOrderInfo: {
			deliveryAddress: "",
			bakeryId: "",
		},
		pickUpOrderInfo: {
			bakeryId: "",
		},
		orderType: "",
	})

	useEffect(() => {
		setFormData((prev) => ({ ...prev, orderType: currentOrderType }))
		setErrorData((_) => ({
			courierOrderInfo: { bakeryId: "", deliveryAddress: "" },
			pickUpOrderInfo: { bakeryId: "" },
			orderType: "",
		}))
	}, [currentOrderType])

	const createOrder = async () => {
		const errorData: ErrorData = {
			courierOrderInfo: {
				deliveryAddress: await requiredFieldValidator(
					formData.courierOrderInfo?.deliveryAddress || "",
				),
				bakeryId: await bakeryIdValidator(
					formData.courierOrderInfo?.bakeryId,
				),
			},
			pickUpOrderInfo: {
				bakeryId: await bakeryIdValidator(
					formData.pickUpOrderInfo?.bakeryId,
				),
			},
			orderType: await orderTypeValidator(formData.orderType),
		}

		setErrorData(errorData)

		if (
			errorData.orderType != "" ||
			(formData.orderType == OrderTypes.Courier &&
				(errorData.courierOrderInfo.bakeryId != "" ||
					errorData.courierOrderInfo.deliveryAddress != "")) ||
			(formData.orderType == OrderTypes.PickUp &&
				errorData.pickUpOrderInfo.bakeryId != "")
		) {
			return
		}

		if (
			formData.productCounts == undefined ||
			formData.productIds == undefined
		) {
			return
		}

		switch (formData.orderType) {
			case OrderTypes.Courier:
				if (
					formData.courierOrderInfo?.bakeryId == undefined ||
					formData.courierOrderInfo?.deliveryAddress == undefined
				) {
					return
				}

				setLoading(true)

				const response = await Order.create<CourierOrderInfo>(
					OrderTypes.Courier,
					{
						bakeryId: formData.courierOrderInfo.bakeryId,
						deliveryAddress:
							formData.courierOrderInfo.deliveryAddress,
						state: CourierOrderStates.RequestSent,
						productCounts: formData.productCounts,
					},
					formData.productIds,
				)

				if (response instanceof ExError) {
					setLoading(false)
					notificate("Произошла ошибка сервера")
					console.error(response)
					return
				}

				response.setLoading(false)
				navigator()

				break
		}
	}

	if (basket.length == 0) {
		return (
			<div className="p-4 m-4 bg-[var(--dark-color)] w-[20rem] rounded-3xl flex flex-col items-center">
				<p className="text-[var(--main-color)] text-center pb-4">
					Для того, чтобы сделать заказ сначала положите продукты в
					корзину
				</p>

				<p className="text-zinc-800 text-center pb-4">
					Вы можете это исправить прямо сейчас, перейдя в наш магазин
				</p>

				<SimpleButton onClick={() => navigator("/products")}>
					<p className="text-zinc-800 text-center">
						Перейти в магазин
					</p>
				</SimpleButton>
			</div>
		)
	}

	return (
		<div
			className="flex flex-col p-4 m-4 bg-[var(--dark-color)] rounded-3xl items-center"
			style={{ width: `${width}vw` }}
		>
			<h1 className="text-[var(--main-color)] text-3xl pb-4">
				Создание заказа
			</h1>

			{errorData.orderType == "" ? (
				<h2 className="text-center">Выберите способ получения</h2>
			) : (
				<h2 className="text-red-500 text-center">
					Нужно выбрать способ получения
				</h2>
			)}

			<div className="flex flex-col sm:flex-row items-center justify-center w-full">
				<AccentButton
					className={`${currentOrderType != OrderTypes.Courier && "saturate-0"} duration-100 w-full sm:w-min`}
					onClick={() => setCurrentOrderType(OrderTypes.Courier)}
				>
					Курьер
				</AccentButton>
				<AccentButton
					className={`${currentOrderType != OrderTypes.PickUp && "saturate-0"} duration-100 w-full sm:w-min`}
					onClick={() => setCurrentOrderType(OrderTypes.PickUp)}
				>
					Самовывоз
				</AccentButton>
			</div>

			<motion.div
				className={`m-2 border-2 border-[var(--main-color)] rounded-3xl ${currentOrderType || "opacity-0"} overflow-hidden w-full`}
				initial={{
					height: 0,
					opacity: 0,
				}}
				animate={
					currentOrderType
						? {
								height: (() => {
									if (!formRef.current) {
										return
									}

									const form =
										formRef.current as HTMLDivElement

									return form.scrollHeight
								})(),
								opacity: 1,
							}
						: "initial"
				}
			>
				<div ref={formRef}>
					{(() => {
						switch (currentOrderType) {
							case OrderTypes.PickUp:
								return (
									<PickUpOrderForm
										formData={formData}
										setFormData={setFormData}
										errorData={errorData}
										setErrorData={setErrorData}
									/>
								)

							case OrderTypes.Courier:
								return (
									<CourierOrderForm
										formData={formData}
										setFormData={setFormData}
										errorData={errorData}
										setErrorData={setErrorData}
									/>
								)
						}
					})()}
				</div>
			</motion.div>

			<AccentButton
				className="px-6"
				onClick={createOrder}
			>
				Оформить заказ
			</AccentButton>
		</div>
	)
}

export { OrderCreationForm }
