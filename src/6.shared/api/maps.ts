import { backendBaseUrl, defaultAxiosRequestConfig } from "@shared/config";
import { errorWrapper, ExError } from "@shared/helpers";
import { Coords } from "@shared/model/types/primitives";
import axios from "axios";

function getMapTileUrl(x: number, y: number, z: number): string {
    return `${backendBaseUrl}/api/maps/tiles/x/${x}/y/${y}/z/${z}`
}

async function getGeocodingFromCoords(coords: Coords): Promise<string | ExError> {
    try {
        const response = await axios.get(`${backendBaseUrl}/api/maps/geocoding/fromCoords/longitude/${coords.longitude}/latitude/${coords.latitude}`, defaultAxiosRequestConfig)

        return response.data
    } catch (e) {
        return errorWrapper(e, "getGeocodingFromCoords")
    }
}

async function getGeocodingFromQuery(query: string): Promise<Array<Coords> | ExError> {
    try {
        const response = await axios.get(`${backendBaseUrl}/api/maps/geocoding/fromQuery/query/${btoa(query)}`, defaultAxiosRequestConfig)

        return response.data
    } catch (e) {
        return errorWrapper(e, "getGeocodingFromQuery")
    }
}

export { getMapTileUrl, getGeocodingFromCoords, getGeocodingFromQuery }
