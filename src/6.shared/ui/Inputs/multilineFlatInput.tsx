import { FC, useEffect, useRef } from "react"

interface MultilineInputProps {
	content?: string
	setContent?: (value: string) => void
	className?: string
	autoHeight?: boolean
}

const MultilineFlatInput: FC<MultilineInputProps> = ({
	content = "",
	setContent = () => {},
	className = "",
	autoHeight = false,
}) => {
	const ref = useRef(null)

	useEffect(() => {
		if (!ref.current) {
			return
		}

		const textarea = ref.current as HTMLTextAreaElement

		textarea.selectionStart = textarea.selectionEnd = textarea.value.length
	}, [])

	function setContentWrapper(value: string) {
		setContent(value)

		if (!ref.current || !autoHeight) {
			return
		}

		const textarea = ref.current as HTMLTextAreaElement

		textarea.style.height = "auto"
		textarea.style.height = `${textarea.scrollHeight}px`
	}

	return (
		<textarea
			autoFocus
			ref={ref}
			className={`outline-none bg-transparent resize-none p-0 ${className}`}
			onChange={(e) => setContentWrapper(e.target.value)}
			value={content}
		></textarea>
	)
}

export default MultilineFlatInput
