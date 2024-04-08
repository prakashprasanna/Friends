import * as React from 'react';
import Svg, {G, Path, Defs, ClipPath} from 'react-native-svg';

const ArrowCloseSvg = () => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={11} height={6} fill='none'>
    <G clipPath='url(#a)'>
      <Path
        stroke='#222'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.2}
        d='m.857 1 4.286 4.286L9.428 1'
      />
    </G>
    <Defs>
      <ClipPath id='a'>
        <Path fill='#fff' d='M10.143 6V.286h-10V6z' />
      </ClipPath>
    </Defs>
  </Svg>
);

export default ArrowCloseSvg;
