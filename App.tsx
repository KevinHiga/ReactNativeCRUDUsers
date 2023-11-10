import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import UserProvider from './src/contexts/UserProvider';
import UserDetail from './src/components/UserDetail';
import FetchGET from './src/screens/FetchGET';
import CityFetchGET from './src/screens/CityFetchGET';
import CityDetail from './src/components/CityDetail';
import CityProvider from './src/contexts/CityProvider';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/FontAwesome6';

const UsersStack = createStackNavigator();

function UsersStackScreen() {
  return (
    <UserProvider>
      <UsersStack.Navigator>
        <UsersStack.Screen component={FetchGET} name='Usuarios' />
        <UsersStack.Screen component={UserDetail} name='DetalleUsuario' />
      </UsersStack.Navigator>
    </UserProvider>
  );
}

const CitysStack = createStackNavigator();

function CitysStackScreen() {
  return (
    <CityProvider>
      <CitysStack.Navigator>
        <CitysStack.Screen component={CityFetchGET} name='Ciudades' />
        <CitysStack.Screen component={CityDetail} name='DetalleCiudad' />
      </CitysStack.Navigator>
    </CityProvider>
  );
}
const screenOptions = (route, color) => {
  switch (route.name) {
    case 'UserMain':
      return <Icon name='users' color={color} size={24} />;
    case 'CityMain':
      return <Icon2 name='city' color={color} size={24} />;
    default:
      break;
  }
};

const Tab = createBottomTabNavigator();

function App(): JSX.Element {
  return (
    <NavigationContainer>
        <Tab.Navigator 
          screenOptions={({route}) => ({
            tabBarIcon: ({color}) => screenOptions(route, color),
            headerShown: false,
          })}
        >
          <Tab.Screen name="UserMain" component={UsersStackScreen}  />
          <Tab.Screen name="CityMain" component={CitysStackScreen} />
        </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
