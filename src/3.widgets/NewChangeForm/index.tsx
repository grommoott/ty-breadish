import { imageImage } from "@assets/ui"
import { New } from "@shared/facades"
import {
	useDefaultWidgetWidth,
	useNotification,
	usePopupWindow,
} from "@shared/hooks"
import ImagePicker from "@shared/ui/ImagePicker"
import Loading from "@shared/ui/Loading"
import { FC, useState } from "react"
import { ErrorData, FormData } from "./types"
import { AccentButton } from "@shared/ui/Buttons"
import { MultilineFlatInput, ValidatedInput } from "@shared/ui/Inputs"
import { agreeWindow } from "@shared/ui/PopupWindows"
import { ExError } from "@shared/helpers"

interface NewChangeFormProps {
	aNew?: New
}

const NewChangeForm: FC<NewChangeFormProps> = ({ aNew }) => {
	const isChanging = aNew != undefined

	const notificate = useNotification()
	const popupWindow = usePopupWindow()

	const [formData, setFormData] = useState<FormData>({
		image: undefined,
		title: aNew?.title || "",
		content: aNew?.content || "",
	})
	const [errorData, setErrorData] = useState<ErrorData>({
		image: "",
		title: "",
		content: "",
	})
	const [isChangeLoading, setChangeLoading] = useState(false)
	const [isDeleteLoading, setDeleteLoading] = useState(false)

	const width = useDefaultWidgetWidth()

	const updateOrCreateNew = async () => {
		const errorData: any = {}

		let error = false

		if (formData.title == "") {
			errorData.title = "Заголовок не может быть пустым"
			error = true
		}

		if (!isChanging && formData.image == undefined) {
			errorData.image =
				"Для создания новости необходимо выбрать изображение для него"
			error = true
		}

		setErrorData(errorData)

		if (error) {
			return
		}

		if (isChanging) {
			setChangeLoading(true)
			const response = await aNew.edit(
				formData.title,
				formData.content,
				formData.image,
			)

			if (response instanceof ExError) {
				console.error(response)
				notificate("Произошла ошибка")
				setChangeLoading(false)
				return
			}

			notificate("Новость успешно изменена")
			setChangeLoading(false)
		} else {
			if (!formData.image || !formData.title || !formData.content) {
				return
			}

			setChangeLoading(true)

			const response = await New.create(
				formData.title,
				formData.content,
				formData.image,
			)

			if (response instanceof ExError) {
				console.error(response)
				notificate("Произошла ошибка")
			}

			setChangeLoading(false)
		}
	}

	return (
		<div
			className="p-4 my-2 bg-[var(--dark-color)] rounded-3xl flex flex-col items-stretch"
			style={{ width: `${width}vw` }}
		>
			<h1 className="text-xl sm:text-2xl text-center">
				{isChanging ? `Изменение новости` : `Создание новости`}
			</h1>

			<div className="self-center">
				<ImagePicker
					defaultUrl={isChanging ? aNew.imageLink : imageImage}
					error={errorData?.image}
					onChange={(image) => {
						setFormData({ ...formData, image })
						setErrorData((prev) => ({ ...prev, image: undefined }))
					}}
				/>
			</div>

			<div className="p-4">
				<h2>Заголовок</h2>
				<ValidatedInput
					margin="0.5rem 0"
					error={errorData?.title}
					width="100%"
					placeholder="Название"
					onChange={(val) => {
						setFormData({ ...formData, title: val })
						setErrorData((prev) => ({ ...prev, title: undefined }))
					}}
					value={aNew?.title}
				/>
			</div>

			<div className="p-4">
				<h2>Содержание</h2>
				<div className="p-4 rounded-3xl bg-zinc-800 my-2">
					<MultilineFlatInput
						content={formData.content}
						setContent={(val) =>
							setFormData({ ...formData, content: val })
						}
						className="w-full h-min"
						autoHeight
					/>
				</div>
			</div>

			<div className="p-4 w-full">
				{isChanging ? (
					<>
						<AccentButton
							className="w-full flex flex-row items-center justify-center"
							onClick={updateOrCreateNew}
						>
							Сохранить изменения
							{isChangeLoading && (
								<span className="px-1">
									<Loading inline />
								</span>
							)}
						</AccentButton>
						<AccentButton
							className="w-full flex flex-row items-center justify-center"
							onClick={async () => {
								const result = await popupWindow(
									agreeWindow(
										"Вы уверены, что хотите удалить новость?",
									),
								)

								if (!result) {
									return
								}

								setDeleteLoading(true)

								const response = await aNew.delete()

								if (response instanceof ExError) {
									console.error(response)
									notificate("Произошла ошибка")
									setDeleteLoading(false)
									return
								}

								setDeleteLoading(false)
							}}
						>
							Удалить новость
							{isDeleteLoading && (
								<span className="px-1">
									<Loading inline />
								</span>
							)}
						</AccentButton>
					</>
				) : (
					<AccentButton
						className="w-full flex flex-row items-center justify-center"
						onClick={updateOrCreateNew}
					>
						Создать новость
						{isChangeLoading && (
							<span className="px-1">
								<Loading inline />
							</span>
						)}
					</AccentButton>
				)}
			</div>
		</div>
	)
}

export default NewChangeForm
