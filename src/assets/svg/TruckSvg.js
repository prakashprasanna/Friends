import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const TruckSvg = () => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={50} height={50} fill='none'>
    <Path fill='#FAF9FF' d='M.5.5h49v49H.5z' />
    <Path
      stroke='#222'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.35}
      d='M28.333 17.5h-12.5v10.833h12.5V17.5ZM28.333 21.667h3.334l2.5 2.5v4.166h-5.834v-6.666ZM19.583 32.5a2.083 2.083 0 1 0 0-4.167 2.083 2.083 0 0 0 0 4.167Z'
    />
    <Path
      stroke='#222'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.35}
      d='M30.417 32.5a2.083 2.083 0 1 0 0-4.167 2.083 2.083 0 0 0 0 4.167Z'
    />
    <Path stroke='#EEE' d='M.5.5h49v49H.5z' />
  </Svg>
);

export default TruckSvg;
