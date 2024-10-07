import { FC, useRef, useState } from "react"
import { fileUploadImage } from "@assets/ui"

interface ImagePickerProps {
	defaultUrl?: string
	compact?: boolean
}

const ImagePicker: FC<ImagePickerProps> = ({ defaultUrl, compact = false }) => {
	const [url, setUrl] = useState<string | undefined>("")
	const ref = useRef(null)

	const openFilePicker = () => {
		if (!ref.current) {
			return
		}

		const input = ref.current as HTMLInputElement

		input.click()
	}

	return (
		<div className="p-4 m-2 rounded-3xl flex flex-col items-center border-2 border-zinc-900">
			<img
				src={url || defaultUrl}
				className="rounded-3xl object-cover"
				style={{ height: `${compact ? 5 : 15}rem` }}
			/>

			<input
				ref={ref}
				type="file"
				onChange={(e) => {
					if (e.target.files == null || e.target.files[0] == null) {
						return
					}

					setUrl(URL.createObjectURL(e.target.files[0]))
					console.log(URL.createObjectURL(e.target.files[0]))
				}}
				className="hidden"
				id="file"
			/>

			<button
				onClick={openFilePicker}
				onKeyDown={(e) => {
					if (e.key == "Enter") {
						openFilePicker()
					}
				}}
				className="group group-hover:scale-110 group-active:scale-90 p-2 m-2 rounded-xl hover:bg-zinc-900 active:bg-zinc-800 duration-100 focus-visible-default"
			>
				<img
					src={fileUploadImage}
					draggable={false}
					className="size-8 select-none group-hover:scale-110 group-active:scale-90 duration-200"
				/>
			</button>
		</div>
	)
}

export default ImagePicker
