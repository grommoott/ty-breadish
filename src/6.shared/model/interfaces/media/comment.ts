import { CommentId, MediaId, Moment, UserId } from "@shared/model/types/primitives"
import { IMedia } from "./media"
import { ExError } from "@shared/helpers"

interface IComment extends IMedia {
    id: CommentId,
    from: UserId,
    target: MediaId,
    content: string,
}

function isMediaIsComment(media: IMedia): media is IComment {
    return (media as IComment)?.id instanceof CommentId &&
        (media as IComment)?.from instanceof UserId &&
        (media as IComment)?.target instanceof MediaId &&
        typeof (media as IComment)?.content === "string"
}

function responseDataToComment(data: any): IComment {
    if (!(
        "id" in data &&
        "from" in data &&
        "target" in data &&
        "content" in data &&
        "mediaId" in data &&
        "moment" in data &&
        "isEdited" in data
    )) {
        throw new ExError("Invalid response data to convert into IComment", 500)
    }

    return {
        id: new CommentId(data.id),
        from: new UserId(data.from),
        target: new MediaId(data.target),
        content: data.content,
        mediaId: new MediaId(data.mediaId),
        moment: new Moment(data.moment),
        isEdited: data.isEdited
    }
}

export { IComment, isMediaIsComment, responseDataToComment }
