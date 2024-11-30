import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";
import LoginScreen from "./screens/Login/LoginScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignUpScreen from "./screens/Signup/SignupScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import HomeScreen from "./screens/Home/Homescreen";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AddEventScreen from './screens/AddEvent/AddEventScreen'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import UserEventsScreen from "./screens/UserEvents/UserEvents";
import { userSignOut } from "./firebase/database";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = getAuth().onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsub();
  }, []);

  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  const HomeStack = () => {
    return (<Stack.Navigator initialRouteName="home">
       <Stack.Screen name="home" component={HomeScreen} options={{ headerTitle: "Home",headerShown: true, headerRight: () => (<Button title="Logout" onPress={() => {userSignOut()}}/>)}}/>
       <Stack.Screen name="addevent" component={AddEventScreen} options={{headerShown: false, headerBackVisible: true}}/>
    </Stack.Navigator>)
  }
  return (
    <NavigationContainer>
      {user ? (
        <Tab.Navigator
          screenOptions={{
            tabBarInactiveTintColor: "#323631",
            tabBarActiveTintColor: "#199501",
          }}
        >
          <Tab.Screen
            options={{
              tabBarIcon: ({ color, size }) => {
                return <FontAwesome name="home" size={size} color={color} />;
              },
              headerShown: false
            }}
            name="Home"
            component={HomeStack}
          />
          <Tab.Screen
            options={{
              tabBarIcon: ({ color, size }) => {
                return <MaterialIcons name="event" size={24} color={color} />;
              },
              headerShown: true
            }}
            name="My Events"
            component={UserEventsScreen}
          />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator initialRouteName="loginScreen">
          <Stack.Screen
            name="loginScreen"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="signupScreen"
            component={SignUpScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
