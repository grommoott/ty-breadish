import CommentWrapper from "@entities/CommentWrapper"
import CreateCommentForm from "@entities/CreateCommentForm"
import NewWrapper from "@entities/NewWrapper"
import ChangeCommentButton from "@features/ChangeCommentButton"
import CreateCommentButton from "@features/CreateCommentButton"
import LikeButton from "@features/LikeButton"
import { commentsPageSize } from "@shared/config"
import { Comment, New } from "@shared/facades"
import { ExError } from "@shared/helpers"
import {
	CommentsSortOrder,
	CommentsSortOrders,
	LikeTypes,
	translatedCommentsSortOrders,
} from "@shared/model/types/enums"
import ListBox from "@shared/ui/ListBox"
import Loading from "@shared/ui/Loading"
import { useInView } from "framer-motion"
import { FC, useEffect, useRef, useState } from "react"

interface NewWidgetProps {
	aNew?: New
}

const NewWidget: FC<NewWidgetProps> = ({ aNew }) => {
	if (!aNew) {
		return (
			<div className="p-4 m-2 rounded-3xl bg-[var(--dark-color)]">
				<Loading />
			</div>
		)
	}

	const [comments, setComments] = useState<Array<Comment>>(
		new Array<Comment>(),
	)

	const [commentsPage, setCommentsPage] = useState(0)
	const [isLoadingComments, setLoadingComments] = useState(false)
	const [commentsPagesTotal, setCommentsPagesTotal] = useState(Infinity)

	const observerRef = useRef(null)
	const isObserverInView = useInView(observerRef)
	const [sortOrder, setSortOrder] = useState<CommentsSortOrder>(
		CommentsSortOrders.NewFirst,
	)

	const appendComments = (comments: Comment[]) => {
		setComments((prev) => prev.concat(comments))
	}

	useEffect(() => {
		;(async () => {
			const response = await aNew.getCommentsCount()

			if (response instanceof ExError) {
				console.error(response)
				return
			}

			setCommentsPagesTotal(Math.ceil(response / commentsPageSize))
		})()
	}, [])

	useEffect(() => {
		setCommentsPage(0)
		setLoadingComments(() => true)
		setComments(new Array())
	}, [sortOrder])

	const loadComments = () => {
		if (!isObserverInView) {
			return
		}

		if (commentsPagesTotal <= commentsPage) {
			return
		}

		if (isLoadingComments) {
			return
		}

		setLoadingComments(() => true)
	}

	useEffect(() => {
		if (isLoadingComments) {
			;(async () => {
				const response = await Comment.getCommentsPage(
					aNew.mediaId,
					sortOrder,
					commentsPage,
				)

				if (response instanceof ExError) {
					console.error(response)
					setLoadingComments(false)
					return
				}

				appendComments(response)
				setLoadingComments(false)
				setCommentsPage((prev) => prev + 1)
			})()
		}
	}, [isLoadingComments])

	useEffect(loadComments, [isObserverInView, commentsPage])

	return (
		<>
			<NewWrapper
				aNew={aNew}
				likeButton={(onChange) => (
					<LikeButton
						likeType={LikeTypes.Media}
						id={aNew.mediaId}
						onChange={onChange}
					/>
				)}
			/>

			<h1 className="text-4xl">Комментарии</h1>
			<div className="flex flex-col sm:flex-row items-center justify-center gap-1">
				<p className="text-2xl text-center">Порядок сортировки</p>
				<ListBox
					items={translatedCommentsSortOrders}
					defaultValue={{
						key: CommentsSortOrders.NewFirst,
						value: translatedCommentsSortOrders.get(
							CommentsSortOrders.NewFirst,
						) as string,
					}}
					onChange={(value) =>
						setSortOrder(value as CommentsSortOrder)
					}
					width="16rem"
				/>
			</div>

			<CreateCommentForm
				createCommentButton={(getContent, onComment) => (
					<CreateCommentButton
						getContent={getContent}
						target={aNew.mediaId}
						onComment={(comment) => {
							onComment()

							setComments((prev) => {
								const tmp = prev.map((v) => v)
								tmp.unshift(comment)

								return tmp
							})
						}}
					/>
				)}
			/>

			{comments.map((comment) => (
				<CommentWrapper
					key={comment.id.id}
					comment={comment}
					onDelete={async (comment) => {
						setComments((prev) =>
							prev.filter((val) => val.id.id != comment.id.id),
						)
					}}
					likeButton={(type, id, onChange) => (
						<LikeButton
							onChange={onChange}
							id={id}
							likeType={type}
						/>
					)}
					replyCommentForm={(target, onComment) => (
						<CreateCommentForm
							autoFocus
							createCommentButton={(getContent) => (
								<CreateCommentButton
									getContent={getContent}
									onComment={onComment}
									target={target}
								/>
							)}
						/>
					)}
					changeCommentButton={(
						comment,
						onValueChange,
						getCommentContent,
					) => (
						<ChangeCommentButton
							comment={comment}
							onValueChange={onValueChange}
							getCommentContent={getCommentContent}
						/>
					)}
				/>
			))}

			<div ref={observerRef} />
			{commentsPagesTotal > commentsPage && <Loading />}
		</>
	)
}

export default NewWidget
