import { ReactNode } from "react"
import { Button } from "./Buttons"

const agreeWindow = (content: ReactNode) => {
	return (closeWindow: (data: any) => void) => {
		return (
			<div className="flex flex-col items-center text-center">
				{content}
				<div className="flex flex-row items-center justify-center">
					<Button onClick={() => closeWindow(undefined)}>Нет</Button>
					<Button onClick={() => closeWindow("yes")}>Да</Button>
				</div>
			</div>
		)
	}
}

const loginWarningPage: (
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

export { agreeWindow, loginWarningPage }
