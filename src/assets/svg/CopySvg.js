import * as React from 'react';
import Svg, {G, Path, Defs, ClipPath} from 'react-native-svg';

const CopySvg = () => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={16} height={16} fill='none'>
    <G
      stroke='#666'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.2}
      clipPath='url(#a)'
    >
      <Path d='M13.333 6h-6C6.597 6 6 6.597 6 7.333v6c0 .737.597 1.334 1.333 1.334h6c.737 0 1.334-.597 1.334-1.334v-6c0-.736-.597-1.333-1.334-1.333Z' />
      <Path d='M3.333 10h-.666a1.333 1.333 0 0 1-1.334-1.333v-6a1.333 1.333 0 0 1 1.334-1.333h6A1.333 1.333 0 0 1 10 2.667v.667' />
    </G>
    <Defs>
      <ClipPath id='a'>
        <Path fill='#fff' d='M0 0h16v16H0z' />
      </ClipPath>
    </Defs>
  </Svg>
);

export default CopySvg;
