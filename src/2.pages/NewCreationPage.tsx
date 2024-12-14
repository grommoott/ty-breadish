import Header from "@widgets/Header"
import NewChangeForm from "@widgets/NewChangeForm"
import { FC } from "react"

const NewCreationPage: FC = () => {
	return (
		<>
			<Header />

			<div className="bg-zinc-900 flex flex-col items-center">
				<NewChangeForm />
			</div>
		</>
	)
}

export default NewCreationPage
