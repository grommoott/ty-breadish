import { FC, ReactNode } from "react"
import { motion } from "framer-motion"

interface PopupWindowProps {
	children?: ReactNode
	isVisible: boolean
	setIsVisible: (value: boolean) => void
}

const PopupWindow: FC<PopupWindowProps> = ({
	isVisible,
	children,
	setIsVisible,
}) => {
	return (
		<>
			<motion.div
				className="bg-[#00000080] w-full h-full left-0 top-0 fixed z-30 backdrop-blur-lg cursor-pointer"
				onClick={() => setIsVisible(false)}
				initial={{ opacity: 0 }}
				animate={
					isVisible
						? {
								opacity: 1,
								display: "block",
							}
						: { opacity: 0, display: "none" }
				}
			/>

			<motion.div
				style={{
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
				}}
				animate={isVisible ? { display: "block" } : { display: "none" }}
				className="fixed z-30"
				onClick={(e) => e.stopPropagation()}
			>
				<motion.div
					initial={{ opacity: 0 }}
					animate={
						isVisible
							? { opacity: 1, y: "0rem" }
							: { opacity: 0, y: "-10rem" }
					}
					className="p-4 bg-zinc-900 rounded-2xl flex flex-col items-center justify-center"
				>
					<svg
						viewBox="0 0 100 100"
						xmlns="http://www.w3.org/2000/svg"
						className="h-6 self-end cursor-pointer hover:scale-125 active:scale-75 duration-100"
						onClick={() => setIsVisible(false)}
					>
						<path
							d="M 10, 10 L 90, 90 M 90,10 L 10, 90"
							strokeWidth="15"
							stroke="white"
							fill="none"
							strokeLinecap="round"
						/>
					</svg>

					<div
						className="flex flex-col overflow-y-scroll m-2"
						style={{ maxHeight: "80vh" }}
					>
						{children}
					</div>
				</motion.div>
			</motion.div>
		</>
	)
}

export default PopupWindow
