import { FC, useEffect, useState } from "react"

interface MultiSelectProps {
	selectedValues: string[]
	values: string[]
	translator?: (value: string) => string
	onSelect?: (value: string) => void
	onDelete?: (value: string) => void
}

const MultiSelect: FC<MultiSelectProps> = ({
	selectedValues,
	values,
	translator = (val) => val,
	onSelect = () => {},
	onDelete = () => {},
}) => {
	const [query, setQuery] = useState("")
	const [shownValues, setShownValues] = useState(new Array<string>())

	useEffect(() => {
		setShownValues(
			values
				.filter((val) =>
					translator(val).toLowerCase().includes(query.toLowerCase()),
				)
				.filter((val) => selectedValues.indexOf(val) == -1)
				.sort((a, b) => translator(a).localeCompare(translator(b))),
		)
	}, [selectedValues, values, query])

	return (
		<div className="flex flex-col items-stretch w-full">
			<div className="flex flex-row flex-wrap m-1 p-2 gap-2">
				{selectedValues.map((val, id) => {
					return (
						<div
							key={id}
							className="py-1 px-2 rounded-xl bg-opacity-[0.03] hover:bg-opacity-5 focus-visible:bg-opacity-10 outline-none bg-white cursor-pointer duration-100 select-none"
							onClick={() => onDelete(val)}
							tabIndex={0}
							onKeyDown={(e) => {
								if (e.key == "Enter") {
									onDelete(val)
								}
							}}
						>
							<p className="text-base ">{translator(val)}</p>
						</div>
					)
				})}
			</div>

			<input
				type="text"
				placeholder="Поиск"
				className="rounded-xl p-2 bg-zinc-800 outline-none w-full my-2 placeholder-zinc-700"
				onKeyDown={(e) => {
					if (e.key == "Enter") {
						onSelect(shownValues[0])
					}
				}}
				onChange={(e) => setQuery(e.target.value)}
			/>

			<div
				className="flex flex-col items-stretch overflow-y-scroll h-40 bg-zinc-900 rounded-2xl"
				tabIndex={-1}
			>
				{shownValues.map((val, id) => {
					return (
						<div
							className="p-2 m-1 bg-white rounded-xl bg-opacity-[0.03] hover:bg-opacity-5 active:bg-opacity-10 duration-100 cursor-pointer select-none outline-none focus-visible:bg-opacity-5"
							key={id}
							tabIndex={0}
							onKeyDown={(e) => {
								if (e.key == "Enter") {
									onSelect(val)
								}
							}}
							onClick={() => onSelect(val)}
						>
							{translator(val)}
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default MultiSelect
