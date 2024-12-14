import { ListItem, ListProduct, ListRecipe } from "@shared/facades"
import Star from "@shared/ui/Star"
import { FC, ReactNode, useEffect, useState } from "react"
import { motion, useAnimationControls } from "framer-motion"
import Loading from "@shared/ui/Loading"
import { useNavigate } from "react-router-dom"
import { ItemId } from "@shared/model/types/primitives"
import { ItemType, ItemTypes } from "@shared/model/types/enums"

interface ListItemWrapperProps {
	item?: ListItem
	featuredButton?: (itemId: ItemId, itemType: ItemType) => ReactNode
	undernameNodes?: ReactNode
	imageLink?: string
	itemLink?: string
}

const ItemWrapper: FC<ListItemWrapperProps> = ({
	item,
	featuredButton = () => {},
	undernameNodes,
	imageLink,
	itemLink,
}) => {
	if (!item) {
		return (
			<div
				style={{ height: "18rem", width: "16rem" }}
				className="flex flex-col items-center justify-center p-2 overflow-hidden rounded-3xl bg-[var(--dark-color)] m-2"
			>
				<Loading />
			</div>
		)
	}

	const [isHovered, setHovered] = useState(false)
	const [isMouseDown, setMouseDown] = useState(false)
	const navigate = useNavigate()
	const effectControls = useAnimationControls()

	useEffect(() => {
		effectControls.set({
			rotate: 0,
		})
		effectControls.start({
			rotate: 360,
			transition: { ease: "linear", repeat: Infinity, duration: 10 },
		})
	}, [])

	useEffect(() => {
		if (isHovered) {
			effectControls.start({ opacity: 1, transition: { duration: 0.3 } })
		} else {
			effectControls.start({ opacity: 0, transition: { duration: 0.3 } })
		}
	}, [isHovered])

	return (
		<motion.div
			className="flex flex-col items-center justify-between p-2 overflow-hidden rounded-3xl bg-[var(--dark-color)] m-2"
			style={{ width: "16rem", height: "18rem" }}
		>
			<div className="flex flex-row items-center justify-between">
				<div className="flex flex-row items-center justify-start">
					{item.avgRate.avgRate == -1 ? (
						<p className="text-zinc-700">Нет отзывов</p>
					) : (
						<>
							{[0, 1, 2, 3, 4].map((val) => {
								return (
									<Star
										fillRatio={item.avgRate.avgRate - val}
										key={val}
									/>
								)
							})}

							<p className="text ml-2">
								{item.avgRate.avgRate.toFixed(1)}
							</p>
						</>
					)}

					<>
						{featuredButton(
							item.itemId,
							(() => {
								if (item instanceof ListRecipe) {
									return ItemTypes.Recipe
								} else {
									return ItemTypes.Product
								}
							})(),
						)}
					</>
				</div>
			</div>

			<motion.div
				onHoverStart={() => setHovered(true)}
				onHoverEnd={() => setHovered(false)}
				onFocus={() => setHovered(true)}
				onBlur={() => setHovered(false)}
				onMouseDown={() => setMouseDown(true)}
				onMouseUp={() => setMouseDown(false)}
				onMouseLeave={() => setMouseDown(false)}
				onTouchStart={() => setMouseDown(true)}
				onTouchEnd={() => setMouseDown(false)}
				onTouchCancel={() => setMouseDown(false)}
				onClick={() => navigate(itemLink || "/")}
				onKeyDown={(e) => {
					if (e.key == "Enter") {
						navigate(itemLink || "/")
					}
				}}
				className="m-2 h-1/2 relative outline-none cursor-pointer"
				tabIndex={0}
			>
				<motion.img
					initial={{ scale: 1, filter: "grayscale(0)" }}
					animate={(() => {
						if (isMouseDown) {
							return { scale: 0.9, filter: "grayscale(1)" }
						} else if (isHovered) {
							return { scale: 1.1, filter: "grayscale(0)" }
						} else {
							return { scale: 1, filter: "grayscale(0)" }
						}
					})()}
					src={imageLink}
					className="top-0 relative z-[1] drop-shadow-xl h-full"
					draggable="false"
				/>
				<motion.svg
					initial={{ opacity: 0 }}
					animate={effectControls}
					className="absolute top-0 blur-2xl"
					style={{
						width: "100%",
						height: "100%",
					}}
					viewBox="0 0 100 100"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						strokeWidth={5}
						stroke="white"
						fill="white"
						d="m18.54516,59.30046c4.43213,15.23545 5.54016,16.06648 16.8975,20.49861c11.35734,4.43213 27.1468,9.14127 34.34902,3.87811c7.20221,-5.26316 11.91135,-12.18836 13.5734,-22.16066c1.66205,-9.9723 0.55402,-11.35734 -0.27701,-21.32963c-0.83102,-9.9723 -7.47922,-27.42381 -19.39057,-26.03877c-11.91135,1.38504 -24.09971,3.60111 -29.63988,6.37119c-5.54016,2.77008 -10.52631,10.2493 -14.68143,15.78947c-4.15512,5.54016 -5.26316,7.75623 -0.83102,22.99168z"
					/>
				</motion.svg>
			</motion.div>

			<div className="flex flex-col items-center justify-center">
				<p className="text-xl text-wrap text-center">
					{item.name.substring(0, 30) +
						(item.name.length > 30 ? "..." : "")}
				</p>
				{undernameNodes}
			</div>
		</motion.div>
	)
}

interface ListProductWrapperProps {
	product?: ListProduct
	featuredButton?: (itemId: ItemId, itemType: ItemType) => ReactNode
}

const ListProductWrapper: FC<ListProductWrapperProps> = ({
	product,
	featuredButton,
}) => {
	return (
		<ItemWrapper
			undernameNodes={
				<p className="text-3xl text-[var(--main-color)]">
					{product?.price.price}₽
				</p>
			}
			featuredButton={featuredButton}
			item={product as ListItem}
			imageLink={product?.imageLink}
			itemLink={`/products/id/${product?.id.id}`}
		/>
	)
}

interface ListRecipeWrapperProps {
	recipe?: ListRecipe
	featuredButton?: (itemId: ItemId, itemType: ItemType) => ReactNode
}

const ListRecipeWrapper: FC<ListRecipeWrapperProps> = ({
	recipe,
	featuredButton,
}) => {
	return (
		<ItemWrapper
			item={recipe as ListItem}
			featuredButton={featuredButton}
			imageLink={recipe?.imageLink}
			itemLink={`/recipes/id/${recipe?.id.id}`}
		/>
	)
}

export { ListProductWrapper, ListRecipeWrapper }
