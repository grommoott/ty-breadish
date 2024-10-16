import {
	createContext,
	FC,
	ReactNode,
	useEffect,
	useRef,
	useState,
} from "react"
import { AnimatePresence, motion } from "framer-motion"

const Context = createContext<(value: string) => void>(() => {})

interface NotificationProps {
	content?: string
}

const Notification: FC<NotificationProps> = ({ content }) => {
	const ref = useRef(null)
	const [height, setHeight] = useState(0)

	useEffect(() => {
		if (ref.current == null) {
			return
		}

		setHeight((ref.current as HTMLDivElement).scrollHeight)
	}, [ref])

	return (
		<motion.div
			ref={ref}
			initial={{ y: 50, opacity: 0, height: 0 }}
			exit={{ y: -50, opacity: 0 }}
			animate={{
				y: 0,
				opacity: 1,
				height,
			}}
		>
			<div
				className="p-4 rounded-2xl shadow-xl bg-zinc-900 m-2 border-2 border-zinc-800"
				style={{ maxWidth: "max(15rem, 40vw)" }}
			>
				<p className="text-center">{content}</p>
			</div>
		</motion.div>
	)
}

interface NotificationProviderProps {
	children?: ReactNode
}

const NotificationsProvider: FC<NotificationProviderProps> = ({ children }) => {
	const [notifications, setNotifications] = useState(
		new Array<{ val: string; key: number }>(),
	)
	const [key, setKey] = useState(0)

	return (
		<Context.Provider
			value={(val: string) => {
				setNotifications((prev) => {
					const prevKey = key

					setKey((p) => p + 1)

					return prev.concat({ val, key: prevKey })
				})

				setTimeout(
					() => {
						setNotifications((prev) => {
							const removeIndex = prev.findIndex(
								(value) => value.val == val,
							)
							const result = prev.map((value) => value)
							result.splice(removeIndex, 1)
							return result
						})
					},
					3000 + val.length * 30,
				)
			}}
		>
			{children}
			<div
				style={{
					position: "fixed",
					width: "100vw",
					height: "100vh",
					top: 0,
					zIndex: 100,
					pointerEvents: "none",
				}}
				className="flex flex-col justify-end items-center"
			>
				<div className="flex flex-col items-center pb-20">
					<AnimatePresence>
						{notifications.map((val) => (
							<Notification
								content={val.val.toString()}
								key={val.key}
							/>
						))}
					</AnimatePresence>
				</div>
			</div>
		</Context.Provider>
	)
}

export default NotificationsProvider
export { Context as NotificationsContext }
