import { FC, useEffect, useState } from "react"
import { OrderFormProps } from "../types"
import CourierOrderMap from "./CourierOrderMap"
import { Coords } from "@shared/model/types/primitives"
import { Maps } from "@shared/facades"
import { ExError } from "@shared/helpers"
import { ValidatedInput } from "@shared/ui/Inputs"
import Loading from "@shared/ui/Loading"

interface CourierOrderFormProps extends OrderFormProps {}

const CourierOrderForm: FC<CourierOrderFormProps> = ({
	formData,
	setFormData,
	errorData,
	setErrorData,
}) => {
	const [selectedCoords, setSelectedCoords] = useState<Coords>()
	const [deliveryAddress, setDeliveryAddress] = useState<string>("")
	const [isDeliveryAddressLoading, setDeliveryAddressLoading] =
		useState(false)

	useEffect(() => {
		if (!selectedCoords) {
			return
		}

		;(async () => {
			setDeliveryAddressLoading(true)
			const response = await Maps.geocodeFromCoords(selectedCoords)

			if (response instanceof ExError) {
				console.error(response)
				setDeliveryAddressLoading(false)
				return
			}

			setDeliveryAddressLoading(false)
			setDeliveryAddress(response)
		})()
	}, [selectedCoords])

	useEffect(() => {
		setFormData((prev) => ({
			...prev,
			courierOrderInfo: { ...prev.courierOrderInfo, deliveryAddress },
		}))
		setErrorData((prev) => ({
			...prev,
			courierOrderInfo: { ...prev.courierOrderInfo, deliveryAddress: "" },
		}))
	}, [deliveryAddress])

	return (
		<div className="p-4 sm:px-6 flex flex-col items-center">
			{errorData.courierOrderInfo.bakeryId == "" ? (
				<h2 className="text-2xl text-center">
					Выберите точку доставки
				</h2>
			) : (
				<h2 className="text-2xl text-center text-[var(--main-color)]">
					Нужно выбрать точку доставки
				</h2>
			)}

			<CourierOrderMap
				onChange={(coords, bakeryId) => {
					setFormData((prev) => ({
						...prev,
						courierOrderInfo: {
							...prev.courierOrderInfo,
							bakeryId,
						},
					}))
					setErrorData((prev) => ({
						...prev,
						courierOrderInfo: {
							...prev.courierOrderInfo,
							bakeryId: "",
						},
					}))

					setSelectedCoords(coords)
				}}
			/>

			<h2 className="text-2xl text-center">
				Укажите наиболее точный адрес доставки
			</h2>

			{isDeliveryAddressLoading ? (
				<div className="my-4">
					<Loading />
				</div>
			) : (
				<ValidatedInput
					error={errorData.courierOrderInfo.deliveryAddress}
					validator={(value) => {
						if (value == "") {
							return "Адрес доставки не может быть пустым"
						}

						return ""
					}}
					onChange={(value) => {
						setDeliveryAddress(value)
						setErrorData((prev) => ({
							...prev,
							courierOrderInfo: {
								...prev.courierOrderInfo,
								deliveryAddress: "",
							},
						}))
					}}
					value={formData.courierOrderInfo?.deliveryAddress}
					currentValue={deliveryAddress}
					width="90%"
					margin="1rem 0"
					placeholder="Адрес доставки"
				/>
			)}
		</div>
	)
}

export default CourierOrderForm
