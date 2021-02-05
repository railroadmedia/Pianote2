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
  StyleSheet,
  Dimensions
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import Modal from 'react-native-modal';
import FastImage from 'react-native-fast-image';
import AddToCalendar from '../modals/AddToCalendar';
import { withNavigation } from 'react-navigation';
import AntIcon from 'react-native-vector-icons/AntDesign';

import { addToMyList, removeFromMyList } from '../services/UserActions';
import ContentModal from '../modals/ContentModal';
import { NetworkContext } from '../context/NetworkProvider';
import Progress from 'Pianote2/src/assets/img/svgs/progress.svg';

let greaterWDim;

class HorizontalVideoList extends React.Component {
  static navigationOptions = { header: null };
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      addToCalendarModal: false,
      items: this.props.items,
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
    if (onTablet) {
      if (this.props.isSquare) return 125;
      else return 225;
    } else {
      if (this.props.isSquare) return Dimensions.get('window').width / 3.25;
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
    console.log(contentID);
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }

    for (i in this.state.items) {
      if (this.state.items[i].id == contentID) {
        this.state.items[i].isLiked = !this.state.items[i].isLiked;
        this.state.items[i].like_count = this.state.items[i].isLiked
          ? this.state.items[i].like_count + 1
          : this.state.items[i].like_count - 1;
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
    if (
      this.props.title !== 'METHOD' &&
      new Date(content.publishedOn) > new Date()
    ) {
      return;
    }
    console.log(content.type, content.id)
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
        return this.props.navigation.navigate('METHOD', {
          url: content.mobile_app_url
        });
      case 'learning-path-level':
        return this.props.navigation.navigate('METHODLEVEL', {
          url: content.mobile_app_url,
          level: index + 1
        });
      case 'learning-path-course':
        return this.props.navigation.push('PATHOVERVIEW', {
          data: content,
          isMethod: true
        });
      case 'learning-path-lesson':
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

  addEventToCalendar = () => {
    const eventConfig = {
      title: this.addToCalendarLessonTitle,
      startDate: new Date(this.addToCalendatLessonPublishDate),
      endDate: new Date(this.addToCalendatLessonPublishDate)
    };
    AddCalendarEvent.presentEventCreatingDialog(eventConfig)
      .then(eventInfo => {
        this.addToCalendarLessonTitle = '';
        this.addToCalendatLessonPublishDate = '';
        this.setState({ addToCalendarModal: false });
      })
      .catch(error => {
        console.log(error);
      });
  };

  render = () => {
    return (
      <View style={localStyles.listContainer}>
        <View style={localStyles.titleContain}>
          <Text
            style={[
              localStyles.title,
              {
                color: this.props.isMethod ? 'white' : colors.secondBackground
              }
            ]}
          >
            {this.props.Title}
          </Text>
          {!this.props.hideSeeAll && (
            <TouchableOpacity
              key={'seeAll'}
              onPress={() => this.props.seeAll()}
            >
              <Text style={localStyles.seeAllText}>See All</Text>
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
              delayLongPress={250}
              onPress={() => this.navigate(item, index)}
            >
              <View style={{ width: '100%' }}>
                {(item.isStarted) && (
                <View 
                  style={[styles.centerContent, localStyles.progressItem]}
                >
                  <Progress
                    height={50}
                    width={50 * factorRatio}
                    fill={'white'}
                  />
                </View>
                )}
                {Platform.OS === 'ios' ? (
                  <FastImage
                    style={[
                      localStyles.imageIOS,
                      { aspectRatio: this.props.isSquare ? 1 : 16 / 9 }
                    ]}
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
                    style={[
                      localStyles.imageIOS,
                      { aspectRatio: this.props.isSquare ? 1 : 16 / 9 }
                    ]}
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

              <View style={localStyles.videoTitle}>
                <View style={{ width: '80%' }}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode='tail'
                    style={localStyles.videoTitleText}
                  >
                    {item.title}
                  </Text>
                  <View style={localStyles.typeContainer}>
                    {this.props.showType && (
                      <Text
                        numberOfLines={1}
                        style={{
                          fontFamily: 'OpenSans-Regular',
                          color: this.props.isMethod
                            ? colors.pianoteGrey
                            : colors.secondBackground,
                            
                          fontSize: onTablet ?  16 : 12 * factorRatio,  
                        }}
                      >
                        {this.changeType(item.type)}/{' '}
                      </Text>
                    )}
                    <Text
                      numberOfLines={1}
                      style={[
                        localStyles.artist,
                        {
                          color: this.props.isMethod
                            ? colors.pianoteGrey
                            : colors.secondBackground
                        }
                      ]}
                    >
                      {item.artist}
                    </Text>
                  </View>
                </View>
                {(new Date(item.publishedOn) > new Date()) ? (
                  <TouchableOpacity
                    onPress={() => {
                      this.addToCalendarLessonTitle = item.title;
                      this.addToCalendatLessonPublishDate = item.publishedOn;
                      this.setState({ addToCalendarModal: true });
                    }}
                  >
                    <FontIcon
                      size={(onTablet) ?  12.5 * factorRatio :  27.5 * factorRatio}
                      name={'calendar-plus'}
                      color={
                        this.props.isMethod && !this.props.methodLevel
                          ? colors.pianoteGrey
                          : colors.pianoteRed
                      }
                    />
                  </TouchableOpacity>
                ) : !item.isAddedToList ? (
                  <TouchableOpacity
                    onPress={() => this.addToMyList(item.id)}
                    style={{ paddingRight: 5 }}
                  >
                    <AntIcon
                      name={'plus'}
                      size={(onTablet) ?  17.5 * factorRatio :  25 * factorRatio}
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
                      size={(onTablet) ?  17.5 * factorRatio :  25 * factorRatio}
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
          style={styles.modalContainer}
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
        <Modal
          key={'calendarModal'}
          isVisible={this.state.addToCalendarModal}
          style={{
            margin: 0,
            height: '100%',
            width: '100%'
          }}
          animation={'slideInUp'}
          animationInTiming={250}
          animationOutTiming={250}
          coverScreen={true}
          hasBackdrop={true}
        >
          <AddToCalendar
            hideAddToCalendar={() =>
              this.setState({ addToCalendarModal: false })
            }
            addEventToCalendar={() => {this.addEventToCalendar()}}
          />
        </Modal>      
      </View>
    );
  };
}

const localStyles = StyleSheet.create({
  listContainer: {
    paddingLeft: 10 * Dimensions.get('window').width / 375
  },
  artist: {
    fontSize: DeviceInfo.isTablet() ? 
      16
      : 
      (12 * (Dimensions.get('window').height / 812 + Dimensions.get('window').width / 375)) / 2,  
    fontFamily: 'OpenSans-Regular'
  },
  title: {
    fontSize: DeviceInfo.isTablet() ? 22 : (18 * (Dimensions.get('window').height / 812 + Dimensions.get('window').width / 375)) / 2,
    fontFamily: 'RobotoCondensed-Bold'
  },
  seeAllText: {
    textAlign: 'right',
    fontSize: DeviceInfo.isTablet() ? 20 : (14.5 * (Dimensions.get('window').height / 812 + Dimensions.get('window').width / 375)) / 2,
    fontWeight: '300',
    color: '#fb1b2f',
    paddingRight: 15 * Dimensions.get('window').width / 375
  },
  titleContain: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: (DeviceInfo.isTablet() ? 10 : 15) *
        (Dimensions.get('window').height / 812 + Dimensions.get('window').width / 375) / 2
  },
  progressItem: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1
  },
  imageIOS: {
    width: '100%',
    borderRadius:
      (7.5 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2
  },
  videoTitle: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  videoTitleText: {
    fontSize: DeviceInfo.isTablet() ?  
      16
      : 
      (14 * (Dimensions.get('window').height / 812 + Dimensions.get('window').width / 375)) / 2,
    marginTop: DeviceInfo.isTablet() ?  5 :
      (7.5 * 
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
    fontFamily: 'OpenSans-Bold',
    color: 'white'
  },
  typeContainer: {
    flexDirection: 'row',
  }
});

export default withNavigation(HorizontalVideoList);
