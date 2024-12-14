import { plusImage } from "@assets/ui"
import { OwnedUser } from "@shared/facades"
import { Roles } from "@shared/model/types/enums"
import { SimpleButton } from "@shared/ui/Buttons"
import { FC } from "react"
import { useNavigate } from "react-router-dom"

interface NewItemButtonProps {
	navigatePath: string
	text: string
}

const NewItemButton: FC<NewItemButtonProps> = ({ text, navigatePath }) => {
	const navigate = useNavigate()

	return (
		<>
			{OwnedUser.instance?.role == Roles.Admin && (
				<div className="h-[18rem] w-[16rem] rounded-3xl bg-[var(--dark-color)] p-2 m-2">
					<SimpleButton
						className="flex flex-col items-center justify-center w-full h-full gap-4"
						onClick={() => navigate(navigatePath)}
					>
						<div className="bg-zinc-800 rounded-3xl p-2 flex flex-col items-center">
							<img
								className="size-12"
								src={plusImage}
							/>
						</div>

						<h2 className="text-[var(--main-color)] text-2xl">
							{text}
						</h2>
					</SimpleButton>
				</div>
			)}
		</>
	)
}

export default NewItemButton
