import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import Icon from '../assets/icons';

const windowDim = Dimensions.get('window');
const width =
  windowDim.width < windowDim.height ? windowDim.width : windowDim.height;

export default class NextVideo extends React.Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    return (
      <TouchableOpacity
        onPress={this.props.onNextLesson}
        style={{
          backgroundColor: this.props.isMethod
            ? 'black'
            : colors.mainBackground,
          borderBottomColor: this.props.isMethod
            ? colors.pianoteGrey
            : colors.secondBackground,
          borderBottomWidth: 0.5,
          marginBottom: 7.5,
          paddingBottom: 5
        }}
      >
        <View style={{ width: '100%' }}>
          <View style={localStyles.container}>
            <View
              style={{
                flex: this.props.progress / 100,
                backgroundColor: colors.pianoteRed
              }}
            />
            <View
              style={{
                flex: 1 - this.props.progress / 100,
                backgroundColor: this.props.isMethod
                  ? colors.pianoteGrey
                  : colors.secondBackground
              }}
            />
          </View>
          <View style={localStyles.nextLesson}>
            <Text
              style={{
                fontSize: sizing.descriptionText,
                marginBottom: 5,
                paddingVertical: 2.5,
                textAlign: 'left',
                fontFamily: 'RobotoCondensed-Bold',
                color: this.props.isMethod
                  ? colors.pianoteGrey
                  : colors.secondBackground
              }}
            >
              YOUR NEXT LESSON
            </Text>
            <Text
              style={[
                localStyles.typeText,
                {
                  fontSize: sizing.descriptionText,
                  color: this.props.isMethod
                    ? colors.pianoteGrey
                    : colors.secondBackground
                }
              ]}
            >
              {this.props.type.charAt(0) +
                this.props.type.slice(1).toLowerCase()}{' '}
              - {this.props.progress}% Complete
            </Text>
          </View>
          <View style={localStyles.videoContainer}>
            <View
              style={{ justifyContent: 'center' }}
              underlayColor={'transparent'}
            >
              <FastImage
                style={localStyles.image}
                source={{
                  uri: `https://cdn.musora.com/image/fetch/w_${Math.round(
                    width * 0.24 * 2
                  )},ar_16:9,fl_lossy,q_auto:eco,c_fill,g_face/${
                    this.props.item.thumbnail_url
                  }`
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
            </View>
            <View style={localStyles.titleTextContainer}>
              <Text
                style={[
                  localStyles.videoTitle,
                  { fontSize: sizing.descriptionText }
                ]}
              >
                {this.props.item.title}
              </Text>
              <Text
                numberOfLines={2}
                style={[
                  localStyles.videoTitleText,
                  {
                    fontSize: sizing.descriptionText,
                    fontFamily: 'OpenSans-Regular',
                    textAlign: 'left',
                    color: this.props.isMethod
                      ? colors.pianoteGrey
                      : colors.secondBackground
                  }
                ]}
              >
                {this.props.item.length_in_seconds
                  ? Math.round(this.props.item.length_in_seconds / 60)
                  : 0}{' '}
                Mins
              </Text>
            </View>
            <View style={[styles.centerContent, localStyles.play]}>
              <Icon.Entypo
                name={'controller-play'}
                size={onTablet ? 35 : 22.5}
                color={colors.pianoteRed}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
}

const localStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 1.5
  },
  nextLesson: {
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10
  },
  typeText: {
    fontFamily: 'OpenSans-Regular',
    textAlign: 'right'
  },
  videoContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10
  },
  image: {
    width: DeviceInfo.isTablet()
      ? Dimensions.get('window').width * 0.15
      : Dimensions.get('window').width * 0.225,
    aspectRatio: 16 / 9,
    borderRadius: 5
  },
  videoTitle: {
    textAlign: 'left',
    fontWeight: 'bold',
    fontFamily: 'OpenSans-Regular',
    color: 'white'
  },
  play: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  titleTextContainer: {
    paddingHorizontal: 10,
    alignSelf: 'center'
  }
});
