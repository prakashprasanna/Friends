import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const MapPinSvg = () => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={50} height={50} fill='none'>
    <Path fill='#FAF9FF' d='M.5.5h49v49H.5z' />
    <Path
      stroke='#222'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.5}
      d='M32.5 23.333c0 5.834-7.5 10.834-7.5 10.834s-7.5-5-7.5-10.834a7.5 7.5 0 1 1 15 0Z'
    />
    <Path
      stroke='#222'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.5}
      d='M25 25.833a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z'
    />
    <Path stroke='#EEE' d='M.5.5h49v49H.5z' />
  </Svg>
);

export default MapPinSvg;
