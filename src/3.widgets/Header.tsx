import { loginImage, menuImage } from "@assets/ui"
import { usePageSize } from "@shared/contexts"
import { PageSizes } from "@shared/enums"
import { OwnedUser } from "@shared/facades"
import { usePopupWindow } from "@shared/hooks"
import { AccentButton, Button, SimpleButton } from "@shared/ui/Buttons"
import { SmallLogo } from "@shared/ui/Logos"
import { FC } from "react"
import { useNavigate } from "react-router-dom"

interface HeaderProps {
	compact?: boolean
}

const Header: FC<HeaderProps> = ({ compact = false }) => {
	const pageSize = usePageSize()

	const popupWindow = usePopupWindow()
	const navigate = useNavigate()

	return (
		<>
			<header
				className={`fixed grid grid-cols-3 top-0 ${!compact && "bg-zinc-900 border-b-2 border-b-zinc-800 "} w-full z-10 items-center h-16 px-2 sm:px-6`}
			>
				<div className="flex flex-row items-center">
					{!compact && (
						<SimpleButton className="cursor-pointer hover:scale-110 active:scale-90 duration-100">
							<SmallLogo size={3} />
						</SimpleButton>
					)}
				</div>

				<div>
					{!compact && (
						<>
							{pageSize >= PageSizes.Small ? (
								<div className="flex flex-row justify-center px-2 sm:px-6 gap-4 sm:gap-10 overflow-visible">
									<SimpleButton>
										<p className="text-[var(--main-color)] text-xl sm:text-2xl">
											Рецепты
										</p>
									</SimpleButton>
									<SimpleButton>
										<p className="text-[var(--main-color)] text-xl sm:text-2xl">
											Магазин
										</p>
									</SimpleButton>
									<SimpleButton>
										<p className="text-[var(--main-color)] text-xl sm:text-2xl">
											Новости
										</p>
									</SimpleButton>
								</div>
							) : (
								<SimpleButton
									className="mx-auto"
									onClick={() => {
										popupWindow(() => {
											return (
												<div className="flex flex-col items-center">
													<Button>Рецепты</Button>
													<Button>Магазин</Button>
													<Button>Новости</Button>
												</div>
											)
										})
									}}
								>
									<img
										src={menuImage}
										className="size-12"
									/>
								</SimpleButton>
							)}
						</>
					)}
				</div>

				<div className="ml-auto">
					{OwnedUser.instance ? (
						<div className="flex flex-row items-center gap-2">
							<SimpleButton
								onClick={() => {
									popupWindow((closeWindow) => {
										return (
											<div className="flex flex-col items-center px-2">
												<Button
													className="w-full"
													onClick={() => {
														navigate("/homePage")
														closeWindow(undefined)
													}}
												>
													Домашняя страница
												</Button>
												<Button className="w-full">
													Корзина
												</Button>
												<Button className="w-full">
													Заказы
												</Button>
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
									})
								}}
							>
								<img
									className="rounded-full size-12"
									draggable={false}
									src={OwnedUser.instance.avatarLink}
								/>
							</SimpleButton>
						</div>
					) : (
						<SimpleButton>
							<img
								src={loginImage}
								className="size-12"
								draggable={false}
							/>
						</SimpleButton>
					)}
				</div>
			</header>
			{!compact && <div className="h-16" />}
		</>
	)
}

export default Header
