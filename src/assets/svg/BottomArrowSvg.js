import * as React from 'react';
import Svg, {G, Path, Defs, ClipPath} from 'react-native-svg';

const BottomArrowSvg = () => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={8} height={5} fill='none'>
    <G clipPath='url(#a)'>
      <Path
        stroke='#666'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.2}
        d='M.8.8 4 4 7.2.8'
      />
    </G>
    <Defs>
      <ClipPath id='a'>
        <Path fill='#fff' d='M8 0v4.8H0V0z' />
      </ClipPath>
    </Defs>
  </Svg>
);

export default BottomArrowSvg;
