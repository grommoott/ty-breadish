import {
	FC,
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react"
import "./index.css"

interface PriceSliderProps {
	min?: number
	max?: number
	width?: { value: string }
	step?: number
	value?: [number, number]
	onValueChanged?: (value: [number, number]) => void
}

function onPointerDown(e: React.PointerEvent) {
	;(e.target as HTMLButtonElement).setPointerCapture(e.pointerId)
}

function onPointerUp(e: React.PointerEvent) {
	;(e.target as HTMLButtonElement).releasePointerCapture(e.pointerId)
}

const clamp = (a: number, min: number, max: number) =>
	Math.min(Math.max(min, a), max)

const PriceSlider: FC<PriceSliderProps> = ({
	min = 0,
	max = 1,
	width = { value: "10rem" },
	step = 1,
	value = [min, max],
	onValueChanged = () => {},
}) => {
	const [sliderValue, setSliderValue] = useState([min, max])
	const minButton = useRef(null)
	const maxButton = useRef(null)
	const sliderRef = useRef(null)

	const [widthPx, setWidthPx] = useState<number>(1)

	const pxToVal = useMemo(() => max / widthPx, [widthPx])

	const roundToStep = useCallback(
		(value: number) => {
			return step * Math.round(value / step)
		},
		[step],
	)

	function addValue(value: [number, number]) {
		const result = [
			clamp(roundToStep(sliderValue[0] + value[0]), min, max),
			clamp(roundToStep(sliderValue[1] + value[1]), min, max),
		]

		if (result[0] > result[1]) {
			if (value[0] != 0) {
				result[1] = result[0]
			}

			if (value[1] != 0) {
				result[0] = result[1]
			}
		}

		onValueChanged([result[0], result[1]])
	}

	useLayoutEffect(() => {
		if (!sliderRef.current) {
			return
		}

		const slider = sliderRef.current as HTMLDivElement

		setWidthPx(slider.clientWidth)
	}, [width])

	useEffect(() => {
		setSliderValue(() => {
			const result = [
				clamp(roundToStep(value[0]), min, max),
				clamp(roundToStep(value[1]), min, max),
			]

			if (result[0] > result[1]) {
				if (value[0] != 0) {
					result[1] = result[0]
				}

				if (value[1] != 0) {
					result[0] = result[1]
				}
			}

			return result
		})
	}, [value])

	return (
		<div
			className="flex flex-col items-center justify-center m-3"
			style={{ width: width.value }}
		>
			<div className="flex flex-row justify-between w-full px-1">
				<p className="text-zinc-700 text-base">{min}</p>
				<p className="text-zinc-700 text-base">{max}</p>
			</div>

			<div className="relative flex flex-col items-center justify-center w-full">
				<button
					onPointerDown={onPointerDown}
					onPointerUp={onPointerUp}
					onPointerMove={(e: React.PointerEvent) => {
						if (!minButton.current) {
							return
						}

						const rect = (
							minButton.current as HTMLButtonElement
						).getBoundingClientRect()

						if (e.pressure != 0) {
							addValue([
								(e.pageX - rect.x - rect.width / 2) * pxToVal,
								0,
							])
						}
					}}
					className="-translate-x-1/2 absolute"
					style={{
						left: sliderValue[0] / pxToVal,
						zIndex: 1,
					}}
					tabIndex={-1}
					ref={minButton}
				>
					<div className="price-slider-thumb" />
				</button>

				<button
					onPointerDown={onPointerDown}
					onPointerUp={onPointerUp}
					onPointerMove={(e: React.PointerEvent) => {
						if (!maxButton.current) {
							return
						}

						const rect = (
							maxButton.current as HTMLButtonElement
						).getBoundingClientRect()

						if (e.pressure != 0) {
							addValue([
								0,
								(e.pageX - rect.x - rect.width / 2) * pxToVal,
							])
						}
					}}
					className="-translate-x-1/2 absolute"
					style={{
						left: sliderValue[1] / pxToVal,
						zIndex: 1,
					}}
					tabIndex={-1}
					ref={maxButton}
				>
					<div className="price-slider-thumb" />
				</button>

				<div
					className="relative size-full"
					ref={sliderRef}
					style={{ width: width.value }}
				>
					<div
						className="relative size-full bg-white opacity-10 translate-y-1/2 rounded-full"
						style={{
							width: widthPx,
							height: widthPx * 0.025,
						}}
					/>

					<div
						className="relative bg-white size-full -translate-y-1/2"
						style={{
							left: sliderValue[0] / pxToVal,
							width: (sliderValue[1] - sliderValue[0]) / pxToVal,
							height: widthPx * 0.03,
						}}
					/>
				</div>
			</div>
		</div>
	)
}

export default PriceSlider
