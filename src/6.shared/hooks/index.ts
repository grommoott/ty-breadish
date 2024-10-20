import { usePageSize } from "@shared/contexts";
import { PageSizes } from "@shared/enums";
import { AppDispatch, RootState } from "@shared/store";
import { NotificationsContext } from "@shared/ui/Notification";
import { PopupWindowContext } from "@shared/ui/PopupWindow";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { TypedUseSelectorHook, useDispatch } from "react-redux";

const useNotification = () => {
    return useContext(NotificationsContext)
}

const usePopupWindow = () => {
    return useContext(PopupWindowContext)
}

const useDefaultWidgetWidth = () => {
    const pageSize = usePageSize()
    const [width, setWidth] = useState(50)

    useEffect(() => {
        if (pageSize > PageSizes.XXL) {
            setWidth(50)
        } else if (pageSize > PageSizes.XL) {
            setWidth(60)
        } else if (pageSize > PageSizes.SmallMedium) {
            setWidth(75)
        } else if (pageSize > PageSizes.Small) {
            setWidth(90)
        }
    }, [pageSize])

    return width
}

const useListNewWidth = () => {
    const pageSize = usePageSize()
    const [width, setWidth] = useState(0)

    useEffect(() => {
        if (pageSize < PageSizes.SmallMedium) {
            setWidth(90)
        } else if (pageSize < PageSizes.XL) {
            setWidth(70)
        } else {
            setWidth(50)
        }

        return
    }, [pageSize])

    return width
}

const useAppDispatch = useDispatch<AppDispatch>
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export {
    useAppDispatch,
    useAppSelector,
    useNotification,
    usePopupWindow,
    useDefaultWidgetWidth,
    useListNewWidth
}
