import { Bakery } from "@shared/facades"
import {
	coordsValidator,
	ExError,
	requiredFieldValidator,
} from "@shared/helpers"
import { useNotification } from "@shared/hooks"
import { Coords } from "@shared/model/types/primitives"
import { AccentButton } from "@shared/ui/Buttons"
import Loading from "@shared/ui/Loading"
import { Dispatch, FC, SetStateAction, useCallback, useState } from "react"

interface ChangeBakeryButtonProps {
	bakery: Bakery
	getAddress: () => string
	getCoords: () => Coords
	setAddressError: Dispatch<SetStateAction<string>>
	setCoordsError: Dispatch<SetStateAction<string>>
	setEditing: Dispatch<SetStateAction<boolean>>
}

const ChangeBakeryButton: FC<ChangeBakeryButtonProps> = ({
	bakery,
	getAddress,
	getCoords,
	setAddressError,
	setCoordsError,
	setEditing,
}) => {
	const notificate = useNotification()
	const [isLoading, setLoading] = useState(false)

	const changeBakery = useCallback(async () => {
		const addressError = await requiredFieldValidator(getAddress())
		const coordsError = await coordsValidator(getCoords())

		setAddressError(addressError)
		setCoordsError(coordsError)

		if (addressError != "" || coordsError != "") {
			return
		}

		setLoading(true)
		const response = await bakery.edit(getAddress(), getCoords())

		if (response instanceof ExError) {
			console.error(response)
			notificate("Произошла ошибка")
			setLoading(false)
			return
		}

		setLoading(false)
		setEditing(false)
		notificate("Данные пекарни изменены")
	}, [
		getAddress,
		getCoords,
		setLoading,
		setAddressError,
		setCoordsError,
		setEditing,
	])

	return (
		<AccentButton
			className="w-full flex flex-row items-center justify-center"
			onClick={changeBakery}
		>
			Сохранить изменения{" "}
			{isLoading && (
				<div className="pl-2">
					<Loading color="black" />
				</div>
			)}
		</AccentButton>
	)
}

export default ChangeBakeryButton
