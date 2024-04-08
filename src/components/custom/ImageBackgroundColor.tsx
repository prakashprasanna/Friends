import React from 'react';
import SafeAreaView from './SafeAreaView';
import FastImage from 'react-native-fast-image';
import {createImageProgress} from 'react-native-image-progress';

import {theme} from '../../constants';
const ImageProgress = createImageProgress(FastImage);

type Props = {
  children?: React.ReactNode;
  version: 1 | 2;
};

const ImageBackgroundColor: React.FC<Props> = ({
  children,
  version,
}): JSX.Element => {
  return (
    <ImageProgress
      source={{
        uri:
          version === 1
            ? 'https://george-fx.github.io/nuton/background/01.png'
            : 'https://george-fx.github.io/nuton/background/02.png',
      }}
      style={{
        width: theme.sizes.width,
        height: theme.sizes.height,
      }}
      resizeMode={'stretch'}
    >
      <SafeAreaView
        style={{
          backgroundColor: theme.colors.transparent,
        }}
      >
        {children}
      </SafeAreaView>
    </ImageProgress>
  );
};

export default ImageBackgroundColor;
