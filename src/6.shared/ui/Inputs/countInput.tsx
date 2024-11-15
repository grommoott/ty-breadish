import { FC, useCallback, useEffect, useRef, useState } from "react"
import { NonStyledButton } from "../Buttons"
import { motion, Transition, Variants } from "framer-motion"

interface NumberInputProps {
	value: number
	setValue: (value: number) => void
	predicate: (value: number) => boolean
}

const NumberInput: FC<NumberInputProps> = ({ value, setValue }) => {
	const [inputValue, setInputValue] = useState("")
	const [isFocused, setFocused] = useState(false)
	const inputRef = useRef(null)

	useEffect(() => {
		if (!isFocused) {
			setInputValue(value.toString())
		}
	}, [value, isFocused])

	useEffect(() => {
		if (value.toString() == inputValue) {
			return
		}

		const num = Number(inputValue)

		if (num) {
			setValue(num)
		}
	}, [inputValue])

	const syncValues = useCallback(() => {
		setInputValue(value.toString())
	}, [setInputValue, value])

	return (
		<input
			ref={inputRef}
			className="bg-transparent w-full text-center outline-none px-2"
			onChange={(e) => {
				setInputValue(e.target.value)
			}}
			onFocus={() => setFocused(true)}
			onBlur={() => setFocused(false)}
			onKeyDown={(e) => {
				if (e.key == "Enter") {
					syncValues()

					if (!inputRef.current) {
						return
					}

					const input = inputRef.current as HTMLInputElement

					input.blur()
				}
			}}
			value={inputValue}
		></input>
	)
}

interface CountInputProps {
	onChange?: (value: number) => void
	initial?: number
	minValue?: number
	maxValue?: number
	value?: number
	controls?: boolean
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

const clamp = (a: number, min: number, max: number) =>
	Math.min(Math.max(min, a), max)

const CountInput: FC<CountInputProps> = ({
	onChange = () => {},
	minValue = 0,
	maxValue = Infinity,
	initial = minValue,
	value = undefined,
	controls = true,
}) => {
	const [count, setCount] = useState(initial)
	const [validatedCount, setValidatedCount] = useState(initial)

	useEffect(() => {
		if (count == validatedCount) {
			return
		}

		if (count < minValue) {
			setCount(minValue)
			return
		}

		if (count > maxValue) {
			setCount(maxValue)
			return
		}

		onChange(count)
		setValidatedCount(count)
	}, [count])

	useEffect(() => {
		if (!value) {
			return
		}

		let validatedValue = clamp(value, minValue, maxValue)

		setValidatedCount(() => validatedValue)
		setCount(() => validatedValue)
	}, [value])

	return (
		<div className="flex flex-row items-center m-2">
			{controls && (
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
			)}

			<div
				className="h-10 bg-zinc-900 flex flex-col items-center justify-center"
				style={{
					width: `${Math.min(count.toString().length, 7) * 0.8 + 1}rem`,
				}}
			>
				<NumberInput
					value={validatedCount}
					setValue={setCount}
					predicate={(val) => val >= 0 && val % 1 == 0}
				/>
			</div>

			{controls && (
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
			)}
		</div>
	)
}

export default CountInput
