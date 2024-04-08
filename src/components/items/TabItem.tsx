import React from 'react';
import {TouchableOpacity, Text} from 'react-native';

import {theme} from '../../constants';
import {useDispatch} from 'react-redux';
import {setScreen} from '../../store/slices/tabSlice';

type Props = {
  tab: {name: string; icon: React.FC<{iconColor: string; bgColor: string}>};
  currentTabScreen: string;
};

const TabItem: React.FC<Props> = ({tab, currentTabScreen}): JSX.Element => {
  const dispatch = useDispatch();

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={() => dispatch(setScreen(tab.name))}
      style={{alignItems: 'center'}}
    >
      <tab.icon
        iconColor={
          tab.name === currentTabScreen
            ? theme.colors.mainColor
            : theme.colors.textColor
        }
        bgColor={
          tab.name === currentTabScreen ? '#B1B1B1' : theme.colors.transparent
        }
      />
      <Text
        style={{
          textAlign: 'center',
          ...theme.fonts.Lato_700Bold,
          textTransform: 'uppercase',
          marginTop: 4,
          fontSize: 10,
          color:
            currentTabScreen === tab.name
              ? theme.colors.mainColor
              : theme.colors.textColor,
        }}
      >
        {tab.name}
      </Text>
    </TouchableOpacity>
  );
};

export default TabItem;
