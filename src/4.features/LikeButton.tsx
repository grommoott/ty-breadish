import { likedImage, likeImage } from "@assets/ui"
import { Like, OwnedUser } from "@shared/facades"
import { ExError } from "@shared/helpers"
import { LikeType } from "@shared/model/types/enums"
import { Id } from "@shared/model/types/primitives"
import { SimpleButton } from "@shared/ui/Buttons"
import { FC, useState } from "react"

interface LikeButtonProps {
	onChange?: (value: boolean) => void
	likeType: LikeType
	id: Id
}

const LikeButton: FC<LikeButtonProps> = ({
	onChange = () => {},
	likeType,
	id,
}) => {
	const [isLiked, setLiked] = useState<boolean>(
		OwnedUser.instance?.likes?.findIndex(
			(val) => val.target.id == id.id && val.type == likeType,
		) != -1,
	)
	const [like, setLike] = useState<Like | undefined>(
		OwnedUser.instance?.likes?.find((val) => val.target.id == id.id),
	)

	const onClick = async () => {
		const isLikedBuf = !isLiked
		setLiked(isLikedBuf)
		onChange(isLikedBuf)

		if (isLikedBuf) {
			const response = await Like.create(id, likeType)

			if (response instanceof ExError) {
				console.error(response)
				return
			}

			setLike(response)
		} else {
			const response = await like?.delete()

			if (response instanceof ExError) {
				console.error(response)
				return
			}

			setLike(undefined)
		}
	}

	return (
		<SimpleButton
			className="size-12"
			onClick={onClick}
		>
			<img
				src={isLiked ? likedImage : likeImage}
				className="h-12"
			/>
		</SimpleButton>
	)
}

export default LikeButton
