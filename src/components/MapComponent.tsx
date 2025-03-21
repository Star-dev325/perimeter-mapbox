import * as React from 'react';
import {
  useState, 
  useEffect, 
  // useCallback, 
  useContext
} from 'react';
import Map from 'react-map-gl';

import DrawControl from './DrawControl';
// import ControlPanel from './ControlPanel';

import { AppContext } from '../context/AppContext';

const TOKEN = 'pk.eyJ1IjoiY3J2ZW5pMTk4OCIsImEiOiJjbHVsejdmcjEwbmUwMmpwN3VxYjNqcXlnIn0.FEkp4XJOMmXQtri6lg-W9Q'; // Set your mapbox token here

export default function MapComponent() {
  const {titles, polygons} = useContext(AppContext);
  const [initFeatures, setInitFeatures] = useState([]);
  // const [features, setFeatures] = useState([]);

  useEffect(() => {
    if (polygons) setInitFeatures(polygons)
      console.log(polygons)
  }, [polygons])

  useEffect(() => console.log(titles), [titles])

  // const onUpdate = useCallback(e => {
  //   setFeatures(currFeatures => {
  //     const newFeatures = {...currFeatures};
  //     for (const f of e.features) {
  //       newFeatures[f.id] = f;
  //     }
  //     return newFeatures;
  //   });
  // }, []);

  // const onDelete = useCallback(e => {
  //   setFeatures(currFeatures => {
  //     const newFeatures = {...currFeatures};
  //     for (const f of e.features) {
  //       delete newFeatures[f.id];
  //     }
  //     return newFeatures;
  //   });
  // }, []);

  return (
    <div className='perimeter-map'>
      <Map
        initialViewState={{
          longitude: -91.874,
          latitude: 42.76,
          zoom: 12
        }}
        mapStyle="mapbox://styles/mapbox/satellite-v9"
        mapboxAccessToken={TOKEN}
      >
        <DrawControl
          position="top-left"
          displayControlsDefault={false}
          controls={{
            polygon: true,
            trash: true
          }}
          defaultMode="draw_polygon"
          // onCreate={onUpdate}
          // onUpdate={onUpdate}
          // onDelete={onDelete}
          addData={initFeatures}
        />
        {/* <ControlPanel polygons={features} titles={titles} /> */}
      </Map>
    </div>
  );
}