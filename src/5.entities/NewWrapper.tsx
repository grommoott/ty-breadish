import { commentImage } from "@assets/ui"
import { New, OwnedUser } from "@shared/facades"
import { ExError, replaceImageIds } from "@shared/helpers"
import { useDefaultWidgetWidth } from "@shared/hooks"
import { LikeTypes, Roles } from "@shared/model/types/enums"
import { AccentButton } from "@shared/ui/Buttons"
import Loading from "@shared/ui/Loading"
import { FC, ReactNode, useEffect, useMemo, useState } from "react"
import Markdown from "react-markdown"
import { useNavigate } from "react-router-dom"

interface NewWrapperProps {
	aNew?: New
	likeButton: (onChange: (value: boolean) => void) => ReactNode
}

const NewWrapper: FC<NewWrapperProps> = ({ aNew, likeButton }) => {
	if (!aNew) {
		return (
			<div className="p-4 bg-[var(--dark-color)] rounded-3xl">
				<Loading />
			</div>
		)
	}

	const width = useDefaultWidgetWidth()

	const [commentsCount, setCommentsCount] = useState<number | undefined>()

	const [likesCount, setLikesCount] = useState<number | undefined>()
	const [isLiked, setLiked] = useState<boolean>(
		OwnedUser.instance?.likes?.findIndex(
			(val) => val.target.id == aNew.id.id && val.type == LikeTypes.Media,
		) != -1,
	)

	const content = useMemo(() => replaceImageIds(aNew.content), [aNew.content])

	useEffect(() => {
		;(async () => {
			const count = await aNew.getCommentsCount()

			if (count instanceof ExError) {
				return
			}

			setCommentsCount(count)
		})()
		;(async () => {
			const count = await aNew.getLikesCount()

			if (count instanceof ExError) {
				return
			}

			setLikesCount(count - (isLiked ? 1 : 0))
		})()
	}, [])

	const navigate = useNavigate()

	return (
		<div
			style={{ width: `${width}vw` }}
			className="rounded-3xl p-4 flex flex-col items-center bg-[var(--dark-color)] my-4"
		>
			{OwnedUser.instance?.role == Roles.Admin && (
				<AccentButton
					onClick={() => navigate(`/news/change/id/${aNew.id.id}`)}
				>
					Изменить новость
				</AccentButton>
			)}

			<h1 className="text-3xl">{aNew.title}</h1>

			<img
				className="w-2/3 rounded-3xl object-cover my-4"
				src={aNew.imageLink}
			/>

			<div className="markdown-container w-full">
				<Markdown>{content}</Markdown>
			</div>

			<div className="flex flex-row w-full justify-center">
				<div className="flex flex-row items-center mx-2">
					<div>
						<img
							src={commentImage}
							className="h-10"
						/>
					</div>
					{commentsCount ? (
						<p>{commentsCount}</p>
					) : (
						<Loading size={2} />
					)}
				</div>
				{likesCount != undefined && (
					<div className="flex flex-row items-center mx-2">
						{likeButton(setLiked)}
						{likesCount != undefined ? (
							<p>{likesCount + (isLiked ? 1 : 0)}</p>
						) : (
							<Loading size={2} />
						)}
					</div>
				)}
			</div>

			{aNew.isEdited && (
				<>
					<p className="text-zinc-700">Изменено</p>
				</>
			)}

			<div className="self-end">
				<p className="text-zinc-700">
					{new Date(aNew.moment.moment).toLocaleDateString()}
				</p>
			</div>
		</div>
	)
}

export default NewWrapper
