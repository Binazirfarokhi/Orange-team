import { DefaultTheme } from "@react-navigation/native";

const MyTheme = {
  ...DefaultTheme,
  // back
  colors: {
    ...DefaultTheme.colors,
    primary: "#613194",
    secondary:''
  },
};

export default MyTheme;
