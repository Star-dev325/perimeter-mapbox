import MapboxDraw from '@mapbox/mapbox-gl-draw';

import type {ControlPosition} from 'react-map-gl';
import type {FeatureCollection} from 'geojson';

type DrawControlProps = ConstructorParameters<typeof MapboxDraw>[0] & {
  position?: ControlPosition;
  addData?: FeatureCollection[];

  onCreate?: (evt: {features: object[]}) => void;
  onUpdate?: (evt: {features: object[]; action: string}) => void;
  onDelete?: (evt: {features: object[]}) => void;
};

export default function DrawControl(props: DrawControlProps) {
  new MapboxDraw(props)
  
  return null;
}

DrawControl.defaultProps = {
  onCreate: () => {},
  onUpdate: () => {},
  onDelete: () => {},
};