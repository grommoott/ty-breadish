import { FC, useEffect, useState } from "react"
import { NonStyledButton } from "../Buttons"
import { motion, Transition, Variants } from "framer-motion"

interface NumberInputProps {
	value: number
	setValue: (value: number) => void
	predicate: (value: number) => boolean
}

const NumberInput: FC<NumberInputProps> = ({ value, setValue, predicate }) => {
	const [isEmpty, setEmpty] = useState(false)

	return (
		<input
			className="bg-transparent w-full text-center outline-none px-2"
			onChange={(e) => {
				if (e.target.value == "") {
					setEmpty(true)
					return
				} else {
					setEmpty(false)
				}

				const val = parseFloat(e.target.value)

				if (!predicate(val)) {
					return
				}

				setValue(val)
			}}
			value={isEmpty ? "" : value.toString()}
		></input>
	)
}

interface CountInputProps {
	onChange?: (value: number) => void
	initial?: number
}

const buttonBackgroundVariants: Variants = {
	default: {
		backgroundColor: "var(--zinc-900)",
	},
	hover: {
		backgroundColor: "var(--zinc-900)",
	},
	active: {
		backgroundColor: "#ffffff",
	},
}

const buttonForegroundVariants: Variants = {
	default: {
		stroke: "#ffffff",
		scale: 0.75,
	},
	hover: {
		stroke: "#ffffff",
		scale: 1,
	},
	active: {
		stroke: "var(--zinc-900)",
		scale: 0.75,
	},
}

const svgTransition: Transition = {
	duration: 0.1,
}

const pathTransition: Transition = {
	duration: 0.15,
}

const CountInput: FC<CountInputProps> = ({
	onChange = () => {},
	initial = 0,
}) => {
	const [count, setCount] = useState(initial)
	const [validatedCount, setValidatedCount] = useState(initial)

	useEffect(() => {
		if (count < 0) {
			setCount(0)
			return
		}

		onChange(count)
		setValidatedCount(count)
	}, [count])

	return (
		<div className="flex flex-row items-center m-2">
			<NonStyledButton
				onClick={() => setCount((prev) => prev - 1)}
				className="focus-visible-default"
			>
				<motion.svg
					xmlns="http://www.w3.org/2000/svg"
					className="select-none size-10"
					style={{ borderRadius: "1rem 0 0 1rem" }}
					transition={svgTransition}
					variants={buttonBackgroundVariants}
					initial="default"
					whileTap="active"
					whileHover="hover"
					viewBox="-5 0 100 100"
				>
					<motion.path
						d="M 20,50 L 80,50"
						strokeWidth={10}
						strokeLinecap="round"
						transition={pathTransition}
						variants={buttonForegroundVariants}
					/>
				</motion.svg>
			</NonStyledButton>

			<div className="h-10 w-16 bg-zinc-900 flex flex-col items-center justify-center">
				<NumberInput
					value={validatedCount}
					setValue={setCount}
					predicate={(val) => val >= 0 && val % 1 == 0}
				/>
			</div>

			<NonStyledButton
				onClick={() => setCount((prev) => prev + 1)}
				className="focus-visible-default"
			>
				<motion.svg
					xmlns="http://www.w3.org/2000/svg"
					className="select-none size-10"
					style={{ borderRadius: "0 1rem 1rem 0" }}
					transition={svgTransition}
					variants={buttonBackgroundVariants}
					initial="default"
					whileTap="active"
					whileHover="hover"
					viewBox="0 0 105 100"
				>
					<motion.path
						d="M 50,20 L 50,80 M 20,50 L 80,50"
						strokeWidth={10}
						strokeLinecap="round"
						transition={pathTransition}
						variants={buttonForegroundVariants}
					/>
				</motion.svg>
			</NonStyledButton>
		</div>
	)
}

export default CountInput
