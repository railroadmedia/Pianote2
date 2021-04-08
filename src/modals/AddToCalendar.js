/**
 * AddToCalendar
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import FontIcon from 'react-native-vector-icons/FontAwesome5';

export default class AddToCalendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: ''
    };
  }

  render = () => {
    return (
      <TouchableWithoutFeedback
        style={styles.container}
        onPress={() => this.props.hideAddToCalendar()}
      >
        <View style={[styles.container, styles.centerContent]}>
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
            <FontIcon
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
        </View>
      </TouchableWithoutFeedback>
    );
  };
}

const localStyles = StyleSheet.create({
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
    height: DeviceInfo.isTablet() ? 40 : 30
  },
  confirmAdditionText: {
    color: 'white'
  }
});
