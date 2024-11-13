import { OwnedUser, User } from "@shared/facades"
import { Email } from "@shared/model/types/primitives"
import { ExError } from "./error"

const registerUsernameValidator:
    (currentUsername?: string) => (value: string) => Promise<string> =
    (currentUsername?: string) => async (value: string) => {
        if (value == "") {
            return "Имя не может быть пустым"
        }

        const response = await User.isUsernameAvailable(value)

        if (response instanceof ExError) {
            return "Произошла ошибка сервера, имя пользователя не может быть проверено на валидность"
        }

        if (response || currentUsername == value) {
            return ""
        } else {
            return "Это имя пользователя уже занято :("
        }
    }

const registerEmailValidator:
    (currentEmail?: string) => (value: string) => Promise<string> =
    (currentEmail?: string) => async (value: string) => {
        if (value == "") {
            return "Адрес электронной почты не может быть пустым"
        }

        let email: Email

        try {
            email = new Email(value)
        } catch (e) {
            return "Невалидный адрес электронной почты"
        }

        const response = await User.isEmailAvailable(email)

        if (response instanceof ExError) {
            return "Произошла ошибка сервера, адрес электронной почты не может быть проверено на валидность"
        }

        if (response || currentEmail == value) {
            return ""
        } else {
            return "Этот адрес электронной почты уже используется :("
        }
    }

const registerPasswordValidator = async (value: string) => {
    if (value.length < 8) {
        return "Пароль должен быть длиннее 8 символов"
    }

    return ""
}

const passwordConfirmationValidator = (password: string) => async (value: string) => {
    if (value != password) {
        return "Пароли не совпадают"
    }

    return ""
}

const validationCodeValidator = async (value: string) => {
    if (value == "") {
        return "Это обязательное поле"
    } else if (!Number(value)) {
        return "Код подтверждения должен содержать только цифры"
    }

    return ""
}

const passwordValidator = async (value: string) => {
    if (value == "") {
        return "Это обязательное поле"
    } else if (!(await OwnedUser.isPasswordIsValid(value))) {
        return "Неправильный пароль"
    }

    return ""
}

const usernameValidator: (value: string) => Promise<string> = async (value: string) => {
    if (value == "") {
        return "Имя не может быть пустым"
    }

    return ""
}

const emailValidator: (value: string) => Promise<string> = async (value: string) => {
    if (value == "") {
        return "Адрес электронной почты не может быть пустым"
    }

    try {
        new Email(value)
    } catch (e) {
        return "Невалидный адрес электронной почты"
    }

    return ""
}

const requiredFieldValidator: (value: string) => Promise<string> = async (value: string) => {
    if (value == "") {
        return "Это обязательное поле"
    }

    return ""
}

export {
    registerUsernameValidator,
    registerEmailValidator,
    registerPasswordValidator,
    passwordConfirmationValidator,
    validationCodeValidator,
    passwordValidator,
    usernameValidator,
    emailValidator,
    requiredFieldValidator
}
