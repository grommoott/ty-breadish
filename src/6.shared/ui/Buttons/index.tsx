import { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react"
import "./index.css"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	onClick?: () => void
	children?: ReactNode
	style?: CSSProperties
	className?: string
}

function ButtonBase({
	style,
	className,
	children,
	onClick,
	...props
}: ButtonProps) {
	return (
		<button
			style={style}
			className={`select-none overflow-visible caret-transparent buttons-base ${className}`}
			onClick={onClick}
			onKeyDown={(e) => {
				if (e.key == "enter" && onClick) {
					onClick()
				}
			}}
			{...props}
		>
			{children}
		</button>
	)
}

function Button({ className, ...props }: ButtonProps) {
	return (
		<ButtonBase
			className={`buttons-white ${className}`}
			{...props}
		/>
	)
}

function AccentButton({ className, ...props }: ButtonProps) {
	return (
		<ButtonBase
			className={`buttons-accent ${className}`}
			{...props}
		/>
	)
}

function SimpleButton({ className, ...props }: ButtonProps) {
	return (
		<ButtonBase
			className={`hover:scale-110 active:scale-90 duration-100 focus-visible-default ${className}`}
			{...props}
		/>
	)
}

function NonStyledButton({ ...props }: ButtonProps) {
	return <ButtonBase {...props} />
}

export { Button, AccentButton, SimpleButton, NonStyledButton }
