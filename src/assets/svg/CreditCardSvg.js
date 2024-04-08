import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const CreditCardSvg = () => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={50} height={50} fill='none'>
    <Path fill='#FAF9FF' d='M.5.5h49v49H.5z' />
    <Path
      stroke='#222'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.5}
      d='M32.5 18.333h-15c-.92 0-1.667.746-1.667 1.667v10c0 .92.747 1.667 1.667 1.667h15c.92 0 1.667-.747 1.667-1.667V20c0-.92-.747-1.667-1.667-1.667ZM15.833 23.333h18.334'
    />
    <Path stroke='#EEE' d='M.5.5h49v49H.5z' />
  </Svg>
);

export default CreditCardSvg;
