import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { navigate } from '../../AppNavigator';

const isTablet = global.onTablet;

export default class Live extends React.Component {
  changeType = word => {
    if (word) {
      try {
        word = word.replace(/[- )(]/g, ' ').split(' ');
      } catch {}

      let string = '';

      for (let i = 0; i < word.length; i++) {
        if (word[i] !== 'and') {
          word[i] = word[i][0].toUpperCase() + word[i].substr(1);
        }
      }

      for (i in word) {
        string = string + word[i];
        if (Number(i) < word.length - 1) string = string + ' / ';
      }

      return string;
    }
  };

  render = () => {
    return (
      <TouchableOpacity
        style={[styles.centerContent, { margin: 0, flex: 1 }]}
        onPress={() => this.props.hideLive()}
      >
        <View style={[styles.container, styles.centerContent]}>
          <View style={localStyles.container}>
            <View style={[styles.centerContent, { flexDirection: 'row' }]}>
              <FastImage
                style={{
                  width: 150,
                  height: 150,
                  borderRadius: 500
                }}
                source={{
                  uri: this.props.liveLesson.thumbnail_url
                    ? `https://cdn.musora.com/image/fetch/w_${Math.round(
                        (Dimensions.get('window').width - 20) * 2
                      )},ar_16:9,fl_lossy,q_auto:eco,c_fill,g_face/${
                        this.props.liveLesson.thumbnail_url
                      }`
                    : fallbackThumb
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
              <View
                style={{
                  position: 'absolute',
                  bottom: 10,
                  alignContent: 'center',
                  borderRadius: onTablet ? 5 : 3,
                  backgroundColor: 'red',
                  paddingHorizontal: onTablet ? 7.5 : 5
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode='tail'
                  style={{
                    fontSize: onTablet ? 16 : 14,
                    fontFamily: 'OpenSans-Regular',
                    color: 'white'
                  }}
                >
                  LIVE
                </Text>
              </View>
            </View>
            <Text style={[styles.modalBodyText, localStyles.live]}>
              <Text
                style={{
                  fontFamily: 'OpenSans-Bold',
                  position: 'absolute',
                  fontSize: onTablet ? 16 : 14,
                  marginTop: 20,
                  textTransform: 'capitalize'
                }}
              >
                {this.changeType(this.props.liveLesson?.instructors)}
              </Text>{' '}
              just went live. {'\n'}Would you like to join?
            </Text>
            <Text style={[styles.modalBodyText, localStyles.live]}>
              <Text
                style={{
                  fontFamily: 'OpenSans-Regular',
                  position: 'absolute',
                  fontSize: onTablet ? 16 : 14
                }}
              >
                {/* Join {this.props.numViewers} members now! */}
              </Text>
            </Text>
            <TouchableOpacity
              style={[
                localStyles.watch,
                { justifyContent: 'center', marginTop: 0 }
              ]}
              onPress={() => {
                navigate('LIVE'), this.props.hideLive();
              }}
            >
              <Text style={[styles.modalButtonText, localStyles.watchText]}>
                WATCH
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[localStyles.cancelButton, { justifyContent: 'center' }]}
              onPress={() => this.props.hideLive()}
            >
              <Text
                style={[styles.modalButtonText, localStyles.cancelButtonText]}
              >
                CANCEL
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
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
    paddingVertical: 20
  },
  live: {
    marginTop: 15,
    paddingHorizontal: 30,
    fontSize: isTablet ? 14 : 12
  },
  calendarIcon: {
    paddingTop: 7.5,
    alignSelf: 'center',
    paddingHorizontal: 40,
    marginTop: 10
  },
  watch: {
    marginTop: 5,
    borderRadius: 100,
    backgroundColor: '#fb1b2f',
    marginHorizontal: 70,
    justifyContent: 'center',
    height: isTablet ? 40 : 30
  },
  cancelButton: {
    marginTop: 5,
    borderRadius: 100,
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: '#fb1b2f',
    marginHorizontal: 70,
    justifyContent: 'center',
    height: isTablet ? 40 : 30
  },
  watchText: {
    color: 'white'
  },
  cancelButtonText: {
    color: 'red'
  }
});
