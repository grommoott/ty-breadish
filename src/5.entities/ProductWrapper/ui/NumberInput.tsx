import { BaseInput } from "@shared/ui/Inputs"
import { FC, useEffect, useState } from "react"

interface NumberInputProps {
	value: number
	setValue: (value: number) => void
	predicate: (value: number) => boolean
}

const NumberInput: FC<NumberInputProps> = ({ value, setValue, predicate }) => {
	const [isEmpty, setEmpty] = useState(false)

	useEffect(() => {
		setEmpty(false)
	}, [value])

	return (
		<BaseInput
			width="5rem"
			placeholderClass="text-center"
			onChange={(e) => {
				if (e.target.value == "") {
					setEmpty(true)
				} else {
					setEmpty(false)
				}

				const val = parseFloat(e.target.value)

				if (!predicate(val)) {
					return
				}

				setValue(val)
			}}
			value={isEmpty ? "" : value.toString()}
		></BaseInput>
	)
}

export default NumberInput
