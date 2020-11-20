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
  resetProgress
} from 'Pianote2/src/services/UserActions.js';
import FastImage from 'react-native-fast-image';
import { withNavigation } from 'react-navigation';
import AntIcon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

class ContentModal extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data
    };
  }

  UNSAFE_componentWillMount() {
    console.log('DATA: ', this.state.data);
  }

  addToMyList = async contentID => {
    // change status of content on parent data structure
    this.props.addToMyList(contentID);
    // make added to list on current data structure
    this.state.data.isAddedToList = true;
    this.setState({ data: this.state.data });
    // add to list on backend
    addToMyList(contentID);
  };

  removeFromMyList = async contentID => {
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

  like = async contentID => {
    // change data on modal
    this.state.data.isLiked = !this.state.data.isLiked;
    this.state.data.like_count = Number(this.state.data.like_count) + 1;
    this.setState({ data: this.state.data });
    // change data on parent data
    // ADD IN
    // like on backend
    let res = await likeContent(contentID);
    console.log('Like content: ', res);
  };

  unlike = async contentID => {
    // change data on modal
    this.state.data.isLiked = !this.state.data.isLiked;
    this.state.data.like_count = Number(this.state.data.like_count) - 1;
    this.setState({ data: this.state.data });
    // change data on parent data
    // ADD IN
    // unlike on backend
    unlikeContent(contentID);
  };

  download = async contentID => {};

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
      <View style={styles.container}>
        <View
          style={{
            position: 'absolute',
            zIndex: 5,
            elevation: 5,
            height: '100%',
            width: '100%'
          }}
        >
          <View style={{ flex: 0.9, alignSelf: 'stretch' }}>
            <TouchableWithoutFeedback
              onPress={() => this.props.hideContentModal()}
              style={{
                height: '100%',
                width: '100%',
                alignSelf: 'stretch'
              }}
            >
              <View style={{ flex: 1, alignSelf: 'stretch' }} />
            </TouchableWithoutFeedback>
          </View>
          <View
            key={'contentContainer'}
            style={{
              flexDirection: 'row',
              borderRadius: 10 * factorRatio
            }}
          >
            <TouchableWithoutFeedback
              onPress={() => this.props.hideContentModal()}
              style={{ width: fullWidth * 0.05 }}
            >
              <View style={{ flex: 1, alignSelf: 'stretch' }} />
            </TouchableWithoutFeedback>
            <View
              style={{
                width: fullWidth * 0.9,
                paddingLeft: 10 * factorHorizontal,
                paddingRight: 10 * factorHorizontal,
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
              <View style={{ height: fullHeight * 0.0225 }} />
              <View key={'image'} style={styles.centerContent}>
                <View
                  style={{
                    height: 180 * factorRatio,
                    width: type == 'song' ? 180 * factorRatio : fullWidth * 0.8,
                    backgroundColor: 'white',
                    zIndex: 10
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
              <View style={{ height: 10 * factorVertical }} />
              <View key={'title'} style={styles.centerContent}>
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
              </View>
              <View
                key={'artist'}
                style={[
                  styles.centerContent,
                  {
                    marginTop: 5 * factorRatio
                  }
                ]}
              >
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
              </View>
              <View style={{ height: 10 * factorVertical }} />
              <View
                key={'description'}
                style={[
                  styles.centerContent,
                  {
                    paddingLeft: fullWidth * 0.05,
                    paddingRight: fullWidth * 0.05
                  }
                ]}
              >
                <Text
                  style={{
                    fontFamily: 'OpenSans-Regular',
                    fontSize: 14 * factorRatio,
                    textAlign: 'left'
                  }}
                >
                  {description}
                </Text>
              </View>
              <View
                key={'stats'}
                style={[
                  styles.centerContent,
                  {
                    flexDirection: 'row'
                  }
                ]}
              >
                <View style={{ flex: 1, alignSelf: 'stretch' }} />
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
                {bundle_count > 1 && (
                  <View style={{ width: 15 * factorRatio }} />
                )}
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
                <View style={{ flex: 1, alignSelf: 'stretch' }} />
              </View>
              <View style={{ height: 10 * factorVertical }} />
              <View
                key={'buttons'}
                style={[
                  styles.centerContent,
                  {
                    flexDirection: 'row'
                  }
                ]}
              >
                <View style={{ flex: 1, alignSelf: 'stretch' }} />
                <View
                  style={[
                    styles.centerContent,
                    {
                      width: 70 * factorRatio
                    }
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => {
                      isLiked ? this.unlike(id) : this.like(id);
                    }}
                  >
                    <AntIcon
                      name={isLiked ? 'like1' : 'like2'}
                      size={25 * factorRatio}
                    />
                  </TouchableOpacity>
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
                </View>
                <View style={{ width: 15 * factorRatio }} />
                <View
                  style={[
                    styles.centerContent,
                    {
                      width: 70 * factorRatio
                    }
                  ]}
                >
                  <View>
                    {!isAddedToList && (
                      <TouchableOpacity
                        style={{
                          paddingTop: 5 * factorVertical
                        }}
                        onPress={() => this.addToMyList(id)}
                      >
                        <AntIcon
                          name={'plus'}
                          size={30 * factorRatio}
                          color={'black'}
                        />
                      </TouchableOpacity>
                    )}
                    {isAddedToList && (
                      <TouchableOpacity
                        style={{
                          paddingTop: 5 * factorVertical
                        }}
                        onPress={() => this.removeFromMyList(id)}
                      >
                        <AntIcon
                          name={'close'}
                          size={30 * factorRatio}
                          color={'black'}
                        />
                      </TouchableOpacity>
                    )}
                  </View>

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
                </View>
                <View style={{ width: 15 * factorRatio }} />
                <View
                  style={[
                    styles.centerContent,
                    {
                      width: 70 * factorRatio
                    }
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => {
                      resetProgress(id);
                      this.download(id);
                    }}
                  >
                    <MaterialIcon
                      name={'arrow-collapse-down'}
                      size={30 * factorRatio}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontFamily: 'OpenSans-Regular',
                      fontSize: 12 * factorRatio,
                      textAlign: 'left',
                      marginTop: 10 * factorVertical
                    }}
                  >
                    Download
                  </Text>
                </View>
                <View style={{ flex: 1, alignSelf: 'stretch' }} />
              </View>
              <View style={{ height: 20 * factorVertical }} />
            </View>
            <TouchableWithoutFeedback
              onPress={() => this.props.hideContentModal()}
              style={{ width: fullWidth * 0.05 }}
            >
              <View style={{ flex: 1, alignSelf: 'stretch' }} />
            </TouchableWithoutFeedback>
          </View>
          <View style={{ flex: 1.1, alignSelf: 'stretch' }}>
            <TouchableWithoutFeedback
              onPress={() => this.props.hideContentModal()}
              style={{
                height: '100%',
                width: '100%',
                alignSelf: 'stretch'
              }}
            >
              <View style={{ flex: 1, alignSelf: 'stretch' }} />
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    );
  };
}

export default withNavigation(ContentModal);
