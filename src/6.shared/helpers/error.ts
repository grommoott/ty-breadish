class ExError extends Error {
    public statusCode: number

    public constructor(msg: string, statusCode: number) {
        super(msg)

        this.statusCode = statusCode
    }
}

export { ExError }
