import React, { useEffect, useMemo, useState } from "react";
import "./SimpleMap.css";
import SpinnerOfDoom from "../HomePage/SpinnerOfDoom";
import { Button, TextField, colors, Select, FormControl, InputLabel, MenuItem } from "@mui/material";

import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api";
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
import { UserTrips } from "./UserTrips";

const libraries = ['places']

export default function SimpleMap({MapProps}){
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyAzZKv1qMj4zuF5Q0eM5vmZonlrTjm6eZ8",
        libraries
    })
    const [coordLoaded, setCoordsLoaded] = React.useState(false);
    const [dProps, setDProps] = React.useState({});
    const [markers, setMarkers] = useState([]);
    const [loadingMarkers, setLoadingMarkers] = useState(true);
    const [desCreation, setDesCreation] = useState(false);

    //if mapProps is null, then load the markers from the database
    useEffect(() => {
        if (MapProps === null || MapProps === undefined){
            allDestinations(setMarkers, setLoadingMarkers);
            setDesCreation(true);
        } else {
            setMarkers(MapProps);
            setLoadingMarkers(false);
            setDesCreation(false);
        }
    }, [])

    React.useEffect(() => {
      if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(success, error);
      } else {
        console.log('Geolocation Not Supported')
      }
    }, [])

    function success(position) {
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

    if (!isLoaded && !coordLoaded && loadingMarkers) return <SpinnerOfDoom/>
    //What is this???
    //somehow the first if statement didn't work
    if (isLoaded){
        if (coordLoaded) {
            if (!loadingMarkers){
                return <Map props={dProps} markers={markers} create={desCreation} setMarkers={setMarkers}/>
            }
        }
    }
    return <SpinnerOfDoom/>
    
}

function Map({props, markers, create, setMarkers}){
    const [selected, setSelected] = useState(null);
    const [mapref, setMapRef] = useState(null);
    const [latlng, setLatLng] = useState([]);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [country, setCountry] = useState(null);
    const [mapCenter, setMapCenter] = useState(null);
    const [creating, setCreating] = useState(false);
    //every time latlng changes, update the map center
    useMemo(() => {
        //if selected is null then set to props.center
        if (selected === null) {
            setMapCenter(props.center)
        } else {    
            setMapCenter(selected)
        }
    }, [selected])
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

    const handleMarkerClick = (event) => {
        //log the lat and lng for the marker 
        console.log('You clicked on ' + event.latLng.lat() + ', ' + event.latLng.lng())
        //find the marker that was clicked on
        const marker = markers.find((val) => {
            return val.latitude === event.latLng.lat() && val.longitude === event.latLng.lng()
        })
        //set the selected marker to the marker that was clicked on
        setSelectedMarker(marker);
    }


    const handleNewLocation = async () => {
        const posinfo = await getGeocode({location: {lat: latlng[0], lng: latlng[1]}})
        const lastval = posinfo.length - 1;
        setCountry(posinfo[lastval].formatted_address)
        setCreating(true);
    }
    const handleAbortLocation = () => {
        setCreating(false);
    }

    return (
        <div className="map-popup">
            <div className="search-container">
                <SearchPlaces className={"search-box"} setSelected={setSelected}/>
            </div>
            {creating && <CreateLocation countryName={country} position={latlng} handleClose={handleAbortLocation} setMarkers={setMarkers} markers={markers}/>}
            <GoogleMap zoom={10} center={mapCenter} mapContainerClassName="map-container" onLoad={handleOnLoad} onCenterChanged={handleCenterChanged}>
                {markers.map((val, k) =>{ return <Marker key={k} position={{lat: val.latitude, lng: val.longitude}} onClick={handleMarkerClick} /> })}
                {selectedMarker && (
                    <InfoWindow className="marker-info" onCloseClick={() => setSelectedMarker(null)} position={{lat: selectedMarker.latitude, lng: selectedMarker.longitude}}>
                        <div>
                            <h2>{selectedMarker.name}</h2>
                            <h3>{selectedMarker.city}, {selectedMarker.country}</h3>
                            <h6>This is detailed location view, theres not much to show</h6>
                        </div>
                    </InfoWindow>
                )}
                <Marker position={{lat: latlng[0], lng: latlng[1]}} icon={{url: 'mapmarker.ico'}}/>
                {selected && <Marker position={{lat: selected.lat, lng: selected.lng}} icon={{url: 'mapmarker.ico'}}/>}
            </GoogleMap>
            {create && <button className="map-submit" onClick={handleNewLocation}>New Location</button>}
        </div>
    )
}


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
        const result = await getGeocode({ address: location });
        const {lat, lng} = await getLatLng(result[0]);
        setSelected({lat, lng})
    }

    return <Combobox onSelect={handleSelect}>
        <ComboboxInput value={value} onChange={(e)=> setValue(e.target.value)} disabled={!ready} className="comboboxinput" placeholder="Search Places"/>
    
        <ComboboxPopover>
            <ComboboxList className="suggestions-ls">
                {status === "OK" && data.map(({place_id, description}) => <ComboboxOption key={place_id} value={description}/>)}
            </ComboboxList>
        </ComboboxPopover>

    </Combobox>
}

