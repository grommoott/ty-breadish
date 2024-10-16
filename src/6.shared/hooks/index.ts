import { AppDispatch, RootState } from "@shared/store";
import { NotificationsContext } from "@shared/ui/Notification";
import { PopupWindowContext } from "@shared/ui/PopupWindow";
import { useContext } from "react";
import { useSelector } from "react-redux";
import { TypedUseSelectorHook, useDispatch } from "react-redux";

const useNotification = () => {
    return useContext(NotificationsContext)
}

const usePopupWindow = () => {
    return useContext(PopupWindowContext)
}

const useAppDispatch = useDispatch<AppDispatch>
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export {
    useAppDispatch,
    useAppSelector,
    useNotification,
    usePopupWindow
}
