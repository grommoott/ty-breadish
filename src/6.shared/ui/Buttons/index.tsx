import { CSSProperties, ReactNode } from "react"
import "./index.css"

interface ButtonProps {
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
			className={`select-none caret-transparent buttons-base ${className}`}
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

export { Button, AccentButton }
