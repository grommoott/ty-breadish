import { FC, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Loading from "../Loading"
import BaseInput from "./baseInput"

interface ValidatedInputProps {
	onChange?: (value: string) => void
	onError?: (error: string) => void
	validator?: (value: string) => string | Promise<string>
	placeholder?: string
	width?: string
	displayErrors?: boolean
}

const ValidatedInput: FC<ValidatedInputProps> = ({
	onChange = () => {},
	onError = () => {},
	validator = () => "",
	placeholder = "",
	width = "min(20rem,80%)",
	displayErrors = true,
}) => {
	const [isValid, setIsValid] = useState(true)
	const [isLoading, setIsLoading] = useState(false)
	const [isFocused, setIsFocused] = useState(false)
	const [errorMessage, setErrorMessage] = useState("")

	return (
		<BaseInput
			width={width}
			placeholder={placeholder}
			placeholderClass={
				isValid ? "placeholder-zinc-700" : "placeholder-red-700"
			}
			bgClass={isValid ? "bg-zinc-800" : "bg-red-500"}
			childrenLeft={
				displayErrors && (
					<AnimatePresence>
						{!isValid && isFocused && (
							<motion.div
								initial={{
									y: "-4rem",
									opacity: 0,
								}}
								animate={{
									y: "-1rem",
									opacity: 1,
								}}
								exit={{
									y: "-4rem",
									opacity: 0,
								}}
								className="absolute bg-zinc-900 z-10 border-zinc-800 border-2 rounded-3xl p-2 w-full min-h-12 flex flex-col justify-center bottom-full"
							>
								<p className="text-base w-full text-wrap px-4 text-center text-red-500 m-0">
									{errorMessage}
								</p>
							</motion.div>
						)}
					</AnimatePresence>
				)
			}
			childrenRight={
				isLoading && (
					<div className="ml-2">
						<Loading size={1.6} />
					</div>
				)
			}
			onFocus={() => {
				setIsFocused(true)
			}}
			onBlur={() => {
				setIsFocused(false)
			}}
			onChange={(e) => {
				if (onChange) {
					onChange(e.target.value)
				}

				async function validate() {
					setIsLoading(() => true)

					const value = e.target.value

					const result = await validator(e.target.value)

					if (value != e.target.value) {
						return
					}

					if (result == "") {
						setIsValid(() => true)
						setErrorMessage("")
					} else {
						setIsValid(() => false)
						setErrorMessage(result)
						onError(result)
					}

					setIsLoading(() => false)
				}

				validate()
			}}
		/>
	)
}

export default ValidatedInput