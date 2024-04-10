import * as React from 'react';
import { useContext } from "react";

import { AppContext } from '../context/AppContext';
import type {FeatureCollection} from 'geojson';

interface ControlPanelProps {
  titles: string[],
  polygons: FeatureCollection[]
}

function ControlPanel<ControlPanelProps>(props) {
  const [title, setTitle] = React.useState<string>("");
  const {savePolygon, getPolygon} = useContext(AppContext);

  const handleSave = () => {
    if (!title.length) alert("Please enter a title.")
    if (props?.polygons) savePolygon(title, props?.polygons)
  }

  const selectTitle = (t) => {
    console.log(t)
    getPolygon(t)
  }

  return (
    <div className="control-panel">
      <h3>Control</h3>
      <input
        onChange={e => setTitle(e.target.value)}
        value={title}
      />
      <button
        onClick={handleSave}
      >
        Save
      </button>
      {props?.titles.map(t => (
        <p onClick={() => selectTitle(t)}>{t}</p>
      ))}
    </div>
  );
}

export default React.memo(ControlPanel);