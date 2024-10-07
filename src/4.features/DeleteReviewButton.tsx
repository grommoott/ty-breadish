import { Review } from "@shared/facades"
import { ExError } from "@shared/helpers"
import { AccentButton } from "@shared/ui/Buttons"
import { FC } from "react"

interface DeleteReviewButtonProps {
	review: Review
}

const DeleteReviewButton: FC<DeleteReviewButtonProps> = ({ review }) => {
	return (
		<AccentButton
			onClick={async () => {
				const response = await review.delete()

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

export default DeleteReviewButton
