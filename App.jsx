import { useContext, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CountriesContextProvider, GameContextProvider } from './utils-async/Context';
import { 
  BottomTabsNavigationScreenOptions, 
  NativeStackNavigationScreenOptions 
} from './constants/NavigationScreenOptions';
import HomeIntroScreen from './screens/HomeIntroScreen';
import HomeGameScreen from './screens/HomeGameScreen';
import ScoreScreen from './screens/ScoreScreen';
import VictoryScreen from './screens/VictoryScreen';

const NativeStack = createNativeStackNavigator();
const GameStackNavigator = () => {
  const [asyncStoragePlayerName, setAsyncStoragePlayerName] = useState();  

  useEffect(() => {
    const loadPlayer = async () => {
      let player = await AsyncStorage.getItem("player");
      setAsyncStoragePlayerName(player);
    };  
    loadPlayer();
  });

  return (
    <NativeStack.Navigator 
    screenOptions={NativeStackNavigationScreenOptions}
    initialRouteName={
      (!asyncStoragePlayerName) ? "HomeIntro" : "HomeGame"
    }>
      <NativeStack.Screen 
      name="HomeIntro" 
      component={HomeIntroScreen}
      options={{ 
        title: "Welcome!",
        headerBackVisible: false 
      }} />
      <NativeStack.Screen name="HomeGame" component={HomeGameScreen} />
      <NativeStack.Screen name="GameVictory" component={VictoryScreen} /> 
    </NativeStack.Navigator>
  );
};

const ScoreStackNavigator = () => {
  return (
    <NativeStack.Navigator screenOptions={NativeStackNavigationScreenOptions}>
      <NativeStack.Screen name="Score Summary" component={ScoreScreen} />
    </NativeStack.Navigator>
  );
};

const AppBottomTabs = createBottomTabNavigator();
const App = () => {
  return (
   <GameContextProvider>
    <CountriesContextProvider>
      <StatusBar translucent backgroundColor="transparent" style="light" />
     <NavigationContainer>
      <AppBottomTabs.Navigator screenOptions={BottomTabsNavigationScreenOptions}>
        <AppBottomTabs.Screen 
        name="Home" 
        component={GameStackNavigator}
        options={{
          headerShown: false
        }} />

        <AppBottomTabs.Screen 
        name="Score" 
        component={ScoreStackNavigator}
        options={{
          title: 'Score Summary',
          headerShown: false
        }} />
      </AppBottomTabs.Navigator> 
     </NavigationContainer>
    </CountriesContextProvider>
   </GameContextProvider>
  );
};

export default App;