import { Order } from "@shared/facades"
import { ExError } from "@shared/helpers"
import { useNotification, usePopupWindow } from "@shared/hooks"
import { AccentButton } from "@shared/ui/Buttons"
import Loading from "@shared/ui/Loading"
import { agreeWindow } from "@shared/ui/PopupWindows"
import { FC, useState } from "react"

interface DeleteOrderButtonProps {
	onDelete: (order: Order) => void
	order: Order
}

const DeleteOrderButton: FC<DeleteOrderButtonProps> = ({ onDelete, order }) => {
	const popupWindow = usePopupWindow()
	const notification = useNotification()

	const [isLoading, setLoading] = useState(false)

	return (
		<AccentButton
			onClick={async () => {
				const result = await popupWindow(
					agreeWindow(
						"Вы уверены, что хотите отменить выполнение заказа? Средства будут возвращены, однако не сразу",
					),
				)

				if (result == undefined) {
					return
				}

				setLoading(true)

				const response = await order.delete()

				if (response instanceof ExError) {
					console.error(response)
					notification("Произошла ошибка сервера")
					setLoading(false)
					return
				}

				setLoading(false)
				onDelete(order)
			}}
			className="flex flex-row items-center"
		>
			Отменить заказ{" "}
			{isLoading && (
				<div className="l-2">
					<Loading color="black" />
				</div>
			)}
		</AccentButton>
	)
}

export default DeleteOrderButton
