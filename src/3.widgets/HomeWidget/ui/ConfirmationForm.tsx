import { ValidatedInput } from "@shared/ui/Inputs"
import { FC, useMemo, useState } from "react"
import {
	Confirmation,
	ConfirmationData,
	ConfirmationErrorData,
	Confirmations,
} from "../types"
import { AccentButton } from "@shared/ui/Buttons"
import { passwordValidator, validationCodeValidator } from "../helpers"

interface ConfirmationFormProps {
	confirmations: Set<Confirmation>
	closeWindow: (value: any) => void
}

const ConfirmationForm: FC<ConfirmationFormProps> = ({
	confirmations,
	closeWindow,
}) => {
	const [confirmationData, setConfirmationData] = useState<ConfirmationData>({
		password: "",
		code: "",
		newCode: "",
	})

	const [errorData, setErrorData] = useState<ConfirmationErrorData>({
		password: "",
		code: "",
		newCode: "",
	})

	const hasChanged = useMemo(
		() =>
			Array.from(confirmations)
				.map((val) => confirmationData[val] != "")
				.reduce((prev, val) => prev && val),

		[confirmationData],
	)

	const sendConfirmationData = async () => {
		const errorData: ConfirmationErrorData = {
			password: "",
			code: "",
			newCode: "",
		}

		if (confirmations.has(Confirmations.password)) {
			errorData.password = await passwordValidator(
				confirmationData.password,
			)
		}

		if (confirmations.has(Confirmations.code)) {
			errorData.code = await validationCodeValidator(
				confirmationData.code,
			)
		}

		if (confirmations.has(Confirmations.newCode)) {
			errorData.code = await validationCodeValidator(
				confirmationData.newCode,
			)
		}

		if (
			errorData.password != "" ||
			errorData.code != "" ||
			errorData.newCode != ""
		) {
			setErrorData(errorData)
			return
		}

		closeWindow(["done", confirmationData])
	}

	return (
		<div className="flex flex-col items-center">
			<h1 className="text-2xl text-[var(--main-color)]">
				Подтвердите изменения
			</h1>

			{confirmations.has("password") && (
				<div className="my-2 flex flex-col items-center">
					<h1 className="text-center">Пароль</h1>
					<ValidatedInput
						placeholder="Пароль"
						error={errorData.password}
						validator={passwordValidator}
						onChange={(value) => {
							setConfirmationData((prev) => ({
								...prev,
								password: value,
							}))
						}}
					/>
				</div>
			)}

			{confirmations.has("code") && (
				<div className="my-2 flex flex-col items-center mx-4">
					<h1 className="text-center">
						Код подтверждения <br /> (отправлен на почту)
					</h1>
					<ValidatedInput
						placeholder="Код подтверждения"
						error={errorData.code}
						validator={validationCodeValidator}
						onChange={(value) => {
							setConfirmationData((prev) => ({
								...prev,
								code: value,
							}))
						}}
					/>
				</div>
			)}

			{confirmations.has("newCode") && (
				<div className="my-2 flex flex-col items-center mx-4">
					<h1 className="text-center">
						Код подтверждения
						<br />
						(отправлен на новую почту)
					</h1>
					<ValidatedInput
						placeholder="Код подтверждения"
						error={errorData.newCode}
						validator={validationCodeValidator}
						onChange={(value) => {
							setConfirmationData((prev) => ({
								...prev,
								newCode: value,
							}))
						}}
					/>
				</div>
			)}

			<div
				className={`flex flex-col items-center w-full duration-200 ${!hasChanged && "pointer-events-none grayscale"}`}
			>
				<AccentButton onClick={sendConfirmationData}>
					Подтвердить изменения
				</AccentButton>
			</div>
		</div>
	)
}

export default ConfirmationForm
