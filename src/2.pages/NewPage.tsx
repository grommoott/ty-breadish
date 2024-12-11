import { New } from "@shared/facades"
import { ExError } from "@shared/helpers"
import { NewId } from "@shared/model/types/primitives"
import Header from "@widgets/Header"
import NewWidget from "@widgets/NewWidget"
import { FC, useEffect, useState } from "react"
import { useParams } from "react-router-dom"

const NewPage: FC = () => {
	const params = useParams()
	const [aNew, setNew] = useState<New>()

	useEffect(() => {
		;(async () => {
			const id = params["id"]

			if (!id) {
				console.error("There is no id in params")
				return
			}

			const newId = new NewId(id)

			if (!newId) {
				console.error("Invalid new's id")
				return
			}

			const response = await New.fromId(newId)

			if (response instanceof ExError) {
				console.error(response)
				return
			}

			setNew(response)
		})()
	}, [params])

	return (
		<>
			<Header />
			<div className="bg-zinc-900">
				<NewWidget aNew={aNew} />
			</div>
		</>
	)
}

export default NewPage
