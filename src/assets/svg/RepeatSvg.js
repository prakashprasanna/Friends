import * as React from 'react';
import Svg, {G, Path, Defs, ClipPath} from 'react-native-svg';

const RepeatSvg = () => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={16} height={16} fill='none'>
    <G
      stroke='#222'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.5}
      clipPath='url(#a)'
    >
      <Path d='M11.333.667 14 3.333 11.333 6' />
      <Path d='M2 7.333V6a2.667 2.667 0 0 1 2.667-2.667H14M4.667 15.333 2 12.667 4.667 10' />
      <Path d='M14 8.667V10a2.667 2.667 0 0 1-2.667 2.667H2' />
    </G>
    <Defs>
      <ClipPath id='a'>
        <Path fill='#fff' d='M0 0h16v16H0z' />
      </ClipPath>
    </Defs>
  </Svg>
);

export default RepeatSvg;
