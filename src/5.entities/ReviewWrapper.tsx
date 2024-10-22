import { trashImage } from "@assets/ui"
import { usePageSize } from "@shared/contexts"
import { PageSizes } from "@shared/enums"
import { OwnedReview, OwnedUser, Review, User } from "@shared/facades"
import { ExError } from "@shared/helpers"
import { LikeTypes, Rate } from "@shared/model/types/enums"
import { SimpleButton } from "@shared/ui/Buttons"
import { MultilineFlatInput } from "@shared/ui/Inputs"
import Loading from "@shared/ui/Loading"
import RateSelector from "@shared/ui/RateSelector"
import Star from "@shared/ui/Star"
import { FC, ReactNode, useEffect, useState } from "react"

interface ReviewWrapperProps {
	review?: Review
	onDelete?: () => void
	changeReviewButton?: (
		review: OwnedReview,
		getReviewContent: () => string,
		getReviewRate: () => Rate,
		onValueChange: (value: boolean) => void,
	) => ReactNode
	likeButton?: (onChange: (value: boolean) => void) => ReactNode
}

const ReviewWrapper: FC<ReviewWrapperProps> = ({
	review,
	onDelete,
	changeReviewButton = () => {},
	likeButton = () => {},
}) => {
	if (!review) {
		return <div />
	}

	const [user, setUser] = useState<User | undefined>()

	const [likesCount, setLikesCount] = useState<number | undefined>()
	const [isLiked, setLiked] = useState(
		OwnedUser.instance?.likes?.findIndex(
			(val) =>
				val.target.id == review.id.id && val.type == LikeTypes.Review,
		) != -1,
	)

	const pageSize = usePageSize()
	const [width, setWidth] = useState(70)
	const [isEditing, setEditing] = useState(false)
	const [content, setContent] = useState(review.content)
	const [rate, setRate] = useState(review.rate)

	useEffect(() => {
		;(async () => {
			const response = await User.fromId(review.from)

			if (response instanceof ExError) {
				console.log(response)
				return
			}

			setUser(response)
		})()
		;(async () => {
			const likesCount = await review.getLikesCount()

			if (likesCount instanceof ExError) {
				console.log(likesCount)
				return
			}

			setLikesCount(likesCount - (isLiked ? 1 : 0))
		})()
	}, [])

	useEffect(() => {
		if (pageSize < PageSizes.Large) {
			setWidth(90)
		} else if (pageSize < PageSizes.XL) {
			setWidth(70)
		} else if (pageSize < PageSizes.XXL) {
			setWidth(60)
		} else {
			setWidth(50)
		}
	}, [pageSize])

	return (
		<div
			className="flex flex-col items-center p-2 m-2 bg-[var(--dark-color)] rounded-3xl"
			style={{ width: `min(${width}vw, 100%)` }}
		>
			<div className="flex flex-row w-full">
				<img
					src={user?.avatarLink}
					className="size-16 object-cover rounded-full m-2"
				/>

				<div className="flex flex-col items-end flex-1">
					<div className="flex flex-col sm:flex-row items-center w-full">
						<div className="flex flex-row items-center">
							<p>{user?.username}</p>

							{review instanceof OwnedReview && (
								<>
									<div className="w-4 sm:hidden block" />
									<SimpleButton
										onClick={onDelete}
										className="size-10 sm:hidden block"
									>
										<img src={trashImage} />
									</SimpleButton>
								</>
							)}
						</div>

						<div className="flex-1" />

						{isEditing ? (
							<RateSelector
								rate={rate}
								setRate={setRate}
							/>
						) : (
							<div className="max-h-8 flex flex-row">
								{[0, 1, 2, 3, 4].map((val) => (
									<Star
										fillRatio={rate - val}
										key={val}
									/>
								))}
							</div>
						)}
						{review instanceof OwnedReview && (
							<>
								<div className="w-4 hidden sm:block" />
								<SimpleButton
									onClick={onDelete}
									className="size-10 hidden sm:block"
								>
									<img src={trashImage} />
								</SimpleButton>
							</>
						)}
					</div>

					<div className="w-full">
						{isEditing ? (
							<MultilineFlatInput
								content={content}
								setContent={setContent}
								className="w-full"
							></MultilineFlatInput>
						) : (
							<p>{content}</p>
						)}
					</div>
				</div>
			</div>
			<p className="ml-auto text-zinc-600 text-sm">
				{new Date(review.moment.moment).toLocaleDateString()}
			</p>
			<div className="flex flex-row justify-between w-full">
				{review instanceof OwnedReview ? (
					<>
						{changeReviewButton(
							review,
							() => content,
							() => rate,
							setEditing,
						)}
					</>
				) : (
					<div />
				)}

				<div className="flex flex-row items-center justify-between">
					<>{likeButton(setLiked)}</>
					{likesCount != undefined ? (
						<p>{likesCount + (isLiked ? 1 : 0)}</p>
					) : (
						<Loading />
					)}
				</div>
			</div>
		</div>
	)
}

export default ReviewWrapper
