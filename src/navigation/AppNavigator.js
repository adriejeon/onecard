import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// 스크린들
import HomeScreen from "../screens/HomeScreen";
import CardSelectionScreen from "../screens/CardSelectionScreen";
import QuestionInputScreen from "../screens/QuestionInputScreen";
import CardDrawScreen from "../screens/CardDrawScreen";
import ResultScreen from "../screens/ResultScreen";
import DailyCardSelectionScreen from "../screens/DailyCardSelectionScreen";
import DailyResultScreen from "../screens/DailyResultScreen";
import PrivacyPolicyScreen from "../screens/PrivacyPolicyScreen";
import MoreScreen from "../screens/MoreScreen";
import CardArchiveScreen from "../screens/CardArchiveScreen";
import ContactDeveloperScreen from "../screens/ContactDeveloperScreen";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: "transparent" },
          gestureEnabled: true,
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            gestureEnabled: false,
          }}
        />
        <Stack.Screen name="CardSelection" component={CardSelectionScreen} />
        <Stack.Screen name="QuestionInput" component={QuestionInputScreen} />
        <Stack.Screen name="CardDraw" component={CardDrawScreen} />
        <Stack.Screen name="Result" component={ResultScreen} />
        <Stack.Screen
          name="DailyCardSelection"
          component={DailyCardSelectionScreen}
        />
        <Stack.Screen name="DailyResult" component={DailyResultScreen} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
        <Stack.Screen name="More" component={MoreScreen} />
        <Stack.Screen name="CardArchive" component={CardArchiveScreen} />
        <Stack.Screen
          name="ContactDeveloper"
          component={ContactDeveloperScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
