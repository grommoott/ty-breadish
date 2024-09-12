import { IMedia } from "@shared/model/interfaces";
import { MediaId, Moment } from "@shared/model/types/primitives";
import { Like } from "../like";
import { LikeTypes } from "@shared/model/types/enums";
import { ExError } from "@shared/helpers";

class Media {

    // Private fields

    private _media: IMedia
    private _likesCount: number | undefined

    // Getters

    public get mediaId(): MediaId {
        return this._media.mediaId
    }

    public get moment(): Moment {
        return this._media.moment
    }

    public get isEdited(): boolean {
        return this._media.isEdited
    }

    // Methods

    protected setIsEdited() {
        this._media.isEdited = true
    }

    public async getLikesCount(): Promise<number | ExError> {
        if (!this._likesCount) {
            const likesCount: number | ExError = await Like.getLikesCount(this._media.mediaId, LikeTypes.Media)

            if (likesCount instanceof ExError) {
                return likesCount
            }

            this._likesCount = likesCount
        }

        return this._likesCount
    }

    // Constructor

    protected constructor({ mediaId, moment, isEdited }: IMedia) {
        this._media = { mediaId, moment, isEdited }
    }
}

export { Media }
