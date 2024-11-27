import { getGeocodingFromCoords, getGeocodingFromQuery, getMapTileUrl } from "@shared/api/maps"
import { ExError } from "@shared/helpers"
import { Coords } from "@shared/model/types/primitives"

class Maps {
    public static mapTileUrl(x: string, y: string, z: string): string {
        return getMapTileUrl(x, y, z)
    }

    public static async geocodeFromCoords(coords: Coords): Promise<string | ExError> {
        return await getGeocodingFromCoords(coords)
    }

    public static async geocodeFromQuery(query: string): Promise<Array<Coords> | ExError> {
        return await getGeocodingFromQuery(query)
    }
}

export { Maps }
