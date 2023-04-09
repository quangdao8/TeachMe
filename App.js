/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, Component } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import database from '@react-native-firebase/database';
import { Provider, connect } from "react-redux";
import { PersistGate } from "redux-persist/es/integration/react";
import configureStore from "./store/configureStore";
import MainApp from './src/Main';

const { persistor, store } = configureStore();


const Section = ({children, title}) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

export default class App extends Component {
  UNSAFE_componentWillMount() {}
  render() {
      return (
          <Provider store={store}>
              <PersistGate persistor={persistor}>
                  <MainApp />
              </PersistGate>
          </Provider>
      );
  }
}
