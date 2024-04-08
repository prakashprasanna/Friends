import {View, Text, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import Accordion from 'react-native-collapsible/Accordion';

import {svg} from '../assets/svg';
import {text} from '../text';
import {components} from '../components';
import {useAppNavigation} from '../hooks';
import {theme, history} from '../constants';

const OrderHistory: React.FC = (): JSX.Element => {
  const navigation = useAppNavigation();
  const [activeSections, setActiveSections] = useState<number[]>([]);
  const setSections = (sections: any) => {
    setActiveSections(sections.includes(undefined) ? [] : sections);
  };

  const statusColor = (status: string) => {
    return status === 'Shipping'
      ? '#FFA462'
      : status === 'Delivered'
      ? '#00824B'
      : status === 'Cancelled'
      ? '#F84C6B'
      : status === 'Pending' && '#FFA462';
  };

  const accordionHeader = (section: any) => {
    return (
      <components.Container
        containerStyle={{
          backgroundColor: activeSections === section.id ? '#F7F7F7' : 'white',
          marginBottom: 10,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 7,
          }}
        >
          <text.H5>#{section.number}</text.H5>
          <text.T14
            style={{
              color: statusColor(section.status) as string,
            }}
          >
            {section.status}
          </text.T14>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text
            style={{
              ...theme.fonts.Lato_400Regular,
              color: theme.colors.textColor,
            }}
          >
            {section.date}
          </Text>
          <Text
            style={{...theme.fonts.Lato_700Bold, color: theme.colors.mainColor}}
          >
            ${section.total}
          </Text>
        </View>
      </components.Container>
    );
  };

  const renderStatusBar = () => {
    return <components.StatusBar backgroundColor={theme.colors.pastel} />;
  };

  const accordionContent = (section: any) => {
    return (
      <components.Container
        containerStyle={{
          marginBottom: 10,
        }}
      >
        {section.products.map((product: any, index: number) => {
          return (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 6,
              }}
            >
              <text.T14
                style={{
                  color: theme.colors.textColor,
                }}
              >
                {product.name}
              </text.T14>
              <text.T14
                style={{
                  color: theme.colors.textColor,
                }}
              >{`${product.quantity} x $${product.price}`}</text.T14>
            </View>
          );
        })}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 14,
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <svg.RepeatSvg />
            <text.T14
              style={{
                marginLeft: 6,
                textTransform: 'none',
              }}
            >
              Repeat order
            </text.T14>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('LeaveAReviews')}
          >
            <text.T14
              style={{
                color: theme.colors.accentColor,
                textTransform: 'none',
              }}
            >
              Leave a review
            </text.T14>
          </TouchableOpacity>
        </View>
      </components.Container>
    );
  };

  const renderContent = () => {
    return (
      <View style={{flex: 1}}>
        <Accordion
          activeSections={activeSections}
          sections={history}
          renderHeader={accordionHeader}
          renderContent={accordionContent}
          onChange={setSections}
          touchableComponent={TouchableOpacity}
          containerStyle={{
            paddingHorizontal: 20,
            paddingTop: 20,
          }}
        />
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <components.Header
        title='Order history'
        goBack={navigation.canGoBack()}
        backgroundColor={theme.colors.pastel}
      />
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

export default OrderHistory;
