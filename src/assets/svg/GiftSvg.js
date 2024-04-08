import * as React from 'react';
import Svg, {Path, G, Defs, ClipPath} from 'react-native-svg';

const GiftSvg = () => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={50} height={50} fill='none'>
    <Path fill='#FAF9FF' d='M.5.5h49v49H.5z' />
    <G
      stroke='#222'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.5}
      clipPath='url(#a)'
    >
      <Path d='M31.667 25v8.333H18.333V25M33.333 20.833H16.667V25h16.666v-4.167ZM25 33.333v-12.5M25 20.833h-3.75a2.083 2.083 0 1 1 0-4.166c2.917 0 3.75 4.166 3.75 4.166ZM25 20.833h3.75a2.083 2.083 0 0 0 0-4.166c-2.917 0-3.75 4.166-3.75 4.166Z' />
    </G>
    <Path stroke='#EEE' d='M.5.5h49v49H.5z' />
    <Defs>
      <ClipPath id='a'>
        <Path fill='#fff' d='M15 15h20v20H15z' />
      </ClipPath>
    </Defs>
  </Svg>
);

export default GiftSvg;
