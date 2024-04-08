import {ScrollView} from 'react-native';
import React from 'react';

import {theme} from '../constants';
import {components} from '../components';
import {useAppNavigation} from '../hooks';

import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Reviews'>;

const Reviews: React.FC<Props> = ({route}): JSX.Element => {
  const {reviews} = route.params;
  const navigation = useAppNavigation();

  const renderStatusBar = () => {
    return <components.StatusBar backgroundColor={theme.colors.pastel} />;
  };

  const renderHeader = () => {
    return (
      <components.Header
        title='Reviews'
        goBack={navigation.canGoBack()}
        backgroundColor={theme.colors.pastel}
      />
    );
  };

  const renderContent = () => {
    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 20,
        }}
      >
        {reviews.map((review, index) => {
          return <components.ReviewItem key={index} item={review} />;
        })}
      </ScrollView>
    );
  };

  return (
    <components.SafeAreaView
      style={{
        backgroundColor: theme.colors.white,
      }}
      edges={['bottom']}
    >
      {renderStatusBar()}
      {renderHeader()}
      {renderContent()}
    </components.SafeAreaView>
  );
};

export default Reviews;
