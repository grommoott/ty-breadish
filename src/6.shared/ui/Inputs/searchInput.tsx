import { ChangeEvent, FC } from "react"
import BaseInput from "./baseInput"

interface SearchInputProps {
	onChange?: (e: ChangeEvent<HTMLInputElement>) => void
	placeholder?: string
	width?: string
}

const SearchInput: FC<SearchInputProps> = ({
	onChange,
	width = "max(30%, min(15rem, 80%))",
	placeholder = "Поиск...",
}) => {
	return (
		<BaseInput
			placeholder={placeholder}
			onChange={onChange}
			width={width}
		/>
	)
}

export default SearchInput
