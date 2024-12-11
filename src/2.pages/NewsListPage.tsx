import Header from "@widgets/Header"
import NewsList from "@widgets/NewsList"
import { FC } from "react"

const NewsListPage: FC = () => {
	return (
		<>
			<Header />
			<div className="bg-zinc-900">
				<NewsList />
			</div>
		</>
	)
}

export default NewsListPage
