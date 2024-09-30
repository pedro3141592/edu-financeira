import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Home from './Home';
import FormRenda from './FormRenda';
import FormGasto from './FormGasto';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

const { Navigator, Screen } = createBottomTabNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Navigator
        initialRouteName='Home'
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#B0B0B0',
          tabBarIconStyle: styles.tabBarIcon,
        }}
      >
        <Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: ({ size, color }) => <Feather name="home" size={size} color={color} />
          }}
        />
        <Screen
          name="Renda"
          component={FormRenda}
          options={{
            tabBarIcon: ({ size, color }) => <Feather name="dollar-sign" size={size} color={color} />
          }}
        />
        <Screen
          name="Gastos"
          component={FormGasto}
          options={{
            tabBarIcon: ({ size, color }) => <Feather name="arrow-down" size={size} color={color} />
          }}
        />
      </Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF', // Cor de fundo da barra de navegação
    borderTopWidth: 0, // Remove a borda superior
    elevation: 10, // Sombra para dar profundidade
    height: 50, // Diminuiu a altura da barra de navegação
  },
  tabBarLabel: {
    fontSize: 12, // Tamanho da fonte do rótulo
    marginBottom: 3, // Espaçamento abaixo do rótulo
  },
  tabBarIcon: {
    marginTop: 2, // Espaçamento acima do ícone
  },
});
