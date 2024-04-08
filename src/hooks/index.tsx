import {useDispatch, useSelector} from 'react-redux';
import {useNavigation, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../types/RootStackParamList';

import type {TypedUseSelectorHook} from 'react-redux';
import type {RootState, AppDispatch} from '../store/store';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppNavigation: () => NativeStackNavigationProp<RootStackParamList> =
  useNavigation;
