import React, {useState} from 'react';
import {View, TouchableOpacity, ScrollView} from 'react-native';
import {responsiveHeight} from 'react-native-responsive-dimensions';

import {text} from '../text';
import {svg} from '../assets/svg';
import {components} from '../components';
import {useAppNavigation} from '../hooks';
import {theme, promocodes} from '../constants';

const MyPromocodes: React.FC = (): JSX.Element => {
  const navigation = useAppNavigation();

  const [activeSections, setActiveSections] = useState<string>('current');

  const renderStatusBar = () => {
    return <components.StatusBar backgroundColor={theme.colors.pastel} />;
  };

  const renderHeader = () => {
    return (
      <components.Header
        title='My promocodes'
        backgroundColor='#F7F7F7'
        goBack={navigation.canGoBack()}
      />
    );
  };

  const renderCategories = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginHorizontal: 20,
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        <TouchableOpacity
          style={{
            borderBottomWidth: 1,
            width: '49%',
            paddingBottom: 10,
            opacity: activeSections === 'current' ? 1 : 0.5,
          }}
          onPress={() => setActiveSections('current')}
        >
          <text.H4>Current</text.H4>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            borderBottomWidth: 1,
            width: '49%',
            paddingBottom: 10,
            opacity: activeSections === 'used' ? 1 : 0.5,
          }}
          onPress={() => setActiveSections('used')}
        >
          <text.H4>Used</text.H4>
        </TouchableOpacity>
      </View>
    );
  };

  const renderContent = () => {
    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingBottom: 20,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}
        >
          {promocodes.map((item, index) => {
            return <components.PromocodeItem item={item} key={item.id} />;
          })}
        </View>
        <TouchableOpacity
          style={{
            marginTop: responsiveHeight(12),
            alignItems: 'center',
          }}
          onPress={() => navigation.navigate('MyPromocodesEmpty')}
        >
          <svg.AddButtonSvg />
          <text.T14
            style={{
              textAlign: 'center',
              marginTop: 10,
              color: theme.colors.textColor,
              textTransform: 'none',
            }}
          >
            Add a new promocode
          </text.T14>
        </TouchableOpacity>
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
      {renderCategories()}
      {renderContent()}
    </components.SafeAreaView>
  );
};

export default MyPromocodes;
