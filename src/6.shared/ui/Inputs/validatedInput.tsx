import { FC, HTMLInputAutoCompleteAttribute, useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Loading from "../Loading"
import BaseInput from "./baseInput"

interface ValidatedInputProps {
	onChange?: (value: string) => void
	onError?: (error: string) => void
	validator?: (value: string) => string | Promise<string>
	placeholder?: string
	width?: string
	margin?: string
	displayErrors?: boolean
	value?: string
	error?: string
	passwordInput?: boolean
	autocomplete?: HTMLInputAutoCompleteAttribute
}

const ValidatedInput: FC<ValidatedInputProps> = ({
	onChange = () => {},
	onError = () => {},
	validator = () => "",
	placeholder = "",
	width = "min(20rem,80%)",
	margin,
	displayErrors = true,
	value,
	error = "",
	passwordInput = false,
	autocomplete = "new-password",
}) => {
	const [isValid, setIsValid] = useState(error == "")
	const [isLoading, setIsLoading] = useState(false)
	const [isFocused, setIsFocused] = useState(false)
	const [errorMessage, setErrorMessage] = useState(error)

	useEffect(() => {
		setErrorMessage(error)
	}, [error])

	useEffect(() => {
		setIsValid(errorMessage == "")
	}, [errorMessage])

	return (
		<BaseInput
			autocomplete={autocomplete}
			passwordInput={passwordInput}
			width={width}
			margin={margin}
			placeholder={placeholder}
			placeholderClass={
				isValid ? "placeholder-zinc-700" : "placeholder-red-700"
			}
			bgClass={isValid ? "bg-zinc-800" : "bg-red-500"}
			value={value}
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
				<div className="ml-2">
					{isLoading ? (
						<Loading size={1.6} />
					) : (
						<div style={{ width: "1.6rem", height: "1.6rem" }} />
					)}
				</div>
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
