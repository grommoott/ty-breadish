class AvgRate {
    private _avgRate: number

    public get avgRate(): number {
        return this._avgRate
    }

    public toString(): string {
        return this._avgRate.toString()
    }

    public constructor(avgRate: number | string) {
        if (typeof avgRate === "string") {
            avgRate = parseFloat(avgRate)
        }

        let isValid: boolean = true

        isValid = isValid && Math.round(avgRate) - avgRate == 0
        isValid = isValid && (avgRate >= 1 && avgRate <= 5 || avgRate == -1)

        this._avgRate = avgRate
    }
}

export { AvgRate }
