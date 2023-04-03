import React from "react";
import { Fab, Icon } from "native-base";
import {} from "react-native";
import Modal from "react-native-modal";
import { GroupSelect } from "../../index";

const ModalGroupSelect = props => {
    const {
        isVisible,
        leftOnPress = () => {},
        onCreatedRoomSuccess = () => {},
        onCreatedRoomError = () => {},
        member = [],
        chatRoomInfo,
        onAddMemberSuccess = () => {},
        modalVisibleToggle = () => {}
    } = props;
    return (
        <Modal style={{ padding: 0, margin: 0 }} isVisible={isVisible} onRequestClose={modalVisibleToggle}>
            <GroupSelect
                chatRoomInfo={chatRoomInfo}
                member={member}
                onCreatedRoomSuccess={(id, chatRoomInfo) => onCreatedRoomSuccess(id, chatRoomInfo)}
                onCreatedRoomError={() => onCreatedRoomError()}
                leftOnPress={() => leftOnPress()}
                onAddMemberSuccess={memberInfo => onAddMemberSuccess(memberInfo)}
            />
        </Modal>
    );
};

export default ModalGroupSelect;
