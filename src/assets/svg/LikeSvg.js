import * as React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';

const LikeSvg = ({fillColor, strokeColor = '#222222'}) => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={50} height={50} fill='none'>
    <Circle cx={25} cy={25} r={24.5} fill='#fff' stroke='#F6F5FB' />
    <Path
      fill={fillColor}
      stroke={strokeColor}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.2}
      d='M32.367 18.842a4.584 4.584 0 0 0-6.483 0l-.884.883-.883-.883a4.584 4.584 0 0 0-6.483 6.483l.883.883L25 32.692l6.484-6.484.883-.883a4.585 4.585 0 0 0 0-6.483v0Z'
    />
  </Svg>
);

export default LikeSvg;
