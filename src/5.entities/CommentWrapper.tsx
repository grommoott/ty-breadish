import { commentImage, trashImage } from "@assets/ui"
import { Comment, OwnedComment, OwnedUser, User } from "@shared/facades"
import { ExError } from "@shared/helpers"
import { AccentButton, Button, SimpleButton } from "@shared/ui/Buttons"
import Loading from "@shared/ui/Loading"
import { FC, ReactNode, useEffect, useRef, useState } from "react"
import { motion, useAnimationControls } from "framer-motion"
import { PageSizes } from "@shared/enums"
import { MultilineFlatInput } from "@shared/ui/Inputs"
import { useSmallWidgetWidth } from "@shared/hooks"
import { usePageSize } from "@shared/contexts"

interface CommentWrapperProps {
	comment?: Comment
	likeButton?: (onChange: (value: boolean) => void) => ReactNode
	changeCommentButton?: (
		comment: Comment,
		onValueChange: (value: boolean) => void,
		getCommentContent: () => string,
	) => ReactNode
	onReply?: () => void
	onDelete?: () => void
	children?: ReactNode
}

const CommentWrapper: FC<CommentWrapperProps> = ({
	comment,
	likeButton = () => {},
	changeCommentButton = () => {},
	onReply = () => {},
	onDelete = () => {},
	children,
}) => {
	if (!comment) {
		return <div></div>
	}

	const [user, setUser] = useState<User | undefined>(undefined)
	const [likesCount, setLikesCount] = useState<number | undefined>()
	const [isLiked, setLiked] = useState<boolean>(
		OwnedUser.instance?.likes?.findIndex(
			(val) => val.target.id == comment.mediaId.id,
		) != -1,
	)
	const [commentsCount, setCommentsCount] = useState<number | undefined>()
	const [isEditing, setEditing] = useState<boolean>(false)
	const [isUnwraped, setUnwraped] = useState<boolean>(false)
	const [content, setContent] = useState(comment.content)

	const childrenControls = useAnimationControls()
	const childrenDiv = useRef(null)

	const width = useSmallWidgetWidth()
	const pageSize = usePageSize()

	useEffect(() => {
		;(async () => {
			const user = await User.fromId(comment.from)

			if (user instanceof ExError) {
				setUser(undefined)
				return
			}

			setUser(user)
		})()
		;(async () => {
			const likesCount = await comment.getLikesCount()

			if (likesCount instanceof ExError) {
				return
			}

			setLikesCount(likesCount - (isLiked ? 1 : 0))
		})()
		;(async () => {
			const commentsCount = await comment.getCommentsCount()

			if (commentsCount instanceof ExError) {
				return
			}

			setCommentsCount(commentsCount)
		})()
	}, [])

	useEffect(() => {
		if (!childrenDiv.current) {
			return
		}

		const div = childrenDiv.current as HTMLDivElement

		if (isUnwraped) {
			childrenControls.start({
				maxHeight: div.scrollHeight,
				opacity: 1,
				pointerEvents: "all",
			})
		} else {
			childrenControls.start({
				maxHeight: 0,
				opacity: 0,
				pointerEvents: "none",
			})
		}
	}, [isUnwraped])

	return (
		<div
			className="flex flex-col items-center"
			style={{
				width: `min(${width}vw, 100%)`,
			}}
		>
			<div className="flex flex-col p-2 m-2 bg-[var(--dark-color)] rounded-3xl w-full">
				<div className="flex flex-row items-start justify-between">
					<span>
						<img
							src={user?.avatarLink}
							className="size-16 object-cover rounded-full m-2"
						/>
					</span>

					<div className="flex flex-col items-start flex-1">
						<p className="text-[var(--main-color)]">
							{user?.username}
						</p>
						{isEditing ? (
							<MultilineFlatInput
								content={content}
								setContent={setContent}
								className="w-full"
							/>
						) : (
							<p>{content}</p>
						)}
					</div>

					{comment instanceof OwnedComment && (
						<SimpleButton
							className="size-10"
							onClick={onDelete}
						>
							<img src={trashImage} />
						</SimpleButton>
					)}
				</div>

				<div className="flex flex-row justify-between pl-4">
					<p className="text-zinc-600 text-sm">
						{comment.isEdited && "Изменено"}
					</p>

					<p className="text-zinc-600 text-sm">
						{new Date(comment.moment.moment).toLocaleDateString()}
					</p>
				</div>

				<div className="flex flex-col md:flex-row justify-between items-center">
					<div className="flex flex-col md:flex-row items-stretch md:items-center w-full">
						{OwnedUser.instance && (
							<AccentButton onClick={onReply}>
								Ответить
							</AccentButton>
						)}

						{comment instanceof OwnedComment && (
							<>
								{changeCommentButton(
									comment,
									setEditing,
									() => content,
								)}
							</>
						)}
					</div>

					<div className="flex flex-row items-center gap-4">
						<div className="flex flex-row items-center w-max">
							<>{likeButton(setLiked)}</>
							{likesCount != undefined ? (
								<p>{likesCount + (isLiked ? 1 : 0)}</p>
							) : (
								<Loading />
							)}
						</div>

						<div className="flex flex-row items-center w-max">
							<img
								src={commentImage}
								className="h-12"
							/>
							{commentsCount != undefined ? (
								<p>{commentsCount}</p>
							) : (
								<Loading />
							)}
						</div>

						{pageSize >= PageSizes.Small && children && (
							<Button
								onClick={() => setUnwraped((prev) => !prev)}
							>
								{isUnwraped ? "Свернуть" : "Развернуть"}
							</Button>
						)}
					</div>

					{pageSize < PageSizes.Small && children && (
						<Button
							className="self-stretch"
							onClick={() => setUnwraped((prev) => !prev)}
						>
							{isUnwraped ? "Свернуть" : "Развернуть"}
						</Button>
					)}
				</div>
			</div>

			<motion.div
				initial={{
					opacity: 0,
					maxHeight: 0,
					pointerEvents: "none",
				}}
				animate={childrenControls}
				ref={childrenDiv}
				className="w-full mb-2"
			>
				<div className="px-2 flex flex-col items-start border-2 border-zinc-800 rounded-3xl">
					{children}
				</div>
			</motion.div>
		</div>
	)
}

export default CommentWrapper
