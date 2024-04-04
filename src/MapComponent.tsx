import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { Point, Polygon } from './types';

mapboxgl.accessToken = '...';

const MapComponent: React.FC = () => {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [currentPolygonName, setCurrentPolygonName] = useState<string>('');

  useEffect(() => {
    const newMap = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [0, 0],
      zoom: 1,
    });

    newMap.on('load', () => {
      setMap(newMap);
    });

    newMap.on('click', (e) => {
      const newPoint = {
        lng: e.lngLat.lng,
        lat: e.lngLat.lat,
      };
      setPoints([...points, newPoint]);
    });

    return () => {
      newMap.remove();
    };
  }, [points]);

  const savePolygon = () => {
    // Logic to save the polygon
    const polygon: Polygon = {
      points: points,
      name: currentPolygonName,
    };
    console.log('Polygon:', polygon);
  };

  const clearPoints = () => {
    setPoints([]);
    setCurrentPolygonName('');
  };

  return (
    <div>
      <div id="map" style={{ width: '800px', height: '600px' }}></div>
      <button onClick={savePolygon}>Save Polygon</button>
      <button onClick={clearPoints}>Clear Points</button>
      <input
        type="text"
        placeholder="Polygon Name"
        value={currentPolygonName}
        onChange={(e) => setCurrentPolygonName(e.target.value)}
      />
    </div>
  );
};

export default MapComponent;