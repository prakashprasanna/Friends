import React from 'react';
import {View, Text} from 'react-native';
import type {PropsWithChildren} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import type {RootStackParamList} from '../types';
import {useAppSelector} from '../hooks';

const Stack = createNativeStackNavigator<RootStackParamList>();

import {screens} from '../screens';
import TabNavigator from './TabNavigator';

const StackNavigator: React.FC = (): JSX.Element => {
  const {isFirstTime, accessToken, refreshToken} = useAppSelector(
    (state) => state.appState,
  );

  return (
    <Stack.Navigator>
      {isFirstTime && !accessToken && !refreshToken && (
        <Stack.Group>
          <Stack.Screen
            name='Onboarding'
            component={screens.Onboarding}
            options={{headerShown: false}}
          />
        </Stack.Group>
      )}
      {!isFirstTime && !accessToken && !refreshToken && (
        <Stack.Group>
          <Stack.Screen
            name='SignIn'
            component={screens.SignIn}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name='SignUp'
            component={screens.SignUp}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name='ForgotPassword'
            component={screens.ForgotPassword}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name='NewPassword'
            component={screens.NewPassword}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name='ForgotPasswordSentEmail'
            component={screens.ForgotPasswordSentEmail}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name='VerifyYourPhoneNumber'
            component={screens.VerifyYourPhoneNumber}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name='ConfirmationCode'
            component={screens.ConfirmationCode}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name='SignUpAccountCreated'
            component={screens.SignUpAccountCreated}
            options={{headerShown: false}}
          />
        </Stack.Group>
      )}
      {!isFirstTime && accessToken && refreshToken && (
        <Stack.Group>
          <Stack.Screen
            name='TabNavigator'
            component={TabNavigator}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name='Shop'
            component={screens.Shop}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name='Product'
            component={screens.Product}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name='OrderHistory'
            component={screens.OrderHistory}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name='PaymentMethod'
            component={screens.PaymentMethod}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name='MyAddress'
            component={screens.MyAddress}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name='MyPromocodes'
            component={screens.MyPromocodes}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name='FAQ'
            component={screens.FAQ}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name='EditProfile'
            component={screens.EditProfile}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name='AddANewCard'
            component={screens.AddANewCard}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name='OrderFailed'
            component={screens.OrderFailed}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name='OrderSuccessful'
            component={screens.OrderSuccessful}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name='Reviews'
            component={screens.Reviews}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name='LeaveAReviews'
            component={screens.LeaveAReviews}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name='MyPromocodesEmpty'
            component={screens.MyPromocodesEmpty}
            options={{headerShown: false}}
          />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
};

export default StackNavigator;
