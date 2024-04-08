import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const PlusSvg = () => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={30} height={30} fill='none'>
    <Path fill='#FAF9FF' d='M.5.5h29v29H.5z' />
    <Path
      stroke='#222'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.2}
      d='M14.955 10.916v8.167M10.898 15h8.114'
    />
    <Path stroke='#EEE' d='M.5.5h29v29H.5z' />
  </Svg>
);

export default PlusSvg;
