import { ExError } from "@shared/helpers"
import { Email, Moment, UserId } from "@shared/model/types/primitives"
import { Role } from "../types/enums"

interface IUser {
    id: UserId,
    username: string,
    email: Email,
    moment: Moment,
    role: Role
}

function responseDataToUser(data: any): IUser {
    if (!(
        "id" in data &&
        "username" in data &&
        "email" in data &&
        "moment" in data &&
        "role" in data
    )) {
        throw new ExError("Invalid response data to convert into IUser", 500)
    }

    return {
        id: new UserId(data.id),
        username: data.username,
        email: new Email(data.email),
        moment: new Moment(data.moment),
        role: data.role
    }
}

export { IUser, responseDataToUser }
