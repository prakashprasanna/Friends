import React from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';

import {text} from '../text';
import {svg} from '../assets/svg';
import {theme, addresses} from '../constants';
import {components} from '../components';
import {useAppNavigation} from '../hooks';

const MyAddress: React.FC = (): JSX.Element => {
  const navigation = useAppNavigation();

  const renderStatusBar = () => {
    return <components.StatusBar backgroundColor={theme.colors.pastel} />;
  };

  const renderHeader = () => {
    return (
      <components.Header
        title='My address'
        backgroundColor={theme.colors.pastel}
        goBack={navigation.canGoBack()}
      />
    );
  };

  const renderButton = () => {
    return (
      <TouchableOpacity
        style={{
          marginTop: 'auto',
          alignItems: 'center',
          marginBottom: 20,
        }}
        onPress={() => navigation.navigate('AddANewCard')}
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
          Add a new card
        </text.T14>
      </TouchableOpacity>
    );
  };

  const renderContent = () => {
    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: 20,
          paddingHorizontal: 20,
        }}
      >
        {addresses.map((item, index, array) => {
          const lastElement = index === array.length - 1;

          return (
            <View
              key={index}
              style={{
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: lastElement ? 0 : 8,
              }}
            >
              <item.icon />
              <View style={{flex: 1, marginLeft: 14}}>
                <text.H5
                  style={{
                    marginBottom: 4,
                    color: theme.colors.mainColor,
                  }}
                >
                  {item.type}
                </text.H5>
                <text.T14
                  numberOfLines={1}
                  style={{
                    color: theme.colors.textColor,
                  }}
                >
                  {item.address}
                </text.T14>
              </View>
              <svg.EditSvg />
            </View>
          );
        })}
        {renderButton()}
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

export default MyAddress;
