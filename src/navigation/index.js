import React from "react";
import { Tabbar } from "../components/index";
import {
    createStackNavigator,
    createAppContainer,
    createSwitchNavigator,
    createDrawerNavigator,
    createBottomTabNavigator
} from "react-navigation";
// import { FindAccount, AccountVerify, ConfirmationCode, ConfirmationSuccess, NewPassword } from "screens/ResetPassword";
// import { AddMemberDrawer, QRScanDrawer } from "../screens/DrawerScreen";
// import { ListUser } from "screens/Contacts";
import MainTabContainer from "./MainTabContainer";
import MainTabContainerTeacher from "./MainTabContainerTeacher";
import { DEVICE } from "../helper/Consts";
import Login from '../screens/StartLogin/index'
import NewLogin from "../screens/NewLogin";
import Drawer from "../screens/Drawer"
import FeeList from "../screens/FeeList"
import MyQrCode from "../screens/MyQrCode"
import FrequentQuestions from "../screens/Settings a/FrequentQuestions";
import {TopUp,Vnpay} from "../screens/TopUp"
import MainSetting from "../screens/Settings a/MainSetting"
import Privacy from "../screens/Settings a/Privacy";
import Notification from "../screens/Settings a/Notification"
import Maps from "../screens/Maps";
import IncomingCall from "../screens/IncomingCall"
import VideoCall from "../screens/VideoCall"
import Call from "../screens/Call"
import FindAccount from "../screens/ResetPassword/FindAccount"
import AccountVerify from "../screens/ResetPassword/AccountVerify";
import ConfirmationCode from "../screens/ResetPassword/ConfirmationCode";



const LoginStack = createStackNavigator(
    {
        Login: Login,
        NewLogin,
        FindAccount: FindAccount,
        AccountVerify,
        ConfirmationCode
    },
    {
        initialRouteName: "Login",
        headerMode: "none"
    }
);

const TopupStack = createStackNavigator(
    {
        TopUp,
        Vnpay
    },
    {
        initialRouteName: "TopUp",
        headerMode: "none"
    }
);

// const QrScanStack = createStackNavigator(
//     {
//         QRScanDrawer,
//         AddContact,
//         DetailTeacher
//     },
//     {
//         initialRouteName: "QRScanDrawer",
//         headerMode: "none"
//     }
// );

const SettingStack = createStackNavigator(
    {
        MainSetting: MainSetting,
        // FrequentQuestions: FrequentQuestions,
        Notification: Notification,
        Privacy: Privacy
    },
    {
        initialRouteName: "MainSetting",
        headerMode: "none"
    }
);

const DrawerApp = createDrawerNavigator(
    {
        MainTabContainer,
        // TeacherDetails,
        // StudentDetails,
        // DetailTeacher,
        Maps,
        // Charts,
        MyQrCode,
        TopupStack,
        // IncomeHistory,
        SettingStack,
        // QrScanStack,
        FrequentQuestions,
        FeeList,
        // Chat,
        // LoadingScreen
    },
    {
        contentComponent: Drawer,
        drawerWidth: DEVICE.DEVICE_WIDTH * 0.85
    }
);

const DrawerAppTeacher = createDrawerNavigator(
    {
        MainTabContainerTeacher,
        // TeacherDetails,
        // StudentDetails,
        // DetailTeacher,
        // Maps,
        // Charts,
        // MyQrCode,
        // TopupStack,
        // IncomeHistory,
        // SettingStack,
        // QrScanStack,
        // FrequentQuestions,
        // FeeList,
        // LoadingScreen,
        // Chat
    },
    {
        contentComponent: Drawer,
        drawerWidth: DEVICE.DEVICE_WIDTH * 0.85
    }
);

const Switch = createSwitchNavigator(
    {
        LoginStack,
        DrawerApp,
        // Maps,
        // Element,
        // DrawerApp,
        DrawerAppTeacher,
        // IncomingCall,
        // Splash,
        // IncomeHistory,
        // MainSetting,
        // WaitForVerify
    },
    {
        initialRouteName: "LoginStack",
        headerMode: "none"
    }
);

const AppStack = createStackNavigator(
    {
        Switch,
        IncomingCall,
        VideoCall,
        Call,
    },
    {
        initialRouteName: "Switch",
        mode: "card",
        headerMode: "none",
        defaultNavigationOptions: {
            gesturesEnabled: false
        },
        navigationOptions: {
            swipeEnabled: false
        }
    }
);

export default createAppContainer(AppStack);
