import { Comment, OwnedComment } from "@shared/facades"
import { ExError } from "@shared/helpers"
import { AccentButton } from "@shared/ui/Buttons"
import Loading from "@shared/ui/Loading"
import { FC, useState } from "react"

interface ChangeCommentButtonProps {
	onValueChange?: (value: boolean) => void
	getCommentContent: () => string
	comment: Comment
}

const ChangeCommentButton: FC<ChangeCommentButtonProps> = ({
	onValueChange = () => {},
	getCommentContent,
	comment,
}) => {
	if (!(comment instanceof OwnedComment)) {
		return <div className="none"></div>
	}

	const [isEditing, setEditing] = useState(false)
	const [isLoading, setLoading] = useState(false)
	const [initialContent, setInitialContent] = useState("")

	return (
		<AccentButton
			className="flex flex-row items-center justify-center"
			onClick={async () => {
				const isEditingBuf = !isEditing

				if (!isEditingBuf) {
					setLoading(true)

					const content = getCommentContent()

					if (initialContent !== content) {
						const result = await comment.edit(content)

						if (result instanceof ExError) {
							console.error(result)
						}
					}

					setLoading(false)
					setEditing(isEditingBuf)
					onValueChange(isEditingBuf)
				} else {
					setInitialContent(getCommentContent())
					setEditing(isEditingBuf)
					onValueChange(isEditingBuf)
				}
			}}
		>
			{isEditing ? "Сохранить" : "Изменить"}
			{isLoading && (
				<Loading
					color="black"
					size={1.5}
				/>
			)}
		</AccentButton>
	)
}

export default ChangeCommentButton
