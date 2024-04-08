import {View, Text, ScrollView} from 'react-native';

import React from 'react';

import {theme, categories} from '../../constants';
import {components} from '../../components';

const Categories: React.FC = (): JSX.Element => {
  const renderHeader = () => {
    return (
      <components.Header
        logo={true}
        basket={true}
        search={true}
        backgroundColor={theme.colors.pastel}
      />
    );
  };

  const renderCategories = () => {
    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          marginHorizontal: 20,
          paddingTop: 15,
          paddingBottom: 20,
        }}
      >
        {categories.map((item, index) => {
          return <components.CategoryItem item={item} key={index} />;
        })}
      </ScrollView>
    );
  };

  return (
    <components.SmartView>
      {renderHeader()}
      {renderCategories()}
    </components.SmartView>
  );
};

export default Categories;
