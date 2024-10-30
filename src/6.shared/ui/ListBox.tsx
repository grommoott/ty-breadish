import { FC, useEffect, useRef, useState } from "react"
import { motion, useAnimationControls } from "framer-motion"
import { NonStyledButton } from "./Buttons"

interface ListBoxProps {
	items: Map<string, string>
	onChange?: (value: string) => void
	defaultValue?: { key: string; value: string }
}

const ListBox: FC<ListBoxProps> = ({
	items,
	onChange = () => {},
	defaultValue,
}) => {
	const [isOpened, setOpened] = useState(false)
	const [selected, setSelected] = useState(defaultValue?.key || "nothing")
	const listContainer = useRef(null)
	const absoluteContainer = useRef(null)
	const [mainContainerSize, setMainContainerSize] = useState<{
		width: number
		height: number
	}>()
	const listContainerControls = useAnimationControls()

	useEffect(() => {
		if (!absoluteContainer.current) {
			return
		}

		const container = absoluteContainer.current as HTMLDivElement

		setMainContainerSize({
			width: container.scrollWidth,
			height: container.scrollHeight,
		})
	}, [absoluteContainer])

	useEffect(() => {
		if (isOpened) {
			if (!listContainer.current) {
				return
			}

			const container = listContainer.current as HTMLDivElement
			listContainerControls.start({ height: container.scrollHeight })
		} else {
			listContainerControls.start({ height: 0 })
		}
	}, [isOpened])

	const selectItem = (item: string) => {
		setOpened(false)
		setSelected(item)
		onChange(item)
	}

	return (
		<div
			className="relative m-2"
			style={mainContainerSize}
		>
			<div
				className="absolute border-white rounded-xl border-2"
				ref={absoluteContainer}
			>
				<NonStyledButton
					className={`p-2 min-w-60 bg-zinc-900 flex flex-row justify-between items-center`}
					style={{
						borderRadius: isOpened
							? "0.75rem 0.75rem 0 0"
							: "0.75rem",
					}}
					onClick={() => setOpened((prev) => !prev)}
				>
					{items.get(selected) || "Ничего не выбрано"}

					<motion.svg
						xmlns="http://www.w3.org/svg/2000"
						viewBox="0 0 100 100"
						className="size-6"
						initial={{ rotate: 0 }}
						animate={{ rotate: isOpened ? 180 : 0 }}
					>
						<path
							d="M 10,30 L 50,70 L 90, 30"
							strokeWidth="10"
							fill="none"
							stroke="white"
							strokeLinecap="round"
						/>
					</motion.svg>
				</NonStyledButton>
				<motion.div
					ref={listContainer}
					initial={{ height: 0 }}
					animate={listContainerControls}
					className="overflow-hidden flex flex-col bg-[var(--dark-color)]"
					style={{ borderRadius: "0 0 0.75rem 0.75rem" }}
				>
					{Array.from(items.entries()).map((value, id) => (
						<div
							className="p-2 focus-visible:bg-[var(--main-color)] outline-none bg-zinc-900 hover:bg-[var(--dakr-color)] active:bg-zinc-800 duration-100 cursor-pointer select-none"
							key={id}
							tabIndex={isOpened ? 0 : -1}
							onClick={() => selectItem(value[0])}
							onKeyDown={(e) => {
								if (e.key == "Enter") {
									selectItem(value[0])
								}
							}}
						>
							{value[1]}
						</div>
					))}
				</motion.div>
			</div>
		</div>
	)
}

export default ListBox
