/**
 * Taskbar for navigation
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from 'react-native';
import { withNavigation } from 'react-navigation';
import FastImage from 'react-native-fast-image';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { ContentModel } from '@musora/models';

class NextVideo extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {};
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
          borderBottomWidth: 0.25 * factorRatio
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
                fontSize: 16 * factorRatio,
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
                  color: this.props.isMethod
                    ? colors.pianoteGrey
                    : colors.secondBackground
                }
              ]}
            >
              {this.props.type} - {this.props.progress}% COMPLETE
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
                    fullWidth * 0.24 * 2
                  )},ar_16:9,fl_lossy,q_auto:eco,c_fill,g_face/${this.props.item.getData(
                    'thumbnail_url'
                  )}`
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
            </View>
            <View style={localStyles.titleTextContainer}>
              <Text style={localStyles.videoTitle}>
                {this.props.item.getField('title')}
              </Text>
              <Text
                numberOfLines={2}
                style={[
                  localStyles.videoTitleText,
                  {
                    color: this.props.isMethod
                      ? colors.pianoteGrey
                      : colors.secondBackground
                  }
                ]}
              >
                {this.props.item.post.fields?.find(f => f.key === 'video')
                  ? Math.round(
                      new ContentModel(
                        this.props.item.getFieldMulti('video')[0]
                      )?.getField('length_in_seconds') / 60
                    )
                  : 0}{' '}
                MINS
              </Text>
            </View>
            <View
              onPress={() => {}}
              style={[styles.centerContent, localStyles.play]}
            >
              <View style={{ flex: 1 }} />
              <EntypoIcon
                name={'controller-play'}
                size={30 * factorRatio}
                color={colors.pianoteRed}
              />
            </View>
          </View>
        </View>
        <View style={{ height: 15 * factorVertical }} />
      </TouchableOpacity>
    );
  };
}

const localStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height:
      (3 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2
  },
  nextLesson: {
    marginTop: (10 * Dimensions.get('window').height) / 812,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15
  },
  typeText: {
    fontSize:
      (12 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
    fontFamily: 'OpenSans-Regular',
    textAlign: 'right'
  },
  videoContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15
  },
  image: {
    width: Dimensions.get('window').width * 0.24,
    aspectRatio: 16 / 9,
    borderRadius:
      (7 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2
  },
  videoTitle: {
    fontSize:
      (15 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
    marginBottom: 2,
    textAlign: 'left',
    fontWeight: 'bold',
    fontFamily: 'OpenSans-Regular',
    color: 'white'
  },
  play: {
    flex: 1,
    flexDirection: 'row'
  },
  videoTitleText: {
    fontSize:
      (12 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
    fontFamily: 'OpenSans-Regular',
    textAlign: 'left'
  },
  titleTextContainer: {
    paddingLeft: 15,
    alignSelf: 'center'
  }
});

export default withNavigation(NextVideo);
