import { Dispatch, SetStateAction } from "react"
import { LoginPage } from "../enums"

type FormData = {
    email: string,
    username: string,
    password: string,
}

interface LoginPageBaseProps {
    goToPage: (page: LoginPage) => void
    formData: FormData
    setFormData: Dispatch<SetStateAction<FormData>>
}

export { FormData, LoginPageBaseProps }
