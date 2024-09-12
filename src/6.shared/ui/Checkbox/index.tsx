import { FC, useEffect, useState } from "react"
import { motion, useAnimationControls } from "framer-motion"
import "./index.css"

interface CheckboxProps {
	children?: string
	onValueChanged?: (value: boolean) => void
}

const Checkbox: FC<CheckboxProps> = ({
	children,
	onValueChanged = () => {},
}) => {
	const [value, setValue] = useState(false)
	const checkboxControls = useAnimationControls()

	function setValueEx(value: boolean) {
		setValue(value)
		onValueChanged(value)
	}

	useEffect(() => {
		if (value) {
			checkboxControls.start(
				{
					backgroundColor: "var(--main-color)",
					outlineColor: "var(--main-color)",
					scale: 1.1,
				},
				{ duration: 0.1 },
			)
		} else {
			checkboxControls.start(
				{
					backgroundColor: "#ffffff",
					outlineColor: "#ffffff",
					scale: 0.9,
				},
				{ duration: 0.1 },
			)
		}
	}, [value])

	return (
		<div
			className="flex flex-row items-center justify-center gap-2 focus-visible-default m-1"
			onKeyDown={(e) => {
				if (e.key === "Enter") {
					setValueEx(!value)
				}
			}}
			tabIndex={0}
		>
			<motion.button
				animate={checkboxControls}
				whileTap={{
					backgroundColor: value ? "#ffffff" : "var(--main-color)",
					outlineColor: value ? "#ffffff" : "var(--main-color)",
					scale: 0.8,
					transition: { duration: 0.1 },
				}}
				onTapCancel={() => {
					checkboxControls.start({
						backgroundColor: value
							? "var(--main-color)"
							: "#ffffff",
						outlineColor: value ? "var(--main-color)" : "#ffffff",
						scale: value ? 1.1 : 0.9,
						transition: { duration: 0.1 },
					})
				}}
				onKeyUp={(e) => {
					if (e.key === "Enter") {
						checkboxControls.start({
							backgroundColor: value
								? "var(--main-color)"
								: "#ffffff",
							outlineColor: value
								? "var(--main-color)"
								: "#ffffff",
							scale: value ? 1.1 : 0.9,
							transition: { duration: 0.1 },
						})
					}
				}}
				tabIndex={-1}
				style={{ zIndex: 0 }}
				className="checkbox-checkbox"
				onClick={() => {
					setValueEx(!value)
				}}
			/>
			<p>{children}</p>
		</div>
	)
}

export default Checkbox
