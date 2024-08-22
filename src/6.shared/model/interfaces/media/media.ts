import { MediaId, Moment } from "@shared/model/types/primitives";

interface IMedia {
    mediaId: MediaId,
    moment: Moment,
    isEdited: boolean
}

export { IMedia }
