import { commentImage, likeImage } from "@assets/ui"
import { Comment, OwnedComment, OwnedUser, User } from "@shared/facades"
import { ExError } from "@shared/helpers"
import { AccentButton, Button } from "@shared/ui/Buttons"
import Loading from "@shared/ui/Loading"
import { FC, ReactNode, useEffect, useRef, useState } from "react"
import { motion, useAnimationControls } from "framer-motion"
import { usePageSize } from "@shared/contexts"
import { PageSizes } from "@shared/enums"
import MultilineInput from "@shared/ui/Inputs/multilineInput"

interface CommentWrapperProps {
	comment?: Comment
	likeButton?: (onChange: (value: boolean) => void) => ReactNode
	children?: ReactNode
}

const CommentWrapper: FC<CommentWrapperProps> = ({
	comment,
	likeButton,
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
	const [isVisible, setVisible] = useState(true)

	const childrenControls = useAnimationControls()
	const childrenDiv = useRef(null)

	const pageSize = usePageSize()
	const [width, setWidth] = useState(70)

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

			setLikesCount(
				likesCount +
					(OwnedUser.instance?.likes?.findIndex(
						(val) => val.target.id == comment.mediaId.id,
					) == -1
						? 0
						: -1),
			)
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
			className="flex flex-col items-center"
			style={{
				width: `min(${width}vw, 100%)`,
				display: isVisible ? "block" : "none",
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
							<MultilineInput
								content={content}
								setContent={setContent}
								className="w-full"
							/>
						) : (
							<p>{content}</p>
						)}
					</div>

					{comment instanceof OwnedComment && (
						<svg
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/svg/2000"
							className="size-10 hover:scale-110 active:scale-90 duration-100"
							onClick={async () => {
								const result = await comment.delete()

								if (result instanceof ExError) {
									console.error(result)
									return
								}

								setVisible(false)
							}}
						>
							<path
								d="m 16.941189,7.0486955 -0.659566,9.8930015 c -0.05773,0.866437 -0.08663,1.299697 -0.273742,1.628204 -0.164788,0.289224 -0.41333,0.521707 -0.712849,0.666896 -0.340201,0.164871 -0.774449,0.164871 -1.642863,0.164871 h -3.304362 c -0.8684141,0 -1.3026211,0 -1.6428471,-0.164871 C 8.4054253,19.091608 8.1568998,18.859125 7.992136,18.569901 7.8049883,18.241394 7.7761072,17.808134 7.7183446,16.941697 L 7.0588113,7.0486955 m -1.6470632,0 H 18.588252"
								fill="white"
								strokeWidth={2}
								stroke="white"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>

							<path
								d="M 15.294126,6.4296546 15.071279,5.7610047 C 14.855267,5.1130336 14.747219,4.7890481 14.546936,4.5495157 14.370042,4.3379916 14.142912,4.1742653 13.886299,4.0733498 13.595675,3.9590601 13.254239,3.9590601 12.571202,3.9590601 h -1.142403 c -0.683037,0 -1.024473,0 -1.315089,0.1142897 -0.2566041,0.1009155 -0.4837672,0.2646418 -0.6606541,0.4761659 -0.200316,0.2395324 -0.308305,0.5635179 -0.524301,1.211489 l -0.222881,0.6686499"
								strokeWidth={2}
								fill="transparent"
								stroke="white"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
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
							<AccentButton>Ответить</AccentButton>
						)}
						{/*Featured*/}
						{comment instanceof OwnedComment && (
							<AccentButton
								onClick={async () => {
									if (isEditing) {
										const response =
											await comment.edit(content)

										if (response instanceof ExError) {
											console.log(response)
										}
									}

									setEditing((prev) => !prev)
								}}
							>
								{isEditing ? "Сохранить" : "Изменить"}
							</AccentButton>
						)}
					</div>

					<div className="flex flex-row items-center gap-4">
						<div className="flex flex-row items-center w-max">
							{likesCount != undefined ? (
								<>
									{likeButton?.call(this, setLiked)}
									<p>{likesCount + (isLiked ? 1 : 0)}</p>
								</>
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
