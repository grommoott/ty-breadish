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

interface CreateBakeryButtonProps {
	getAddress: () => string
	getCoords: () => Coords
	setAddressError: Dispatch<SetStateAction<string>>
	setCoordsError: Dispatch<SetStateAction<string>>
	onCreate?: (bakery: Bakery) => void
}

const CreateBakeryButton: FC<CreateBakeryButtonProps> = ({
	getAddress,
	getCoords,
	setAddressError,
	setCoordsError,
	onCreate = () => {},
}) => {
	const notificate = useNotification()
	const [isLoading, setLoading] = useState(false)

	const createBakery = useCallback(async () => {
		const addressError = await requiredFieldValidator(getAddress())
		const coordsError = await coordsValidator(getCoords())

		setAddressError(addressError)
		setCoordsError(coordsError)

		if (addressError != "" || coordsError != "") {
			return
		}

		setLoading(true)
		const response = await Bakery.create(getAddress(), getCoords())

		if (response instanceof ExError) {
			console.error(response)
			notificate("Произошла ошибка")
			setLoading(false)
			return
		}

		console.log(response)

		notificate("Пекарня создана")
		setLoading(false)
		onCreate(response)
	}, [getAddress, getCoords, setLoading, setAddressError, setCoordsError])

	return (
		<AccentButton
			onClick={createBakery}
			className="w-full flex flex-row items-center justify-center"
		>
			Создать пекарню{" "}
			{isLoading && (
				<div className="pl-2">
					<Loading color="black" />
				</div>
			)}
		</AccentButton>
	)
}

export default CreateBakeryButton
