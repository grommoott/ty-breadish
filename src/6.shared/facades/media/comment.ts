import { IComment } from "@shared/model/interfaces"
import { Media } from "./media"
import { CommentId, Id, MediaId, UserId } from "@shared/model/types/primitives"
import { ExError } from "@shared/helpers"
import { createComment, deleteComment, getCommentsPage, putComment } from "@shared/api/comments"
import { OwnedUser } from "../user"
import { CommentsSortOrder } from "@shared/model/types/enums"

class Comment extends Media {

    // Private fields

    private _id: CommentId
    private _from: UserId
    private _target: Id
    private _content: string

    // Getters

    public get id(): CommentId {
        return this._id
    }

    public get from(): UserId {
        return this._from
    }

    public get target(): Id {
        return this._target
    }

    public get content(): string {
        return this._content
    }

    // Methods

    protected async edit(content?: string): Promise<void | ExError> {
        const edit: void | ExError = await putComment(this.id, content)

        if (edit instanceof ExError) {
            return edit
        }

        if (content) {
            this._content = content
        }
    }

    // Static constructors

    public async getCommentsPage(target: MediaId, sortOrder: CommentsSortOrder, page: number): Promise<Array<Comment> | ExError> {
        const comments: Array<IComment> | ExError = await getCommentsPage(target, sortOrder, page)

        if (comments instanceof ExError) {
            return comments
        }

        return comments.map(comment => OwnedComment.tryOccupyComment(new Comment(comment)))
    }

    // Constructor

    protected constructor({ id, from, target, content, mediaId, moment, isEdited }: IComment) {
        super({ mediaId, moment, isEdited })

        this._id = id
        this._from = from
        this._target = target
        this._content = content
    }
}

class OwnedComment extends Comment {

    // Methods

    public async edit(content?: string): Promise<void | ExError> {
        return await super.edit(content)
    }

    public async delete(): Promise<void | ExError> {
        return await deleteComment(this.id)
    }

    // Methods

    public static async create(target: MediaId, content: string): Promise<OwnedComment | ExError> {
        const comment: IComment | ExError = await createComment(target, content)

        if (comment instanceof ExError) {
            return comment
        }

        return new OwnedComment(comment)
    }

    // Static constructors

    public static tryOccupyComment(comment: Comment): Comment | OwnedComment {
        if (comment.from.id === OwnedUser.instance.id.id) {
            return new OwnedComment(comment)
        } else {
            return comment
        }
    }

    private constructor({ id, from, target, content, mediaId, moment, isEdited }: IComment) {
        super({ id, from, target, content, mediaId, moment, isEdited })
    }
}

export { Comment, OwnedComment }
