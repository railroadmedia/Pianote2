/**
 * AddToCalendar
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions
} from 'react-native';
import { withNavigation } from 'react-navigation';
import FontIcon from 'react-native-vector-icons/FontAwesome5';

class AddToCalendar extends React.Component {
  static navigationOptions = { header: null };
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
            <Text style={[styles.modalHeaderText, localStyles.addToCalendar]}>
              ADD TO CALENDAR
            </Text>
            <Text style={[styles.modalBodyText, localStyles.addToCalendar]}>
              Add this lesson to your calendar to be notified when it's
              available
            </Text>
            <FontIcon
              size={60 * factorRatio}
              name={'calendar-plus'}
              color={colors.pianoteRed}
              style={localStyles.calendarIcon}
            />
            <TouchableOpacity
              style={localStyles.confirmAddition}
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
    paddingBottom: (12.5 * Dimensions.get('window').height) / 812,
    borderRadius:
      (15 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
    margin:
      (20 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2
  },
  addToCalendar: {
    marginTop: (12.5 * Dimensions.get('window').height) / 812,
    paddingHorizontal: 40
  },
  calendarIcon: {
    paddingTop: (7.5 * Dimensions.get('window').height) / 812,
    alignSelf: 'center',
    paddingHorizontal: 40,
    marginTop:
      (10 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2
  },
  confirmAddition: {
    marginTop: (12.5 * Dimensions.get('window').height) / 812,
    borderRadius:
      (100 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
    backgroundColor: '#fb1b2f',
    marginHorizontal: 40
  },
  confirmAdditionText: {
    color: 'white',
    paddingVertical: 10
  }
});

export default withNavigation(AddToCalendar);
