import { loginImage, menuImage } from "@assets/ui"
import { usePageSize } from "@shared/contexts"
import { PageSizes } from "@shared/enums"
import { OwnedUser } from "@shared/facades"
import { usePopupWindow } from "@shared/hooks"
import { Button, SimpleButton } from "@shared/ui/Buttons"
import { SmallLogo } from "@shared/ui/Logos"
import { FC } from "react"

const Header: FC = () => {
	const pageSize = usePageSize()

	const popupWindow = usePopupWindow()

	return (
		<>
			<header className="fixed grid grid-cols-3 top-0 bg-zinc-900 border-b-2 border-b-zinc-800 w-full z-10 items-center h-16 px-2 sm:px-6">
				<div className="flex flex-row items-center">
					<SimpleButton className="cursor-pointer hover:scale-110 active:scale-90 duration-100">
						<SmallLogo size={3} />
					</SimpleButton>
				</div>

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

				<div className="ml-auto">
					{OwnedUser.instance ? (
						<div className="flex flex-row items-center">
							<img
								className="rounded-full size-12 cursor-pointer select-none hover:scale-110 active:scale-90 duration-100"
								draggable={false}
								src={OwnedUser.instance.avatarLink}
							/>
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
			<div className="h-16" />
		</>
	)
}

export default Header
