import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const RightArrowSvg = () => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={8} height={12} fill='none'>
    <Path
      stroke='#222'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.5}
      d='M1.2 10.8 6 6 1.2 1.2'
    />
  </Svg>
);

export default RightArrowSvg;
