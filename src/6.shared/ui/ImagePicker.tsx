import { FC, useEffect, useRef, useState } from "react"
import { fileUploadImage, trashImage } from "@assets/ui"
import Loading from "./Loading"

interface ImagePickerProps {
	defaultUrl?: string
	compact?: boolean
	deletable?: boolean
	onChange?: (file: File) => Promise<void> | void
	onDelete?: () => Promise<void> | void
	error?: string
}

const ImagePicker: FC<ImagePickerProps> = ({
	defaultUrl,
	compact = false,
	deletable = false,
	onChange = () => {},
	onDelete = () => {},
	error: err = "",
}) => {
	const [url, setUrl] = useState<string | undefined>("")
	const [isLoading, setLoading] = useState(false)
	const [error, setError] = useState(err)
	const inputRef = useRef(null)

	useEffect(() => {
		setError(err)
	}, [err])

	const openFilePicker = () => {
		if (!inputRef.current) {
			return
		}

		const input = inputRef.current as HTMLInputElement

		input.click()
	}

	return (
		<div
			className={`m-2 rounded-3xl flex flex-col items-center border-2 ${!error ? "border-zinc-800 bg-transparent" : "border-red-700 bg-red-500"} duration-100`}
		>
			{isLoading ? (
				<div className="p-4">
					<Loading />
				</div>
			) : (
				<img
					src={url || defaultUrl}
					className="rounded-3xl object-cover"
					style={{
						height: `${compact ? 5 : 15}rem`,
						padding: `${compact ? 0.5 : 1}rem`,
					}}
				/>
			)}
			{error && (
				<p
					className="text-red-900 text-wrap text-center"
					style={{ width: `${compact ? 4 : 14}rem` }}
				>
					{error}
				</p>
			)}
			<input
				ref={inputRef}
				type="file"
				onChange={async (e) => {
					if (e.target.files == null || e.target.files[0] == null) {
						return
					}

					setError("")

					setLoading(true)

					setUrl(URL.createObjectURL(e.target.files[0]))
					await onChange(e.target.files[0])

					setLoading(false)
				}}
				className="hidden"
				name="image"
				id="file"
			/>

			<div className="flex flex-row">
				<button
					onClick={openFilePicker}
					onKeyDown={(e) => {
						if (e.key == "Enter") {
							openFilePicker()
						}
					}}
					className="group group-hover:scale-110 group-active:scale-90 p-2 m-2 rounded-xl bg-black bg-opacity-0 hover:bg-opacity-10 active:bg-opacity-20 duration-100 focus-visible-default"
				>
					<img
						src={fileUploadImage}
						draggable={false}
						className="select-none group-hover:scale-110 group-active:scale-90 duration-200"
						style={{
							width: `${compact ? 1.5 : 2}rem`,
							height: `${compact ? 1.5 : 2}rem`,
						}}
					/>
				</button>

				{deletable && (
					<button
						onClick={async () => {
							setLoading(true)

							await onDelete()

							setLoading(false)
						}}
						onKeyDown={async (e) => {
							if (e.key == "Enter") {
								setLoading(true)

								await onDelete()

								setLoading(false)
							}
						}}
						className="group group-hover:scale-110 group-active:scale-90 p-2 m-2 rounded-xl bg-black bg-opacity-0 hover:bg-opacity-10 active:bg-opacity-20 duration-100 focus-visible-default"
					>
						<img
							src={trashImage}
							draggable={false}
							className="select-none group-hover:scale-110 group-active:scale-90 duration-200"
							style={{
								width: `${compact ? 1.5 : 2}rem`,
								height: `${compact ? 1.5 : 2}rem`,
							}}
						/>
					</button>
				)}
			</div>
		</div>
	)
}

export default ImagePicker
