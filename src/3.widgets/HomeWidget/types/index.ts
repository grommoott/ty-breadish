type FormData = {
    username: string
    email: string
    password: string
    passwordConfirmation: string
}

type ErrorData = {
    username: string
    email: string
    password: string
    passwordConfirmation: string
}

type ConfirmationData = {
    password: string
    code: string
    newCode: string
}

type ConfirmationErrorData = {
    password: string
    code: string
    newCode: string
}

const Confirmations = {
    code: "code",
    newCode: "newCode",
    password: "password"
} as const

type Confirmation = typeof Confirmations[keyof typeof Confirmations]

export { FormData, ErrorData, ConfirmationData, Confirmations, Confirmation, ConfirmationErrorData }