const CreateLocation = ({countryName, position, handleClose, setMarkers, markers}) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [city, setCity] = useState("");
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState(false);
    const [trips, setTrips] = useState([]);
    const [loadingTrips, setLoadingTrips] = useState(true);
    const [selectedTrip, setSelectedTrip] = useState("");

    UserTrips({setTrips, setLoadingTrips});

    const handleSubmit = () => {
        //check if all fields are filled
        if (name === "" || description === "" || city === "" || selectedTrip === null){
            setUploadError(true);
            return;
        }
        setUploading(true);
        const destination = {
            name: name,
            city: city,
            country: countryName,
            latitude: position[0],
            longitude: position[1],
        }
        postNewLocation({destination, handleClose, setUploadError, setUploading, setMarkers, markers});
    }
    if (uploading || loadingTrips) return (
        <div className="create-location">
            <Button className="pop-close-button" onClick={handleClose}>
                <h1 style={{margin: "0", padding:"0"}}>X</h1>
            </Button>
            <h1>Uploading...</h1>
            <SpinnerOfDoom/>
        </div>
    )
    return (
        <div className="create-location">
            {uploadError && <h1 className="upload-error">Error Uploading, try again</h1>}
            <Button className="pop-close-button" onClick={handleClose}>
                <h1 style={{margin: "0", padding:"0"}}>X</h1>
            </Button>
            <h3>Location Name</h3>
            <TextField
                style={{ width: "100%", margin: "5px"}}
                type="text"
                label="Location Name"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <span style={{width: "100%"}}>
                <TextField
                    style={{ width: "45%", margin: "5px"}}
                    type="text"
                    label="City"
                    variant="outlined"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
                <TextField
                    style={{ width: "45%", margin: "5px"}}
                    type="text"
                    label= {countryName}
                    variant="outlined"
                    disabled
                />
            </span>
            <FormControl style={{width: "100%"}}>
                <InputLabel>Select Trip</InputLabel>
                <Select
                    value={selectedTrip}
                    onChange={(e) => setSelectedTrip(e.target.value)}
                    style={{ width: "100%", margin: "5px"}}
                    variant="outlined"
                    label="Select Trip"
                >
                    {trips.map((val) => {
                        return <MenuItem key={val.id} value={val.id}>|{val.name}|</MenuItem>
                    })}
                </Select>
            </FormControl>

                
            <h3>Location Description</h3>
            <TextField
                style={{ width: "100%", margin: "5px"}}
                type="text"
                label="Location Description"
                variant="outlined"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <Button style={{ marginTop: "10px" }} variant="contained" color="primary" className="new-trip-button" onClick={handleSubmit}>
                Post!
            </Button>
        </div>
    )
}

async function postNewLocation({destination, handleClose, setUploadError, setUploading, setMarkers, markers }){
    fetch('http://172.20.10.4:3000/api/v1/destinations', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem("token")
        },
        method: 'POST',
        body: JSON.stringify({
            destination
        })})    
    .then(response => {
        // Check if the response status code is in the range of 200-299 (successful)
        if (!response.ok) {
            setUploading(false);
            setUploadError(true);
            throw new Error('Network response was not ok');
        }

        // Parse the response as JSON
        return response.json();
    })
    .then(data => {
        // Handle the data here (e.g., update the UI)
        setMarkers([...markers, destination]);
        setUploading(false);
        handleClose();
    })
    .catch(error => {
        // Handle any errors that occurred during the fetch operation
        console.error('Fetch error:', error);
        setUploading(false);
        setUploadError(true);
    }); 
}



//Functions to load markers

async function allDestinations(setMarkers, setLoadingMarkers){
    const res = await fetch("http://172.20.10.4:3000/api/v1/destinations", {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem("token")
        },
        method: 'GET'
    })
    const data = await res.json()
    const markers = data.map((val) => {
        return {
            name: val.name,
            city: val.city,
            country: val.country,
            latitude: val.latitude,
            longitude: val.longitude
        }
    }
    )
    setMarkers(markers)
    setLoadingMarkers(false)
}
