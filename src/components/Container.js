import React from "react";
import { View, ScrollView } from "react-native";
import { Const } from "../helper";
import Header from "./Header";

export default class Container extends React.PureComponent {
  render() {
    const {
      children,
      leftIcon,
      title,
      navigation,
      isBack,
      contentContainerStyle
    } = this.props;
    return (
      <View style={styles.container}>
        {title ? (
          <Header
            leftIcon={leftIcon}
            navigation={navigation}
            isBack={isBack}
            title={title}
          />
        ) : null}
        <ScrollView
          {...this.props}
          keyboardShouldPersistTaps="handled"
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.contentContainer,
            contentContainerStyle
          ]}
          accessible={false}
        >
          {/* {titleNoIcon ? <Header title={titleNoIcon} /> : null} */}

          {children}
        </ScrollView>
      </View>
    );
  }
}

const styles = {
    contentContainer: {
        alignItems: 'center',
        // flex: 1,
        flexGrow: 1,
        // padding: 8,
        // paddingBottom: 8,
    },
    container: {
        width: '100%',
        flex: 1
    }
};
