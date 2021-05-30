import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import Icon from '../assets/icons';

const onTablet = global.onTablet;

export default class AddToCalendar extends React.Component {
  render = () => {
    return (
      <Modal
        visible={this.props.isVisible}
        transparent={true}
        style={{ margin: 0, flex: 1 }}
        animation={'slideInUp'}
        animationInTiming={250}
        animationOutTiming={250}
        coverScreen={true}
        hasBackdrop={true}
      >
        <TouchableOpacity
          style={[localStyles.centerContent, { margin: 0, flex: 1 }]}
          activeOpacity={1}
          onPress={() => this.props.hideAddToCalendar()}
        >
          <View style={localStyles.container}>
            <Text
              style={[
                localStyles.modalHeaderText,
                localStyles.addToCalendar,
                { marginTop: 10 }
              ]}
            >
              Add To Calendar
            </Text>
            <Text
              style={[localStyles.modalBodyText, localStyles.addToCalendar]}
            >
              Add this lesson to your calendar to{'\n'} be notified when it's
              available
            </Text>
            <Icon.FontAwesome5
              size={onTablet ? 70 : 50}
              name={'calendar-plus'}
              color={colors.pianoteRed}
              style={localStyles.calendarIcon}
            />
            <TouchableOpacity
              style={[
                localStyles.confirmAddition,
                { backgroundColor: colors.pianoteRed }
              ]}
              onPress={() => this.props.addEventToCalendar()}
            >
              <Text
                style={[
                  localStyles.modalButtonText,
                  localStyles.confirmAdditionText
                ]}
              >
                CONFIRM ADDITION
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };
}

const localStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.5)'
  },
  container: {
    backgroundColor: 'white',
    paddingBottom: 15,
    borderRadius: 15,
    margin: 20,
    paddingVertical: 5
  },
  addToCalendar: {
    marginTop: 5,
    paddingHorizontal: 20
  },
  calendarIcon: {
    paddingTop: 7.5,
    alignSelf: 'center',
    paddingHorizontal: 40,
    marginTop: 10
  },
  confirmAddition: {
    marginTop: 15,
    borderRadius: 100,
    marginHorizontal: 40,
    justifyContent: 'center',
    height: onTablet ? 40 : 30,
    justifyContent: 'center'
  },
  confirmAdditionText: {
    color: 'white'
  },
  centerContent: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  modalHeaderText: {
    fontFamily: 'OpenSans-Bold',
    textAlign: 'center',
    fontSize: onTablet ? 24 : 18
  },
  modalBodyText: {
    textAlign: 'center',
    fontFamily: 'OpenSans-Regular',
    fontSize: onTablet ? 16 : 12
  },
  modalButtonText: {
    textAlign: 'center',
    fontFamily: 'RobotoCondensed-Bold',
    fontSize: onTablet ? 16 : 12
  }
});
