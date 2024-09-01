import { BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AppNavigator from './AppNavigator';
import ProfileNavigator from './ProfileNavigator';
import {AntDesign} from '@expo/vector-icons'
import Entypo from '@expo/vector-icons/Entypo';
import { title } from 'process';
import NewListing from '@views/NewListing';

const Tab = createBottomTabNavigator();


const getOptions = (iconName: string) : BottomTabNavigationOptions => {
  return {
    tabBarIcon({ color, size }) {
      return <AntDesign name={iconName as any} size={size} color={color} />
    },
    title:""
  }
}

const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{headerShown:false}}>
      
    <Tab.Screen name="HomeNavigator" component={AppNavigator} options={getOptions("home")} />

    <Tab.Screen name='NewListing' component={NewListing} options={getOptions('pluscircleo')}/>

    <Tab.Screen name="ProfileNavigator" component={ProfileNavigator} options={getOptions("user")} />


      
    </Tab.Navigator>
  );
}

export default TabNavigator









// <Tab.Screen name="HomeNavigator" component={AppNavigator} 
// options={{tabBarIcon ({color, focused, size}) { 
// return focused ? <Entypo name="home" size={size} color={color} /> : <AntDesign name="home" size={size} color={color} /> },
// title: "" }} />
