import { useAnimationControls, motion } from "framer-motion"
import { FC, ReactNode, useEffect, useRef, useState } from "react"

interface FoldableItemProps {
	title?: string
	children?: ReactNode
	width?: string
}

const FoldableItem: FC<FoldableItemProps> = ({
	title,
	children,
	width = "10rem",
}) => {
	const [isFolded, setIsFolded] = useState(true)
	const outerDivControls = useAnimationControls()
	const innterDiv = useRef(null)

	useEffect(() => {
		if (innterDiv.current == null) {
			return
		}

		const inner = innterDiv.current as HTMLDivElement

		if (!isFolded) {
			outerDivControls.start({
				maxHeight: inner.scrollHeight,
				opacity: 1,
			})
		} else {
			outerDivControls.start({ maxHeight: 0, opacity: 0 })
		}
	}, [isFolded])

	useEffect(() => {
		outerDivControls.set({ maxHeight: 0 })
	}, [])

	return (
		<div
			className="flex flex-col items-center justify-center m-2 rounded-2xl bg-[var(--dark-color)]"
			style={{ width }}
		>
			<button
				className="px-3 h-10 w-full focus-visible-default flex flex-row items-center justify-between gap-2"
				onClick={() => setIsFolded(!isFolded)}
			>
				<p>{title}</p>

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
			</button>

			<motion.div
				animate={outerDivControls}
				className="overflow-hidden"
			>
				<div
					ref={innterDiv}
					className="flex flex-col items-center justify-center"
				>
					{children}
				</div>
			</motion.div>
		</div>
	)
}

export default FoldableItem
