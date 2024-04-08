import {Platform} from 'react-native';

const TenorSans_400Regular = {
  fontFamily: Platform.OS === 'ios' ? 'TenorSans' : 'TenorSans-Regular',
};
const Lato_400Regular = {fontFamily: 'Lato-Regular'};
const Lato_700Bold = {fontFamily: 'Lato-Bold'};

export const fonts = {
  // H1-5
  H1: {
    ...TenorSans_400Regular,
    fontSize: 32,
    lineHeight: 32 * 1.2,
  },
  H2: {
    ...TenorSans_400Regular,
    fontSize: 22,
    lineHeight: 22 * 1.2,
  },
  H3: {
    ...TenorSans_400Regular,
    fontSize: 20,
    lineHeight: 20 * 1.2,
  },
  H4: {
    ...TenorSans_400Regular,
    fontSize: 18,
    lineHeight: 18 * 1.2,
  },
  H5: {
    ...TenorSans_400Regular,
    fontSize: 16,
    lineHeight: 16 * 1.2,
  },
  H6: {
    ...TenorSans_400Regular,
    fontSize: 14,
    lineHeight: 14 * 1.6,
  },
  T14: {...Lato_400Regular, fontSize: 14, lineHeight: 14 * 1.5},
  T16: {...Lato_400Regular, fontSize: 16, lineHeight: 16 * 1.7},
  // Lato
  Lato_400Regular: {...Lato_400Regular},
  Lato_700Bold: {...Lato_700Bold},
};
