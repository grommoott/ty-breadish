import { Bakery } from "@shared/facades"
import { ExError } from "@shared/helpers"
import { useNotification, usePopupWindow } from "@shared/hooks"
import { AccentButton } from "@shared/ui/Buttons"
import Loading from "@shared/ui/Loading"
import { agreeWindow } from "@shared/ui/PopupWindows"
import { FC, useCallback, useState } from "react"

interface DeleteBakeryButtonProps {
	bakery: Bakery
	onDelete?: (bakery: Bakery) => void
}

const DeleteBakeryButton: FC<DeleteBakeryButtonProps> = ({
	bakery,
	onDelete = () => {},
}) => {
	const [isLoading, setLoading] = useState(false)

	const notificate = useNotification()
	const popupWindow = usePopupWindow()

	const deleteBakery = useCallback(async () => {
		const result = await popupWindow(
			agreeWindow("Вы уверены, что хотите удалить эту пекарню?"),
		)

		if (result == undefined) {
			return
		}

		setLoading(true)
		const response = await bakery.delete()

		if (response instanceof ExError) {
			console.error(response)
			setLoading(false)
			notificate("Произошла ошибка")
			return
		}

		onDelete(bakery)
		notificate("Пекарня удалена")
		setLoading(false)
	}, [bakery, setLoading])

	return (
		<AccentButton
			className="w-full flex flex-row items-center justify-center"
			onClick={deleteBakery}
		>
			Удалить пекарню{" "}
			{isLoading && (
				<div className="pl-2">
					<Loading color="black" />
				</div>
			)}
		</AccentButton>
	)
}

export default DeleteBakeryButton
