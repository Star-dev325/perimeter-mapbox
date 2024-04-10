import * as React from 'react';
import { useEffect } from 'react';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import {useControl} from 'react-map-gl';

import type {MapRef, ControlPosition} from 'react-map-gl';
import type {FeatureCollection} from 'geojson';

type DrawControlProps = ConstructorParameters<typeof MapboxDraw>[0] & {
  position?: ControlPosition;
  addData?: FeatureCollection[];

  onCreate?: (evt: {features: object[]}) => void;
  onUpdate?: (evt: {features: object[]; action: string}) => void;
  onDelete?: (evt: {features: object[]}) => void;
};

export default function DrawControl(props: DrawControlProps) {
  let draw = new MapboxDraw(props)
  useControl<MapboxDraw>(
    () => draw,
    ({map}: {map}) => {
      map.on('draw.create', props.onCreate);
      map.on('draw.update', props.onUpdate);
      map.on('draw.delete', props.onDelete);
      map.on('load', function() {
        for (const key in props.addData) {
          console.log(props.addData[key])
          draw.add(props.addData[key]); 
        }
      });
    },
    {
      position: props.position
    }
  );
  return null;
}

DrawControl.defaultProps = {
  onCreate: () => {},
  onUpdate: () => {},
  onDelete: () => {},
};