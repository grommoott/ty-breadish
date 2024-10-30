import { New } from "@shared/facades"
import { ExError } from "@shared/helpers"
import { NewId } from "@shared/model/types/primitives"
import NewWidget from "@widgets/NewWidget"
import { ReactElement, useEffect, useState } from "react"

export default function Test(): ReactElement {
	const [aNew, setNew] = useState<New>()

	useEffect(() => {
		;(async () => {
			const response = await New.fromId(new NewId(0))

			if (response instanceof ExError) {
				console.error(response)
				return
			}

			setNew(response)
		})()
	}, [])

	return (
		<div className="bg-zinc-900 flex flex-col items-center justify-center">
			{/* <AnimatedFullLogo /> */}

			<NewWidget aNew={aNew} />

			<div className="h-60" />
		</div>
	)
}
