import { CSSProperties, FC, useEffect, useMemo, useState } from "react"
import { fullLogo, logo } from "@assets/index"
import { motion, Variants, useAnimationControls } from "framer-motion"
import "./index.css"
import { usePageSize } from "@shared/contexts"
import { PageSizes } from "@shared/enums"
import { useDefaultWidgetWidth } from "@shared/hooks"

const FullLogo: FC<{ size?: number }> = ({ size = 16 }) => {
	return (
		<img
			className="select-none"
			draggable={false}
			src={fullLogo}
			style={{ height: `${size}rem` }}
		/>
	)
}

const circleVariants: Variants = {
	shown: {
		opacity: 1,
		pathLength: 1,
		strokeWidth: "0.2rem",
		transition: {
			duration: 1,
			ease: "easeInOut",
		},
	},
	hidden: {
		opacity: 0,
		pathLength: 0,
		strokeWidth: "0.16rem",
	},
	idle: {
		transition: {
			duration: 4,
			ease: "linear",
		},
	},
}

const breadVariants: Variants = {
	shown: {
		opacity: 1,
		scale: 1,
		y: "0rem",
		transition: {
			stiffness: 50,
			damping: Math.sqrt(42),
			type: "spring",
		},
	},
	hidden: {
		scale: 0.7,
		opacity: 0,
		y: "10rem",
	},
}

const upperTextVariants: Variants = {
	shown: {
		opacity: 1,
		startOffset: "0%",
		transition: {
			stiffness: 50,
			damping: 8,
			type: "spring",
		},
	},
	hidden: {
		opacity: 0,
		startOffset: "50%",
	},
}

const bottomTextVariants: Variants = {
	shown: {
		opacity: 1,
		startOffset: "0%",
		transition: {
			stiffness: 50,
			damping: 8,
			type: "spring",
		},
	},
	hidden: {
		opacity: 0,
		startOffset: "-50%",
	},
}

const circleSize = 35
const breadSize = 14
const fullSize = Math.max(circleSize, breadSize)
const different = circleSize - breadSize

const breadPathStyle: CSSProperties = {
	stroke: "white",
	strokeLinecap: "round",
	fill: "#00000000",
	strokeWidth: `${(0.2 * 2 * circleSize) / breadSize}rem`,
	strokeLinejoin: "round",
}

const innerBreadPathStyle: CSSProperties = {
	...breadPathStyle,
	fill: "#ffffff",
}

