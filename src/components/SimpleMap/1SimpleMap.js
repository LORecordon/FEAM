import React from "react";
import GoogleMapReact from 'google-map-react';
import SpinnerOfDoom from "../HomePage/SpinnerOfDoom";
import './SimpleMap.css';


//const AnyReactComponent = ({ text }) => <div className="pin">{text}</div>;
const AnyReactComponent = ({ text }) => <div className="pin1"></div>

export default function SimpleMap(){
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


  //const defaultProps = {
  //  center: {
  //    lat: 20.99835602,
   //   lng: 77.01502627
   // },
  //  zoom: 11
  //};

  console.log('rendering')
  return (
    // Important! Always set the container height explicitly
    <div style={{width: '100%'}}>
      <h1>  </h1>
      {coordLoaded
        ? <div style={{ height: '60vh', width: '80%' }}>
          <GoogleMapReact
            bootstrapURLKeys={{ key: "AIzaSyAzZKv1qMj4zuF5Q0eM5vmZonlrTjm6eZ8" }}
            defaultCenter={dProps.center}
            defaultZoom={dProps.zoom}
          >
            <AnyReactComponent
              lat={dProps.center.lat}
              lng={dProps.center.lng}
              text="You"
            />
          </GoogleMapReact>
        </div>
        :<SpinnerOfDoom />
      }
    </div>
  );
}