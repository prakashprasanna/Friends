import React from 'react';
import {View, Text} from 'react-native';
import type {PropsWithChildren} from 'react';
import ParsedText from 'react-native-parsed-text';

import {text} from '../../text';
import {theme} from '../../constants';
import Button from '../buttons/Button';
import {useAppNavigation} from '../../hooks';
import {BannerType} from '../../types/BannerType';
import ImageBackground from '../custom/ImageBackground';

type Props = PropsWithChildren<{
  version: number;
  banner: BannerType;
}>;

const BannerItem: React.FC<Props> = ({version, banner}): JSX.Element | null => {
  const navigation = useAppNavigation();

  if (version === 1) {
    return (
      <ImageBackground
        source={{uri: banner.image}}
        style={{
          width: theme.sizes.width,
          aspectRatio: 1.14,
          paddingHorizontal: 20,
          justifyContent: 'center',
        }}
        resizeMode='cover'
      >
        <text.H1>{banner.title1}</text.H1>
        <text.H1
          style={{
            marginBottom: 10,
          }}
        >
          {banner.title2}
        </text.H1>
        <Text
          style={{
            ...theme.fonts.Lato_400Regular,
            fontSize: 16,
            color: theme.colors.textColor,
            lineHeight: 16 * 1.5,
          }}
        >
          {banner.description1}
        </Text>
        <Text
          style={{
            ...theme.fonts.Lato_400Regular,
            fontSize: 16,
            color: theme.colors.textColor,
            marginBottom: 24,
            lineHeight: 16 * 1.5,
          }}
        >
          {banner.description2}
        </Text>
        <Button
          title={banner.btnText}
          onPress={() => {
            navigation.navigate('Shop');
          }}
          containerStyle={{
            width: '40%',
          }}
        />
      </ImageBackground>
    );
  }

  if (version === 2) {
    return (
      <ImageBackground
        source={{uri: banner.image}}
        style={{
          width: theme.sizes.width,
          aspectRatio: 1.57,
          paddingHorizontal: 20,
          justifyContent: 'center',
        }}
      >
        <ParsedText
          style={{
            ...theme.fonts.H2,
            color: theme.colors.mainColor,
            marginBottom: 8,
          }}
          parse={[
            {
              pattern: /50%/,
              style: {color: theme.colors.accentColor},
              onPress: () => navigation.navigate('SignUp'),
            },
          ]}
        >
          {banner.title}
        </ParsedText>
        <Text
          style={{
            ...theme.fonts.Lato_400Regular,
            fontSize: 16,
            color: theme.colors.textColor,
            lineHeight: 16 * 1.5,
          }}
        >
          {banner.description1}
        </Text>
        <Text
          style={{
            ...theme.fonts.Lato_400Regular,
            fontSize: 16,
            color: theme.colors.textColor,
            marginBottom: 20,
            lineHeight: 16 * 1.5,
          }}
        >
          {banner.description2}
        </Text>
        <Button
          title={banner.btnText}
          onPress={() => {
            navigation.navigate('Shop');
          }}
          containerStyle={{
            width: '40%',
          }}
        />
      </ImageBackground>
    );
  }

  return null;
};

export default BannerItem;
