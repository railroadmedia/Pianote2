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
  ActivityIndicator,
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
import IonIcon from 'react-native-vector-icons/Ionicons';

import Relevance from '../modals/Relevance';
import { addToMyList, removeFromMyList } from '../services/UserActions';
import ContentModal from '../modals/ContentModal';
import { NetworkContext } from '../context/NetworkProvider';
import ApprovedTeacher from 'Pianote2/src/assets/img/svgs/approved-teacher.svg';
import Progress from 'Pianote2/src/assets/img/svgs/progress.svg';

let greaterWDim;
const windowDim = Dimensions.get('window');
const width =
  windowDim.width < windowDim.height ? windowDim.width : windowDim.height;
const height =
  windowDim.width > windowDim.height ? windowDim.width : windowDim.height;
const factor = (height / 812 + width / 375) / 2;
const sortDict = {
  newest: 'NEWEST',
  oldest: 'OLDEST',
  popularity: 'POPULAR',
  trending: 'TRENDING',
  relevance: 'RELEVANCE'
};

class HorizontalVideoList extends React.Component {
  static navigationOptions = { header: null };
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      addToCalendarModal: false,
      showRelevance: false,
      outVideos: this.props.outVideos,
      isLoading: false,
      items: this.props.items
    };
    greaterWDim = fullHeight < fullWidth ? fullWidth : fullHeight;
  }

  UNSAFE_componentWillReceiveProps = props => {
    if (props.isPaging !== this.state.isPaging) {
      if (!this.state.isLoading) {
        this.setState({ isPaging: props.isPaging });
      }
    }
    if (props.outVideos !== this.state.outVideos) {
      this.setState({ outVideos: props.outVideos });
    }
    if (props.isLoading !== this.state.isLoading) {
      this.setState({
        isLoading: props.isLoading,
        items: [...this.state.items, ...props.items]
      });
    } else if (props.items !== this.state.items) {
      this.setState({
        items: props.items
      });
    }
  };

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
    console.log(content.type, content.id);
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

  listFooter = () => {
    if (this.state.outVideos || !this.state.callEndReached) {
      return <></>;
    }

    if (this.state.items.length > 0) {
      return (
        <View
          style={[
            styles.centerContent,
            {
              flex: 1,
              marginHorizontal: 40 * factor,
              flexDirection: 'row'
            }
          ]}
        >
          <View style={{ flex: 3 }} />
          <ActivityIndicator
            size={onTablet ? 'large' : 'small'}
            animating={true}
            color={
              this.props.isMethod ? colors.pianoteGrey : colors.secondBackground
            }
          />
          <View style={{ flex: 0.7 }} />
        </View>
      );
    } else {
      return (
        <View
          style={{
            width: width,
            height: '100%'
          }}
        >
          <View style={{ flex: 1 }} />
          <ActivityIndicator
            size={onTablet ? 'large' : 'small'}
            animating={true}
            color={
              this.props.isMethod ? colors.pianoteGrey : colors.secondBackground
            }
          />
          <View style={{ flex: 1 }} />
        </View>
      );
    }
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
            <View style={{flex: 1}}/>
            {this.props.Title}
          </Text>
          {!this.props.hideSeeAll && (
            <>
              {(!onTablet || (onTablet && this.props.hideFilterButton)) && (
                <TouchableOpacity
                  key={'seeAll'}
                  onPress={() => this.props.seeAll()}
                >
                  <Text style={localStyles.seeAllText}>See All</Text>
                </TouchableOpacity>
              )}
              {onTablet && (
                <>
                  {!this.props.hideFilterButton && (
                    <>
                      <View style={{ flex: 1 }} />
                      <TouchableOpacity
                        style={[
                          styles.centerContent,
                          {
                            flexDirection: 'row',
                            marginRight: 5 * factor
                          }
                        ]}
                        onPress={() => {
                          this.setState({
                            showRelevance: !this.state.showRelevance
                          });
                        }}
                      >
                        <View style={{ flex: 1 }} />
                        <Text
                          style={[
                            localStyles.seeAllText,
                            {
                              paddingRight: 4 * factor,
                              fontSize: (onTablet ? 10 : 14.5 ) * factor,
                            }
                          ]}
                        >
                          {onTablet ? 
                            sortDict[this.props.currentSort].charAt(0) + sortDict[this.props.currentSort].substring(1).toLowerCase()
                            :
                            sortDict[this.props.currentSort]
                          }
                        </Text>
                        <View>
                          <FontIcon
                            size={(onTablet ? 10 : 14) * factor}
                            name={'sort-amount-down'}
                            color={colors.pianoteRed}
                          />
                        </View>
                        <View style={{ flex: 1 }} />
                      </TouchableOpacity>
                    </>
                  )}
                  {!this.props.hideFilterButton && (
                    <TouchableOpacity
                      onPress={() => {
                        this.props.filterResults();
                      }}
                      style={[
                        styles.centerContent,
                        {
                          borderWidth: 1 * factor,
                          borderColor: colors.pianoteRed,
                          height: (onTablet ? 17.5 : 30) * factor,
                          width: (onTablet ? 17.5 : 30) * factor,
                          borderRadius: 30 * factor,
                          marginRight: 10 * factor
                        }
                      ]}
                    >
                      <View style={{ flex: 1 }} />
                      <View
                        style={{
                          transform: [{ rotate: '90deg' }]
                        }}
                      >
                        <IonIcon
                          size={(onTablet ? 9 : 14) * factor}
                          name={'md-options'}
                          color={colors.pianoteRed}
                        />
                      </View>
                      <View style={{ flex: 1 }} />
                    </TouchableOpacity>
                  )}
                </>
              )}
            </>
          )}
        </View>
        <FlatList
          key={'videos'}
          data={this.state.items}
          extraData={this.state}
          horizontal={true}
          style={{ width: '100%' }}
          showsHorizontalScrollIndicator={false}
          onEndReached={() => {
            this.props.callEndReached ? this.props.reachedEnd() : null;
          }}
          onEndReachedThreshold={1}
          ListFooterComponent={() => this.listFooter()}
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
                  <View style={[styles.centerContent, localStyles.progressItem]}>
                    {item.isStarted ? (
                      <Progress
                        height={onTablet ? 50 : 50 * factor}
                        width={onTablet ? 50 : 50 * factor}
                        fill={'white'}
                      />
                    ) : item.isCompleted ? (
                      <ApprovedTeacher
                        height={onTablet ? 62.5 : 50 * factor}
                        width={onTablet ? 62.5 : 50 * factor}
                        fill={'white'}
                      />
                    ) : null}
                  </View>

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
                    <Text
                      numberOfLines={1}
                      style={{
                        fontFamily: 'OpenSans-Regular',
                        color: this.props.isMethod
                          ? colors.pianoteGrey
                          : colors.secondBackground,

                        fontSize: (onTablet ? 8 : 12) * factor,
                        marginTop: 1.5
                      }}
                    >
                      {this.props.showType && this.changeType(item.type)}
                      {this.props.showType && '/ '}
                      {item.artist}
                    </Text>
                  </View>
                </View>
                {new Date(item.publishedOn) > new Date() ? (
                  <TouchableOpacity
                    onPress={() => {
                      this.addToCalendarLessonTitle = item.title;
                      this.addToCalendatLessonPublishDate = item.publishedOn;
                      this.setState({ addToCalendarModal: true });
                    }}
                  >
                    <FontIcon
                      size={onTablet ? 12.5 * factor : 27.5 * factor}
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
                      size={onTablet ? 17.5 * factor : 25 * factor}
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
                      size={onTablet ? 17.5 * factor : 25 * factor}
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
            addEventToCalendar={() => {
              this.addEventToCalendar();
            }}
          />
        </Modal>
        <Modal
          key={'modalRelevance'}
          isVisible={this.state.showRelevance}
          style={{
            margin: 0,
            height: '100%',
            width: '100%'
          }}
          animation={'slideInUp'}
          animationInTiming={250}
          animationOutTiming={250}
          coverScreen={true}
          hasBackdrop={false}
          backdropColor={'white'}
          backdropOpacity={0.79}
        >
          <Relevance
            hideRelevance={() => {
              this.setState({ showRelevance: false });
            }}
            isMethod={this.props.isMethod}
            currentSort={this.props.currentSort}
            changeSort={sort => {
              this.props.changeSort(sort);
            }}
          />
        </Modal>
      </View>
    );
  };
}

