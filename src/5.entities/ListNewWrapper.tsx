import { commentImage } from "@assets/ui"
import { usePageSize } from "@shared/contexts"
import { PageSizes } from "@shared/enums"
import { ListNew } from "@shared/facades"
import { ExError } from "@shared/helpers"
import Loading from "@shared/ui/Loading"
import { FC, ReactNode, useEffect, useState } from "react"

interface ListNewWrapperProps {
	aNew?: ListNew
	likeButton?: (onChange: (value: boolean) => void) => ReactNode
}

const ListNewWrapper: FC<ListNewWrapperProps> = ({ aNew, likeButton }) => {
	const pageSize = usePageSize()
	const [width, setWidth] = useState(0)

	useEffect(() => {
		if (pageSize < PageSizes.SmallMedium) {
			setWidth(90)
		} else if (pageSize < PageSizes.XL) {
			setWidth(70)
		} else {
			setWidth(50)
		}

		return
	}, [pageSize])

	if (!aNew) {
		return (
			<div
				className="flex flex-col items-center justify-start rounded-3xl bg-[var(--dark-color)]"
				style={{
					width: `${width}vw`,
					height: `calc(${width / 2}vw + 4rem)`,
				}}
			>
				<Loading />
			</div>
		)
	}

	const [commentsCount, setCommentsCount] = useState<number | undefined>(
		undefined,
	)
	const [likesCount, setLikesCount] = useState<number | undefined>(undefined)

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

			setLikesCount(count)
		})()
	}, [])

	return (
		<div
			className="flex flex-col items-center justify-start rounded-3xl bg-[var(--dark-color)]"
			style={{ width: `${width}vw` }}
		>
			<img
				src={aNew.imageLink}
				className="w-full overflow-hidden"
				style={{
					borderRadius: "1.5rem 1.5rem 0 0",
					height: `${width / 2}`,
				}}
			/>
			<div className="flex flex-row items-center justify-between h-16 p-2 w-full">
				<p>{aNew.title}</p>
				<div className="flex flex-row items-center justify-center">
					<div className="flex flex-row items-center mx-2">
						<img
							src={commentImage}
							className="h-10"
						/>
						{commentsCount ? (
							<p>{commentsCount}</p>
						) : (
							<Loading size={2} />
						)}
					</div>
					<div className="flex flex-row items-center mx-2">
						{likeButton?.call(this, (value) => {
							if (value) {
								setLikesCount((prev) => (prev || 0) + 1)
							} else {
								setLikesCount((prev) => (prev || 0) - 1)
							}
						})}
						{likesCount ? (
							<p>{likesCount}</p>
						) : (
							<Loading size={2} />
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default ListNewWrapper
