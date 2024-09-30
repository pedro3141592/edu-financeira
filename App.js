import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Home from './src/components/Home';
import FormRenda from './src/components/FormRenda';
import FormGasto from './src/components/FormGasto';
import Navigation from './src/components/Navigation';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import {Feather} from '@expo/vector-icons';
const {Navigator, Screen} = createBottomTabNavigator();

function zeroesquerda(number){
    if(number <= 9){
      return "0" + number;
    }
  return;
}

function url(qtdias){
  const date = new Date();
  const lastdays = qtdias;
  const end_date = `${date.getFullYear()}-${zeroesquerda(date.getMonth()+1)}-${zeroesquerda(date.getDay()+1)}`
  date.setDate(data.getDate() - lastdays)
  ;
  const start_date = `${date.getFullYear()}-${zeroesquerda(date.getMonth()+1)}-${zeroesquerda(date.getDay()+1)}`;
  return `https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,BTC-BRL`;
}



export default function App() {
  return (
      <Navigation/>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
});
