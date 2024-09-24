import { FC } from "react"

const Star: FC<{ fillRatio: number; size?: string }> = ({
	fillRatio,
	size = "2rem",
}) => {
	return (
		<svg
			style={{ height: size }}
			viewBox="0 0 423.33332 423.33333"
		>
			<defs>
				<linearGradient
					id={`gradient-${fillRatio}`}
					x1="0.1"
					x2="0.9"
					y1="0"
					y2="0"
				>
					<stop
						offset="0%"
						stopColor="#ffdf3f"
					/>

					<stop
						offset={`${fillRatio * 100}%`}
						stopColor="#ffdf3f"
					/>

					<stop
						offset={`${fillRatio * 100}%`}
						stopColor="#ffdf3f00"
					/>

					<stop
						offset="100%"
						stopColor="#ffdf3f00"
					/>
				</linearGradient>
			</defs>
			<path
				stroke="#ffdf3f"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={20}
				fill={`url(#gradient-${fillRatio})`}
				d="m 211.66666,66.145828 32.7599,100.430692 105.63863,0.12173 -85.39189,62.19131 32.52835,100.50592 -85.53499,-61.99435 -85.535,61.99435 32.52836,-100.50592 -85.391894,-62.19132 105.638624,-0.12172 z"
			/>
		</svg>
	)
}

export default Star
