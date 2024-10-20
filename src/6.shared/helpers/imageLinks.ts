import { backendBaseUrl } from "@shared/config"
import { ImageId } from "@shared/model/types/primitives"

function searchImageIds(text: string): ImageId[] {
    const result = new Array<ImageId>()

    const matches = text.matchAll(
        /!\[[^\]]*\]\(image:([0-9]*) "[^"]*"\)/gm,
    )

    for (const match of matches) {
        if (match[1] == "") {
            continue
        }

        result.push(new ImageId(match[1]))
    }

    return result
}

function replaceImageIds(text: string): string {
    return text.replace(
        /!\[([^\]]*)\]\(image:([0-9]*) "([^"]*)"\)/gm,
        (_, alt, id, name) => {
            return `![${alt}](${backendBaseUrl}/api/images/id/${id} "${name}")`
        },
    )
}

export { searchImageIds, replaceImageIds }
