import { backendBaseUrl } from "@shared/config";
import { errorWrapper, ExError } from "@shared/helpers";
import { ImageId } from "@shared/model/types/primitives";
import axios from "axios";

async function checkImage(id: ImageId): Promise<void | ExError> {
    try {
        axios.get(`${backendBaseUrl}/api/images/id/${id}`)
    } catch (e) {
        return errorWrapper(e, "checkImage")
    }
}

async function createImage(image: File): Promise<void | ExError> {
    try {
        const formData = new FormData()
        formData.append("image", image)

        await axios.postForm(`${backendBaseUrl}/api/images/create`, formData)
    } catch (e) {
        return errorWrapper(e, "createImage")
    }
}

async function deleteImage(id: ImageId): Promise<void | ExError> {
    try {
        await axios.delete(`${backendBaseUrl}/api/images/id/${id}`)
    } catch (e) {
        return errorWrapper(e, "deleteImage")
    }
}

async function putImage(id: ImageId, image: File): Promise<void | ExError> {
    try {
        const formData = new FormData()
        formData.append("id", id.toString())
        formData.append("image", image)

        await axios.putForm(`${backendBaseUrl}/api/images`, formData)
    } catch (e) {
        return errorWrapper(e, "putImage")
    }
}

export {
    checkImage,
    createImage,
    deleteImage,
    putImage
}
