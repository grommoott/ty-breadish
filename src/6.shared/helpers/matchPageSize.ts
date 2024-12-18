import { PageSize, PageSizes } from "@shared/enums"

function matchPageSize(pageWidth: number): PageSize {
    if (pageWidth < PageSizes.ExtraSmall) {
        return PageSizes.ExtraSmall
    } else if (pageWidth < PageSizes.IPhone) {
        return PageSizes.ExtraSmall
    } else if (pageWidth < PageSizes.Small) {
        return PageSizes.IPhone
    } else if (pageWidth < PageSizes.SmallMedium) {
        return PageSizes.Small
    } else if (pageWidth < PageSizes.Medium) {
        return PageSizes.SmallMedium
    } else if (pageWidth < PageSizes.Large) {
        return PageSizes.Medium
    } else if (pageWidth < PageSizes.XL) {
        return PageSizes.Large
    } else if (pageWidth < PageSizes.XXL) {
        return PageSizes.XL
    } else {
        return PageSizes.XXL
    }
}


export { matchPageSize }
