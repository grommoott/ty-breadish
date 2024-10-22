import React, { FC, useState } from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import "./markdown-container.css"
import { Provider } from "react-redux"
import store from "@shared/store"
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import Test from "@pages/Test"
import { PageSizeProvider } from "@shared/contexts"
import { PageSize, PageSizes } from "@shared/enums"
import NotificationsProvider from "@shared/ui/Notification"
import PopupWindowProvider from "@shared/ui/PopupWindow"
import { OwnedUser } from "@shared/facades"

const router = createBrowserRouter([
	{
		path: "/",
		element: <Test />,
	},
])

await OwnedUser.login("grommoott", "1234")
await OwnedUser.instance?.initialize()

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

const PageSizeProviderWrapper: FC = () => {
	const [pageSize, setPageSize] = useState(matchPageSize(window.innerWidth))

	window.onresize = () => {
		setPageSize(matchPageSize(window.innerWidth))
	}

	return (
		<PageSizeProvider value={pageSize}>
			<RouterProvider router={router} />
		</PageSizeProvider>
	)
}

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<Provider store={store}>
			<NotificationsProvider>
				<PopupWindowProvider>
					<PageSizeProviderWrapper />
				</PopupWindowProvider>
			</NotificationsProvider>
		</Provider>
	</React.StrictMode>,
)
