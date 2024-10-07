import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

const defaultStyles = {
    headerTitleAlign: 'center',
    headerStyle: {
      backgroundColor: Colors.appTheme.darkgreen,
    },
    headerTintColor: Colors.white,
    headerTitleStyle: {
      fontSize: 28
    }
};

const BottomTabsNavigationScreenOptions = ({ route }) => ({
    ...defaultStyles,
    unmountOnBlur: true,
    tabBarStyle: {
      backgroundColor: Colors.appTheme.darkgreen
    },
    tabBarLabelStyle: { fontSize: 14 },
    tabBarInactiveTintColor: Colors.white,
    tabBarActiveTintColor: Colors.appTheme.darkorange,
    tabBarIcon: ({ focused, color }) => {
      let iconName;
  
      if (route.name == 'Home') {
        iconName = focused ? 'home' : 'home-outline';
      } else if (route.name == 'Score') {
        iconName = focused ? 'flag' : 'flag-outline';
      }

     return (
      <Ionicons 
      name={iconName}
      color={color}
      size={24} />
    );
   }
});

const NativeStackNavigationScreenOptions = defaultStyles;

export {
  BottomTabsNavigationScreenOptions,
  NativeStackNavigationScreenOptions
};