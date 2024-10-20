import { plusImage } from "@assets/ui"
import { createImage } from "@shared/api/images"
import { ExError } from "@shared/helpers"
import { ImageId } from "@shared/model/types/primitives"
import { SimpleButton } from "@shared/ui/Buttons"
import { FC, useRef } from "react"

interface AddImageButtonProps {
	onImage?: (id: ImageId) => void
}

const AddImageButton: FC<AddImageButtonProps> = ({ onImage = () => {} }) => {
	const inputRef = useRef(null)

	return (
		<SimpleButton
			onClick={() => {
				if (!inputRef.current) {
					return
				}

				const input = inputRef.current as HTMLInputElement

				input.click()
			}}
		>
			<input
				ref={inputRef}
				type="file"
				className="hidden"
				onChange={async (e) => {
					if (e.target.files == null || e.target.files.length == 0) {
						return
					}

					const response = await createImage(e.target.files[0])

					if (response instanceof ExError) {
						console.error(response)
						return
					}

					onImage(response)
				}}
			/>

			<img
				src={plusImage}
				className="h-12"
			/>
		</SimpleButton>
	)
}

export default AddImageButton
