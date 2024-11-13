import { FC, useMemo, useState } from "react"
import { LoginPage, LoginPages } from "./enums"
import { SimpleButton } from "@shared/ui/Buttons"
import { leftArrowImage } from "@assets/ui"
import MainPage from "./ui/MainPage"
import { FormData } from "./types"
import LoginForm from "./ui/LoginForm"
import RecoveryPasswordForm from "./ui/RecoveryPasswordForm"
import RegisterForm from "./ui/RegisterForm"

const LoginWidget: FC = () => {
	const [pagesStack, setPagesStack] = useState<Array<LoginPage>>(
		new Array<LoginPage>(LoginPages.Main),
	)
	const [formData, setFormData] = useState<FormData>({
		email: "",
		password: "",
		username: "",
	})

	const currentPage = useMemo(
		() => pagesStack[pagesStack.length - 1],
		[pagesStack],
	)

	const goToPage = (page: LoginPage) => {
		pagesStack.push(page)
		const tmp = pagesStack.filter(() => true)
		setPagesStack(tmp)
	}

	const goBack = () => {
		if (pagesStack.length > 1) {
			pagesStack.pop()
			const tmp = pagesStack.filter(() => true)
			setPagesStack(tmp)
		}
	}

	return (
		<div className="w-full flex flex-col items-center">
			<div className="flex flex-col items-start bg-[var(--dark-color)] rounded-3xl px-4 sm:px-10 m-4 py-4 pb-8">
				<div className="w-full h-8">
					{pagesStack.length > 1 && (
						<SimpleButton
							onClick={goBack}
							className="size-8"
						>
							<img src={leftArrowImage} />
						</SimpleButton>
					)}
				</div>

				{currentPage == LoginPages.Main && (
					<MainPage
						goToPage={goToPage}
						formData={formData}
						setFormData={setFormData}
					/>
				)}

				{currentPage == LoginPages.Login && (
					<LoginForm
						goToPage={goToPage}
						formData={formData}
						setFormData={setFormData}
					/>
				)}

				{currentPage == LoginPages.RecoveryPassword && (
					<RecoveryPasswordForm
						goToPage={goToPage}
						formData={formData}
						setFormData={setFormData}
					/>
				)}

				{currentPage == LoginPages.Register && (
					<RegisterForm
						goToPage={goToPage}
						formData={formData}
						setFormData={setFormData}
					/>
				)}
			</div>
		</div>
	)
}

export default LoginWidget
