import { Order } from "@shared/facades"
import { ExError } from "@shared/helpers"
import { useNotification } from "@shared/hooks"
import { CourierOrderState, PickUpOrderState } from "@shared/model/types/enums"
import { Moment } from "@shared/model/types/primitives"
import { AccentButton } from "@shared/ui/Buttons"
import Loading from "@shared/ui/Loading"
import { Dispatch, FC, SetStateAction, useCallback, useState } from "react"

interface ChangeOrderButtonProps {
	order: Order
	setChanged: Dispatch<SetStateAction<boolean>>
	getSelectedState: () => CourierOrderState | PickUpOrderState
	getReadyDate: () => Date
	className?: string
}

const ChangeOrderButton: FC<ChangeOrderButtonProps> = ({
	order,
	setChanged,
	getSelectedState,
	getReadyDate,
	className = "",
}) => {
	const [isLoading, setLoading] = useState(false)
	const notificate = useNotification()

	const changeOrderState = useCallback(async () => {
		setLoading(true)
		const stateResponse = await order.changeState(getSelectedState())

		if (stateResponse instanceof ExError) {
			console.error(stateResponse)
			setLoading(false)
			notificate("Произошла ошибка")
			return
		}

		const momentResponse = await order.changeReadyMoment(
			new Moment(getReadyDate().getTime()),
		)

		if (momentResponse instanceof ExError) {
			console.error(momentResponse)
			setLoading(false)
			notificate("Произошла ошибка")
			return
		}

		setLoading(false)
		setChanged(false)
	}, [])

	return (
		<AccentButton
			className={
				"px-6 flex flex-row items-center justify-center " + className
			}
			onClick={changeOrderState}
		>
			Сохранить{" "}
			{isLoading && (
				<div className="l-2">
					<Loading color="black" />
				</div>
			)}
		</AccentButton>
	)
}

export default ChangeOrderButton
