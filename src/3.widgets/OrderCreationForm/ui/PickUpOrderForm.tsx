import { FC } from "react"
import { OrderFormProps } from "../types"
import PickUpOrderMap from "./PickUpOrderMap"

interface PickUpOrderFormProps extends OrderFormProps {}

const PickUpOrderForm: FC<PickUpOrderFormProps> = ({
	setFormData,
	errorData,
	setErrorData,
}) => {
	return (
		<div className="p-4 sm:px-6 flex flex-col items-center">
			{errorData.pickUpOrderInfo.bakeryId == "" ? (
				<h2 className="text-2xl text-center">Выберите пункт выдачи</h2>
			) : (
				<h2 className="text-2xl text-center text-[var(--main-color)]">
					Нужно выбрать пункт выдачи
				</h2>
			)}

			<PickUpOrderMap
				onChange={(bakery) => {
					setFormData((prev) => ({
						...prev,
						pickUpOrderInfo: {
							bakeryId: bakery?.id,
						},
					}))
					setErrorData((prev) => ({
						...prev,
						pickUpOrderInfo: {
							...prev.courierOrderInfo,
							bakeryId: "",
						},
					}))
				}}
			/>
		</div>
	)
}

export default PickUpOrderForm
