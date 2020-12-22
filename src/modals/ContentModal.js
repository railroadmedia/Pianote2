/**
 * ContentModal
 */
import React from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity
} from 'react-native';
import {
  likeContent,
  unlikeContent,
  addToMyList,
  removeFromMyList,
} from 'Pianote2/src/services/UserActions.js';
import FastImage from 'react-native-fast-image';
import { withNavigation } from 'react-navigation';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { Download_V2 } from 'RNDownload';
import contentService from '../services/content.service';

class ContentModal extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data
    };
  }

  addToMyList = contentID => {
    // change status of content on parent data structure
    this.props.addToMyList(contentID);
    // make added to list on current data structure
    this.state.data.isAddedToList = true;
    this.setState({ data: this.state.data });
    // add to list on backend
    addToMyList(contentID);
  };

  removeFromMyList = contentID => {
    // change status of parent data
    this.props.removeFromMyList(contentID);
    // change data on modal
    this.state.data.isAddedToList = false;
    this.setState({ data: this.state.data });
    // change data on backend
    removeFromMyList(contentID);
  };

  changeType = word => {
    word = word.replace(/[- )(]/g, ' ').split(' ');
    let string = '';

    for (let i = 0; i < word.length; i++) {
      if (word[i] !== 'and') {
        word[i] = word[i][0].toUpperCase() + word[i].substr(1);
      }
    }

    for (i in word) {
      string = string + word[i] + ' ';
    }

    return string;
  };

  like = contentID => {
    // change data on modal
    this.state.data.isLiked = !this.state.data.isLiked;
    this.state.data.like_count = Number(this.state.data.like_count) + 1;
    this.setState({ data: this.state.data });
    // change data on parent data
    // ADD IN
    // like on backend
    likeContent(contentID);
  };

  unlike = contentID => {
    // change data on modal
    this.state.data.isLiked = !this.state.data.isLiked;
    this.state.data.like_count = Number(this.state.data.like_count) - 1;
    this.setState({ data: this.state.data });
    // change data on parent data
    // ADD IN
    // unlike on backend
    unlikeContent(contentID);
  };

  render = () => {
    const {
      type,
      thumbnail,
      title,
      artist,
      description,
      bundle_count,
      lesson_count,
      xp,
      id,
      isLiked,
      like_count,
      isAddedToList
    } = this.state.data;
    return (
      <TouchableWithoutFeedback
        onPress={() => this.props.hideContentModal()}
        style={{
          height: '100%',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'transparent'
        }}
      >
        <View
          style={{
            height: '100%',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'transparent'
          }}
        >
          <View
            style={{
              margin: 40 * factorRatio,
              paddingHorizontal: 15,
              borderRadius: 10 * factorRatio,
              shadowOffset: {
                width: 5 * factorRatio,
                height: 10 * factorRatio
              },
              shadowColor: 'black',
              shadowOpacity: 0.1,
              elevation: 3,
              backgroundColor: 'white'
            }}
          >
            <View key={'image'} style={styles.centerContent}>
              <View
                style={{
                  height: 180 * factorRatio,
                  aspectRatio: type == 'song' ? 1 : 16 / 9,
                  backgroundColor: 'white',
                  zIndex: 10,
                  marginTop: 10 * factorRatio
                }}
              >
                <FastImage
                  style={{ flex: 1, borderRadius: 10 }}
                  source={{
                    uri:
                      thumbnail && thumbnail !== 'TBD'
                        ? thumbnail
                        : fallbackThumb
                  }}
                  resizeMode={FastImage.resizeMode.stretch}
                />
              </View>
            </View>

            <Text
              style={{
                fontFamily: 'OpenSans-Regular',
                fontWeight: 'bold',
                fontSize: 22 * factorRatio,
                textAlign: 'center'
              }}
            >
              {title}
            </Text>

            <Text
              style={{
                fontFamily: 'OpenSans-Regular',
                textAlign: 'center',
                fontSize: 12 * factorRatio,
                color: 'grey'
              }}
            >
              {this.changeType(type)}/ {artist}
            </Text>

            <Text
              style={{
                fontFamily: 'OpenSans-Regular',
                fontSize: 14 * factorRatio,
                textAlign: 'center'
              }}
            >
              {description}
            </Text>
            <View
              key={'stats'}
              style={[
                styles.centerContent,
                {
                  flexDirection: 'row'
                }
              ]}
            >
              {(bundle_count > 1 || lesson_count) && (
                <View
                  style={[
                    styles.centerContent,
                    {
                      width: 70 * factorRatio
                    }
                  ]}
                >
                  <Text
                    style={{
                      fontFamily: 'OpenSans-Regular',
                      fontWeight: 'bold',
                      fontSize: 18 * factorRatio,
                      textAlign: 'left',
                      marginTop: 10 * factorVertical
                    }}
                  >
                    {lesson_count > 1 ? lesson_count : bundle_count}
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'OpenSans-Regular',
                      fontSize: 12 * factorRatio,
                      textAlign: 'left',
                      marginTop: 5 * factorVertical
                    }}
                  >
                    LESSONS
                  </Text>
                </View>
              )}
              {bundle_count > 1 && <View style={{ width: 15 * factorRatio }} />}
              <View
                style={[
                  styles.centerContent,
                  {
                    width: 70 * factorRatio
                  }
                ]}
              >
                <Text
                  style={{
                    fontFamily: 'OpenSans-Regular',
                    fontWeight: 'bold',
                    fontSize: 18 * factorRatio,
                    textAlign: 'left',
                    marginTop: 10 * factorVertical
                  }}
                >
                  {xp}
                </Text>
                <Text
                  style={{
                    fontFamily: 'OpenSans-Regular',
                    fontSize: 12 * factorRatio,
                    textAlign: 'left',
                    marginTop: 5 * factorVertical
                  }}
                >
                  XP
                </Text>
              </View>
            </View>
            <View style={{ height: 10 * factorVertical }} />
            <View key={'buttons'} style={{ flexDirection: 'row', padding: 20 }}>
              <TouchableOpacity
                style={{ flex: 1, alignItems: 'center' }}
                onPress={() => {
                  isLiked ? this.unlike(id) : this.like(id);
                }}
              >
                <AntIcon name={isLiked ? 'like1' : 'like2'} size={25} />
                <Text
                  style={{
                    fontFamily: 'OpenSans-Regular',
                    fontSize: 12 * factorRatio,
                    textAlign: 'left',
                    marginTop: 15 * factorVertical
                  }}
                >
                  {like_count}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flex: 1, alignItems: 'center' }}
                onPress={() =>
                  this[isAddedToList ? 'removeFromMyList' : 'addToMyList'](id)
                }
              >
                <AntIcon
                  size={25}
                  name={isAddedToList ? 'close' : 'plus'}
                  color={'black'}
                />
                <Text
                  style={{
                    fontFamily: 'OpenSans-Regular',
                    fontSize: 12 * factorRatio,
                    textAlign: 'left',
                    marginTop: 10 * factorVertical
                  }}
                >
                  My List
                </Text>
              </TouchableOpacity>
              <Download_V2
                entity={{
                  id,
                  content: contentService.getContent(id, true)
                }}
                styles={{
                  touchable: { flex: 1 },
                  activityIndicatorColor: colors.pianoteRed,
                  animatedProgressBackground: colors.pianoteRed,
                  textStatus: {
                    color: 'black',
                    fontSize: 12 * factorRatio,
                    fontFamily: 'OpenSans-Regular',
                    marginTop: 7.5 * factorVertical
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

export default withNavigation(ContentModal);
