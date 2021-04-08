/**
 * Live
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import DeviceInfo from 'react-native-device-info';
import FontIcon from 'react-native-vector-icons/FontAwesome5';

export default class Live extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        liveLesson: this.props.liveLesson[0]
    };
  }

  componentDidMount() {
    console.log(this.state.liveLesson)
    }

  changeType = word => {
    let string = '';

    for (let i = 0; i < word.length; i++) {
      if (word[i] !== 'and') {
        word[i] = word[i][0].toUpperCase() + word[i].substr(1);
      }
    }
    console.log(string, word)
    for (i in word) {
    
      string = string + word[i]
      if(Number(i) < word.length-1) (string = string + ' / ') 
    }

    return string;
  };

  render = () => {
    return (
      <TouchableWithoutFeedback
        style={styles.container}
        onPress={() => this.props.hideLive()}
      >
        <View style={[styles.container, styles.centerContent]}>
          <View style={localStyles.container}>
            <View style={[styles.centerContent, {flexDirection: 'row'}]}>
                <FastImage
                    style={{ 
                        width: 150,
                        height: 150,
                        borderRadius: 500,
                    }}
                    source={{ uri: `https://cdn.musora.com/image/fetch/w_${Math.round((Dimensions.get('window').width - 20) * 2)},ar_16:9,fl_lossy,q_auto:eco,c_fill,g_face/${this.props.liveLesson[0]?.thumbnail_url}` }}
                    resizeMode={FastImage.resizeMode.cover}
                />
                <View 
                    style={{
                        position: 'absolute',
                        bottom: 10, 
                        alignContent: 'center',
                        borderRadius: onTablet ? 5 : 3,
                        backgroundColor: 'red',
                        paddingHorizontal: onTablet ? 7.5 : 5,
                    }}
                >
                    <Text
                    numberOfLines={1}
                    ellipsizeMode='tail'
                    style={{
                        fontSize: onTablet ? 16 : 14,
                        fontFamily: 'OpenSans-Regular',
                        color: 'white',
                    }}
                    >
                    LIVE
                    </Text>
                </View>
            </View>
            <Text style={[styles.modalBodyText, localStyles.Live]}>
                <Text
                    style={{
                        fontFamily: 'OpenSans-Bold',
                        position: 'absolute',
                        fontSize: onTablet ? 16 : 14,
                    }}
                >
                    {this.changeType(this.props.liveLesson[0]?.instructors)}
                </Text> just went live. Would you like to join?
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
    paddingVertical: 20,
  },
  Live: {
    marginTop: 15,
    paddingHorizontal: 30
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
