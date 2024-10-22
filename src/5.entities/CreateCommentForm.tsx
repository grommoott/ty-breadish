import { userPng } from "@assets/png"
import { OwnedUser } from "@shared/facades"
import { useSmallWidgetWidth } from "@shared/hooks"
import { MultilineFlatInput } from "@shared/ui/Inputs"
import { FC, ReactNode, useState } from "react"

interface CreateCommentForm {
	createCommentButton: (getContent: () => string) => ReactNode
}

const CreateCommentForm: FC<CreateCommentForm> = ({ createCommentButton }) => {
	const [content, setContent] = useState("")
	const width = useSmallWidgetWidth()

	return (
		<div
			className="flex flex-col m-2 p-2 rounded-3xl bg-[var(--dark-color)] items-stretch"
			style={{ width: `${width}vw` }}
		>
			<div className="flex flex-row">
				<img
					className="size-16 object-cover rounded-full m-2"
					src={OwnedUser.instance?.avatarLink || userPng}
				/>
				<div className="bg-zinc-900 rounded-3xl p-2 m-2 flex-grow">
					<MultilineFlatInput
						className="w-full"
						placeholder="Напишите здесь свой комментарий"
						autoHeight
						content={content}
						setContent={setContent}
					/>
				</div>
			</div>
			{createCommentButton(() => content)}
		</div>
	)
}

export default CreateCommentForm
