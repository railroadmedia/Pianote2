/**
 * HorizontalVideoList
 */
import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Platform,
  Image,
  Dimensions
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Modal from 'react-native-modal';
import FastImage from 'react-native-fast-image';
import { withNavigation } from 'react-navigation';
import AntIcon from 'react-native-vector-icons/AntDesign';

import { addToMyList, removeFromMyList } from '../services/UserActions';
import ContentModal from '../modals/ContentModal';
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
      items: this.props.items
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

  decideWidth() {
    if (DeviceInfo.isTablet()) {
      if (this.props.isSquare) return 300;
      else return 400;
    } else {
      if (this.props.isSquare) return Dimensions.get('window').width / 2.2;
      else return ((Dimensions.get('window').width - 30) * 3) / 4;
    }
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
      <View key={'container'} style={{ paddingHorizontal: 15 }}>
        <View
          key={'title'}
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 10 * factorRatio
          }}
        >
          <Text
            style={{
              fontSize: 18 * factorRatio,
              fontFamily: 'RobotoCondensed-Bold',
              color: this.props.isMethod ? 'white' : colors.secondBackground
            }}
          >
            {this.props.Title}
          </Text>

          {!this.props.hideSeeAll && (
            <TouchableOpacity
              key={'seeAll'}
              onPress={() => this.props.seeAll()}
            >
              <Text
                style={{
                  textAlign: 'right',
                  fontSize: 14.5 * factorRatio,
                  fontWeight: '300',
                  color: colors.pianoteRed
                }}
              >
                See All
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          key={'videos'}
          data={this.state.items}
          extraData={this.state}
          horizontal={true}
          style={{ width: '100%' }}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={{ width: this.decideWidth(), marginRight: 15 }}
              onLongPress={() => {
                this.setState({
                  showModal: true,
                  item
                });
              }}
              delayLongPress={350}
              onPress={() => this.navigate(item, index)}
            >
              <View style={{ width: '100%' }}>
                <View
                  style={[
                    styles.centerContent,
                    {
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      zIndex: 1
                    }
                  ]}
                >
                  <Progress
                    height={50}
                    width={50 * factorRatio}
                    fill={'white'}
                  />
                </View>

                {Platform.OS === 'ios' ? (
                  <FastImage
                    style={{
                      width: '100%',
                      aspectRatio: this.props.isSquare ? 1 : 16 / 9,
                      borderRadius: 7.5 * factorRatio
                    }}
                    source={{
                      uri:
                        item.thumbnail && item.thumbnail !== 'TBD'
                          ? `https://cdn.musora.com/image/fetch/w_${Math.round(
                              this.decideWidth() * 2
                            )},ar_${
                              this.props.isSquare ? '1' : '16:9'
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
                      width: '100%',
                      aspectRatio: this.props.isSquare ? 1 : 16 / 9,
                      borderRadius: 7.5 * factorRatio
                    }}
                    resizeMode='cover'
                    source={{
                      uri:
                        item.thumbnail && item.thumbnail !== 'TBD'
                          ? `https://cdn.musora.com/image/fetch/w_${Math.round(
                              this.decideWidth() * 2
                            )},ar_${
                              this.props.isSquare ? '1' : '16:9'
                            },fl_lossy,q_auto:eco,c_fill,g_face/${
                              item.thumbnail
                            }`
                          : fallbackThumb
                    }}
                  />
                )}
              </View>

              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <View style={{ width: '80%' }}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode='tail'
                    style={{
                      fontSize: 14 * factorRatio,
                      marginTop: 7.5 * factorRatio,
                      marginBottom: 3 * factorRatio,
                      fontFamily: 'OpenSans-Bold',
                      color: 'white'
                    }}
                  >
                    {item.title}
                  </Text>

                  <View
                    style={{
                      flexDirection: 'row',
                      marginBottom: 3 * factorRatio
                    }}
                  >
                    {this.props.showType && (
                      <Text
                        numberOfLines={1}
                        style={{
                          fontFamily: 'OpenSans-Regular',
                          color: this.props.isMethod
                            ? colors.pianoteGrey
                            : colors.secondBackground,
                          fontSize: 12 * factorRatio
                        }}
                      >
                        {this.changeType(item.type)}/
                      </Text>
                    )}
                    <Text
                      numberOfLines={1}
                      style={{
                        fontFamily: 'OpenSans-Regular',
                        color: this.props.isMethod
                          ? colors.pianoteGrey
                          : colors.secondBackground,
                        fontSize: 12 * factorRatio
                      }}
                    >
                      {' '}
                      {item.artist}
                    </Text>
                  </View>
                </View>

                {!item.isAddedToList ? (
                  <TouchableOpacity
                    onPress={() => this.addToMyList(item.id)}
                    style={{ paddingRight: 5 }}
                  >
                    <AntIcon
                      name={'plus'}
                      size={25 * factorRatio}
                      color={
                        this.props.isMethod
                          ? colors.pianoteGrey
                          : colors.pianoteRed
                      }
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={{ paddingRight: 5 }}
                    onPress={() => this.removeFromMyList(item.id)}
                  >
                    <AntIcon
                      name={'close'}
                      size={25 * factorRatio}
                      color={
                        this.props.isMethod
                          ? colors.pianoteGrey
                          : colors.pianoteRed
                      }
                    />
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          )}
        />

        <Modal
          key={'modal'}
          isVisible={this.state.showModal}
          style={[
            styles.centerContent,
            {
              margin: 0,
              height: '100%',
              width: '100%'
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
    );
  };
}

export default withNavigation(HorizontalVideoList);
