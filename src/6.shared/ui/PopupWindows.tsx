import { ReactNode } from "react"
import { Button } from "./Buttons"

const agreeWindow = (content: ReactNode) => {
	return (closeWindow: (data: any) => void) => {
		return (
			<div className="flex flex-col items-center text-center">
				{content}
				<div className="flex flex-row items-center justify-center">
					<Button onClick={() => closeWindow(undefined)}>Нет</Button>
					<Button onClick={() => closeWindow("yes")}>Да</Button>
				</div>
			</div>
		)
	}
}

export { agreeWindow }
