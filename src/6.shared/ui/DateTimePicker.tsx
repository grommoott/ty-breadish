import { FC } from "react"

interface DateTimePickerProps {
	onChange?: (value: Date) => void
	defaultValue?: Date
}

const DateTimePicker: FC<DateTimePickerProps> = ({
	onChange = () => {},
	defaultValue = new Date(),
}) => {
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
			onChange={(e) => onChange(new Date(e.target.value))}
		/>
	)
}

export default DateTimePicker
