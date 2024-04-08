import React from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {text} from '../text';
import {theme} from '../constants';
import {components} from '../components';
import {useAppNavigation} from '../hooks';

const LeaveAReviews: React.FC = (): JSX.Element => {
  const navigation = useAppNavigation();

  const renderHeader = () => {
    return (
      <components.Header
        title='Leave a review'
        backgroundColor={theme.colors.pastel}
        goBack={navigation.canGoBack()}
      />
    );
  };

  const renderContent = () => {
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingVertical: 20,
          justifyContent: 'center',
        }}
        enableOnAndroid={true}
      >
        <components.Image
          source={{
            uri: 'https://george-fx.github.io/beloni/products-02/14.jpg',
          }}
          style={{
            width: 204,
            marginBottom: 30,
            alignSelf: 'center',
            aspectRatio: 1.12,
          }}
        />
        <text.H2
          style={{
            textAlign: 'center',
            marginBottom: 20,
          }}
        >
          Please rate the quality of{'\n'}service for the order!
        </text.H2>
        <components.RatingStars
          containerStyle={{
            marginBottom: 20,
            alignSelf: 'center',
          }}
        />
        <text.T16
          style={{
            textAlign: 'center',
            marginBottom: 30,
            color: theme.colors.textColor,
          }}
        >
          Your comments and suggestions help{'\n'}us improve the service quality
          better!
        </text.T16>
        <components.inputFieldBig
          containerStyle={{
            marginBottom: 20,
          }}
        />
        <components.Button title='submit' onPress={() => navigation.goBack()} />
      </KeyboardAwareScrollView>
    );
  };

  return (
    <components.SafeAreaView>
      {renderHeader()}
      {renderContent()}
    </components.SafeAreaView>
  );
};

export default LeaveAReviews;
