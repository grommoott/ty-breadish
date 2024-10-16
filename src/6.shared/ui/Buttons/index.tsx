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

function Button({ className, style, ...props }: ButtonProps) {
	return (
		<ButtonBase
			className={`buttons-white ${className}`}
			style={style}
			{...props}
		/>
	)
}

function AccentButton({ className, style, ...props }: ButtonProps) {
	return (
		<ButtonBase
			className={`buttons-accent ${className}`}
			style={style}
			{...props}
		/>
	)
}

function SimpleButton({ className, style, ...props }: ButtonProps) {
	return (
		<ButtonBase
			className={`hover:scale-110 active:scale-90 duration-100 focus-visible-default ${className}`}
			style={style}
			{...props}
		/>
	)
}

export { Button, AccentButton, SimpleButton }
