import { AnimatedFullLogo } from "@shared/ui/Logos"
import RecipeChangeForm from "@widgets/RecipeChangeForm"
import { ReactElement } from "react"

export default function Test(): ReactElement {
	return (
		<div className="bg-zinc-900 flex flex-col items-center justify-center">
			<AnimatedFullLogo />

			<RecipeChangeForm />

			<div className="h-60" />
		</div>
	)
}
