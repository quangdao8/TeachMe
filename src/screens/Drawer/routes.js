import { Images, ICON } from "assets";
import I18n from "helper/locales";

export const routes = [
    {
        name: I18n.t("menu.home"),
        navigate: "MainTabContainer",
        img: ICON.LIST_MENU,
        fireBase: "Menu_Logout"
    },
    {
        name: I18n.t("menu.shareApp"),
        navigate: "",
        img: ICON.SHARE_MENU,
        fireBase: "Menu_Share"
    },
    {
        name: I18n.t("menu.feeList"),
        navigate: "FeeList",
        img: ICON.LIST_MENU,
        fireBase: "Menu_Logout"
    },
    {
        name: I18n.t("menu.recharge"),
        navigate: "TopupStack",
        img: ICON.MONEY_MENU,
        fireBase: "Menu_Logout"
    },
    {
        name: I18n.t("menu.incomeHistory"),
        navigate: "IncomeHistory",
        img: ICON.CLOCK_MENU,
        fireBase: "Menu_Logout"
    },
    {
        name: I18n.t("menu.chart"),
        navigate: "Charts",
        img: ICON.CHART,
        fireBase: "Menu_Logout"
    },
    {
        name: I18n.t("menu.scanQR"),
        navigate: "QrScanStack",
        img: ICON.CODE_QR_MENU,
        fireBase: "Menu_Home"
    },
    {
        name: I18n.t("menu.setting"),
        navigate: "MainSetting",
        img: ICON.SETTING_MENU,
        fireBase: "Menu_Logout"
    },
    {
        name: I18n.t("menu.help"),
        navigate: "FrequentQuestions",
        img: ICON.HELP_MENU,
        fireBase: "Menu_Logout"
    },
    {
        name: I18n.t("menu.exit"),
        navigate: "ConfirmLogOut",
        img: ICON.OUT_MENU,
        fireBase: "Menu_Logout"
    }
];

export const routes1 = [
    {
        name: I18n.t("menu.home"),
        navigate: "MainTabContainerTeacher",
        img: ICON.LIST_MENU,
        fireBase: "Menu_Logout"
    },
    {
        name: I18n.t("menu.shareApp"),
        navigate: "",
        img: ICON.SHARE_MENU,
        fireBase: "Menu_Share"
    },
    {
        name: I18n.t("menu.feeList"),
        navigate: "FeeList",
        img: ICON.LIST_MENU,
        fireBase: "Menu_Logout"
    },
    {
        name: I18n.t("menu.recharge"),
        navigate: "TopupStack",
        img: ICON.MONEY_MENU,
        fireBase: "Menu_Logout"
    },
    {
        name: I18n.t("menu.scanQR"),
        navigate: "QrScanStack",
        img: ICON.CODE_QR_MENU,
        fireBase: "Menu_Home"
    },
    {
        name: I18n.t("menu.setting"),
        navigate: "MainSetting",
        img: ICON.SETTING_MENU,
        fireBase: "Menu_Logout"
    },
    {
        name: I18n.t("menu.help"),
        navigate: "FrequentQuestions",
        img: ICON.HELP_MENU,
        fireBase: "Menu_Logout"
    },
    {
        name: I18n.t("menu.exit"),
        navigate: "ConfirmLogOut",
        img: ICON.OUT_MENU,
        fireBase: "Menu_Logout"
    }
];
