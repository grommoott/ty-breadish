import { Comment } from "@shared/facades"
import { ExError } from "@shared/helpers"
import { AccentButton } from "@shared/ui/Buttons"
import { FC } from "react"

interface DeleteCommentButtonProps {
	comment: Comment
}

const DeleteCommentButton: FC<DeleteCommentButtonProps> = ({ comment }) => {
	return (
		<AccentButton
			onClick={async () => {
				const response = await comment.delete()

				if (response instanceof ExError) {
					console.error(response)
					return
				}
			}}
		>
			Удалить
		</AccentButton>
	)
}

export default DeleteCommentButton
