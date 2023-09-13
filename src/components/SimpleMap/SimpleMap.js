import React, { useMemo, useState } from "react";
import "./SimpleMap.css";
import SpinnerOfDoom from "../HomePage/SpinnerOfDoom";

import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng
} from "use-places-autocomplete";

import {
	Combobox,
	ComboboxInput,
	ComboboxPopover,
	ComboboxList,
	ComboboxOption,
} from "@reach/combobox";
import { Height } from "@mui/icons-material";
import { width } from "@mui/system";

const libraries = ['places']

export default function SimpleMap(){
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyAzZKv1qMj4zuF5Q0eM5vmZonlrTjm6eZ8",
        libraries
    })
    const [coordLoaded, setCoordsLoaded] = React.useState(false);
    const [dProps, setDProps] = React.useState({});

    React.useEffect(() => {
      if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(success, error);
      } else {
        console.log('Geolocation Not Supported')
      }
    }, [])

    function success(position) {
      //console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
      setDProps({
        center: {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        },
        zoom: 11
      })
      setCoordsLoaded(true)
    }

    function error() {
      console.log("Unable to retrieve your location");
      setDProps({
        center: {
          lat: 0.00000,
          lng: 0.00000
        },
        zoom: 6
      })
      setCoordsLoaded(false)
    }

    if (!isLoaded && !coordLoaded) return <SpinnerOfDoom/>
    return <Map props={dProps}/>
}

function Map({props}){
    const [selected, setSelected] = useState(null);
    const [mapref, setMapRef] = useState(null);
    const [latlng, setLatLng] = useState([]);
    const [markers, setMarkers] = useState([]);
    const handleOnLoad = map => {
        setMapRef(map);
    }
    const handleCenterChanged = () => {
        if (mapref) {
            const newCenter = mapref.getCenter();
            setLatLng([newCenter.lat(), newCenter.lng()])
        }
    }
    const handleSetLocation = () =>{
        console.log('You placed your marker on ' + latlng[0] + ', ' + latlng[1])
    }

    const handleAddMarker = () => {
        const mcords = [latlng[0], latlng[1]]
        setMarkers(prevTags => [...prevTags, mcords])
        console.log(markers)
    }
    return (
        <div className="map-popup">
            <GoogleMap zoom={10} center={props.center} mapContainerClassName="map-container" onLoad={handleOnLoad} onCenterChanged={handleCenterChanged}>
                <Marker position={{lat: latlng[0], lng: latlng[1]}} />
                {markers.map((val) =>{ return <Marker position={{lat:val[0], lng:val[1]}} /> })}
            </GoogleMap>
            <div className="map-inputs">
                <input type="text" className="search-box"></input>
                <button className="map-submit" onClick={handleAddMarker}>Add</button>
            </div>
        </div>
    )
}
//<div className="search-container">{
//                    <SearchPlaces className={"search-box"} setSelected={setSelected}/>
//                </div>
//
const SearchPlaces = ({setSelected}) => {
    const {
        ready,
        value,
        setValue,
        suggestions: {status, data},
        clearSuggestions
    } = usePlacesAutocomplete();

    const handleSelect = async (location) => {
        setValue(location, false);
        clearSuggestions();

        const result = await getGeocode({location});
        const {lat, lng} = await getLatLng(result[0]);
        setSelected({lat, lng})
    }

    return <Combobox onSelect={handleSelect}>
        <ComboboxInput value={value} onChange={(e)=> setValue(e.target.value)} disabled={!ready} className="comboboxinput" placeholder="Search Places"/>
    
        <ComboboxPopover>
            <ComboboxList>
                {status === "OK" && data.map(({place_id, description}) => <ComboboxOption key={place_id} value={description}/>)}
            </ComboboxList>
        </ComboboxPopover>

    </Combobox>
}