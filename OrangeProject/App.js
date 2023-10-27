import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { navigationRef } from "./contexts/rootNavigation";
import LoginScreen from "./layouts/login.layout";
import SplashScreen from "./layouts/splash.layout";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthContext from "./contexts/auth";
import AccountScreen from "./layouts/account.layout";
import AuthorizedTabs from "./components/authorized-tabs.component";
import ChildrenListScreen from "./layouts/children-list.layout";
import AddChildrenScreen from "./layouts/add-child.layout";
import EventHistoryScreen from "./layouts/event-history.layout";
import PersonalInformationScreen from "./layouts/personal-information.layout";

import { post, get } from "./contexts/api";
import {
  getPersistData,
  removePersistData,
  savePersistData,
} from "./contexts/store";
import ReviewScreen from "./layouts/review.layout";
import TimeInVolunteerScreen from "./layouts/time-in-volunteer.layout";
import VolunteerDetailScreen from "./layouts/volunteer-detail.layout";
import SettingsScreen from "./layouts/setting.layout";
import MyTheme from "./contexts/theme";
import CreateEventScreen from "./layouts/create-event.layout";
import EventDetailScreen from "./layouts/event-detail.layout";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function App({ navigation }) {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case "RESTORE_TOKEN":
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case "SIGN_IN":
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case "SIGN_OUT":
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );
  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        // alert(JSON.stringify(await getPersistData('token')))
        const token = await getPersistData("token");
        userToken = token.idToken;
        // Restore token stored in `SecureStore` or any other encrypted storage
        // userToken = await SecureStore.getItemAsync('userToken');
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: "RESTORE_TOKEN", token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `SecureStore` or any other encrypted storage
        // In the example, we'll use a dummy token
        const result = (await post("/auth", data)).data;
        if (result.status === "OK") {
          await savePersistData("userInfo", result.userData);
          await savePersistData("token", result.token);
          dispatch({ type: "SIGN_IN", token: result.token.idToken });
          navigationRef.navigate("AuthorizedTabs");
        } else if (result) {
          alert(result.message);
        } else alert("Unable to connect to server");
      },
      reloadUserData: async () => {
        try {
          const data = await getPersistData("userInfo");
          const result = (await get(`/profile/${data[0].signup.emailAddress}`))
            .data;
          await savePersistData("userInfo", result);
        } catch (error) {
          console.error(error);
        }
      },
      signOut: async () => {
        await removePersistData("userInfo");
        dispatch({ type: "SIGN_OUT" });
        await removePersistData("token");
        navigationRef.navigate("Login");
      },
      signUp: async (data) => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `SecureStore` or any other encrypted storage
        // In the example, we'll use a dummy token
        const result = (await post("/auth/signup", data)).data;
        if (result) {
          if (result.status === "Failed") alert(result.message);
          else return "OK";
        } else alert("Unable to connect to server");
        return "Failed";
        // dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
      forgotPassword: async (data) => {
        try {
          const result = (await post("/auth/reset", { email: data })).data;
          if (result.status === "OK") {
            alert("Sent an email to password reset link.");
          }
        } catch (error) {
          alert(error);
        }
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer ref={navigationRef} theme={MyTheme}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {state.isLoading ? (
            <Stack.Screen name="SplashScreen" component={SplashScreen} />
          ) : state.userToken == null ? (
            <Stack.Screen name="Login" component={LoginScreen} />
          ) : (
            <Stack.Screen
              name="AuthorizedTabs"
              component={AuthorizedTabs}
              options={{
                title: "Sign in",
                animationTypeForReplace: state.isSignout ? "pop" : "push",
              }}
            />
          )}

          <Stack.Group
            screenOptions={{ headerStyle: { backgroundColor: "papayawhip" } }}>
            <Stack.Screen name="Account" component={AccountScreen} />
            <Stack.Screen
              name="PersonalInformation"
              component={PersonalInformationScreen}
            />
            <Stack.Screen name="ChildrenList" component={ChildrenListScreen} />
            <Stack.Screen name="AddChild" component={AddChildrenScreen} />
            <Stack.Screen
              name="TimeInVolunteer"
              component={TimeInVolunteerScreen}
            />
            <Stack.Screen name="Review" component={ReviewScreen} />
            <Stack.Screen name="EventHistory" component={EventHistoryScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen
              name="VolunteerDetail"
              component={VolunteerDetailScreen}
            />
            <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
            <Stack.Screen name="EventDetail" component={EventDetailScreen} />
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

export default App;
