import { MediaId, Moment, NewId } from "@shared/model/types/primitives"
import { IMedia } from "./media"

interface INew extends IMedia {
    id: NewId,
    title: string,
    content: string,
}

interface IListNew extends Omit<INew, "content"> { }

function isMediaIsNew(media: IMedia): media is INew {
    return (media as INew)?.id instanceof NewId &&
        typeof (media as INew)?.title === "string" &&
        typeof (media as INew)?.content === "string"
}

function responseDataToNew(data: any): INew {
    if (!(
        "id" in data &&
        "title" in data &&
        "content" in data &&
        "mediaId" in data &&
        "moment" in data &&
        "isEdited" in data)) {
        throw new Error("Invalid response data to convert into INew")
    }

    return {
        id: new NewId(data.id),
        title: data.title,
        content: data.content,
        mediaId: new MediaId(data.mediaId),
        moment: new Moment(data.moment),
        isEdited: data.isEdited
    }
}


function responseDataToListNew(data: any): IListNew {
    if (!(
        "id" in data &&
        "title" in data &&
        "mediaId" in data &&
        "moment" in data &&
        "isEdited" in data)) {
        throw new Error("Invalid response data to convert into INew's list")
    }

    return {
        id: new NewId(data.id),
        title: data.title,
        mediaId: new MediaId(data.mediaId),
        moment: new Moment(data.moment),
        isEdited: data.isEdited
    }
}

export { INew, IListNew, isMediaIsNew, responseDataToNew, responseDataToListNew }