const localStyles = StyleSheet.create({
  listContainer: {
    paddingLeft: DeviceInfo.isTablet() ? 5 : 10 * factor 
  },
  artist: {
    fontSize:
      ((DeviceInfo.isTablet() ? 12 : 16) *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
    fontFamily: 'OpenSans-Regular'
  },
  title: {
    fontSize: (DeviceInfo.isTablet() ? 12 : 18) * factor,
    fontFamily: 'RobotoCondensed-Bold'
  },
  seeAllText: {
    textAlign: 'right',
    fontSize: (DeviceInfo.isTablet() ? 10 : 14.5 ) * factor,
    fontWeight: DeviceInfo.isTablet() ? '500' : '300',
    color: '#fb1b2f',
    paddingRight: 10 * factor
  },
  titleContain: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical:
      ((DeviceInfo.isTablet() ? 10 : 15) *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2
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
    fontSize: DeviceInfo.isTablet()
      ? 16
      : (14 *
          (Dimensions.get('window').height / 812 +
            Dimensions.get('window').width / 375)) /
        2,
    marginTop: DeviceInfo.isTablet()
      ? 5
      : (7.5 *
          (Dimensions.get('window').height / 812 +
            Dimensions.get('window').width / 375)) /
        2,
    fontFamily: 'OpenSans-Bold',
    color: 'white'
  },
  typeContainer: {
    flexDirection: 'row'
  }
});

export default withNavigation(HorizontalVideoList);
