import { DefaultTheme } from '@react-navigation/native';

const MyTheme = {
    ...DefaultTheme,
    // back
    colors: {
      ...DefaultTheme.colors,
      primary: '#613194',
    },
  };

export default MyTheme;