import { New } from "@shared/facades"
import { ExError } from "@shared/helpers"
import { NewId } from "@shared/model/types/primitives"
import Loading from "@shared/ui/Loading"
import Header from "@widgets/Header"
import NewChangeForm from "@widgets/NewChangeForm"
import { FC, useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"

const NewChangingPage: FC = () => {
	const params = useParams()
	const id = useMemo(() => {
		const param = params["id"]

		if (!param) {
			console.error('There is no "id" param')
			return
		}

		return new NewId(param)
	}, [params])

	const [aNew, setNew] = useState<New>()

	const [isLoading, setLoading] = useState(false)

	useEffect(() => {
		;(async () => {
			if (!id) {
				return
			}

			setLoading(true)
			const response = await New.fromId(id)

			if (response instanceof ExError) {
				console.error(response)
				setLoading(false)
				return
			}

			setLoading(false)
			setNew(response)
		})()
	}, [id])

	return (
		<>
			<Header />

			<div className="bg-zinc-900 flex flex-col items-center">
				{isLoading ? (
					<div className="m-4 p-4 rounded-3xl bg-[var(--dark-color)]">
						<Loading />
					</div>
				) : (
					<NewChangeForm aNew={aNew} />
				)}
			</div>
		</>
	)
}

export default NewChangingPage
