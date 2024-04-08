import * as React from 'react';
import Svg, {Path, G, Defs, ClipPath} from 'react-native-svg';

const HelpCircleSvg = () => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={50} height={50} fill='none'>
    <Path fill='#FAF9FF' d='M.5.5h49v49H.5z' />
    <G
      stroke='#222'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.5}
      clipPath='url(#a)'
    >
      <Path d='M25 33.333a8.333 8.333 0 1 0 0-16.666 8.333 8.333 0 0 0 0 16.666Z' />
      <Path d='M22.575 22.5a2.5 2.5 0 0 1 4.858.833c0 1.667-2.5 2.5-2.5 2.5M25 29.167h.008' />
    </G>
    <Path stroke='#EEE' d='M.5.5h49v49H.5z' />
    <Defs>
      <ClipPath id='a'>
        <Path fill='#fff' d='M15 15h20v20H15z' />
      </ClipPath>
    </Defs>
  </Svg>
);

export default HelpCircleSvg;
