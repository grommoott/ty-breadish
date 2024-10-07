import { CSSProperties, FC, ReactNode } from "react"

interface TagProps {
	children?: ReactNode
	style?: CSSProperties
	className?: string
	onClick?: () => void
}

const Tag: FC<TagProps> = ({ children, style, className, onClick }) => {
	return (
		<span
			className={`px-2 m-1 text-base h-6 rounded-full bg-[var(--main-color)] text-[var(--dark-color)] ${className}`}
			style={style}
			onClick={onClick}
		>
			{children}
		</span>
	)
}

export default Tag
