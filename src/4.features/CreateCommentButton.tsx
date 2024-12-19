import { OwnedComment, OwnedUser } from "@shared/facades"
import { ExError } from "@shared/helpers"
import { usePopupWindow } from "@shared/hooks"
import { MediaId } from "@shared/model/types/primitives"
import { AccentButton } from "@shared/ui/Buttons"
import Loading from "@shared/ui/Loading"
import { loginWarningPage } from "@shared/ui/PopupWindows"
import { FC, useState } from "react"
import { useNavigate } from "react-router-dom"

interface CreateCommentButton {
	getContent: () => string
	onComment: (comment: OwnedComment) => void
	target: MediaId
}

const CreateCommentButton: FC<CreateCommentButton> = ({
	getContent,
	onComment,
	target,
}) => {
	const popupWindow = usePopupWindow()
	const navigate = useNavigate()
	const [isLoading, setLoading] = useState(false)

	return (
		<AccentButton
			onClick={async () => {
				if (!OwnedUser.instance) {
					const result = await popupWindow(
						loginWarningPage(
							"Чтобы отправлять комментарии вы должны зарегистрироваться или войти в аккаунт",
							navigate,
						),
					)

					if (!result) {
						return
					}

					return
				}

				setLoading(true)

				const response = await OwnedComment.create(target, getContent())

				if (response instanceof ExError) {
					console.error(response)
					setLoading(false)
					return
				}

				setLoading(false)
				onComment(response)
			}}
		>
			<div className="flex flex-row items-center justify-center">
				<p>Отправить комментарий</p>

				{isLoading && <Loading color="var(--dark-color)" />}
			</div>
		</AccentButton>
	)
}

export default CreateCommentButton
