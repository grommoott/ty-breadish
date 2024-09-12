import { FC } from "react"
import { motion } from "framer-motion"

const Loading: FC<{ size?: number; color?: string }> = ({
	size = 2,
	color = "white",
}) => {
	return (
		<svg
			viewBox="0 0 100 100"
			xmlns="http://www.w3.org/2000/svg"
			style={{ height: `${size}rem`, userSelect: "none" }}
		>
			<motion.circle
				cx={50}
				cy={50}
				r={30}
				style={{
					strokeWidth: `${size / 4}rem`,
					fill: "none",
					stroke: color,
					strokeLinecap: "round",
				}}
				initial={{ pathLength: 0, pathOffset: 0, rotate: 0 }}
				animate={{
					pathLength: [0, 0.8, 0],
					pathOffset: [0, 0.2, 0],
					rotate: [0, 360, 1080],
				}}
				transition={{
					repeat: Infinity,
					repeatType: "loop",
					ease: "linear",
					duration: 5,
				}}
			/>
		</svg>
	)
}

export default Loading
