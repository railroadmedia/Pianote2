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
            <Text
              key={'emailTaken'}
              style={{
                fontFamily: 'OpenSans-Bold',
                fontSize: 21 * factorRatio,
                textAlign: 'center',
                alignSelf: 'center',
                paddingHorizontal: 40,
                marginTop: 10 * factorRatio
              }}
            >
              ADD TO CALENDAR
            </Text>

            <Text
              style={{
                fontFamily: 'OpenSans-Regular',
                fontSize: 15 * factorRatio,
                fontWeight: '300',
                textAlign: 'center',
                alignSelf: 'center',
                paddingHorizontal: 40,
                marginTop: 10 * factorRatio
              }}
            >
              Add this lesson to your calendar to be notified when it's
              available
            </Text>

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

            <TouchableOpacity
              onPress={() => {
                this.props.addEventToCalendar();
              }}
              style={{
                borderRadius: 100 * factorRatio,
                backgroundColor: '#fb1b2f',
                marginHorizontal: 40,
                marginVertical: 10 * factorRatio
              }}
            >
              <Text
                style={{
                  fontFamily: 'OpenSans-Regular',
                  fontSize: 15 * factorRatio,
                  fontWeight: '700',
                  textAlign: 'center',
                  color: 'white',
                  paddingVertical: 10
                }}
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

export default withNavigation(AddToCalendar);
