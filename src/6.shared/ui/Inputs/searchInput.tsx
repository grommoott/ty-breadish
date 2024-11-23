import { FC } from "react"
import BaseInput from "./baseInput"

interface SearchInputProps {
	onChange?: (value: string) => void
	placeholder?: string
	width?: string
	margin?: string
}

const SearchInput: FC<SearchInputProps> = ({
	onChange = () => {},
	width = "max(30%, min(15rem, 80%))",
	placeholder = "Поиск...",
	margin,
}) => {
	return (
		<BaseInput
			margin={margin}
			placeholder={placeholder}
			onChange={(e) => onChange(e.target.value)}
			width={width}
		/>
	)
}

export default SearchInput
