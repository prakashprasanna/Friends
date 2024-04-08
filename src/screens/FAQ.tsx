import React, {useState} from 'react';
import Accordion from 'react-native-collapsible/Accordion';
import {View, ScrollView, TouchableOpacity} from 'react-native';

import {text} from '../text';
import {svg} from '../assets/svg';
import {components} from '../components';
import {useAppNavigation} from '../hooks';
import {theme, frequentlyQuestions} from '../constants';

const FAQ: React.FC = (): JSX.Element => {
  const navigation = useAppNavigation();
  const [activeSections, setActiveSections] = useState([]);

  const renderStatusBar = () => {
    return <components.StatusBar backgroundColor={theme.colors.pastel} />;
  };

  const setSections = (sections: any) => {
    setActiveSections(sections.includes(undefined) ? [] : sections);
  };

  const renderHeader = () => {
    return (
      <components.Header
        title='FAQ'
        backgroundColor={theme.colors.pastel}
        goBack={navigation.canGoBack()}
      />
    );
  };

  const renderFaqHeader = (section: any, _: any, isActive: boolean) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 13,
        }}
      >
        <text.H5>{section.question}</text.H5>
        {isActive ? <svg.ArrowCloseSvg /> : <svg.ArrowOpenSvg />}
      </View>
    );
  };

  const renderFaqContent = (section: any, _: any, isActive: boolean) => {
    return (
      <View
        style={{
          paddingHorizontal: 20,
          marginBottom: 20,
        }}
      >
        <View>
          <text.T16
            style={{
              color: theme.colors.textColor,
            }}
          >
            {section.answer}
          </text.T16>
        </View>
      </View>
    );
  };

  const renderContent = () => {
    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: 20,
          backgroundColor: theme.colors.white,
        }}
      >
        <Accordion
          activeSections={activeSections}
          sections={frequentlyQuestions}
          touchableComponent={TouchableOpacity}
          renderHeader={renderFaqHeader}
          renderContent={renderFaqContent}
          duration={400}
          onChange={setSections}
          sectionContainerStyle={{
            backgroundColor: theme.colors.white,
            marginBottom: 8,
            borderWidth: 1,
            borderColor: '#EEEEEE',
            marginHorizontal: 20,
          }}
        />
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

export default FAQ;
