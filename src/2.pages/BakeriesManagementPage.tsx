import BakeriesList from "@widgets/BakeriesList"
import Header from "@widgets/Header"
import { FC } from "react"

const BakeriesManagementPage: FC = () => {
	return (
		<>
			<Header />
			<div className="bg-zinc-900">
				<BakeriesList />
			</div>
		</>
	)
}

export default BakeriesManagementPage
