import { OwnedReview } from "@shared/facades"
import { ExError } from "@shared/helpers"
import { Rate } from "@shared/model/types/enums"
import { AccentButton } from "@shared/ui/Buttons"
import Loading from "@shared/ui/Loading"
import { FC, useState } from "react"

interface ChangeReviewButtonProps {
	review: OwnedReview
	getReviewContent: () => string
	getReviewRate: () => Rate
	onValueChange?: (value: boolean) => void
}

const ChangeReviewButton: FC<ChangeReviewButtonProps> = ({
	review,
	getReviewContent,
	getReviewRate,
	onValueChange = () => {},
}) => {
	const [isEditing, setEditing] = useState(false)
	const [isLoading, setLoading] = useState(false)
	const [initialContent, setInitialContent] = useState("")
	const [initialRate, setInitialRate] = useState<Rate>()

	return (
		<AccentButton
			className="flex flex-row items-center justify-center"
			onClick={async () => {
				const isEditingBuf = !isEditing

				if (!isEditingBuf) {
					setLoading(true)

					const content = getReviewContent()
					const rate = getReviewRate()

					if (initialContent !== content || initialRate !== rate) {
						const result = await review.edit(content, rate)

						if (result instanceof ExError) {
							console.error(result)
						}
					}

					setLoading(false)
					setEditing(isEditingBuf)
					onValueChange(isEditingBuf)
				} else {
					setInitialContent(getReviewContent())
					setInitialRate(getReviewRate())
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

export default ChangeReviewButton
