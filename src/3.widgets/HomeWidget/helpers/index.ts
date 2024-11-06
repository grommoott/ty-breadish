import { OwnedUser, User } from "@shared/facades"
import { Email } from "@shared/model/types/primitives"

const usernameValidator = (username: string) => async (value: string) => {
    if (value == "") {
        return "Имя не может быть пустым"
    }

    if (
        value == username ||
        (await User.isUsernameAvailable(value))
    ) {
        return ""
    } else {
        return "Пользователь с таким именем уже существует"
    }
}

const emailValidator = (userEmail: string) => async (value: string) => {
    if (value == "") {
        return "Адресс почты не может быть пустым"
    }

    let email: Email

    try {
        email = new Email(value)
    } catch (e) {
        return "Невалидный email"
    }

    if (
        value == userEmail ||
        (await User.isEmailAvailable(new Email(value)))
    ) {
        return ""
    } else {
        return "Пользователь с такой почтой уже существует"
    }
}

const newPasswordValidator = async (value: string) => {
    if (value == "") {
        return ""
    }

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

export { usernameValidator, emailValidator, newPasswordValidator, passwordConfirmationValidator, validationCodeValidator, passwordValidator }
