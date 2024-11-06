import {
	createContext,
	FC,
	ReactNode,
	useEffect,
	useRef,
	useState,
} from "react"
import { motion } from "framer-motion"

type PopupWindow = {
	content: ReactNode
	onClose: (result: any) => void
}

interface PopupWindowProps {
	children?: ReactNode
	isVisible: boolean
	setIsVisible: (value: boolean) => void
}

const PopupWindowElement: FC<PopupWindowProps> = ({
	isVisible,
	children,
	setIsVisible,
}) => {
	const ref = useRef(null)

	const focus = () => {
		ref.current && (ref.current as HTMLDivElement).focus()
	}

	useEffect(() => {
		const timeout = setTimeout(focus, 10)

		return () => clearTimeout(timeout)
	}, [isVisible])

	return (
		<>
			<motion.div
				className="bg-[#00000080] w-full h-full left-0 top-0 fixed z-30 backdrop-blur-lg cursor-pointer"
				onClick={() => setIsVisible(false)}
				initial={{ opacity: 0 }}
				animate={
					isVisible
						? {
								opacity: 1,
								display: "block",
							}
						: { opacity: 0, display: "none" }
				}
			/>

			<motion.div
				style={{
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
				}}
				animate={isVisible ? { display: "block" } : { display: "none" }}
				className="fixed z-30 outline-none"
				onClick={(e) => e.stopPropagation()}
				ref={ref}
				tabIndex={0}
				onKeyDown={(e) => {
					if (e.key == "Escape") {
						setIsVisible(false)
					}
				}}
			>
				<motion.div
					initial={{ opacity: 0 }}
					animate={
						isVisible
							? { opacity: 1, y: "0rem" }
							: { opacity: 0, y: "-10rem" }
					}
					className="p-4 bg-zinc-900 rounded-2xl flex flex-col items-center justify-center"
				>
					<svg
						viewBox="0 0 100 100"
						xmlns="http://www.w3.org/2000/svg"
						className="h-4 self-end cursor-pointer hover:scale-125 active:scale-75 duration-100 focus-visible-default"
						onClick={() => setIsVisible(false)}
						tabIndex={0}
						onKeyDown={(e) => {
							if (e.key == "Enter") {
								setIsVisible(false)
							}
						}}
					>
						<path
							d="M 10, 10 L 90, 90 M 90,10 L 10, 90"
							strokeWidth="15"
							stroke="white"
							fill="none"
							strokeLinecap="round"
						/>
					</svg>

					<div
						className="flex flex-col overflow-y-scroll m-2 pr-2"
						style={{ maxHeight: "80vh" }}
					>
						{children}
					</div>
				</motion.div>
			</motion.div>
		</>
	)
}

const Context = createContext<
	(content: (closeWindow: (result: any) => void) => ReactNode) => Promise<any>
>(() => Promise.resolve())

interface PopupWindowProviderProps {
	children?: ReactNode
}

const PopupWindowProvider: FC<PopupWindowProviderProps> = ({ children }) => {
	const [windowsQueue, setWindowsQueue] = useState(new Array<PopupWindow>())
	const [currentWindow, setCurrentWindow] = useState<PopupWindow>()
	const [isVisible, setVisible] = useState(false)
	const [closeWindowResult, setCloseWindowResult] = useState<any>()

	function pushWindow(window: PopupWindow) {
		setWindowsQueue((prev) => {
			const queueTmp = prev.map((v) => v)
			queueTmp.push(window)
			return queueTmp
		})
	}

	function shiftWindow(): PopupWindow | undefined {
		const result = windowsQueue.shift()

		setWindowsQueue(windowsQueue)

		return result
	}

	function closeWindow(result: any) {
		setVisible(false)
		setCloseWindowResult(result)
	}

	useEffect(() => {
		let timeout: NodeJS.Timeout

		if (!isVisible && currentWindow) {
			currentWindow.onClose(closeWindowResult)
			setCloseWindowResult(undefined)
		}

		if (!isVisible && windowsQueue.length != 0) {
			timeout = setTimeout(() => {
				setCurrentWindow(shiftWindow())
				setVisible(true)
			}, 100)
		}

		return () => {
			clearTimeout(timeout)
		}
	}, [isVisible, windowsQueue])

	return (
		<Context.Provider
			value={(
				content: (closeWindow: (result: any) => void) => ReactNode,
			) => {
				const popupWindow: PopupWindow = {
					content: content(closeWindow),
					onClose: () => {},
				}

				const result = new Promise((resolve) => {
					popupWindow.onClose = resolve
				})

				pushWindow(popupWindow)

				return result
			}}
		>
			<PopupWindowElement
				isVisible={isVisible}
				setIsVisible={setVisible}
			>
				{currentWindow?.content}
			</PopupWindowElement>
			{children}
		</Context.Provider>
	)
}

export default PopupWindowProvider
export { Context as PopupWindowContext }
