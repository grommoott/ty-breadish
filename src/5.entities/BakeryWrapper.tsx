import { Bakery } from "@shared/facades"
import { requiredFieldValidator } from "@shared/helpers"
import { useDefaultWidgetWidth } from "@shared/hooks"
import { Coords } from "@shared/model/types/primitives"
import { AccentButton } from "@shared/ui/Buttons"
import { ValidatedInput } from "@shared/ui/Inputs"
import { FC, SetStateAction, useState, Dispatch, ReactNode } from "react"

interface BakeryWrapperProps {
	bakery: Bakery
	changeBakeryButton: (
		bakery: Bakery,
		getAddress: () => string,
		getCoords: () => Coords,
		setAddressError: Dispatch<SetStateAction<string>>,
		setCoordsError: Dispatch<SetStateAction<string>>,
		setEditing: Dispatch<SetStateAction<boolean>>,
	) => ReactNode
	deleteBakeryButton: (bakery: Bakery) => ReactNode
}

const BakeryWrapper: FC<BakeryWrapperProps> = ({
	bakery,
	changeBakeryButton,
	deleteBakeryButton,
}) => {
	const [isEditing, setEditing] = useState(false)

	const [address, setAddress] = useState(bakery.address)
	const [coords, setCoords] = useState(bakery.coords)

	const [addressError, setAddressError] = useState("")
	const [coordsError, setCoordsError] = useState("")

	const width = useDefaultWidgetWidth()

	return (
		<div
			className="flex flex-col items-center m-2 p-4 rounded-3xl bg-[var(--dark-color)]"
			style={{ width: `${width}vw` }}
		>
			<div className="flex flex-col md:flex-row items-center justify-around w-full mb-4 gap-4">
				<div className="flex flex-col items-center">
					<p className="text-zinc-700">ID</p>
					<p>{bakery.id.id}</p>
				</div>

				<div className="flex flex-col items-center">
					<p className="text-zinc-700">Адрес</p>

					{isEditing ? (
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
					) : (
						<p>{address}</p>
					)}
				</div>

				<div className="flex flex-col items-center gap-2">
					<p className="text-zinc-700">Координаты</p>

					<div className="flex flex-row items-center gap-2">
						<p className="text-[var(--main-color)]">Широта</p>

						{isEditing ? (
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
						) : (
							<div className="flex flex-row items-center gap-2">
								<p>{coords.latitude}</p>
							</div>
						)}
					</div>

					<div className="flex flex-row items-center gap-2">
						<p className="text-[var(--main-color)]">Долгота</p>

						{isEditing ? (
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
						) : (
							<div className="flex flex-row items-center gap-2">
								<p>{coords.longitude}</p>
							</div>
						)}
					</div>
				</div>
			</div>

			<div className="flex flex-col md:flex-row items-center justify-center w-full">
				{isEditing ? (
					changeBakeryButton(
						bakery,
						() => address,
						() => coords,
						setAddressError,
						setCoordsError,
						setEditing,
					)
				) : (
					<AccentButton
						className="w-full"
						onClick={() => setEditing(true)}
					>
						Изменить
					</AccentButton>
				)}

				{deleteBakeryButton(bakery)}
			</div>
		</div>
	)
}

export default BakeryWrapper
