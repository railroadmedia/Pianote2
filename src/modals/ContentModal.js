/**
 * ContentModal
 */
import React from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet, 
  Dimensions
} from 'react-native';
import {
  likeContent,
  unlikeContent,
  addToMyList,
  removeFromMyList
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
      type:
        typeof this.props.data.type !== 'undefined' ? this.props.data.type : '',
      thumbnail:
        typeof this.props.data.thumbnail !== 'undefined'
          ? this.props.data.thumbnail
          : '',
      title:
        typeof this.props.data.title !== 'undefined'
          ? this.props.data.title
          : '',
      artist:
        typeof this.props.data.artist !== 'undefined'
          ? this.props.data.artist
          : '',
      description:
        typeof this.props.data.description !== 'undefined'
          ? this.props.data.description
          : '',
      bundle_count:
        typeof this.props.data.bundle_count !== 'undefined'
          ? this.props.data.bundle_count
          : 0,
      lesson_count:
        typeof this.props.data.lesson_count !== 'undefined'
          ? this.props.data.lesson_count
          : 0,
      xp: typeof this.props.data.xp !== 'undefined' ? this.props.data.xp : 0,
      id: typeof this.props.data.id !== 'undefined' ? this.props.data.id : 0,
      isLiked:
        typeof this.props.data.isLiked !== 'undefined'
          ? this.props.data.isLiked
          : false,
      like_count:
        typeof this.props.data.like_count !== 'undefined'
          ? this.props.data.like_count
          : 0,
      isAddedToList:
        typeof this.props.data.isAddedToList !== 'undefined'
          ? this.props.data.isAddedToList
          : false
    };
  }

  componentDidMount = () => {
    console.log(this.state.isLiked);
  };

  addToMyList = contentID => {
    if (this.props.data.description !== 'TBD') {
      // change status of content on parent data structure
      this.props.addToMyList(contentID);
      // make added to list on current data structure
      this.state.isAddedToList = true;
      this.setState({ isAddedToList: this.state.isAddedToList });
      // add to list on backend
      addToMyList(contentID);
    }
  };

  removeFromMyList = contentID => {
    // change status of parent data
    this.props.removeFromMyList(contentID);
    // change data on modal
    this.state.isAddedToList = false;
    this.setState({ isAddedToList: this.state.isAddedToList });
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
    if (this.props.data.description !== 'TBD') {
      // change data on modal
      this.state.isLiked = !this.state.isLiked;
      this.state.like_count = Number(this.state.like_count) + 1;
      this.setState({
        isLiked: this.state.isLiked,
        like_count: this.state.like_count
      });
      // change data on parent data
      // ADD IN
      // like on backend
      likeContent(contentID);
    }
  };

  unlike = contentID => {
    // change data on modal
    this.state.isLiked = !this.state.isLiked;
    this.state.like_count = Number(this.state.like_count) - 1;
    this.setState({
      isLiked: this.state.isLiked,
      like_count: this.state.like_count
    });
    // change data on parent data
    // ADD IN
    // unlike on backend
    unlikeContent(contentID);
  };

  render = () => {
    return (
      <TouchableWithoutFeedback
        style={styles.container}  
        onPress={() => this.props.hideContentModal()}  
      >
        <View style={[styles.container,styles.centerContent]}>
          <View style={localStyles.container}>
            <View key={'image'} style={styles.centerContent}>
              <View style={[localStyles.imageContainer, {aspectRatio: this.state.type == 'song' ? 1 : 16 / 9}]}>
                <FastImage
                  style={localStyles.image}
                  source={{
                    uri:
                      this.state.thumbnail == 'TBD'
                        ? `https://cdn.musora.com/image/fetch/fl_lossy,q_auto:eco,e_grayscale/${fallbackThumb}`
                        : this.state.thumbnail
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                />
              </View>
            </View>
            <Text style={localStyles.title}>{this.state.title}</Text>
            <Text style={localStyles.type}>{this.changeType(this.state.type)}/ {this.state.artist}</Text>
            <Text numberOfLines={5} style={localStyles.description}>
              {this.state.description}
            </Text>
            <View style={[styles.centerContent, {flexDirection: 'row'}]}>
              <View style={{ flex: 1 }} />
              {(this.state.bundle_count > 1 || this.state.lesson_count > 1) && (
                <View
                  style={[
                    styles.centerContent,
                    {
                      width: 70 * factorRatio
                    }
                  ]}
                >
                  <Text style={localStyles.lessonCount}>
                    {this.state.lesson_count > 1
                      ? this.state.lesson_count
                      : this.state.bundle_count}
                  </Text>
                  <Text style={localStyles.lessons}>LESSONS</Text>
                </View>
              )}
              {(this.state.bundle_count > 1 || this.state.lesson_count > 1) && (
                <View style={{ flex: 0.6 }} />
              )}
              <View
                style={[
                  styles.centerContent,
                  {
                    width: 70 * factorRatio
                  }
                ]}
              >
                <Text style={localStyles.xp}>{this.state.xp}</Text>
                <Text style={localStyles.XPtext}>XP</Text>
              </View>
              <View style={{ flex: 1 }} />
            </View>
            <View style={localStyles.button}>
              <TouchableOpacity
                style={localStyles.likeContainer}
                onPress={() => {
                  this.state.isLiked
                    ? this.unlike(this.state.id)
                    : this.like(this.state.id);
                }}
              >
                <AntIcon name={this.state.isLiked ? 'like1' : 'like2'} size={25 * factorRatio}/>
                <View style={{ flex: 1 }} />
                <Text style={localStyles.likeCount}>{this.state.like_count}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.centerContent}
                onPress={() => {
                  this.state.isAddedToList
                    ? this.removeFromMyList(this.state.id)
                    : this.addToMyList(this.state.id);
                }}
              >
                <AntIcon
                  size={25 * factorRatio}
                  name={this.state.isAddedToList ? 'close' : 'plus'}
                  color={'black'}
                />
                <View style={{ flex: 1 }} />
                <Text style={localStyles.myList}>My List</Text>
              </TouchableOpacity>
              <Download_V2
                entity={{
                  id: this.state.id,
                  content: contentService.getContent(this.state.id, true)
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

const localStyles = StyleSheet.create({
  container: {
    margin: 40 * (Dimensions.get('window').height / 812 + Dimensions.get('window').width / 375) / 2,
    borderRadius: 10 * (Dimensions.get('window').height / 812 + Dimensions.get('window').width / 375) / 2,
    shadowOffset: {
      width: 5 * (Dimensions.get('window').height / 812 + Dimensions.get('window').width / 375) / 2,
      height: 10 * (Dimensions.get('window').height / 812 + Dimensions.get('window').width / 375) / 2
    },
    shadowColor: 'black',
    shadowOpacity: 0.1,
    elevation: 3,
    backgroundColor: 'white'
  },
  imageContainer: {
    height: 180 * (Dimensions.get('window').height / 812 + Dimensions.get('window').width / 375) / 2,
    backgroundColor: 'white',
    zIndex: 10,
    marginTop: 10 * (Dimensions.get('window').height / 812 + Dimensions.get('window').width / 375) / 2,
    marginHorizontal: 12.5 * (Dimensions.get('window').height / 812 + Dimensions.get('window').width / 375) / 2
  },
  title: {
    fontFamily: 'OpenSans-Regular',
    fontWeight: 'bold',
    fontSize: 22 * (Dimensions.get('window').height / 812 + Dimensions.get('window').width / 375) / 2,
    textAlign: 'center'
  },
  type: {
    fontFamily: 'OpenSans-Regular',
    textAlign: 'center',
    fontSize: 12 * (Dimensions.get('window').height / 812 + Dimensions.get('window').width / 375) / 2,
    color: 'grey'
  },
  image: {
    flex: 1, 
    borderRadius: 10
  },
  description: {
    marginHorizontal: 10 * (Dimensions.get('window').height / 812 + Dimensions.get('window').width / 375) / 2,
    fontFamily: 'OpenSans-Regular',
    fontSize: 14 * (Dimensions.get('window').height / 812 + Dimensions.get('window').width / 375) / 2,
    textAlign: 'center'
  },
  myList: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 12 * (Dimensions.get('window').height / 812 + Dimensions.get('window').width / 375) / 2,
    textAlign: 'left',
    marginTop: 10 * (Dimensions.get('window').height / 812)
  },
  likeCount: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 12 * (Dimensions.get('window').height / 812 + Dimensions.get('window').width / 375) / 2,
    textAlign: 'left',
    marginTop: 15 * (Dimensions.get('window').height / 812)
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
    fontSize: 12 * (Dimensions.get('window').height / 812 + Dimensions.get('window').width / 375) / 2,
    textAlign: 'left',
    marginTop: 5 * Dimensions.get('window').height / 812
  },
  xp: {
    fontFamily: 'OpenSans-Regular',
    fontWeight: 'bold',
    fontSize: 18 * (Dimensions.get('window').height / 812 + Dimensions.get('window').width / 375) / 2,
    textAlign: 'left',
    marginTop: 10 * (Dimensions.get('window').height / 812 )
  },
  lessonCount: {
    fontFamily: 'OpenSans-Regular',
    fontWeight: 'bold',
    fontSize: 18 * (Dimensions.get('window').height / 812 + Dimensions.get('window').width / 375) / 2,
    textAlign: 'left',
    marginTop: 10 * (Dimensions.get('window').height / 812 )
  },
  lessons: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 12 * (Dimensions.get('window').height / 812 + Dimensions.get('window').width / 375) / 2,
    textAlign: 'left',
    marginTop: 5 * (Dimensions.get('window').height / 812 )
  }
})
export default withNavigation(ContentModal);
