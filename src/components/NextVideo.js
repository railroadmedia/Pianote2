import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from '../assets/icons';

const onTablet = global.onTablet;

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
        <View
          style={{
            backgroundColor: this.props.isMethod
              ? colors.pianoteGrey
              : colors.secondBackground,
            height: 3
          }}
        >
          <View
            style={{
              height: '100%',
              position: 'absolute',
              width: `${this.props.progress || 0}%`,
              backgroundColor: colors.pianoteRed
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
            {this.props.type.charAt(0) + this.props.type.slice(1).toLowerCase()}{' '}
            - {this.props.progress}% Complete
          </Text>
        </View>
        <View style={localStyles.videoContainer}>
          <FastImage
            style={localStyles.image}
            source={{
              uri: `https://cdn.musora.com/image/fetch/w_250,ar_16:9,fl_lossy,q_auto:eco,c_fill,g_face/${this.props.item.thumbnail_url}`
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
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
    width: onTablet
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
