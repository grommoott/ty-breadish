import { Bakery } from "@shared/facades"
import { requiredFieldValidator } from "@shared/helpers"
import { useDefaultWidgetWidth } from "@shared/hooks"
import { Coords } from "@shared/model/types/primitives"
import { ValidatedInput } from "@shared/ui/Inputs"
import {
	FC,
	ReactNode,
	SetStateAction,
	useState,
	Dispatch,
	useCallback,
} from "react"

interface CreateBakeryFormProps {
	onCreate: (bakery: Bakery) => void
	createBakeryButton: (
		getAddress: () => string,
		getCoords: () => Coords,
		setAddressError: Dispatch<SetStateAction<string>>,
		setCoordsError: Dispatch<SetStateAction<string>>,
		onCreate: (bakery: Bakery) => void,
	) => ReactNode
}

const CreateBakeryForm: FC<CreateBakeryFormProps> = ({
	onCreate,
	createBakeryButton,
}) => {
	const [address, setAddress] = useState("")
	const [coords, setCoords] = useState(new Coords(0, 0))

	const [addressError, setAddressError] = useState("")
	const [coordsError, setCoordsError] = useState("")

	const clearFields = useCallback(() => {
		setAddress("")
		setCoords(new Coords(0, 0))

		setAddressError("")
		setCoordsError("")
	}, [setAddress, setCoords, setAddressError, setCoordsError])

	const width = useDefaultWidgetWidth()

	return (
		<div
			className="flex flex-col items-center m-2 p-4 rounded-3xl bg-[var(--dark-color)]"
			style={{ width: `${width}vw` }}
		>
			<div className="flex flex-col md:flex-row items-center mb-4 gap-4">
				<div className="flex flex-col items-center">
					<p className="text-zinc-700">Адрес</p>

					<ValidatedInput
						value={address}
						validator={requiredFieldValidator}
						error={addressError}
						onChange={(value) => {
							setAddress(value)
							setAddressError("")
						}}
						placeholder="Адрес"
						margin="0 0"
					/>
				</div>

				<div className="flex flex-col items-center gap-2">
					<p className="text-zinc-700">Координаты</p>

					<div className="flex flex-row items-center gap-2">
						<p className="text-[var(--main-color)]">Широта</p>

						<ValidatedInput
							value={coords.latitude.toString()}
							validator={(value) => {
								if (Number.isNaN(parseFloat(value))) {
									return "Широта должна представлять из себя число"
								}

								return ""
							}}
							error={coordsError}
							onChange={(value) => {
								setCoords(
									(prev) =>
										new Coords(
											parseFloat(value),
											prev.longitude,
										),
								)
								setCoordsError("")
							}}
							placeholder="Широта"
							margin="0 0"
						/>
					</div>

					<div className="flex flex-row items-center gap-2">
						<p className="text-[var(--main-color)]">Долгота</p>

						<ValidatedInput
							value={coords.longitude.toString()}
							validator={(value) => {
								if (Number.isNaN(parseFloat(value))) {
									return "Долгота должна представлять из себя число"
								}

								return ""
							}}
							error={coordsError}
							onChange={(value) => {
								setCoords(
									(prev) =>
										new Coords(
											prev.latitude,
											parseFloat(value),
										),
								)
								setCoordsError("")
							}}
							placeholder="Долгота"
							margin="0 0"
						/>
					</div>
				</div>
			</div>

			{createBakeryButton(
				() => address,
				() => coords,
				setAddressError,
				setCoordsError,
				(bakery) => {
					clearFields()
					onCreate(bakery)
				},
			)}
		</div>
	)
}

export default CreateBakeryForm
