import I18n from "react-native-i18n";
import en from "./en";
import vi from "./vn";
import { LANGUAGE_ENGLISH, LANGUAGE_VIETNAM } from "../Consts";

I18n.fallbacks = true;
I18n.translations = { en, vi };
I18n.locale = LANGUAGE_VIETNAM;

export default I18n;
