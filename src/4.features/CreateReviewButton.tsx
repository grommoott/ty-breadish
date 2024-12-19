import { OwnedReview, OwnedUser } from "@shared/facades"
import { ExError } from "@shared/helpers"
import { usePopupWindow } from "@shared/hooks"
import { Rate } from "@shared/model/types/enums"
import { ItemId } from "@shared/model/types/primitives"
import { AccentButton } from "@shared/ui/Buttons"
import Loading from "@shared/ui/Loading"
import { loginWarningPage } from "@shared/ui/PopupWindows"
import { FC, useState } from "react"
import { useNavigate } from "react-router-dom"

interface CreateReviewButtonProps {
	getRate: () => Rate
	getContent: () => string
	target: ItemId
	onReview?: (review: OwnedReview) => void
}

const CreateReviewButton: FC<CreateReviewButtonProps> = ({
	getRate,
	getContent,
	target,
	onReview = () => {},
}) => {
	const [isLoading, setLoading] = useState(false)
	const navigate = useNavigate()
	const popupWindow = usePopupWindow()

	return (
		<AccentButton
			onClick={async () => {
				if (!OwnedUser.instance) {
					const result = await popupWindow(
						loginWarningPage(
							"Чтобы отправить отзыв вы должны зарегистрироваться или войти в аккаунт",
							navigate,
						),
					)

					if (!result) {
						return
					}

					return
				}

				setLoading(true)

				const response = await OwnedReview.create(
					target,
					getContent(),
					getRate(),
				)

				if (response instanceof ExError) {
					console.error(response)
					setLoading(false)
					return
				}

				setLoading(false)
				onReview(response)
			}}
		>
			<div className="flex flex-row items-center justify-center">
				<p>Отправить отзыв</p>
				{isLoading && <Loading color="var(--dark-color)" />}
			</div>
		</AccentButton>
	)
}

export default CreateReviewButton
