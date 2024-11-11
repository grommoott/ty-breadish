class Coords {
    private _longitude: number
    private _latitude: number


    public get longitude(): number {
        return this._longitude
    }

    public get latitude(): number {
        return this._latitude
    }


    public static fromObject(object: any): Coords {
        return new Coords(object[0], object[1])
    }

    public toString(): string {
        return `[${this.longitude},${this.latitude}]`
    }

    public toNormalView(): object {
        return [this.longitude, this.latitude]
    }

    public constructor(latitude: number, longitude: number) {
        this._latitude = latitude
        this._longitude = longitude
    }
}

export { Coords }
