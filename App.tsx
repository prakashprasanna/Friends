import React from 'react';
import {Provider} from 'react-redux';
import {components} from './src/components';
import {persistor, store} from './src/store/store';
import {enableScreens} from 'react-native-screens';
import FlashMessage from 'react-native-flash-message';
import StackNavigator from './src/navigation/StackNavigator';
import {NavigationContainer} from '@react-navigation/native';
import {PersistGate} from 'redux-persist/integration/react';
import {SafeAreaProvider} from 'react-native-safe-area-context';

enableScreens();

const App: React.FC = (): JSX.Element => {
  return (
    <NavigationContainer>
      <SafeAreaProvider>
        <Provider store={store}>
          <PersistGate loading={<components.Loader />} persistor={persistor}>
            <StackNavigator />
          </PersistGate>
        </Provider>
      </SafeAreaProvider>
      <FlashMessage position='top' floating={true} />
    </NavigationContainer>
  );
};

export default App;
