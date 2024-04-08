import * as React from 'react';
import {useState, useCallback} from 'react';
import {createRoot} from 'react-dom/client';
import Map from 'react-map-gl';

import DrawControl from './DrawControl';

const TOKEN = 'pk.eyJ1IjoiY3J2ZW5pMTk4OCIsImEiOiJjbHVsejdmcjEwbmUwMmpwN3VxYjNqcXlnIn0.FEkp4XJOMmXQtri6lg-W9Q'; // Set your mapbox token here

const defaultPolygon = {
    "52074af5b042fd9eeb485e24a14533e9": {
        "id": "52074af5b042fd9eeb485e24a14533e9",
        "type": "Feature",
        "properties": {},
        "geometry": {
            "coordinates": [
                [
                    [
                        -91.87030928039604,
                        42.78022523095402
                    ],
                    [
                        -91.83065550231979,
                        42.76384393221136
                    ],
                    [
                        -91.87391416931227,
                        42.75161814062673
                    ],
                    [
                        -91.90137998962443,
                        42.76081921866469
                    ],
                    [
                        -91.87030928039604,
                        42.78022523095402
                    ]
                ]
            ],
            "type": "Polygon"
        }
    }
}

export default function MapComponent() {
  const [features, setFeatures] = useState([]);

  React.useEffect(() => console.log(features), [features])

  const onUpdate = useCallback(e => {
    setFeatures(currFeatures => {
      const newFeatures = {...currFeatures};
      for (const f of e.features) {
        newFeatures[f.id] = f;
      }
      return newFeatures;
    });
  }, []);

  const onDelete = useCallback(e => {
    setFeatures(currFeatures => {
      const newFeatures = {...currFeatures};
      for (const f of e.features) {
        delete newFeatures[f.id];
      }
      return newFeatures;
    });
  }, []);

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
          onCreate={onUpdate}
          onUpdate={onUpdate}
          onDelete={onDelete}
          defaultData={defaultPolygon}
        />
      </Map>
    </div>
  );
}