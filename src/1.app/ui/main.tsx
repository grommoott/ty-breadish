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
import MainPage from "@pages/MainPage"
import HomePage from "@pages/HomePage"
import LoginPage from "@pages/LoginPage"
import BasketPage from "@pages/BasketPage"
import ProductPage from "@pages/ProductPage"
import RecipePage from "@pages/RecipePage"
import { fetchProducts } from "@shared/store/actionCreators/product"
import { fetchRecipes } from "@shared/store/actionCreators/recipe"
import RecipesListPage from "@pages/RecipesListPage"
import ProductsListPage from "@pages/ProductsListPage"
import fetchBakeries from "@shared/store/actionCreators/bakeries"
import OrderCreationPage from "@pages/OrderCreationPage"
import NewsListPage from "@pages/NewsListPage"
import NewPage from "@pages/NewPage"

const router = createBrowserRouter([
	{
		path: "/test",
		element: <Test />,
	},
	{
		path: "/",
		element: <MainPage />,
	},
	{
		path: "/homePage",
		element: <HomePage />,
	},
	{
		path: "/login",
		element: <LoginPage />,
	},
	{
		path: "/basket",
		element: <BasketPage />,
	},
	{
		path: "/products/id/:id",
		element: <ProductPage />,
	},
	{
		path: "/recipes/id/:id",
		element: <RecipePage />,
	},
	{
		path: "/products",
		element: <ProductsListPage />,
	},
	{
		path: "/recipes",
		element: <RecipesListPage />,
	},
	{
		path: "/orderCreation",
		element: <OrderCreationPage />,
	},
	{
		path: "/news",
		element: <NewsListPage />,
	},
	{
		path: "/news/id/:id",
		element: <NewPage />,
	},
])

async function initialization(): Promise<void> {
	await Promise.all([
		(async () => {
			await OwnedUser.refreshToken()
			await OwnedUser.instance?.initialize()
		})(),
		store.dispatch(fetchProducts()),
		store.dispatch(fetchRecipes()),
		store.dispatch(fetchBakeries()),
	])
}

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
			<NotificationsProvider>
				<PopupWindowProvider>
					<RouterProvider router={router} />
				</PopupWindowProvider>
			</NotificationsProvider>
		</PageSizeProvider>
	)
}

initialization().then(() =>
	ReactDOM.createRoot(document.getElementById("root")!).render(
		<React.StrictMode>
			<Provider store={store}>
				<PageSizeProviderWrapper />
			</Provider>
		</React.StrictMode>,
	),
)
