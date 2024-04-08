import * as React from 'react';
import Svg, {G, Path, Defs, ClipPath} from 'react-native-svg';

const StarSvg = () => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={12} height={12} fill='none'>
    <G clipPath='url(#a)'>
      <Path
        fill='#CFC819'
        stroke='#CFC819'
        strokeLinecap='round'
        strokeLinejoin='round'
        d='m6 1 1.545 3.13L11 4.635 8.5 7.07l.59 3.44L6 8.885 2.91 10.51l.59-3.44L1 4.635l3.455-.505L6 1Z'
      />
    </G>
    <Defs>
      <ClipPath id='a'>
        <Path fill='#fff' d='M0 0h12v12H0z' />
      </ClipPath>
    </Defs>
  </Svg>
);

export default StarSvg;
