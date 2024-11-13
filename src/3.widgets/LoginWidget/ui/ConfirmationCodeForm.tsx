import { ValidatedInput } from "@shared/ui/Inputs"
import { FC, useState } from "react"
import { validationCodeValidator } from "@shared/helpers"
import { AccentButton } from "@shared/ui/Buttons"

interface ConfirmationCodeFormProps {
	closeWindow: (value: any) => void
}

const ConfirmationCodeForm: FC<ConfirmationCodeFormProps> = ({
	closeWindow,
}) => {
	const [code, setCode] = useState<string>("")
	const [error, setError] = useState<string>()

	const sendCode = async () => {
		const error = await validationCodeValidator(code)

		setError(error)

		if (error != "") {
			return
		}

		setCode("")
		closeWindow(parseInt(code || ""))
	}

	return (
		<div className="flex flex-col items-center">
			<h1 className="text-[var(--main-color)]">
				Код подтверждения отправлен на почту
			</h1>

			<ValidatedInput
				onChange={(value) => setCode(value)}
				validator={validationCodeValidator}
				error={error}
				placeholder="Код подтверждения"
			/>

			<AccentButton onClick={sendCode}>Подтвердить</AccentButton>
		</div>
	)
}

export default ConfirmationCodeForm
