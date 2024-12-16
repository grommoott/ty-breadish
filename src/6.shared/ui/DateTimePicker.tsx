import { FC, useEffect, useRef } from "react"

interface DateTimePickerProps {
	onChange?: (value: Date) => void
	defaultValue?: Date
}

const DateTimePicker: FC<DateTimePickerProps> = ({
	onChange = () => {},
	defaultValue = new Date(),
}) => {
	const inputRef = useRef(null)

	console.log(defaultValue.toLocaleString())
	useEffect(() => {
		if (inputRef.current == undefined) {
			return
		}

		const input = inputRef.current as HTMLInputElement

		input.min = new Date().toISOString()
		input.defaultValue = defaultValue.toISOString()
	}, [inputRef])

	return (
		<input
			defaultValue={new Date(
				defaultValue.getTime() -
					defaultValue.getTimezoneOffset() * 60 * 1000,
			)
				.toISOString()
				.substring(0, 16)}
			type="datetime-local"
			className="datetime-picker-default focus-visible:scale-105 duration-100 outline-none"
			onChange={(e) =>
				onChange(
					new Date(
						new Date(e.target.value).getTime() +
							new Date().getTimezoneOffset() * 60 * 1000,
					),
				)
			}
		/>
	)
}

export default DateTimePicker
