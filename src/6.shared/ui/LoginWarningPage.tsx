import { ReactNode } from "react"
import { Button } from "./Buttons"

const LoginWarningPage: (closeWindow: (value: any) => void) => ReactNode = (
	closeWindow,
) => {
	return (
		<div className="flex flex-col">
			<p>
				Чтобы отправлять комментарии вы должны зарегистрироваться или
				войти
			</p>
			<div className="flex flex-row items-center justify-center w-full gap-2">
				<Button onClick={() => closeWindow(undefined)}>
					Не сейчас
				</Button>
				<Button onClick={() => closeWindow("login")}>Войти</Button>
			</div>
		</div>
	)
}

export default LoginWarningPage
