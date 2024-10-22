import { userPng } from "@assets/png"
import { OwnedUser } from "@shared/facades"
import { useSmallWidgetWidth } from "@shared/hooks"
import { Rate } from "@shared/model/types/enums"
import { MultilineFlatInput } from "@shared/ui/Inputs"
import RateSelector from "@shared/ui/RateSelector"
import { FC, ReactNode, useState } from "react"

interface CreateReviewFormProps {
	createReviewButton: (
		getContent: () => string,
		getRate: () => Rate,
	) => ReactNode
}

const CreateReviewForm: FC<CreateReviewFormProps> = ({
	createReviewButton,
}) => {
	const [content, setContent] = useState("")
	const [rate, setRate] = useState<Rate>(5)
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
				<div className="flex flex-col flex-grow items-end">
					<RateSelector
						rate={rate}
						setRate={setRate}
					/>

					<div className="bg-zinc-900 rounded-3xl p-2 m-2 self-stretch">
						<MultilineFlatInput
							className="w-full"
							placeholder="Напишите здесь свой отзыв"
							autoHeight
							content={content}
							setContent={setContent}
						/>
					</div>
				</div>
			</div>

			{createReviewButton(
				() => content,
				() => rate,
			)}
		</div>
	)
}

export default CreateReviewForm
