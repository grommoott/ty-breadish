import { Rate } from "@shared/model/types/enums"
import { Dispatch, FC, SetStateAction, useState } from "react"
import { SimpleButton } from "./Buttons"
import Star from "./Star"

interface RateSelectorProps {
	rate: Rate
	setRate: Dispatch<SetStateAction<Rate>>
}

const RateSelector: FC<RateSelectorProps> = ({ rate, setRate }) => {
	const [editingRate, setEditingRate] = useState(rate)

	return (
		<div
			onMouseLeave={() => setEditingRate(rate)}
			onBlur={() => setEditingRate(rate)}
			className="max-h-8 flex flex-row"
		>
			{[0, 1, 2, 3, 4].map((val) => (
				<SimpleButton
					key={val}
					onPointerDown={() => {
						setEditingRate((val + 1) as Rate)
						setRate((val + 1) as Rate)
					}}
					onMouseEnter={() => setEditingRate((val + 1) as Rate)}
				>
					<Star fillRatio={editingRate - val} />
				</SimpleButton>
			))}
		</div>
	)
}

export default RateSelector
