import { FC, useState } from "react"
import { LoginPageBaseProps } from "../types"
import { useNotification, usePopupWindow } from "@shared/hooks"
import { motion } from "framer-motion"
import { loginPageVariants } from "../animations"
import { ValidatedInput } from "@shared/ui/Inputs"
import { emailValidator, usernameValidator } from "@shared/helpers"
import { Email } from "@shared/model/types/primitives"
import { AccentButton } from "@shared/ui/Buttons"
import ConfirmationCodeForm from "./ConfirmationCodeForm"
import { OwnedUser, User } from "@shared/facades"
import Loading from "@shared/ui/Loading"
import { ExError } from "@shared/helpers"
import { LoginPages } from "../enums"

interface RecoveryPasswordFormProps extends LoginPageBaseProps {}

interface ErrorData {
	email: string
	username: string
}

const RecoveryPasswordForm: FC<RecoveryPasswordFormProps> = ({
	goToPage,
	formData,
	setFormData,
}) => {
	const popupWindow = usePopupWindow()
	const notificate = useNotification()

	const [errorData, setErrorData] = useState<ErrorData>({
		email: "",
		username: "",
	})
	const [isLoading, setLoading] = useState(false)

	const sendConfirmationCode = async () => {
		const errorData: ErrorData = {
			email: await emailValidator(formData.email),
			username: await usernameValidator(formData.username),
		}

		setErrorData(errorData)

		if (errorData.email != "" || errorData.username != "") {
			return
		}

		User.createVerificationCode(new Email(formData.email))

		const code = await popupWindow((closeWindow) => (
			<ConfirmationCodeForm closeWindow={closeWindow} />
		))

		if (!code) {
			return
		}

		setLoading(true)

		const response = await OwnedUser.sendRecoveryPassword(
			formData.username,
			code,
		)

		if (response instanceof ExError) {
			notificate(
				"Произошла ошибка, скорее всего вы ввели неправильный код подтверждения или адрес электронной почты",
			)
			console.error(response)
			setLoading(false)
			return
		}

		goToPage(LoginPages.Login)
		setLoading(false)
	}

	return (
		<motion.div
			initial="initial"
			animate="show"
			exit="hide"
			variants={loginPageVariants}
			className="flex flex-col items-center"
		>
			<h1 className="text-4xl text-[var(--main-color)] my-4">
				Восстановление пароля
			</h1>

			<ValidatedInput
				margin="1rem 0"
				value={formData.username}
				placeholder="Имя пользователя"
				validator={usernameValidator}
				error={errorData.username}
				onChange={(value) =>
					setFormData((prev) => ({ ...prev, username: value }))
				}
			/>

			<ValidatedInput
				margin="1rem 0"
				value={formData.email}
				placeholder="Электронная почта"
				validator={emailValidator}
				error={errorData.email}
				onChange={(value) =>
					setFormData((prev) => ({ ...prev, email: value }))
				}
			/>

			<AccentButton onClick={sendConfirmationCode}>
				<div className="px-16 flex flex-row items-center">
					Отправить код подтверждения{" "}
					{isLoading && (
						<div className="pl-2">
							<Loading color="black" />
						</div>
					)}
				</div>
			</AccentButton>
		</motion.div>
	)
}

export default RecoveryPasswordForm
