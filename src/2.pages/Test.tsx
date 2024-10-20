import { New } from "@shared/facades"
import { ExError } from "@shared/helpers"
import { NewId } from "@shared/model/types/primitives"
import { AnimatedFullLogo } from "@shared/ui/Logos"
import { ReactElement, useEffect, useState } from "react"
import NewWrapper from "@entities/NewWrapper"
import LikeButton from "@features/LikeButton"
import { LikeTypes } from "@shared/model/types/enums"

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
			<AnimatedFullLogo />

			{aNew && (
				<NewWrapper
					aNew={aNew}
					likeButton={(onChange) => (
						<LikeButton
							likeType={LikeTypes.Media}
							id={aNew.id}
							onChange={onChange}
						/>
					)}
				/>
			)}

			<div className="h-60" />
		</div>
	)
}
