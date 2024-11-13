import CreateReviewForm from "@entities/CreateReviewForm"
import ProductWrapper from "@entities/ProductWrapper"
import ReviewWrapper from "@entities/ReviewWrapper"
import ChangeReviewButton from "@features/ChangeReviewButton"
import CreateReviewButton from "@features/CreateReviewButton"
import LikeButton from "@features/LikeButton"
import { Product, Review } from "@shared/facades"
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
import { FC, useEffect, useRef, useState } from "react"

interface ProductWidgetProps {
	product?: Product
}

const ProductWidget: FC<ProductWidgetProps> = ({ product }) => {
	if (!product) {
		return (
			<div className="p-4 m-2 rounded-3xl bg-[var(--dark-color)]">
				<Loading />
			</div>
		)
	}

	const observerRef = useRef(null)
	const isObserverInView = useInView(observerRef)

	const [sortOrder, setSortOrder] = useState<ReviewsSortOrder>(
		ReviewsSortOrders.NewFirst,
	)

	const [isLoadingReviews, setLoadingReviews] = useState(false)
	const [reviewsPage, setReviewsPage] = useState(0)
	const [allReviewsHasLoaded, setAllReviewsHasLoaded] = useState(false)

	const [reviews, setReviews] = useState<Array<Review>>(new Array<Review>())

	const appendReviews = (reviews: Array<Review>) => {
		setReviews((prev) => prev.concat(reviews))
	}

	useEffect(() => {
		setReviewsPage(0)
		setAllReviewsHasLoaded(false)
		setReviews(new Array<Review>())
		loadReviews()
	}, [sortOrder])

	useEffect(() => {
		setLoadingReviews(true)
	}, [])

	const loadReviews = () => {
		if (!isObserverInView) {
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
					product.itemId,
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

	return (
		<>
			<ProductWrapper product={product} />
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

			<CreateReviewForm
				createReviewButton={(getContent, getRate) => (
					<CreateReviewButton
						onReview={(review) =>
							setReviews((prev) => {
								const tmp = new Array()
								tmp.push(review)

								return tmp.concat(prev)
							})
						}
						getContent={getContent}
						getRate={getRate}
						target={product.itemId}
					/>
				)}
			/>

			<div className="flex flex-col">
				{reviews.map((review) => (
					<ReviewWrapper
						key={review.id.id}
						review={review}
						onDelete={(rev) => {
							setReviews((prev) =>
								prev.filter((val) => val.id.id != rev.id.id),
							)
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

				<div className="h-20" />
			</div>
		</>
	)
}

export default ProductWidget
