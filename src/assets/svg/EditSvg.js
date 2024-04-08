import * as React from 'react';
import Svg, {Rect, Path} from 'react-native-svg';

const EditSvg = () => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={40} height={40} fill='none'>
    <Rect width={39} height={39} x={0.5} y={0.5} fill='#fff' rx={19.5} />
    <Path
      stroke='#222'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.5}
      d='M20 25.333h6M23 14.333a1.414 1.414 0 0 1 2 2l-8.333 8.334-2.667.666.667-2.666L23 14.333Z'
    />
    <Rect width={39} height={39} x={0.5} y={0.5} stroke='#F6F5FB' rx={19.5} />
  </Svg>
);

export default EditSvg;
