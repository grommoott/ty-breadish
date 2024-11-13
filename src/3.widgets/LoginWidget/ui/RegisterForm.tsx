import { FC, useState } from "react"
import { LoginPageBaseProps } from "../types"
import { motion } from "framer-motion"
import { loginPageVariants } from "../animations"
import { ValidatedInput } from "@shared/ui/Inputs"
import {
	registerPasswordValidator,
	registerEmailValidator,
	registerUsernameValidator,
	passwordConfirmationValidator,
	ExError,
} from "@shared/helpers"
import { OwnedUser } from "@shared/facades"
import { Email } from "@shared/model/types/primitives"
import { useNotification, usePopupWindow } from "@shared/hooks"
import { AccentButton } from "@shared/ui/Buttons"
import ConfirmationCodeForm from "./ConfirmationCodeForm"
import { useNavigate } from "react-router-dom"
import Loading from "@shared/ui/Loading"

interface RegisterFormProps extends LoginPageBaseProps {}

type ErrorData = {
	username: string
	email: string
	password: string
	passwordConfirmation: string
}

const RegisterForm: FC<RegisterFormProps> = ({ formData, setFormData }) => {
	const [errorData, setErrorData] = useState<ErrorData>({
		username: "",
		email: "",
		password: "",
		passwordConfirmation: "",
	})
	const [passwordConfirmation, setPasswordConfirmation] = useState<string>("")

	const [isLoading, setLoading] = useState(false)

	const notificate = useNotification()
	const popupWindow = usePopupWindow()
	const navigate = useNavigate()

	const register = async () => {
		const errorData: ErrorData = {
			username: await registerUsernameValidator()(formData.username),
			email: await registerEmailValidator()(formData.email),
			password: await registerPasswordValidator(formData.password),
			passwordConfirmation: await passwordConfirmationValidator(
				formData.password,
			)(passwordConfirmation),
		}

		setErrorData(errorData)

		if (
			Object.values(errorData)
				.map((val) => val != "")
				.reduce((prev, curr) => prev || curr)
		) {
			return
		}

		setLoading(true)

		const registerToken = await OwnedUser.createRegisterToken(
			formData.username,
			formData.password,
			new Email(formData.email),
		)

		if (registerToken instanceof ExError) {
			notificate("Произошла ошибка сервера, приносим свои извинения")
			console.error(registerToken)
			return
		}

		const code = await popupWindow((closeWindow) => (
			<ConfirmationCodeForm closeWindow={closeWindow} />
		))

		if (!code) {
			return
		}

		const response = await OwnedUser.register(code, registerToken)

		if (response instanceof ExError) {
			notificate("Произошла ошибка сервера, приносим свои извинения")
			console.error(response)
			return
		}

		const init = await OwnedUser.instance?.initialize()

		if (init instanceof ExError) {
			notificate(
				"Пользователь создан, но произошла ошибка инициализации, перезагрузите страницу",
			)
			console.error(init)
			return
		}

		setLoading(false)
		navigate("/")
	}

	return (
		<motion.div
			initial="initial"
			animate="show"
			exit="hide"
			variants={loginPageVariants}
			className="flex flex-col items-center"
		>
			<h1 className="text-4xl my-4 text-[var(--main-color)]">
				Регистрация
			</h1>

			<ValidatedInput
				margin="1rem 0"
				value={formData.username}
				validator={registerUsernameValidator()}
				error={errorData.username}
				onChange={(value) =>
					setFormData((prev) => ({ ...prev, username: value }))
				}
				placeholder="Имя пользователя"
			/>

			<ValidatedInput
				margin="1rem 0"
				value={formData.email}
				validator={registerEmailValidator()}
				error={errorData.email}
				onChange={(value) =>
					setFormData((prev) => ({ ...prev, email: value }))
				}
				placeholder="Электронная почтa"
			/>

			<ValidatedInput
				passwordInput
				margin="1rem 0"
				value={formData.password}
				validator={registerPasswordValidator}
				error={errorData.password}
				onChange={(value) =>
					setFormData((prev) => ({ ...prev, password: value }))
				}
				placeholder="Придумайте пароль"
			/>

			<ValidatedInput
				passwordInput
				margin="1rem 0"
				validator={passwordConfirmationValidator(formData.password)}
				error={errorData.passwordConfirmation}
				onChange={setPasswordConfirmation}
				placeholder="Подтвердите пароль"
			/>

			<AccentButton onClick={register}>
				<div className="px-16 flex flex-row items-center">
					Далее{" "}
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

export default RegisterForm
