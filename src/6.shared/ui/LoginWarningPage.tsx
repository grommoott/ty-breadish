import { ReactNode } from "react"
import { Button } from "./Buttons"

const LoginWarningPage: (
	text: string,
) => (closeWindow: (value: any) => void) => ReactNode =
	(text) => (closeWindow) => {
		return (
			<div className="flex flex-col">
				<p>{text}</p>
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
