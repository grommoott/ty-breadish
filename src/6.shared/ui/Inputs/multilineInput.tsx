import { FC } from "react"

interface MultilineInputProps {
	content?: string
	setContent?: (value: string) => void
	className?: string
}

const MultilineInput: FC<MultilineInputProps> = ({
	content = "",
	setContent = () => {},
	className = "",
}) => {
	return (
		<textarea
			className={`outline-none bg-zinc-900 rounded-2xl p-2 resize-none ${className}`}
			onChange={(e) => setContent(e.target.value)}
			value={content}
		></textarea>
	)
}

export default MultilineInput
