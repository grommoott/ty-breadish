import { ReactNode } from "react"
import { AccentButton, Button } from "./Buttons"
import { OwnedUser } from "@shared/facades"
import { NavigateFunction } from "react-router-dom"
import { Roles } from "@shared/model/types/enums"

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
	navigate: NavigateFunction,
) => (closeWindow: (value: any) => void) => ReactNode =
	(text, navigate) => (closeWindow) => {
		return (
			<div className="flex flex-col">
				<p>{text}</p>
				<div className="flex flex-row items-center justify-center w-full gap-2">
					<Button onClick={() => closeWindow(undefined)}>
						Не сейчас
					</Button>
					<Button
						onClick={() => {
							navigate("/login")
							closeWindow("login")
						}}
					>
						Войти
					</Button>
				</div>
			</div>
		)
	}

const userWindow = (navigate: NavigateFunction) => {
	return (closeWindow: (value: any) => void) => {
		return (
			<div className="flex flex-col items-center px-2 overflow-y-scroll overflow-x-hidden">
				<div className="flex flex-col items-center gap-2 mb-6">
					<img
						src={OwnedUser.instance?.avatarLink}
						className="size-16 rounded-full"
					/>
					<p className="text-[var(--main-color)] text-center text-2xl">
						{OwnedUser.instance?.username}
					</p>
				</div>

				<Button
					className="w-full"
					onClick={() => {
						navigate("/homePage")
						closeWindow(undefined)
					}}
				>
					Домашняя страница
				</Button>
				<Button
					className="w-full"
					onClick={() => {
						navigate("/basket")
						closeWindow(undefined)
					}}
				>
					Корзина
				</Button>
				<Button
					className="w-full"
					onClick={() => {
						navigate("/orders/list")
						closeWindow(undefined)
					}}
				>
					Заказы
				</Button>
				{(OwnedUser.instance?.role == Roles.Baker ||
					OwnedUser.instance?.role == Roles.Admin) && (
					<Button
						className="w-full"
						onClick={() => {
							navigate("/orders/management")
							closeWindow(undefined)
						}}
					>
						Управление заказами
					</Button>
				)}
				{OwnedUser.instance?.role == Roles.Admin && (
					<Button
						className="w-full"
						onClick={() => {
							navigate("/bakeries/management")
							closeWindow(undefined)
						}}
					>
						Управление пекарнями
					</Button>
				)}
				<AccentButton
					onClick={async () => {
						await OwnedUser.instance?.logout()
						navigate("/", {
							replace: true,
						})
						closeWindow(undefined)
					}}
					className="w-full"
				>
					Выйти из аккаунта
				</AccentButton>
			</div>
		)
	}
}

const cookiesAgreeWindow = (closeWindow: (value: any) => void) => {
	return (
		<div className="flex flex-col items-center">
			<p>Мы используем файлы cookie</p>
			<Button onClick={() => closeWindow("agreed")}>Смириться</Button>
		</div>
	)
}

export { agreeWindow, loginWarningPage, userWindow, cookiesAgreeWindow }
