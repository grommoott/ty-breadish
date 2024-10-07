import { featuredActivatedImage, featuredImage } from "@assets/ui"
import { Featured, OwnedUser } from "@shared/facades"
import { ExError } from "@shared/helpers"
import { ItemType } from "@shared/model/types/enums"
import { ItemId } from "@shared/model/types/primitives"
import { SimpleButton } from "@shared/ui/Buttons"
import { FC, useState } from "react"

interface FeaturedButtonProps {
	itemId: ItemId
	itemType: ItemType
}

const FeaturedButton: FC<FeaturedButtonProps> = ({ itemId, itemType }) => {
	const [isFeatured, setFeatured] = useState(
		OwnedUser.instance?.featured?.findIndex(
			(val) => val.target.id == itemId.id,
		) != -1,
	)

	return (
		<SimpleButton
			onClick={async () => {
				if (isFeatured) {
					const index = OwnedUser.instance?.featured?.findIndex(
						(val) => val.target.id == itemId.id,
					)

					if (index == -1 || index == undefined) {
						return
					}

					setFeatured(false)

					const response = await OwnedUser.instance?.featured
						?.at(index)
						?.delete()

					OwnedUser.instance?.featured?.splice(index, 1)

					if (response instanceof ExError) {
						setFeatured(true)
						console.error(response)
						return
					}
				} else {
					setFeatured(true)

					const response = await Featured.create(itemId, itemType)

					if (response instanceof ExError) {
						setFeatured(false)
						console.error(response)
						return
					}

					OwnedUser.instance?.featured?.push(response)
				}
			}}
		>
			<img
				src={isFeatured ? featuredActivatedImage : featuredImage}
				className="h-12"
			/>
		</SimpleButton>
	)
}

export default FeaturedButton
