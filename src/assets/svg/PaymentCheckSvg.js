import * as React from 'react';
import Svg, {G, Path, Defs, ClipPath} from 'react-native-svg';

const PaymentCheckSvg = () => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={14} height={10} fill='none'>
    <G clipPath='url(#a)'>
      <Path
        stroke='#00824B'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M12.333 1 5 8.333 1.667 5'
      />
    </G>
    <Defs>
      <ClipPath id='a'>
        <Path fill='#fff' d='M0 0h14v10H0z' />
      </ClipPath>
    </Defs>
  </Svg>
);

export default PaymentCheckSvg;
