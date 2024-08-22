class Price {
    private _price: number

    public get price(): number {
        return this._price
    }

    public toString(): string {
        return `${this._price.toString()} ₽`
    }

    public constructor(price: number) {
        if (typeof price === "string") {
            price = parseFloat(price)
        }

        this._price = price
    }
}

export { Price }
