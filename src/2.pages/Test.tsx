import CommentWrapper from "@entities/CommentWrapper"
import LikeButton from "@features/LikeButton"
import { Comment } from "@shared/facades"
import { ExError } from "@shared/helpers"
import { CommentsSortOrders, LikeTypes } from "@shared/model/types/enums"
import { MediaId } from "@shared/model/types/primitives"
import { AnimatedFullLogo } from "@shared/ui/Logos"
import { ReactElement, useEffect, useState } from "react"

export default function Test(): ReactElement {
	const [comment, setComment] = useState<Array<Comment>>(new Array<Comment>())

	useEffect(() => {
		;(async () => {
			const array = new Array<Comment>()

			const prod = await Comment.getCommentsPage(
				new MediaId(0),
				CommentsSortOrders.NewFirst,
				0,
			)

			if (prod instanceof ExError) {
				return
			}

			setComment(array.concat(prod))
		})()
	}, [])

	return (
		<div className="bg-zinc-900 flex flex-col items-center justify-center">
			<AnimatedFullLogo />

			{comment.map((comm, id) => (
				<CommentWrapper
					comment={comm}
					key={id}
					likeButton={(onChange) => (
						<LikeButton
							onChange={onChange}
							id={comm.mediaId}
							likeType={LikeTypes.Media}
						/>
					)}
				></CommentWrapper>
			))}

			<div className="h-60" />

			{/* 	isVisible={true} */}
			{/* 	setIsVisible={() => {}} */}
			{/* > */}
			{/* 	<div className="size-96 bg-blue-500" /> */}
			{/* </PopupWindow> */}
		</div>
	)
}
