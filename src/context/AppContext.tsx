import React from "react";
import { createContext, useState, useEffect } from "react";

import type {FeatureCollection} from 'geojson';

interface AppProps {
  titles: string[],
  polygons: FeatureCollection[],
  savePolygon: (
    title: string, 
    data: FeatureCollection[]
  ) => void,
  getPolygon: (title: string) => void
}

export const AppContext = createContext<AppProps>(null!);

const AppContextProvider = ({ children }) => {
  const [titles, setTitles] = useState<string[]>([]);
  const [polygons, setPolygons] = useState<FeatureCollection[]>([]);

  useEffect(() => {
    setTitles(JSON.parse(localStorage.getItem('titles'))??[])
    setPolygons(JSON.parse(localStorage.getItem('yr'))??[])
  }, [])

  const savePolygon = (title: string, data: FeatureCollection[]) => {
    const newTitles = [
      ...titles,
      title,
    ]
    setTitles(newTitles)
    localStorage.setItem(title, JSON.stringify(data))
    localStorage.setItem('titles', JSON.stringify(newTitles))
  }

  const getPolygon = (title: string) => {
    const geojson: FeatureCollection[] = JSON.parse(localStorage.getItem(title));
    setPolygons(geojson)
  }

  return (
    <AppContext.Provider value={{
      titles,
      polygons,
      savePolygon,
      getPolygon
    }}>
        {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
