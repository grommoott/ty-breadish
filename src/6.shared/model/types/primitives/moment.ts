class Moment {
    private _moment: number

    public get moment(): number {
        return this._moment
    }

    public static now(): Moment {
        return new Moment(new Date().getTime())
    }

    public toString(): string {
        return this._moment.toString()
    }

    public constructor(moment: number | string) {
        if (typeof moment === "string") {
            moment = parseInt(moment)
        }

        this._moment = moment
    }
}

export { Moment }
