import React from "react";
import { Tabbar } from "../components";
import {
    createStackNavigator,
    createAppContainer,
    createSwitchNavigator,
    createDrawerNavigator,
    createBottomTabNavigator
} from "react-navigation";
// import {
//     Maps,
//     Chat,
//     ContactDetails,
//     AddContact,
//     FindContact,
//     QRScan,
//     ChatHistories,
//     Call,
//     CallHistory,
//     CallDetails,
//     IncomingCall,
//     VideoCall,
//     DetailTeacher,
//     ListTeacher,
//     GroupSelect,
//     Advancedsearch,
//     Share,
//     ListSearch,
//     DetailSearch,
//     GroupChatDetail,
//     QRScanTeacher,
//     ForwardMessage,
//     AddDeviceContact
// } from "screens/index";

import { ListUser } from "../screens/Contacts";
import ChatHistories from "../screens/Chats/ChatHistories"

const StackContact = createStackNavigator(
    {
        ListUser: ListUser,
        // ContactDetails,
        // FindContact,
        // AddContact,
        // QRScan,
        // Call,
        // IncomingCall,
        // VideoCall,
        // DetailTeacher,
        // Share,
        // Chat,
        // AddDeviceContact
    },
    {
        initialRouteName: "ListUser",
        headerMode: "none",
        defaultNavigationOptions: {
            gesturesEnabled: false
        },
        navigationOptions: {
            swipeEnabled: false
        }
    }
);

StackContact.navigationOptions = ({ navigation }) => {
    const currentScreenPath = navigation.router.getPathAndParamsForState(navigation.state).path;
    const isChatScreen =
        // currentScreenPath === "FindContact" ||
        // currentScreenPath === "AddContact" ||
        currentScreenPath === "Call" ||
        // || currentScreenPath === "QRScan" ||
        currentScreenPath === "IncomingCall" ||
        currentScreenPath === "VideoCall" ||
        currentScreenPath === "Share" ||
        currentScreenPath === "DetailTeacher" ||
        currentScreenPath === "Chat" ||
        currentScreenPath === "AddDeviceContact";

    return {
        tabBarVisible: isChatScreen === false
    };
};
const StackChat = createStackNavigator(
    {
        ChatHistories,
        // Chat,
        // Call,
        // VideoCall,
        // GroupSelect,
        // GroupChatDetail,
        // DetailSearch,
        // ContactDetails,
        // DetailTeacher,
        // ForwardMessage
    },
    {
        initialRouteName: "ChatHistories",
        headerMode: "none",
        defaultNavigationOptions: {
            gesturesEnabled: false
        },
        navigationOptions: {
            swipeEnabled: false
        }
    }
);

// StackChat.navigationOptions = ({ navigation }) => {
//     const currentScreenPath = navigation.router.getPathAndParamsForState(navigation.state).path;
//     const isChatScreen =
//         currentScreenPath === "Chat" ||
//         currentScreenPath === "Call" ||
//         currentScreenPath === "GroupSelect" ||
//         currentScreenPath === "GroupChatDetail" ||
//         currentScreenPath === "DetailSearch" ||
//         currentScreenPath === "DetailTeacher" ||
//         currentScreenPath === "VideoCall" ||
//         currentScreenPath === "ForwardMessage" ||
//         currentScreenPath === "ContactDetails";
//     return {
//         tabBarVisible: isChatScreen === false
//     };
// };

//stackCall

// const StackCall = createStackNavigator(
//     {
//         CallHistory,
//         CallDetails,
//         Call,
//         VideoCall
//     },
//     {
//         initialRouteName: "CallHistory",
//         headerMode: "none",
//         defaultNavigationOptions: {
//             gesturesEnabled: false
//         },
//         navigationOptions: {
//             swipeEnabled: false
//         }
//     }
// );

// StackCall.navigationOptions = ({ navigation }) => {
//     const currentScreenPath = navigation.router.getPathAndParamsForState(navigation.state).path;
//     const isChatScreen =
//         // currentScreenPath === "CallDetails" ||
//         currentScreenPath === "Call" || currentScreenPath === "VideoCall";
//     return {
//         tabBarVisible: isChatScreen === false
//     };
// };

//stackTeacher
// const StackTeacher = createStackNavigator(
//     {
//         ListTeacher,
//         QRScan,
//         DetailTeacher,
//         Maps,
//         Share,
//         ListSearch,
//         DetailSearch,
//         Chat,
//         Advancedsearch,
//         QRScanTeacher
//     },
//     {
//         initialRouteName: "ListTeacher",
//         headerMode: "none",
//         defaultNavigationOptions: {
//             gesturesEnabled: false
//         },
//         navigationOptions: {
//             swipeEnabled: false
//         }
//     }
// );

// StackTeacher.navigationOptions = ({ navigation }) => {
//     const currentScreenPath = navigation.router.getPathAndParamsForState(navigation.state).path;
//     const isChatScreen =
//         // currentScreenPath === "QRScan" ||
//         currentScreenPath === "DetailTeacher" ||
//         currentScreenPath === "Share" ||
//         // currentScreenPath === "Advancedsearch" ||
//         currentScreenPath === "Chat" ||
//         currentScreenPath === "Maps" ||
//         // currentScreenPath === "ListSearch" ||
//         currentScreenPath === "DetailSearch";
//     return {
//         tabBarVisible: isChatScreen === false
//     };
// };

const MainTab = createBottomTabNavigator(
    {
        // StackCall,
        StackChat,
        StackContact,
        // StackTeacher
    },
    {
        swipeEnabled: false,
        tabBarPosition: "bottom",
        initialRouteName: "StackChat",
        lazy: true,
        tabBarComponent: Tabbar,
        tabBarOptions: {
            style: {
                backgroundColor: "transparent",
                height: 50
            }
        }
    }
);

export default createAppContainer(MainTab);