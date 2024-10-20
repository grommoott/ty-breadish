import { ChangeEvent, FC, ReactNode, useEffect, useRef } from "react"

interface InputBaseProps {
	placeholder?: string
	width?: string
	margin?: string
	childrenLeft?: ReactNode
	childrenRight?: ReactNode
	bgClass?: string
	placeholderClass?: string
	value?: string
	onChange?: (e: ChangeEvent<HTMLInputElement>) => void
	onFocus?: () => void
	onBlur?: () => void
}

const BaseInput: FC<InputBaseProps> = ({
	placeholder,
	width,
	margin = "1rem",
	childrenLeft,
	childrenRight,
	bgClass = "bg-zinc-800",
	placeholderClass = "placeholder-zinc-700",
	value,
	onChange = () => {},
	onFocus,
	onBlur,
}) => {
	const inputRef = useRef(null)

	useEffect(() => {
		if (!inputRef.current || value == undefined) {
			return
		}

		const input = inputRef.current as HTMLInputElement

		input.value = value
	}, [inputRef])

	return (
		<div
			className={`flex flex-row items-center justify-center relative`}
			style={{
				width: width,
				margin: margin,
			}}
		>
			<div
				className={`flex flex-row items-center justify-center w-full py-1 px-4 rounded-full duration-100 ${bgClass}`}
			>
				{childrenLeft}
				<input
					ref={inputRef}
					type="text"
					className={`bg-transparent outline-none w-full ${placeholderClass}`}
					placeholder={placeholder}
					onChange={onChange}
					onFocus={onFocus}
					onBlur={onBlur}
				/>
				{childrenRight}
			</div>
		</div>
	)
}

export default BaseInput