const AnimatedFullLogo: FC = () => {
	const pageSize = usePageSize()
	const circleControls = useAnimationControls()

	const [sizeMultiplier, setSizeMultiplier] = useState(1)

	const circleSizeMultiplied = useMemo(
		() => circleSize * sizeMultiplier,
		[sizeMultiplier],
	)
	const breadSizeMultiplied = useMemo(
		() => breadSize * sizeMultiplier,
		[sizeMultiplier],
	)
	const fullSizeMultiplied = useMemo(
		() => fullSize * sizeMultiplier,
		[sizeMultiplier],
	)
	const differentMultiplied = useMemo(
		() => different * sizeMultiplier,
		[sizeMultiplier],
	)

	useEffect(() => {
		if (pageSize >= PageSizes.XXL) {
			setSizeMultiplier(0.9)
		} else if (pageSize >= PageSizes.XL) {
			setSizeMultiplier(0.9)
		} else if (pageSize >= PageSizes.Large) {
			setSizeMultiplier(0.9)
		} else if (pageSize >= PageSizes.Medium) {
			setSizeMultiplier(0.9)
		} else if (pageSize >= PageSizes.SmallMedium) {
			setSizeMultiplier(0.9)
		} else if (pageSize >= PageSizes.Small) {
			setSizeMultiplier(0.9)
		} else if (pageSize >= PageSizes.ExtraSmall) {
			setSizeMultiplier(0.9)
		} else {
			setSizeMultiplier(0.9)
		}
	}, [pageSize])

	useEffect(() => {
		circleControls.set("hidden")

		circleControls.start("shown")

		circleControls.start({
			rotate: 360,
			transition: {
				repeat: Infinity,
				duration: 12,
				ease: "linear",
			},
		})
	}, [])

	return (
		<motion.div
			className="relative select-none"
			initial="hidden"
			animate="shown"
			tabIndex={-1}
			style={{
				width: `${fullSizeMultiplied}rem`,
				height: `${fullSizeMultiplied}rem`,
			}}
			whileHover={{
				scale: 1.02,
				transition: {
					type: "spring",
					stiffness: 100,
					damping: 5,
				},
			}}
			whileTap={{
				scale: 0.97,
				transition: {
					type: "spring",
					stiffness: 120,
					damping: 7,
				},
			}}
		>
			<motion.div
				className="absolute"
				style={{ height: `${circleSizeMultiplied}rem` }}
			>
				<motion.svg
					viewBox="0 0 423.33332 423.33333"
					xmlns="http://www.w3.org/2000/svg"
					className="select-none size-full"
				>
					<motion.path
						className="logo-path-default"
						variants={circleVariants}
						initial="hidden"
						animate={circleControls}
						d="m 104.24684,203.80197 c 3.50285,-31.60771 23.17516,-62.08729 49.08069,-79.24054 26.7533,-17.7146 63.8129,-21.71097 95.12792,-14.71703 36.13371,8.07015 64.96451,45.04503 70.96515,80.24479 6.67115,39.13298 -11.91244,88.83675 -44.8813,110.31192 -22.35931,14.56435 -53.21577,27.47514 -77.70314,19.25497 -17.37139,-5.83141 -36.26254,-10.17554 -50.50674,-21.70261 -17.21365,-13.93009 -32.1391,-31.73469 -38.37903,-54.22419 -3.42315,-12.33743 -5.24658,-26.00383 -3.70355,-39.92731 z"
					/>
				</motion.svg>
			</motion.div>

			<motion.div
				className="absolute"
				style={{
					height: `${breadSizeMultiplied}rem`,
					top: `${differentMultiplied / 2}rem`,
					left: `${differentMultiplied / 2}rem`,
				}}
			>
				<motion.svg
					viewBox="0 0 423.33332 423.33333"
					xmlns="http://www.w3.org/2000/svg"
					variants={breadVariants}
					className="select-none size-full"
				>
					<path
						style={breadPathStyle}
						d="M 357.18749,52.916663 C 395.85134,110.7732 310.46734,232.36569 226.14477,215.42283 257.68009,300.906 158.26708,412.17942 92.604163,383.64581 10.811786,348.1032 73.700686,186.29617 132.29166,119.06249 183.62907,60.152353 313.77082,-12.051996 357.18749,52.916663 Z"
					/>

					<path
						style={innerBreadPathStyle}
						d="m 251.35416,79.374995 c 3.73988,20.181497 29.17492,45.022985 52.91667,52.916665 -0.913,-25.8809 -28.05683,-51.926973 -52.91667,-52.916665 z"
					/>

					<path
						style={innerBreadPathStyle}
						d="m 191.1358,193.34128 c -19.39384,-6.76555 -34.07467,-10.11287 -45.62512,-29.96071 22.35733,3.0029 36.66233,12.29262 45.62512,29.96071 z"
					/>

					<path
						style={innerBreadPathStyle}
						d="m 94.491184,287.80068 c 9.298396,23.7594 31.183566,34.4872 58.722316,38.37538 -11.76515,-25.71315 -28.72157,-42.12978 -58.722316,-38.37538 z"
					/>
				</motion.svg>
			</motion.div>

			<motion.div
				className="absolute"
				style={{ height: `${fullSizeMultiplied}rem`, zIndex: 1 }}
			>
				<motion.svg
					viewBox="0 0 423.33332 423.33333"
					xmlns="http://www.w3.org/2000/svg"
					className="select-none size-full"
				>
					<motion.circle
						id="circle"
						cx="50%"
						cy="50%"
						r="126.85303"
						fill="none"
					/>

					<motion.text
						className="select-none logo-text-default neucha"
						fontSize="4rem"
						textAnchor="middle"
						x="142%"
					>
						<motion.textPath
							href="#circle"
							variants={upperTextVariants}
						>
							ТЫ
						</motion.textPath>
					</motion.text>

					<motion.text>
						<motion.textPath href="#MyPath">привет</motion.textPath>
					</motion.text>
				</motion.svg>
			</motion.div>

			<motion.div
				className="absolute"
				style={{ height: `${fullSizeMultiplied}rem`, zIndex: 2 }}
			>
				<motion.svg
					viewBox="0 0 423.33332 423.33333"
					xmlns="http://www.w3.org/2000/svg"
					className="select-none size-full"
				>
					<motion.circle
						id="circle2"
						cx="50%"
						cy="50%"
						fill="none"
						r="185"
					/>

					<motion.text
						className="select-none logo-text-default neucha"
						fontSize="4rem"
						x="178%"
						textAnchor="start"
					>
						<motion.textPath
							//@ts-ignore
							side="right"
							href="#circle2"
							variants={bottomTextVariants}
						>
							BREADISH!
						</motion.textPath>
					</motion.text>
				</motion.svg>
			</motion.div>
		</motion.div>
	)
}

const SmallLogo: FC<{ size: number }> = ({ size }) => {
	return (
		<img
			className="select-none"
			draggable={false}
			src={logo}
			style={{ height: `${size}rem` }}
		/>
	)
}

export { FullLogo, AnimatedFullLogo, SmallLogo }
