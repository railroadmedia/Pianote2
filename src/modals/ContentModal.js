import React from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import {
  likeContent,
  unlikeContent,
  addToMyList,
  removeFromMyList
} from '../../src/services/UserActions.js';
import FastImage from 'react-native-fast-image';
import Icon from '../assets/icons';
import { Download_V2 } from 'RNDownload';
import contentService from '../services/content.service';

const isTablet = global.onTablet;

export default class ContentModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: props.data.type || '',
      thumbnail: props.data.thumbnail_url || '',
      title: props.data.title || '',
      artist: props.data.artist || '',
      instructor: props.data.instructors || '',
      description: props.data.description || '',
      bundle_number: props.data.bundle_number || '',
      lesson_count: props.data.lesson_count || 0,
      xp: props.data.xp || 0,
      id: props.data.id || 0,
      isLiked: props.data.is_liked_by_current_user || false,
      like_count: props.data.like_count || 0,
      isAddedToList: props.data.is_added_to_primary_playlist || false
    };
  }

  toggleMyList = contentID => {
    if (!this.state.isAddedToList) {
      this.props.addToMyList(contentID);
      this.setState({ isAddedToList: true });
      addToMyList(contentID);
    } else {
      this.props.removeFromMyList(contentID);
      this.setState({ isAddedToList: false });
      removeFromMyList(contentID);
    }
  };

  changeType = word => {
    word = word.replace(/[- )(]/g, ' ').split(' ');
    let string = '';
    for (i in word) string = string + word[i] + ' ';
    return string;
  };

  toggleLike = contentID => {
    if (!this.state.isLiked) {
      this.setState({
        isLiked: true,
        like_count: Number(this.state.like_count) + 1
      });
      this.props.like(contentID);
      likeContent(contentID);
    } else {
      this.setState({
        isLiked: false,
        like_count: Number(this.state.like_count) - 1
      });
      this.props.like(contentID);
      unlikeContent(contentID);
    }
  };

  render = () => {
    return (
      <TouchableWithoutFeedback
        style={styles.container}
        onPress={() => this.props.hideContentModal()}
      >
        <View style={[styles.container, styles.centerContent]}>
          <View style={localStyles.container}>
            <View
              style={[
                localStyles.imageContainer,
                { aspectRatio: this.state.type == 'song' ? 1 : 16 / 9 }
              ]}
            >
              <FastImage
                style={localStyles.image}
                source={{
                  uri:
                    this.state.thumbnail ||
                    `https://cdn.musora.com/image/fetch/fl_lossy,q_auto:eco,e_grayscale/${fallbackThumb}`
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
            </View>
            <Text style={localStyles.title}>{this.state.title}</Text>
            <Text style={localStyles.type}>
              {this.changeType(this.state.type)}/{' '}
              {this.state.artist || this.state.instructor}
            </Text>
            <Text numberOfLines={5} style={localStyles.description}>
              {this.state.description}
            </Text>
            <View style={[styles.centerContent, { flexDirection: 'row' }]}>
              <View style={{ flex: 1 }} />
              {(this.state.bundle_number > 1 ||
                this.state.lesson_count > 1) && (
                <View style={[styles.centerContent, { flex: 1 }]}>
                  <Text style={localStyles.lessonCount}>
                    {this.state.lesson_count > 1
                      ? this.state.lesson_count
                      : this.state.bundle_number}
                  </Text>
                  <Text style={localStyles.lessons}>LESSONS</Text>
                </View>
              )}
              {(this.state.bundle_number > 1 ||
                this.state.lesson_count > 1) && <View style={{ flex: 0.6 }} />}
              <View style={[styles.centerContent, { flex: 1 }]}>
                <Text style={localStyles.xp}>{this.state.xp}</Text>
                <Text style={localStyles.XPtext}>XP</Text>
              </View>
              <View style={{ flex: 1 }} />
            </View>
            <View style={localStyles.button}>
              <TouchableOpacity
                style={localStyles.likeContainer}
                onPress={() => this.toggleLike(this.state.id)}
              >
                <Icon.AntDesign
                  name={this.state.isLiked ? 'like1' : 'like2'}
                  size={sizing.myListButtonSize * 0.9}
                />
                <Text style={localStyles.likeCount}>
                  {this.state.like_count}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.centerContent}
                onPress={() => this.toggleMyList(this.state.id)}
              >
                <Icon.AntDesign
                  size={sizing.myListButtonSize}
                  name={this.state.isAddedToList ? 'close' : 'plus'}
                  color={'black'}
                />
                <Text style={localStyles.myList}>My List</Text>
              </TouchableOpacity>
              <Download_V2
                entity={{
                  id: this.state.id,
                  content: contentService.getContent(this.state.id, true)
                }}
                styles={{
                  iconSize: {
                    width: sizing.myListButtonSize,
                    height: sizing.myListButtonSize
                  },
                  touchable: { flex: 1 },
                  activityIndicatorColor: colors.pianoteRed,
                  animatedProgressBackground: colors.pianoteRed,
                  textStatus: {
                    color: 'black',
                    fontSize: sizing.descriptionText,
                    fontFamily: 'OpenSans-Regular'
                  },
                  alert: {
                    alertTextMessageFontFamily: 'OpenSans-Regular',
                    alertTouchableTextDeleteColor: 'white',
                    alertTextTitleColor: 'black',
                    alertTextMessageColor: 'black',
                    alertTextTitleFontFamily: 'OpenSans-Bold',
                    alertTouchableTextCancelColor: colors.pianoteRed,
                    alertTouchableDeleteBackground: colors.pianoteRed,
                    alertBackground: 'white',
                    alertTouchableTextDeleteFontFamily: 'OpenSans-Bold',
                    alertTouchableTextCancelFontFamily: 'OpenSans-Bold'
                  }
                }}
              />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };
}

const localStyles = StyleSheet.create({
  container: {
    margin: 40,
    borderRadius: 10,
    shadowOffset: {
      width: 5,
      height: 10
    },
    shadowColor: 'black',
    shadowOpacity: 0.1,
    elevation: 3,
    backgroundColor: 'white'
  },
  imageContainer: {
    width: isTablet ? '75%' : '95%',
    backgroundColor: 'white',
    zIndex: 10,
    marginTop: 10,
    marginHorizontal: 10
  },
  title: {
    fontFamily: 'OpenSans-Regular',
    fontWeight: 'bold',
    paddingHorizontal: 10,
    fontSize: isTablet ? 24 : 18,
    textAlign: 'center',
    marginTop: 5
  },
  type: {
    fontFamily: 'OpenSans-Regular',
    textAlign: 'center',
    fontSize: isTablet ? 16 : 12,
    color: 'grey',
    marginVertical: 5,
    textTransform: 'capitalize'
  },
  image: {
    flex: 1,
    borderRadius: 10
  },
  description: {
    marginHorizontal: 10,
    fontFamily: 'OpenSans-Regular',
    paddingHorizontal: 5,
    fontSize: isTablet ? 16 : 12,
    textAlign: 'center'
  },
  myList: {
    fontFamily: 'OpenSans-Regular',
    fontSize: isTablet ? 16 : 12,
    textAlign: 'left'
  },
  likeCount: {
    fontFamily: 'OpenSans-Regular',
    fontSize: isTablet ? 16 : 12,
    textAlign: 'left'
  },
  likeContainer: {
    flex: 1,
    alignItems: 'center'
  },
  button: {
    flexDirection: 'row',
    padding: 20
  },
  XPtext: {
    fontFamily: 'OpenSans-Regular',
    fontSize: isTablet ? 16 : 12,
    textAlign: 'left',
    marginTop: 5
  },
  xp: {
    fontFamily: 'OpenSans-Regular',
    fontWeight: 'bold',
    fontSize: isTablet ? 24 : 18,
    textAlign: 'left'
  },
  lessonCount: {
    fontFamily: 'OpenSans-Regular',
    fontWeight: 'bold',
    fontSize: isTablet ? 24 : 18,
    textAlign: 'left'
  },
  lessons: {
    fontFamily: 'OpenSans-Regular',
    fontSize: isTablet ? 16 : 12,
    textAlign: 'left'
  }
});
