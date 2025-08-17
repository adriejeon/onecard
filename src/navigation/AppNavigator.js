import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// 스크린들
import HomeScreen from "../screens/HomeScreen";
import QuestionInputScreen from "../screens/QuestionInputScreen";
import CardDrawScreen from "../screens/CardDrawScreen";
import ResultScreen from "../screens/ResultScreen";
import DailyCardSelectionScreen from "../screens/DailyCardSelectionScreen";
import DailyResultScreen from "../screens/DailyResultScreen";

import MoreScreen from "../screens/MoreScreen";
import LanguageSelectionScreen from "../screens/LanguageSelectionScreen";
import CardArchiveScreen from "../screens/CardArchiveScreen";
import ContactDeveloperScreen from "../screens/ContactDeveloperScreen";
import DiaryInputScreen from "../screens/DiaryInputScreen";
import BackupRestoreScreen from "../screens/BackupRestoreScreen";

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
        <Stack.Screen
          name="QuestionInput"
          component={QuestionInputScreen}
          options={{
            gestureEnabled: true,
            gestureResponseDistance: 50,
          }}
        />
        <Stack.Screen
          name="CardDraw"
          component={CardDrawScreen}
          options={{
            gestureEnabled: true,
            gestureResponseDistance: 50,
          }}
        />
        <Stack.Screen
          name="Result"
          component={ResultScreen}
          options={{
            gestureEnabled: true,
            gestureResponseDistance: 50,
          }}
        />
        <Stack.Screen
          name="DailyCardSelection"
          component={DailyCardSelectionScreen}
          options={{
            gestureEnabled: true,
            gestureResponseDistance: 50,
          }}
        />
        <Stack.Screen
          name="DailyResult"
          component={DailyResultScreen}
          options={{
            gestureEnabled: false,
          }}
        />

        <Stack.Screen
          name="More"
          component={MoreScreen}
          options={{
            presentation: "modal",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="LanguageSelection"
          component={LanguageSelectionScreen}
          options={{
            presentation: "modal",
            headerShown: false,
          }}
        />
        <Stack.Screen name="CardArchive" component={CardArchiveScreen} />
        <Stack.Screen
          name="ContactDeveloper"
          component={ContactDeveloperScreen}
        />
        <Stack.Screen
          name="DiaryInput"
          component={DiaryInputScreen}
          options={{
            gestureEnabled: true,
            gestureResponseDistance: 50,
          }}
        />
        <Stack.Screen name="BackupRestore" component={BackupRestoreScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
