import { FC, useEffect, useRef } from "react"

interface MultilineInputProps {
	content?: string
	setContent?: (value: string) => void
	className?: string
	autoHeight?: boolean
	placeholder?: string
	autoFocus?: boolean
}

const MultilineFlatInput: FC<MultilineInputProps> = ({
	content = "",
	setContent = () => {},
	className = "",
	autoHeight = false,
	placeholder = "",
	autoFocus = false,
}) => {
	const ref = useRef(null)

	useEffect(() => {
		if (!ref.current) {
			return
		}

		const textarea = ref.current as HTMLTextAreaElement

		textarea.selectionStart = textarea.selectionEnd = textarea.value.length

		setContentWrapper(content)
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
			placeholder={placeholder}
			autoFocus={autoFocus}
			ref={ref}
			className={`outline-none bg-transparent resize-none placeholder-zinc-700 p-0 ${className}`}
			onChange={(e) => setContentWrapper(e.target.value)}
			value={content}
		></textarea>
	)
}

export default MultilineFlatInput
