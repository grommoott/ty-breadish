import { useAnimationControls, motion } from "framer-motion"
import { FC, ReactNode, useEffect, useRef, useState } from "react"

interface FoldableItemProps {
	title?: ReactNode
	children?: ReactNode
	width?: string
	contentAlign?: "center" | "stretch"
	contentPadding?: string
}

const FoldableItem: FC<FoldableItemProps> = ({
	title,
	children,
	width = "10rem",
	contentAlign = "center",
	contentPadding = "0rem",
}) => {
	const [isFolded, setIsFolded] = useState(true)
	const outerDivControls = useAnimationControls()
	const [height, setHeight] = useState(0)
	const innterDiv = useRef(null)

	useEffect(() => {
		if (!isFolded) {
			outerDivControls.start({
				maxHeight: height,
				opacity: 1,
			})
		} else {
			outerDivControls.start({ maxHeight: 0, opacity: 0 })
		}
	}, [isFolded, height])

	useEffect(() => {
		if (innterDiv.current == null) {
			return
		}

		const inner = innterDiv.current as HTMLDivElement

		setHeight(inner.scrollHeight)

		const interval = setInterval(() => {
			setHeight(inner.scrollHeight)
		}, 0.05)

		outerDivControls.set({ maxHeight: 0 })

		return () => {
			clearInterval(interval)
		}
	}, [])

	return (
		<div
			className="flex flex-col items-center justify-center m-2 rounded-2xl border-2 border-zinc-800"
			style={{ width }}
		>
			<button
				className="pl-5 pr-3 py-2 w-full focus-visible:text-[var(--main-color)] duration-100 outline-none flex flex-row items-center justify-between gap-2"
				onClick={() => setIsFolded(!isFolded)}
			>
				<p>{title}</p>

				<div>
					<motion.svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 100 100"
						className="h-6"
						initial={{ rotate: 0 }}
						animate={{ rotate: isFolded ? 180 : 0 }}
					>
						<path
							d="M 10,70 L 50,30 L 90, 70"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={10}
							fill="none"
							stroke="white"
						/>
					</motion.svg>
				</div>
			</button>

			<motion.div
				animate={outerDivControls}
				className={`${isFolded && "overflow-hidden"} self-stretch`}
				style={{ visibility: isFolded ? "hidden" : "visible" }}
			>
				<div
					ref={innterDiv}
					className="flex flex-col justify-center"
					style={{
						alignItems: contentAlign,
						paddingLeft: contentPadding,
						paddingRight: contentPadding,
					}}
				>
					{children}
				</div>
			</motion.div>
		</div>
	)
}

export default FoldableItem
