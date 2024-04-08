import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const HeartSvg = ({fillColor, strokeColor = '#222222'}) => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={13} height={13} fill='none'>
    <Path
      fill={fillColor}
      stroke={strokeColor}
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M11.288 2.497a2.978 2.978 0 0 0-4.214 0l-.574.574-.574-.574a2.98 2.98 0 1 0-4.214 4.214l.574.574L6.5 11.5l4.214-4.215.574-.574a2.979 2.979 0 0 0 0-4.214v0Z'
    />
  </Svg>
);

export default HeartSvg;
