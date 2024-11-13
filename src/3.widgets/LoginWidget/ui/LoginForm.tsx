import { FC, useState } from "react"
import { LoginPageBaseProps } from "../types"
import { ValidatedInput } from "@shared/ui/Inputs"
import { requiredFieldValidator, usernameValidator } from "@shared/helpers"
import { AccentButton, SimpleButton } from "@shared/ui/Buttons"
import { OwnedUser } from "@shared/facades"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { loginPageVariants } from "../animations"
import Loading from "@shared/ui/Loading"
import { LoginPages } from "../enums"
import { ExError } from "@shared/helpers"
import { useNotification } from "@shared/hooks"

interface LoginFormProps extends LoginPageBaseProps {}

type ErrorData = {
	username: string
	password: string
}

const LoginForm: FC<LoginFormProps> = ({ goToPage, formData, setFormData }) => {
	const [errorData, setErrorData] = useState<ErrorData>({
		username: "",
		password: "",
	})
	const navigator = useNavigate()
	const notificate = useNotification()
	const [isLoading, setLoading] = useState(false)

	const login = async () => {
		const errorData: ErrorData = {
			username: await usernameValidator(formData.username),
			password: await requiredFieldValidator(formData.password),
		}

		setErrorData(errorData)

		if (errorData.username != "" || errorData.password != "") {
			return
		}

		setLoading(true)

		const response = await OwnedUser.login(
			formData.username,
			formData.password,
		)

		if (response instanceof ExError) {
			setLoading(false)
			notificate("Неправильный логин или пароль")
			console.error(response)
			return
		}

		await OwnedUser.instance?.initialize()

		setLoading(false)
		navigator("/")
	}

	return (
		<motion.div
			initial="initial"
			animate="show"
			exit="hide"
			variants={loginPageVariants}
			className="flex flex-col items-center"
		>
			<h1 className="text-4xl text-center py-4 text-[var(--main-color)]">
				Вход в аккаунт
			</h1>

			<ValidatedInput
				autocomplete="username"
				margin="1rem 0rem"
				value={formData.username}
				error={errorData.username}
				placeholder="Имя пользователя"
				validator={usernameValidator}
				onChange={(value) =>
					setFormData((prev) => ({ ...prev, username: value }))
				}
			/>

			<ValidatedInput
				passwordInput
				margin="1rem 0rem"
				value={formData.password}
				error={errorData.password}
				placeholder="Пароль"
				validator={requiredFieldValidator}
				onChange={(value) =>
					setFormData((prev) => ({ ...prev, password: value }))
				}
			/>

			<AccentButton onClick={login}>
				<div className="px-16 flex flex-row items-center">
					Войти{" "}
					{isLoading && (
						<div className="pl-2">
							<Loading color="black" />
						</div>
					)}
				</div>
			</AccentButton>

			<div className="h-4"></div>

			<SimpleButton
				onClick={() => {
					goToPage(LoginPages.RecoveryPassword)
				}}
			>
				<p>Выслать код на почту</p>
			</SimpleButton>
		</motion.div>
	)
}

export default LoginForm
