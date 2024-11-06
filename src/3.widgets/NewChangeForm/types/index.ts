type FormData = {
    image?: File
    title?: string
    content?: string
}

type ErrorData = {
    image?: string
    title?: string
    content: string
}

export { FormData, ErrorData }
