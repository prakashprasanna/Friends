import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const SettingsSvg = () => (
  <Svg xmlns='http://www.w3.org/2000/svg' width={18} height={18} fill='none'>
    <Path
      stroke='#4A5F73'
      strokeLinecap='round'
      strokeWidth={1.2}
      d='M3.75 15.75v-9m10.5-4.5v3-3Zm0 13.5v-7.5 7.5ZM9 2.25v9-9Zm0 13.5v-1.5 1.5ZM3.75 2.25v1.5-1.5ZM12.75 6.75a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0ZM7.5 12.75a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0ZM2.25 5.25a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Z'
    />
  </Svg>
);

export default SettingsSvg;
