/**
 * HorizontalVideoList
 */
import React from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TouchableHighlight,
  Platform,
  Image
} from 'react-native';
import {
  addToMyList,
  removeFromMyList
} from 'Pianote2/src/services/UserActions.js';
import Modal from 'react-native-modal';
import FastImage from 'react-native-fast-image';
import { withNavigation } from 'react-navigation';
import ContentModal from '../modals/ContentModal';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { NetworkContext } from '../context/NetworkProvider';
import ApprovedTeacher from 'Pianote2/src/assets/img/svgs/approved-teacher.svg';
import Progress from 'Pianote2/src/assets/img/svgs/progress.svg';

let greaterWDim;

class HorizontalVideoList extends React.Component {
  static navigationOptions = { header: null };
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      items: this.props.items,
      isLoading: this.props.isLoading
    };
    greaterWDim = fullHeight < fullWidth ? fullWidth : fullHeight;
  }

  componentDidUpdate(prevProps) {
    let { items: pItems } = prevProps;
    let myListStatusChanged, progressChanged;
    if (this.props.items.length !== pItems.length) progressChanged = true;
    else if (
      this.props.items.some(item =>
        pItems.some(
          pItem =>
            item.id === pItem.id && item.isAddedToList !== pItem.isAddedToList
        )
      )
    )
      myListStatusChanged = true;
    if (progressChanged || myListStatusChanged)
      this.setState({ items: this.props.items });
  }

  addToMyList = contentID => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    // change data structure
    for (i in this.state.items) {
      if (this.state.items[i].id == contentID) {
        this.state.items[i].isAddedToList = true;
      }
    }
    this.setState({ items: this.state.items });

    addToMyList(contentID);
  };

  removeFromMyList = contentID => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    for (i in this.state.items) {
      if (this.state.items[i].id == contentID) {
        this.state.items[i].isAddedToList = false;
      }
    }
    this.setState({ items: this.state.items });
    removeFromMyList(contentID);
  };

  showFooter = () => {
    if (this.state.items.length == 0) {
      return (
        <View
          style={[
            styles.centerContent,
            {
              height: '100%'
            }
          ]}
        >
          <View style={{ flex: 0.33 }} />
          <ActivityIndicator
            size={onTablet ? 'large' : 'small'}
            animating={true}
            color={colors.secondBackground}
          />
          <View style={{ flex: 0.66 }} />
        </View>
      );
    }
  };

  like = contentID => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    for (i in this.state.items) {
      if (this.state.items[i].id == contentID) {
        this.state.items[i].isLiked = !this.state.items.isLiked;
        this.state.items[i].like_count = this.state.items.isLiked
          ? this.state.items.like_count + 1
          : this.state.items.like_count - 1;
      }
    }
    this.setState({ items: this.state.items });
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

  navigate = (content, index) => {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    switch (content.type) {
      case 'course':
        return this.props.navigation.navigate('PATHOVERVIEW', {
          data: content
        });
      case 'song':
        if (content.lesson_count === 1)
          return this.props.navigation.navigate('VIDEOPLAYER', {
            id: content.currentLessonId
          });
        return this.props.navigation.navigate('PATHOVERVIEW', {
          data: content
        });
      case 'learning-path':
        return this.props.navigation.navigate('FOUNDATIONS', {
          url: content.mobile_app_url
        });
      case 'unit':
        return this.props.navigation.navigate('FOUNDATIONSLEVEL', {
          url: content.mobile_app_url,
          level: index + 1
        });
      case 'unit-part':
        return this.props.navigation.push('VIDEOPLAYER', {
          url: content.mobile_app_url
        });
      case 'pack':
        return this.props.navigation.push('SINGLEPACK', {
          url: content.mobile_app_url
        });
      case 'pack-bundle':
        return this.props.navigation.push('SINGLEPACK', {
          url: content.mobile_app_url
        });
      case 'pack-bundle-lesson':
        return this.props.navigation.push('VIDEOPLAYER', {
          url: content.mobile_app_url
        });
      default:
        return this.props.navigation.navigate('VIDEOPLAYER', {
          id: content.id
        });
    }
  };

  render = () => {
    return (
      <View style={styles.container}>
        <View
          key={'container'}
          style={[
            styles.centerContent,
            {
              minHeight: this.props.itemHeight
            }
          ]}
        >
          <View
            key={'title'}
            style={[
              styles.centerContent,
              {
                width: fullWidth - 20 * factorHorizontal
              }
            ]}
          >
            <View style={{ height: 10 * factorVertical }} />
            <View
              key={'title'}
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignContent: 'center',
                paddingBottom: 5 * factorVertical
              }}
            >
              <Text
                style={{
                  fontSize: 18 * factorRatio,
                  marginBottom: 5 * factorVertical,
                  textAlign: 'left',
                  fontFamily: 'RobotoCondensed-Bold',
                  color: colors.secondBackground
                }}
              >
                {this.props.Title}
              </Text>
              <View style={{ flex: 1 }} />
              {!this.props.hideSeeAll && (
                <TouchableOpacity
                  key={'seeAll'}
                  style={{ flex: 1 }}
                  onPress={() => this.props.seeAll()}
                >
                  <Text
                    style={{
                      textAlign: 'right',
                      fontSize: 14.5 * factorRatio,
                      marginRight: 3.5 * factorHorizontal,
                      fontWeight: '300',
                      marginTop: 5 * factorVertical,
                      color: 'red'
                    }}
                  >
                    See All
                  </Text>
                </TouchableOpacity>
              )}
              <View style={{ flex: 0.1 }} />
            </View>
          </View>

          {this.state.isLoading && (
            <View
              style={[
                styles.centerContent,
                {
                  width: fullWidth,
                  height: this.props.itemHeight + 80 * factorVertical,
                  alignSelf: 'stretch'
                }
              ]}
            >
              {this.showFooter()}
            </View>
          )}
          {!this.state.isLoading && (
            <FlatList
              key={'videos'}
              data={this.state.items}
              extraData={this.state}
              horizontal={true}
              style={{
                width: '100%'
              }}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onLongPress={() => {
                    this.setState({
                      showModal: true,
                      item
                    });
                  }}
                  delayLongPress={350}
                  onPress={() => this.navigate(item, index)}
                >
                  <View
                    style={[
                      styles.centerContent,
                      {
                        width: this.props.itemWidth,
                        height: this.props.itemHeight,
                        marginRight: 10 * factorHorizontal,
                        borderRadius: 7.5 * factorRatio
                      }
                    ]}
                  >
                    {item.isCompleted && (
                      <View
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: this.props.itemWidth,
                          height: this.props.itemHeight,
                          borderRadius: 7.5 * factorRatio,
                          zIndex: 1,
                          opacity: 0.2,
                          backgroundColor: colors.pianoteRed
                        }}
                      />
                    )}

                    <View
                      style={[
                        styles.centerContent,
                        {
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: this.props.itemWidth,
                          height: this.props.itemHeight,
                          zIndex: 2
                        }
                      ]}
                    >
                      {item.isStarted ? (
                        <Progress
                          height={50}
                          width={50 * factorRatio}
                          fill={'white'}
                        />
                      ) : item.isCompleted ? (
                        <ApprovedTeacher
                          height={60}
                          width={60 * factorRatio}
                          fill={'white'}
                        />
                      ) : null}
                    </View>

                    <View
                      style={{
                        flex: 1,
                        alignSelf: 'stretch'
                      }}
                    >
                      {Platform.OS === 'ios' ? (
                        <FastImage
                          style={{
                            flex: 1,
                            borderRadius: 7.5 * factorRatio
                          }}
                          source={{
                            uri:
                              item.thumbnail && item.thumbnail !== 'TBD'
                                ? `https://cdn.musora.com/image/fetch/w_${Math.round(
                                    this.props.itemWidth * 2
                                  )},ar_${
                                    this.props.itemWidth ===
                                    this.props.itemHeight
                                      ? '1'
                                      : '16:9'
                                  },fl_lossy,q_auto:eco,c_fill,g_face/${
                                    item.thumbnail
                                  }`
                                : fallbackThumb
                          }}
                          resizeMode={FastImage.resizeMode.cover}
                        />
                      ) : (
                        <Image
                          style={{
                            flex: 1,
                            borderRadius: 7.5 * factorRatio
                          }}
                          resizeMode='cover'
                          source={{
                            uri:
                              item.thumbnail && item.thumbnail !== 'TBD'
                                ? `https://cdn.musora.com/image/fetch/w_${Math.round(
                                    this.props.itemWidth * 2
                                  )},ar_${
                                    this.props.itemWidth ===
                                    this.props.itemHeight
                                      ? '1'
                                      : '16:9'
                                  },fl_lossy,q_auto:eco,c_fill,g_face/${
                                    item.thumbnail
                                  }`
                                : fallbackThumb
                          }}
                        />
                      )}
                    </View>
                  </View>

                  <View
                    style={{
                      width: this.props.itemWidth,
                      height: 80 * factorVertical,
                      flexDirection: 'row'
                    }}
                  >
                    <View style={{ flex: 0.8 }}>
                      <Text
                        numberOfLines={2}
                        style={{
                          fontSize: 15.5 * factorRatio,
                          marginTop: 7.5 * factorRatio,
                          textAlign: 'left',
                          fontWeight: Platform.OS == 'ios' ? '800' : 'bold',
                          fontFamily: 'OpenSans-Regular',
                          color: 'white'
                        }}
                      >
                        {item.title}
                      </Text>
                      <View
                        style={{
                          height: 3 * factorRatio
                        }}
                      />
                      <View
                        style={{
                          flexDirection: 'row'
                        }}
                      >
                        {this.props.showType && (
                          <Text
                            numberOfLines={2}
                            style={{
                              textAlign: 'left',
                              fontFamily: 'OpenSans-Regular',
                              color: colors.secondBackground,
                              fontSize: 12 * factorRatio
                            }}
                          >
                            {this.changeType(item.type)}/
                          </Text>
                        )}
                        {this.props.showArtist && (
                          <Text
                            numberOfLines={2}
                            style={{
                              textAlign: 'left',
                              fontFamily: 'OpenSans-Regular',
                              color: colors.secondBackground,
                              fontSize: 12 * factorRatio
                            }}
                          >
                            {' '}
                            {item.artist}
                          </Text>
                        )}
                      </View>
                    </View>
                    <View
                      style={{
                        flex: 0.2,
                        flexDirection: 'row'
                      }}
                    >
                      <View style={{ flex: 1 }} />
                      {this.props.showArtist && (
                        <View>
                          {!item.isAddedToList && (
                            <TouchableOpacity
                              style={{
                                paddingTop: 5 * factorVertical
                              }}
                              onPress={() => this.addToMyList(item.id)}
                            >
                              <AntIcon
                                name={'plus'}
                                size={30 * factorRatio}
                                color={colors.pianoteRed}
                              />
                            </TouchableOpacity>
                          )}
                          {item.isAddedToList && (
                            <TouchableOpacity
                              style={{
                                paddingTop: 5 * factorVertical
                              }}
                              onPress={() => this.removeFromMyList(item.id)}
                            >
                              <AntIcon
                                name={'close'}
                                size={30 * factorRatio}
                                color={colors.pianoteRed}
                              />
                            </TouchableOpacity>
                          )}
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
          <Modal
            key={'modal'}
            isVisible={this.state.showModal}
            style={[
              styles.centerContent,
              {
                margin: 0,
                height: fullHeight,
                width: fullWidth
              }
            ]}
            animation={'slideInUp'}
            animationInTiming={250}
            animationOutTiming={250}
            coverScreen={true}
            hasBackdrop={true}
          >
            <ContentModal
              data={this.state.item}
              hideContentModal={() => this.setState({ showModal: false })}
              like={contentID => this.like(contentID)}
              addToMyList={contentID => this.addToMyList(contentID)}
              removeFromMyList={contentID => this.removeFromMyList(contentID)}
            />
          </Modal>
        </View>
      </View>
    );
  };
}

export default withNavigation(HorizontalVideoList);
