import { IListNew, INew } from "@shared/model/interfaces"
import { MediaId, Moment, NewId } from "@shared/model/types/primitives"
import { Media } from "./media"
import { ExError } from "@shared/helpers"
import { createNew, createNewImage, deleteNew, deleteNewImage, getNew, getNewsPage, putNew, putNewImage } from "@shared/api/news"
import { backendBaseUrl } from "@shared/config"

class New extends Media {

    // Private fields

    private _id: NewId
    private _title: string
    private _content: string

    // Getters

    public get id(): NewId {
        return this._id
    }

    public get title(): string {
        return this._title
    }

    public get content(): string {
        return this._content
    }

    public get imageLink(): string {
        return `${backendBaseUrl}/api/news/images/id/${this.id}`
    }

    // Methods

    public async edit(title?: string, content?: string, image?: File): Promise<void | ExError> {
        const edit: void | ExError = await putNew(this.id, title, content)

        if (edit instanceof ExError) {
            return edit
        }

        if (image) {
            const putImage: void | ExError = await putNewImage(this.id, image)

            if (putImage instanceof ExError) {
                return putImage
            }
        }

        if (title) {
            this._title = title
        }

        if (content) {
            this._content = content
        }

        if (title || content) {
            this.setIsEdited()
        }
    }

    public async delete(): Promise<void | ExError> {
        const del: void | ExError = await deleteNew(this.id)

        if (del instanceof ExError) {
            return del
        }

        const deleteImage: void | ExError = await deleteNewImage(this.id)

        if (deleteImage instanceof ExError) {
            return deleteImage
        }
    }

    // Static constructors

    public static async fromId(id: NewId): Promise<New | ExError> {
        const aNew: INew | ExError = await getNew(id)

        if (aNew instanceof ExError) {
            return aNew
        }

        return new New(aNew)
    }

    public static async create(title: string, content: string, image: File): Promise<New | ExError> {
        const aNew: INew | ExError = await createNew(title, content)

        if (aNew instanceof ExError) {
            return aNew
        }

        const createImage: void | ExError = await createNewImage(aNew.id, image)

        if (createImage instanceof ExError) {
            return createImage
        }

        return new New(aNew)
    }

    // Constructor

    private constructor({ id, title, content, mediaId, moment, isEdited }: INew) {
        super({ mediaId, moment, isEdited })

        this._id = id
        this._title = title
        this._content = content
    }
}

class ListNew {

    // Private fields

    private _listNew: IListNew

    // Getters

    public get id(): NewId {
        return this._listNew.id
    }

    public get title(): string {
        return this._listNew.title
    }

    public get mediaId(): MediaId {
        return this._listNew.mediaId
    }

    public get moment(): Moment {
        return this._listNew.moment
    }

    public get isEdited(): boolean {
        return this._listNew.isEdited
    }

    public get imageLink(): string {
        return `${backendBaseUrl}/api/news/images/id/${this.id}`
    }

    // Static constructors

    public static async getNewsPage(page: number): Promise<Array<ListNew> | ExError> {
        const newsPage: Array<IListNew> | ExError = await getNewsPage(page)

        if (newsPage instanceof ExError) {
            return newsPage
        }

        return newsPage.map(aNew => new ListNew(aNew))
    }

    // Constructor

    private constructor({ id, title, mediaId, moment, isEdited }: IListNew) {
        this._listNew = { id, title, mediaId, moment, isEdited }
    }
}

export { New, ListNew }
