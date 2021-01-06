/**
 * AddToCalendar
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback
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
        key={'container'}
        onPress={() => this.props.hideAddToCalendar()}
        style={{
          height: '100%',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'transparent'
        }}
      >
        <View
          key={'content'}
          style={{
            height: '100%',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'transparent'
          }}
        >
          <View
            key={'content'}
            style={{
              backgroundColor: 'white',
              borderRadius: 15 * factorRatio,
              margin: 20 * factorRatio
            }}
          >
            <View style={{ height: 12.5 * factorVertical }} />
            <Text style={[styles.modalHeaderText, { paddingHorizontal: 40 }]}>
              ADD TO CALENDAR
            </Text>
            <View style={{ height: 7.5 * factorVertical }} />
            <Text style={[styles.modalBodyText, { paddingHorizontal: 40 }]}>
              Add this lesson to your calendar to be notified when it's
              available
            </Text>
            <View style={{ height: 5 * factorVertical }} />
            <FontIcon
              size={60 * factorRatio}
              name={'calendar-plus'}
              color={colors.pianoteRed}
              style={{
                alignSelf: 'center',
                paddingHorizontal: 40,
                marginTop: 10 * factorRatio
              }}
            />
            <View style={{ height: 12.5 * factorVertical }} />
            <TouchableOpacity
              onPress={() => {
                this.props.addEventToCalendar();
              }}
              style={{
                borderRadius: 100 * factorRatio,
                backgroundColor: '#fb1b2f',
                marginHorizontal: 40
              }}
            >
              <Text
                style={[
                  styles.modalButtonText,
                  { color: 'white', paddingVertical: 10 }
                ]}
              >
                CONFIRM ADDITION
              </Text>
            </TouchableOpacity>
            <View style={{ height: 12.5 * factorVertical }} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };
}

export default withNavigation(AddToCalendar);
