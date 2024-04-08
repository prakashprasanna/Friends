import * as React from 'react';
import Svg, {Rect, Path} from 'react-native-svg';

const AddButtonSvg = () => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={50} height={50} fill='none'>
    <Rect width={49} height={49} x={0.5} y={0.5} fill='#fff' rx={24.5} />
    <Path
      stroke='#222'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.2}
      d='M25 18.583v12.834M18.624 25h12.752'
    />
    <Rect width={49} height={49} x={0.5} y={0.5} stroke='#F6F5FB' rx={24.5} />
  </Svg>
);

export default AddButtonSvg;
