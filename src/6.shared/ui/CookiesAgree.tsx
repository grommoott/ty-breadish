import { usePopupWindow } from "@shared/hooks"
import { FC, useEffect } from "react"
import { cookiesAgreeWindow } from "./PopupWindows"

const CookiesAgree: FC = () => {
	const popupWindow = usePopupWindow()

	useEffect(() => {
		const isAgreed = localStorage.getItem("agreedCookies")

		if (isAgreed == null) {
			;(async () => {
				const result = await popupWindow(cookiesAgreeWindow)

				if (result == "agreed") {
					localStorage.setItem("agreedCookies", "")
				}
			})()
		}
	}, [])

	return <></>
}

export default CookiesAgree
