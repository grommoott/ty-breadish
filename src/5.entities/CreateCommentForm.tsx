import { userPng } from "@assets/png"
import { OwnedUser } from "@shared/facades"
import { useSmallWidgetWidth } from "@shared/hooks"
import { MultilineFlatInput } from "@shared/ui/Inputs"
import { FC, ReactNode, useState } from "react"

interface CreateCommentFormProps {
	createCommentButton: (
		getContent: () => string,
		onComment: () => void,
	) => ReactNode
	autoFocus?: boolean
}

const CreateCommentForm: FC<CreateCommentFormProps> = ({
	createCommentButton,
	autoFocus = false,
}) => {
	const [content, setContent] = useState("")
	const width = useSmallWidgetWidth()

	return (
		<div
			className="flex flex-col m-2 p-2 rounded-3xl bg-[var(--dark-color)] items-stretch"
			style={{ width: `min(${width}vw, 100%)` }}
		>
			<div className="flex flex-row">
				<img
					className="size-16 object-cover rounded-full m-2"
					src={OwnedUser.instance?.avatarLink || userPng}
				/>
				<div className="bg-zinc-900 rounded-3xl p-2 m-2 flex-grow">
					<MultilineFlatInput
						autoFocus={autoFocus}
						className="w-full"
						placeholder="Напишите здесь свой комментарий"
						autoHeight
						content={content}
						setContent={setContent}
					/>
				</div>
			</div>
			{createCommentButton(
				() => content,
				() => setContent(""),
			)}
		</div>
	)
}

export default CreateCommentForm
