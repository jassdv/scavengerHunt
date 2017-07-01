import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { StackNavigator, TabNavigator } from 'react-navigation'
import { Icon } from 'react-native-elements'
import HomeScreen from './src/Components/Home'
import CameraScreen from './src/Components/Camera'
import SignInSignUpScreen from './src/Components/SignInSignUp'
import PlayMap from './src/Components/PlayMap'
import Play from './src/Components/Play'
import database from './database/firebase'


const fireBase = require('./database/firebase');

import SignUpScreen from './src/Components/SignUp'
import LoginScreen from './src/Components/Login'
import MyAccountScreen from './src/Components/MyAccount'
import PlayModeMap from './src/Components/PlayModeMap'
import NewSH from './src/Components/NewSH'
import NYCMap from './src/Components/NYCMap'
import SFMap from './src/Components/SFMap'
import LAMap from './src/Components/LAMap'
import AustinMap from './src/Components/AustinMap'
import SavedConf from './src/Components/SavedConf'

const scavengerHuntRouter = StackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      title: 'Home'
    }
  },
  Camera: {
    screen: CameraScreen,
    navigationOptions: {
      title: 'Play'
    }
  },
  Play: {
    screen: Play
  },
  PlayMap: {
    screen: PlayMap,
  },
  SignUp: {
    screen: SignUpScreen
  },
  Login: {
    screen: LoginScreen
  },
  MyAccount: {
    screen: MyAccountScreen

  },
  SignInSignUp: {
    screen: SignInSignUpScreen
  },
  PlayModeMap: {
    screen: PlayModeMap
  NewSH: {
    screen: NewSH
  },
  NYCMap: {
    screen: NYCMap
  },
  SFMap: {
    screen: SFMap
  },
  LAMap: {
    screen: LAMap
  },
  AustinMap: {
    screen: AustinMap
  },
  SavedConf: {
    screen: SavedConf
  }
})

const Tabs = TabNavigator({
  Home: {
    screen: scavengerHuntRouter,
    navigationOptions: {
      tabBarLabel: 'Home',
      tabBarIcon: ({tintColor}) =>  <Icon name="home" size={26} color={tintColor} />

    }

  },
  Play: {
    screen: CameraScreen,
    navigationOptions: {
      tabBarLabel: 'Play',
      tabBarIcon: ({ tintColor }) => <Icon name="play-circle-filled" size={26} color={tintColor} />

    }

  },
  Account: {
    screen: MyAccountScreen,
    navigationOptions: {
      tabBarLabel: 'Account',
      tabBarIcon: ({ tintColor }) => <Icon name="account-circle" size={26} color={tintColor} />

    }

  }
}, {
    tabBarOptions: {
      activeTintColor: '#800000',
      inactiveTintColor: '#696969'
    }
  })

export default Tabs;



