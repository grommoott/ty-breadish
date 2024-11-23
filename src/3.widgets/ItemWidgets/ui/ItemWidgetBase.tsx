import CreateReviewForm from "@entities/CreateReviewForm"
import ReviewWrapper from "@entities/ReviewWrapper"
import ChangeReviewButton from "@features/ChangeReviewButton"
import CreateReviewButton from "@features/CreateReviewButton"
import LikeButton from "@features/LikeButton"
import { Item, OwnedReview, OwnedUser, Review } from "@shared/facades"
import { ExError } from "@shared/helpers"
import {
	LikeTypes,
	ReviewsSortOrder,
	ReviewsSortOrders,
	translatedReviewsSortOrder,
} from "@shared/model/types/enums"
import ListBox from "@shared/ui/ListBox"
import Loading from "@shared/ui/Loading"
import { useInView } from "framer-motion"
import { ReactNode, useEffect, useRef, useState } from "react"

interface ItemWidgetBaseProps<T extends Item> {
	item?: T
	itemWrapper: (item: T) => ReactNode
}

const ItemWidgetBase = <T extends Item>({
	item,
	itemWrapper,
}: ItemWidgetBaseProps<T>) => {
	if (!item) {
		return (
			<div className="flex flex-col items-center">
				<div className="p-4 m-2 rounded-3xl bg-[var(--dark-color)]">
					<Loading />
				</div>
			</div>
		)
	}

	const observerRef = useRef(null)
	const isObserverInView = useInView(observerRef)

	const [sortOrder, setSortOrder] = useState<ReviewsSortOrder>(
		ReviewsSortOrders.NewFirst,
	)

	const [isLoadingReviews, setLoadingReviews] = useState(false)
	const [isUserReviewLoading, setUserReviewLoading] = useState(true)
	const [reviewsPage, setReviewsPage] = useState(0)
	const [allReviewsHasLoaded, setAllReviewsHasLoaded] = useState(false)

	const [reviews, setReviews] = useState<Array<Review>>(new Array<Review>())
	const [userReview, setUserReview] = useState<OwnedReview>()

	const appendReviews = (_reviews: Array<Review>) => {
		setReviews((prev) =>
			prev.concat(
				_reviews.filter((review) => review.id.id != userReview?.id.id),
			),
		)
	}

	useEffect(() => {
		if (isUserReviewLoading) {
			return
		}

		setReviewsPage(0)
		setAllReviewsHasLoaded(false)
		setReviews(() => {
			const tmp = new Array()
			tmp.push(userReview)

			return tmp
		})
		loadReviews()
	}, [sortOrder])

	useEffect(() => {
		;(async () => {
			if (OwnedUser.instance) {
				const response = await Review.fromItemUser(item.itemId)

				if (response instanceof ExError) {
					console.error(response)
					setUserReview(undefined)
					return
				}

				setUserReview(response)
				setReviews(() => {
					const tmp = new Array()
					tmp.push(response)

					return tmp
				})
			} else {
				setUserReview(undefined)
			}
		})().then(() => {
			setUserReviewLoading(false)
		})
	}, [])

	const loadReviews = () => {
		if (!isObserverInView) {
			return
		}

		if (isUserReviewLoading) {
			return
		}

		if (allReviewsHasLoaded) {
			return
		}

		if (isLoadingReviews) {
			return
		}

		setLoadingReviews(() => true)
	}

	useEffect(() => {
		if (isLoadingReviews) {
			;(async () => {
				const response = await Review.getReviewsPage(
					item.itemId,
					sortOrder,
					reviewsPage,
				)

				if (response instanceof ExError) {
					console.error(response)
					setLoadingReviews(false)
					return
				}

				if (response.length == 0) {
					setAllReviewsHasLoaded(true)
				}

				appendReviews(response)
				setLoadingReviews(false)
				setReviewsPage((prev) => prev + 1)
			})()
		}
	}, [isLoadingReviews])

	useEffect(loadReviews, [isObserverInView, reviewsPage])
	useEffect(() => {
		if (!isUserReviewLoading) {
			loadReviews()
		}
	}, [isUserReviewLoading])

	return (
		<div className="flex flex-col items-center">
			<>{itemWrapper(item)}</>
			<h1 className="text-4xl">Отзывы</h1>
			<div className="flex flex-col sm:flex-row items-center justify-center gap-1">
				<p className="text-2xl text-center">Порядок сортировки</p>
				<ListBox
					items={translatedReviewsSortOrder}
					defaultValue={{
						key: ReviewsSortOrders.NewFirst,
						value: translatedReviewsSortOrder.get(
							ReviewsSortOrders.NewFirst,
						) as string,
					}}
					onChange={(value) =>
						setSortOrder(value as ReviewsSortOrder)
					}
					width="16rem"
				/>
			</div>

			{userReview == undefined && (
				<CreateReviewForm
					createReviewButton={(getContent, getRate) => (
						<CreateReviewButton
							onReview={(review) =>
								setReviews((prev) => {
									setUserReview(review)

									const tmp = new Array()
									tmp.push(review)

									return tmp.concat(prev)
								})
							}
							getContent={getContent}
							getRate={getRate}
							target={item.itemId}
						/>
					)}
				/>
			)}

			{reviews.map((review) => (
				<ReviewWrapper
					key={review.id.id}
					review={review}
					onDelete={(rev) => {
						setReviews((prev) =>
							prev.filter((val) => val?.id.id != rev.id.id),
						)

						setUserReview(undefined)
					}}
					likeButton={(onChange) => (
						<LikeButton
							onChange={onChange}
							likeType={LikeTypes.Review}
							id={review.id}
						/>
					)}
					changeReviewButton={(
						rev,
						getReviewContent,
						getReviewRate,
						onValueChange,
					) => (
						<ChangeReviewButton
							review={rev}
							getReviewContent={getReviewContent}
							getReviewRate={getReviewRate}
							onValueChange={onValueChange}
						/>
					)}
				/>
			))}

			<ReviewWrapper />

			<div ref={observerRef} />

			{isLoadingReviews && <Loading />}

			{allReviewsHasLoaded && reviews.length == 0 && (
				<p className="text-center text-3xl text-zinc-700 py-10">
					Отзывов нет
				</p>
			)}

			<div className="h-20" />
		</div>
	)
}

export default ItemWidgetBase
