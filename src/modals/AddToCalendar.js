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
        style={styles.modalContainer}
        animation={'slideInUp'}
        animationInTiming={250}
        animationOutTiming={250}
        coverScreen={true}
        hasBackdrop={true}
      >
        <TouchableOpacity
          style={[styles.centerContent, localStyles.modalContainer]}
          activeOpacity={1}
          onPress={() => this.props.hideAddToCalendar()}
        >
          <View style={localStyles.container}>
            <Text
              style={[
                styles.modalHeaderText,
                localStyles.addToCalendar,
                { marginTop: 10 }
              ]}
            >
              Add To Calendar
            </Text>
            <Text style={[styles.modalBodyText, localStyles.addToCalendar]}>
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
                { justifyContent: 'center' }
              ]}
              onPress={() => this.props.addEventToCalendar()}
            >
              <Text
                style={[
                  styles.modalButtonText,
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
    backgroundColor: '#fb1b2f',
    marginHorizontal: 40,
    justifyContent: 'center',
    height: onTablet ? 40 : 30
  },
  confirmAdditionText: {
    color: 'white'
  }
});
