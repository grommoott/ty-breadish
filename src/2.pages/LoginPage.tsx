import Header from "@widgets/Header"
import LoginWidget from "@widgets/LoginWidget"
import { FC } from "react"

const LoginPage: FC = () => {
	return (
		<>
			<Header />
			<div className="bg-zinc-900">
				<LoginWidget />
			</div>
		</>
	)
}

export default LoginPage
