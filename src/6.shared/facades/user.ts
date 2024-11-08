import { createRegisterToken, createVerificationCode, getAccessToken, login, register } from "@shared/api/auth"
import { createAvatar, deleteAvatar, deleteUser, getUser, getUsername, isAvatarExists, isEmailAvailable, isPasswordIsValid, isUsernameAvailable, putAvatar, putUser } from "@shared/api/users"
import { backendBaseUrl } from "@shared/config"
import { ExError } from "@shared/helpers"
import { IUser } from "@shared/model/interfaces"
import { Email, Moment, UserId } from "@shared/model/types/primitives"
import { Like } from "./like"
import { Featured } from "./featured"

class User {

    // Private fields

    private _id: UserId
    private _username: string

    // Getters

    public get id(): UserId {
        return this._id
    }

    public get username(): string {
        return this._username
    }

    public get avatarLink(): string {
        return `${backendBaseUrl}/api/users/avatars/id/${this.id}`
    }

    // Static methods

    public static async isUsernameAvailable(username: string): Promise<boolean | ExError> {
        return await isUsernameAvailable(username)
    }

    public static async isEmailAvailable(email: Email): Promise<boolean | ExError> {
        return await isEmailAvailable(email)
    }

    public static async createVerificationCode(email: Email): Promise<void | ExError> {
        return await createVerificationCode(email)
    }

    // Static constructors

    public static async fromId(id: UserId): Promise<User | ExError> {
        const username: string | ExError = await getUsername(id)

        if (username instanceof ExError) {
            return username
        }

        return new User({ id, username })
    }

    // Costructor

    private constructor({ id, username }: { id: UserId, username: string }) {
        this._id = id
        this._username = username
    }
}

class OwnedUser {

    // Private fields

    private _user: IUser
    private _likes: Array<Like> | undefined = undefined
    private _featured: Array<Featured> | undefined = undefined
    // private _role: Role | undefined = undefined
    private static _instance: OwnedUser | undefined = undefined

    // Getters

    public get id(): UserId {
        return this._user.id
    }

    public get username(): string {
        return this._user.username
    }

    public get email(): Email {
        return this._user.email
    }

    public get moment(): Moment {
        return this._user.moment
    }

    public get avatarLink(): string {
        return `${backendBaseUrl}/api/users/avatars/id/${this.id}`
    }

    public get likes(): Array<Like> | undefined {
        return this._likes
    }

    public get featured(): Array<Featured> | undefined {
        return this._featured
    }

    // Methods

    public async editAvatar(image: File): Promise<void | ExError> {
        return await putAvatar(image)
    }

    public async deleteAvatar(): Promise<void | ExError> {
        return await deleteAvatar()
    }

    public async createAvatar(image: File): Promise<void | ExError> {
        return await createAvatar(image)
    }

    public async isAvatarExists(): Promise<boolean | ExError> {
        return await isAvatarExists(this._user.id)
    }

    public async edit(password: string, username?: string, newPassword?: string, email?: Email, code?: number, newCode?: number): Promise<void | ExError> {
        return await putUser(password, username, newPassword, email, code, newCode)
    }

    public async delete(verificationCode: number, password: string): Promise<void | ExError> {
        const del: void | ExError = await deleteUser(verificationCode, password)

        if (del instanceof ExError) {
            return del
        }

        const deleteImage: void | ExError = await deleteAvatar()

        if (deleteImage instanceof ExError) {
            return deleteImage
        }
    }

    public async initialize(): Promise<void | ExError> {
        const likes: Array<Like> | ExError = await Like.getList()

        if (!(likes instanceof ExError)) {
            this._likes = likes
        }

        const featured: Array<Featured> | ExError = await Featured.getFeatured()

        if (!(featured instanceof ExError)) {
            this._featured = featured
        }

        setInterval(OwnedUser.refreshToken, 19 * 60 * 1000)
    }

    // Static initializers

    public static async refreshToken(): Promise<void | ExError> {
        const response: void | ExError = await getAccessToken()

        if (response instanceof ExError) {
            return response
        }

        const user: IUser | ExError = await getUser()

        if (user instanceof ExError) {
            return user
        }

        if (!this._instance) {
            this._instance = new OwnedUser(user)
        }
    }

    public static async login(username: string, password: string): Promise<void | ExError> {
        const response: IUser | ExError = await login(username, password)

        if (response instanceof ExError) {
            return response
        }

        this._instance = new OwnedUser(response)
    }

    public static async createRegisterToken(username: string, password: string, email: Email): Promise<string | ExError> {
        return await createRegisterToken(username, password, email)
    }

    public static async register(verificationCode: number, registerToken: string): Promise<void | ExError> {
        const user: IUser | ExError = await register(verificationCode, registerToken)

        if (user instanceof ExError) {
            return user
        }

        this._instance = new OwnedUser(user)
    }

    // Other

    public static get isLoggedIn(): boolean {
        return this._instance !== undefined
    }

    public static get instance(): OwnedUser | undefined {
        if (!this._instance) {
            return undefined
        }

        return this._instance
    }

    public static async isPasswordIsValid(password: string): Promise<boolean | ExError> {
        return isPasswordIsValid(password)
    }

    // Constructor

    private constructor({ id, username, email, moment }: IUser) {
        this._user = { id, username, email, moment }
    }
}

export { User, OwnedUser }
