import { FC, useMemo, useRef } from "react"
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"
import { LeafletEventHandlerFnMap } from "leaflet"
import "leaflet/dist/leaflet.css"
import { maptilerApiKey } from "@shared/config"
import { imageImage } from "@assets/ui"

interface MapProps {
	onCoordsSelect: (coords: [number, number]) => void
}

const Map: FC<MapProps> = ({ onCoordsSelect }) => {
	const markerRef = useRef(null)
	const eventHandlers = useMemo<LeafletEventHandlerFnMap>(
		() => ({
			dragend() {
				if (!markerRef.current) {
					return
				}

				const marker = markerRef.current as L.Marker

				console.log(marker.getLatLng())
			},
		}),
		[],
	)

	return (
		<MapContainer
			center={[51.505, -0.09]}
			zoom={13}
			style={{ height: "30rem", width: "40rem", zIndex: 0 }}
		>
			<TileLayer
				attribution={`<a href="https:url={ //www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>`}
				url={`https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=${maptilerApiKey}`}
			/>
			<Marker
				position={[51.505, -0.09]}
				draggable
				ref={markerRef}
				eventHandlers={eventHandlers}
			>
				<Popup>
					A pretty CSS3 popup. <br /> Easily customizable.
				</Popup>
			</Marker>
		</MapContainer>
	)
}

export default Map
