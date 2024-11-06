import { OwnedUser, User } from "@shared/facades"
import { useNotification, usePopupWindow } from "@shared/hooks"
import { AccentButton } from "@shared/ui/Buttons"
import { ValidatedInput } from "@shared/ui/Inputs"
import { FC, useEffect, useState } from "react"
import {
	Confirmation,
	ConfirmationData,
	Confirmations,
	ErrorData,
	FormData,
} from "./types"
import {
	emailValidator,
	passwordConfirmationValidator,
	newPasswordValidator,
	usernameValidator,
} from "./helpers"
import { ExError } from "@shared/helpers"
import ConfirmationForm from "./ui/ConfirmationForm"
import { Email } from "@shared/model/types/primitives"
import ImagePicker from "@shared/ui/ImagePicker"

const HomeWidget: FC = () => {
	if (!OwnedUser.instance) {
		return
	}

	const user = OwnedUser.instance

	const [hasChanged, setHasChanged] = useState(false)

	const [formData, setFormData] = useState<FormData>({
		username: user.username,
		email: user.email.email,
		password: "",
		passwordConfirmation: "",
	})
	const [errorData, setErrorData] = useState<ErrorData>({
		username: "",
		email: "",
		password: "",
		passwordConfirmation: "",
	})
	const [isAvatarDeletable, setAvatarDeletable] = useState(false)

	const popupWindow = usePopupWindow()
	const notification = useNotification()

	const changeUserData = async () => {
		const errorData: ErrorData = {
			username: await usernameValidator(user.username)(formData.username),
			email: await emailValidator(user.email.email)(formData.email),
			password: await newPasswordValidator(formData.password),
			passwordConfirmation: await passwordConfirmationValidator(
				formData.password,
			)(formData.passwordConfirmation),
		}

		if (
			errorData.username != "" ||
			errorData.email != "" ||
			errorData.password != "" ||
			errorData.passwordConfirmation != ""
		) {
			setErrorData(errorData)
			return
		}

		const confirmations = new Set<Confirmation>()

		if (formData.username != user.username) {
			confirmations.add(Confirmations.password)
		}

		if (formData.email != user.email.email) {
			confirmations.add(Confirmations.password)
			confirmations.add(Confirmations.code)
			confirmations.add(Confirmations.newCode)
		}

		if (formData.password != "") {
			confirmations.add(Confirmations.password)
			confirmations.add(Confirmations.code)
		}

		if (confirmations.has(Confirmations.code)) {
			User.createVerificationCode(user.email).then((response) => {
				if (response instanceof ExError) {
					console.error(response)
					return
				}
			})
		}

		if (confirmations.has(Confirmations.newCode)) {
			User.createVerificationCode(new Email(formData.email)).then(
				(response) => {
					if (response instanceof ExError) {
						console.error(response)
						return
					}
				},
			)
		}

		const result = await popupWindow((closeWindow) => (
			<ConfirmationForm
				closeWindow={closeWindow}
				confirmations={confirmations}
			/>
		))

		if (!result) {
			return
		}

		const [resultText, confirmationData]: [string, ConfirmationData] =
			result

		if (resultText != "done") {
			return
		}

		const response = await user.edit(
			confirmationData.password,
			formData.username != user.username ? formData.username : undefined,
			formData.password == "" ? undefined : formData.password,
			formData.email != user.email.email
				? new Email(formData.email)
				: undefined,
			confirmationData.code == ""
				? undefined
				: parseInt(confirmationData.code),
			confirmationData.newCode == ""
				? undefined
				: parseInt(confirmationData.newCode),
		)

		if (response instanceof ExError) {
			console.error(response)
			notification("Ошибка аутентификации, изменения не были сохранены")
			return
		}
	}

	const deleteUser = async () => {
		const confirmations = new Set([
			Confirmations.password,
			Confirmations.code,
		])

		User.createVerificationCode(user.email).then((response) => {
			if (response instanceof ExError) {
				console.error(response)
				return
			}
		})

		const result = await popupWindow((closeWindow) => (
			<ConfirmationForm
				closeWindow={closeWindow}
				confirmations={confirmations}
			/>
		))

		if (!result) {
			return
		}

		const [resultText, confirmationData]: [string, ConfirmationData] =
			result

		if (resultText != "done") {
			return
		}

		const response = await user.delete(
			parseInt(confirmationData.code),
			confirmationData.password,
		)

		if (response instanceof ExError) {
			console.error(response)

			notification("Ошибка аутентификации, пользователь не был удалён")
			return
		}
	}

	const changeAvatar = async (avatar: File) => {
		const isAvatarExists = await user.isAvatarExists()

		if (isAvatarExists instanceof ExError) {
			console.error(isAvatarExists)
			return
		}

		if (isAvatarExists) {
			const response = await user.editAvatar(avatar)

			if (response instanceof ExError) {
				console.error(response)
				return
			}
		} else {
			const response = await user.createAvatar(avatar)

			if (response instanceof ExError) {
				console.error(response)
				return
			}
		}

		updateAvatarDeletable()
	}

	const deleteAvatar = async () => {
		const response = await user.deleteAvatar()

		if (response instanceof ExError) {
			console.error(response)
			return
		}

		updateAvatarDeletable()
	}

	const updateAvatarDeletable = async () => {
		const response = await user.isAvatarExists()

		if (response instanceof ExError) {
			console.error(response)
			return
		}

		setAvatarDeletable(response)
	}

	useEffect(() => {
		updateAvatarDeletable()
	}, [])

	return (
		<div className="p-4 m-2 rounded-3xl bg-[var(--dark-color)] flex flex-col items-stretch">
			<div className="flex flex-col md:flex-row items-center md:items-stretch">
				<ImagePicker
					defaultUrl={user.avatarLink}
					onChange={changeAvatar}
					onDelete={deleteAvatar}
					deletable={isAvatarDeletable}
				/>
				<div className="flex flex-col items-center justify-center">
					<ValidatedInput
						value={formData.username}
						placeholder="Имя пользователя"
						error={errorData.username}
						validator={usernameValidator(user.username)}
						onChange={(value) => {
							setHasChanged(true)
							setFormData((prev) => ({
								...prev,
								username: value,
							}))
						}}
					/>
					<ValidatedInput
						value={formData.email}
						placeholder="Электронная почта"
						error={errorData.email}
						validator={emailValidator(user.email.email)}
						onChange={(value) => {
							setHasChanged(true)
							setFormData((prev) => ({ ...prev, email: value }))
						}}
					/>
					<ValidatedInput
						value={formData.password}
						placeholder="Новый пароль"
						error={errorData.password}
						validator={newPasswordValidator}
						onChange={(value) => {
							setHasChanged(true)
							setFormData((prev) => ({
								...prev,
								password: value,
							}))
						}}
					/>
					<ValidatedInput
						value={formData.passwordConfirmation}
						placeholder="Ещё раз"
						error={errorData.passwordConfirmation}
						validator={passwordConfirmationValidator(
							formData.password,
						)}
						onChange={(value) => {
							setFormData((prev) => ({
								...prev,
								passwordConfirmation: value,
							}))
						}}
					/>
				</div>
			</div>

			<div className="flex flex-col md:flex-row items-center justify-center">
				<div
					className={`flex flex-col items-center duration-200 ${!hasChanged && "pointer-events-none grayscale"}`}
				>
					<AccentButton onClick={changeUserData}>
						Сохранить изменения
					</AccentButton>
				</div>
				<AccentButton onClick={deleteUser}>
					Удалить аккаунт
				</AccentButton>
			</div>
		</div>
	)
}

export default HomeWidget
