import {View, Text, StatusBar} from 'react-native';
import React from 'react';

import {screens} from '../screens';
import {useAppSelector} from '../hooks';
import {components} from '../components';
import {tabs, theme} from '../constants';
import {homeIndicatorHeight} from '../utils';

const TabNavigator: React.FC = (): JSX.Element => {
  const currentTabScreen = useAppSelector((state) => state.tab.screen);
  const homeIndicator = homeIndicatorHeight();

  const paddingTabVertical = 0;

  const renderStatusBar = () => {
    return <components.StatusBar backgroundColor={theme.colors.pastel} />;
  };

  const renderHomeIndicator = () => {
    return (
      <View
        style={{
          height: homeIndicator,
          width: '100%',
          backgroundColor: theme.colors.white,
        }}
      >
        <View />
      </View>
    );
  };

  const renderScreen = () => {
    return (
      <View style={{flex: 1}}>
        {currentTabScreen === 'Home' && <screens.Home />}
        {currentTabScreen === 'Search' && <screens.Categories />}
        {currentTabScreen === 'Cart' && <screens.Order />}
        {currentTabScreen === 'Wishlist' && <screens.Wishlist />}
        {currentTabScreen === 'Profile' && <screens.Profile />}
      </View>
    );
  };

  const renderBottomBar = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          paddingHorizontal: 20,
          alignItems: 'center',
          paddingVertical: 14,
          borderTopWidth: 1,
          borderTopColor: '#EEEEEE',
          backgroundColor: theme.colors.white,
        }}
      >
        {tabs.map((tab, index) => {
          return (
            <components.TabItem
              key={index}
              tab={tab}
              currentTabScreen={currentTabScreen}
            />
          );
        })}
      </View>
    );
  };

  return (
    <components.SafeAreaView
      style={{
        backgroundColor: theme.colors.white,
      }}
      edges={['left', 'right']}
    >
      {renderStatusBar()}
      {renderScreen()}
      {renderBottomBar()}
      {renderHomeIndicator()}
    </components.SafeAreaView>
  );
};

export default TabNavigator;
