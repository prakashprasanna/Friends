import React, {useState, useRef, useEffect} from 'react';
import {View, Text, ScrollView, StatusBar} from 'react-native';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import {showMessage} from 'react-native-flash-message';

import {text} from '../text';
import {svg} from '../assets/svg';
import {components} from '../components';
import {homeIndicatorHeight} from '../utils';
import {theme, onboardingData} from '../constants';
import {useAppNavigation, useAppDispatch} from '../hooks';
import {setIsFirstTime} from '../store/slices/appStateSlice';

const Onboarding: React.FC = (): JSX.Element => {
  const navigation = useAppNavigation();
  const dispatch = useAppDispatch();

  const ref = useRef<ScrollView>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

  const indicatorHeight = homeIndicatorHeight() + 20;

  const updateCurrentSlideIndex = (e: any) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / theme.sizes.width);
    setCurrentSlideIndex(currentIndex);
  };

  const renderStatusBar = () => {
    return (
      <StatusBar
        translucent={true}
        backgroundColor={'transparent'}
        barStyle={'dark-content'}
      />
    );
  };

  const renderContent = () => {
    return (
      <View
        style={{
          marginVertical: responsiveHeight(4),
          height: 'auto',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <View style={{marginBottom: 12}}>
          <svg.LogoSvg />
        </View>
        <components.Image
          source={require('./../assets/images/01.png')}
          style={{
            width: 210,
            position: 'absolute',
            aspectRatio: 1.16,
          }}
        />

        {onboardingData.map((item, index) => {
          if (currentSlideIndex === index) {
            return (
              <View key={index}>
                <text.H1
                  style={{
                    marginBottom: 14,
                    textTransform: 'capitalize',
                    textAlign: 'center',
                  }}
                >
                  {item.title}
                </text.H1>
                <text.T16
                  style={{
                    textAlign: 'center',
                    fontSize: 16,
                    lineHeight: 16 * 1.7,
                    color: theme.colors.textColor,
                  }}
                >
                  {item.description}
                </text.T16>
              </View>
            );
          }
        })}
      </View>
    );
  };

  const renderSlides = () => {
    return (
      <ScrollView
        ref={ref}
        bounces={false}
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={updateCurrentSlideIndex}
      >
        {onboardingData.map((item, index) => {
          return (
            <components.Image
              key={index}
              source={{uri: item.image}}
              style={{
                width: theme.sizes.width,
                height: '100%',
              }}
              resizeMode='contain'
            />
          );
        })}
      </ScrollView>
    );
  };

  const renderButton = () => {
    return (
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          zIndex: 1,
          paddingHorizontal: 20,
          marginBottom: indicatorHeight,
        }}
      >
        <components.Button
          title='Get Started'
          onPress={() => {
            dispatch(setIsFirstTime(false));
          }}
        />
      </View>
    );
  };

  return (
    <components.SafeAreaView edges={['top']}>
      {renderStatusBar()}
      {renderContent()}
      {renderSlides()}
      {renderButton()}
    </components.SafeAreaView>
  );
};

export default Onboarding;
