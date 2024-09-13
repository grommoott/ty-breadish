import { AccentButton, Button } from "@shared/ui/Buttons"
import Checkbox from "@shared/ui/Checkbox"
import FoldableItem from "@shared/ui/FoldableItem"
import { SearchInput, ValidatedInput } from "@shared/ui/Inputs"
import Loading from "@shared/ui/Loading"
import { AnimatedFullLogo } from "@shared/ui/Logos"
import PopupWindow from "@shared/ui/PopupWindow"
import PriceSlider from "@shared/ui/PriceSlider"
import { ReactElement, useState } from "react"

export default function Test(): ReactElement {
	const [value, setValue] = useState([0, 0])
	const [isPopupVisible, setPopupVisible] = useState(false)

	return (
		<div className="bg-zinc-900 flex flex-col items-center justify-center">
			<AnimatedFullLogo />
			<Loading />

			<Button onClick={() => setPopupVisible(!isPopupVisible)}>
				Открыть всплывающее окно
			</Button>

			<PopupWindow
				isVisible={isPopupVisible}
				setIsVisible={setPopupVisible}
			>
				<Button>Перейти</Button>
				<AccentButton>Оформить заказ</AccentButton>

				<Checkbox>Чечбокс</Checkbox>
				<Checkbox>Чечбокс</Checkbox>
				<Checkbox>Чечбокс</Checkbox>
				<Checkbox>Чечбокс</Checkbox>
				<Checkbox>Чечбокс</Checkbox>
				<Checkbox>Чечбокс</Checkbox>
				<Checkbox>Чечбокс</Checkbox>
				<Checkbox>Чечбокс</Checkbox>
				<Checkbox>Чечбокс</Checkbox>

				<FoldableItem
					title="Элементы"
					width="20rem"
				>
					<Checkbox>Чечбокс</Checkbox>
					<Checkbox>Чечбокс</Checkbox>
					<Checkbox>Чечбокс</Checkbox>
					<Checkbox>Чечбокс</Checkbox>
					<Checkbox>Чечбокс</Checkbox>

					<PriceSlider
						min={0}
						max={100}
						width={15}
						onValueChanged={setValue}
					/>

					<p>
						Min: {value[0]}, Max: {value[1]}
					</p>

					<ValidatedInput
						validator={async (val) => {
							if (val == "f") {
								return "fadsfasdflj asdf"
							} else if (val == "a") {
								return "Error, sorry!"
							}

							return ""
						}}
					/>

					<SearchInput />
				</FoldableItem>
			</PopupWindow>
		</div>
	)
}
