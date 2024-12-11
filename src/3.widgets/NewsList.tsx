import ListNewWrapper from "@entities/ListNewWrapper"
import LikeButton from "@features/LikeButton"
import { ListNew } from "@shared/facades"
import { ExError } from "@shared/helpers"
import { LikeTypes } from "@shared/model/types/enums"
import Loading from "@shared/ui/Loading"
import { useInView } from "framer-motion"
import { FC, useCallback, useEffect, useRef, useState } from "react"

const NewsList: FC = () => {
	const [news, setNews] = useState<Array<ListNew>>(new Array())
	const [page, setPage] = useState<number>(0)
	const [isPagesEnded, setPagesEnded] = useState<boolean>(false)
	const [isLoading, setLoading] = useState<boolean>(false)

	const observerRef = useRef(null)
	const isObserverVisible = useInView(observerRef)

	const loadNewsPage = useCallback(() => {
		if (isPagesEnded || isLoading) {
			return
		}

		setLoading(true)
	}, [isPagesEnded, isLoading, setLoading])

	useEffect(loadNewsPage, [isObserverVisible, page, isLoading])

	useEffect(() => {
		if (!isLoading) {
			return
		}

		;(async () => {
			const response = await ListNew.getNewsPage(page)

			if (response instanceof ExError) {
				console.error(response)
				return
			}

			if (response.length == 0) {
				setPagesEnded(true)
			}

			setPage((prev) => prev + 1)
			setNews((prev) => {
				const tmp = prev?.filter(() => true)
				return tmp.concat(response)
			})

			setLoading(false)
		})()
	}, [isLoading])

	return (
		<div className="flex flex-col items-center">
			<div className="flex flex-col items-center gap-4 m-8">
				{news.map((aNew) => (
					<ListNewWrapper
						aNew={aNew}
						likeButton={(onChange) => (
							<LikeButton
								onChange={onChange}
								likeType={LikeTypes.Media}
								id={aNew.mediaId}
							/>
						)}
						key={aNew.id.id}
					/>
				))}
			</div>

			<div ref={observerRef}></div>

			{isLoading && (
				<div className="m-4">
					<Loading />
				</div>
			)}
		</div>
	)
}

export default NewsList
