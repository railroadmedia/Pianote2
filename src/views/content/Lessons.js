import React from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  Text,
  Image,
  Modal,
  StyleSheet
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import FastImage from 'react-native-fast-image';
import Icon from '../../assets/icons';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-community/async-storage';
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import PasswordVisible from '../../assets/img/svgs/passwordVisible.svg';
import Orientation from 'react-native-orientation-locker';
import { watchersListener } from 'MusoraChat';
import LongButton from '../../components/LongButton';
import CountDown from '../../components/CountDown';
import NavigationBar from '../../components/NavigationBar';
import NavMenuHeaders from '../../components/NavMenuHeaders';
import GradientFeature from '../../components/GradientFeature';
import VerticalVideoList from '../../components/VerticalVideoList';
import HorizontalVideoList from '../../components/HorizontalVideoList';
import UserInfo from '../../forum/src/components/UserInfo.js';
import methodService from '../../services/method.service.js';
import {
  getStartedContent,
  getLiveContent,
  getAllContent
} from '../../services/GetContent';
import { addToMyList, removeFromMyList } from '../../services/UserActions';
import RestartCourse from '../../modals/RestartCourse';
import AddToCalendar from '../../modals/AddToCalendar';
import Live from '../../modals/Live';
import { cacheAndWriteLessons } from '../../redux/LessonsCacheActions';
import { NetworkContext } from '../../context/NetworkProvider';
import { navigate, refreshOnFocusListener } from '../../../AppNavigator';

var page = 1;
const windowDim = Dimensions.get('window');
const width =
  windowDim.width < windowDim.height ? windowDim.width : windowDim.height;

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 20;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

class Lessons extends React.Component {
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    let { lessonsCache } = props;
    this.state = {
      progressLessons: [],
      allLessons: [],
      currentSort: 'newest',
      page: 1,
      isPaging: false,
      filtering: false,
      currentLesson: [],
      liveLesson: null,
      timeDiffLive: 0,
      addToCalendarModal: false,
      methodId: 0,
      methodIsStarted: false,
      methodIsCompleted: false,
      methodNextLessonUrl: null,
      showRestartCourse: false,
      lessonsStarted: true,
      refreshing: !lessonsCache,
      refreshControl: true,
      showLive: false,
      showUserInfo: false,
      isLandscape:
        Dimensions.get('window').height < Dimensions.get('window').width,
      ...this.initialValidData(lessonsCache, true)
    };
  }

  componentDidMount = () => {
    let deepFilters = decodeURIComponent(this.props.route?.params?.url).split(
      '?'
    )[1];
    this.filterQuery = deepFilters && `&${deepFilters}`;
    Orientation.addDeviceOrientationListener(this.orientationListener);
    AsyncStorage.multiGet(['methodIsStarted', 'methodIsCompleted']).then(
      data => {
        this.setState({
          methodIsStarted:
            typeof data[0][1] !== null ? JSON.parse(data[0][1]) : false,
          methodIsCompleted:
            typeof data[1][1] !== null ? JSON.parse(data[1][1]) : false
        });
      }
    );

    this.getLiveContent();
    this.getContent();
    messaging().requestPermission();
    this.refreshOnFocusListener = refreshOnFocusListener.call(this);
  };

  componentWillUnmount() {
    this.refreshOnFocusListener?.();
    this.removeWatchersListener?.();
    Orientation.removeDeviceOrientationListener(this.orientationListener);
  }

  async getContent() {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    let content = await Promise.all([
      methodService.getMethod(),
      getAllContent(
        '',
        this.state.currentSort,
        this.state.page,
        this.filterQuery
      ),
      getStartedContent('', 1)
    ]);
    this.metaFilters = content?.[1]?.meta?.filterOptions;
    this.props.cacheAndWriteLessons({
      all: content[1],
      method: content[0],
      inProgress: content[2]
    });
    this.setState(
      this.initialValidData({
        all: content[1],
        method: content[0],
        inProgress: content[2]
      })
    );
  }

  async getLiveContent() {
    let liveLesson = await getLiveContent();
    let timeNow = Math.floor(Date.now() / 1000);
    let timeLive =
      new Date(liveLesson.live_event_start_time + ' UTC').getTime() / 1000;
    let timeDiff = timeLive - timeNow;
    if (timeDiff < 4 * 3600) {
      this.setState({ liveLesson, timeDiffLive: timeDiff });
      if (liveLesson.isLive) {
        let { apiKey, chatChannelName, userId, token } = liveLesson;
        watchersListener(apiKey, chatChannelName, userId, token, liveViewers =>
          this.setState({ liveViewers })
        ).then(rwl => (this.removeWatchersListener = rwl));
      }
    }
  }

  changeType = word => {
    if (word) {
      try {
        word = word.replace(/[- )(]/g, ' ').split(' ');
      } catch {}

      let string = '';

      for (let i = 0; i < word.length; i++) {
        if (word[i] !== 'and') {
          word[i] = word[i][0].toUpperCase() + word[i].substr(1);
        }
      }

      for (i in word) {
        string = string + word[i];
        if (Number(i) < word.length - 1) string = string + ' / ';
      }

      return string;
    }
  };

  initialValidData = (content, fromCache) => {
    try {
      if (!content) return {};
      let { method } = content;
      let allVideos = content.all.data;

      let inprogressVideos = content.inProgress.data;
      AsyncStorage.multiSet([
        ['methodIsStarted', method.started.toString()],
        ['methodIsCompleted', method.completed.toString()]
      ]);
      return {
        methodId: method.id,
        methodIsStarted: method.started,
        methodIsCompleted: method.completed,
        methodNextLessonUrl: method.banner_button_url,
        allLessons: allVideos,
        progressLessons: inprogressVideos,
        filtering: false,
        isPaging: false,
        lessonsStarted: inprogressVideos.length !== 0,
        refreshing: false,
        refreshControl: fromCache
      };
    } catch (e) {
      return {};
    }
  };

  getMethod = async () => {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    const response = await methodService.getMethod();
    await AsyncStorage.multiSet([
      ['methodIsStarted', response.started.toString()],
      ['methodIsCompleted', response.completed.toString()]
    ]);
    this.setState({
      methodId: response.id,
      methodIsStarted: response.started,
      methodIsCompleted: response.completed,
      methodNextLessonUrl: response.banner_button_url
    });
  };

  getAllLessons = async () => {
    this.setState({ filtering: true });
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    let response = await getAllContent(
      '',
      this.state.currentSort,
      this.state.page,
      this.filterQuery
    );
    this.metaFilters = response?.meta?.filterOptions;

    this.setState({
      allLessons: [...this.state.allLessons, ...response.data],
      filtering: false,
      isPaging: false
    });
  };

  onRestartMethod = async () => {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    resetProgress(this.state.methodId);
    this.setState(
      {
        methodIsStarted: false,
        methodIsCompleted: false,
        showRestartCourse: false
      },
      () => this.getMethod()
    );
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
      .catch(e => {});
  };

  addToMyList = contentID => {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    let liveLesson = Object.assign([], this.state.liveLesson);
    liveLesson.is_added_to_primary_playlist = true;
    this.setState({ liveLesson });
    addToMyList(contentID);
  };

  removeFromMyList = contentID => {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    let liveLesson = Object.assign([], this.state.liveLesson);
    liveLesson.is_added_to_primary_playlist = false;
    this.setState({ liveLesson });
    removeFromMyList(contentID);
  };

  handleScroll = event => {
    if (isCloseToBottom(event) && !this.state.isPaging) {
      this.setState({ page: this.state.page + 1, isPaging: true }, () =>
        this.getAllLessons(true)
      );
    }
  };

  orientationListener = o => {
    if (o === 'UNKNOWN') return;
    let isLandscape = o.indexOf('LAND') >= 0;

    if (isiOS)
      if (onTablet) this.setState({ isLandscape });
      else
        Orientation.getAutoRotateState(isAutoRotateOn => {
          if (isAutoRotateOn && onTablet) this.setState({ isLandscape });
        });
  };

  getAspectRatio() {
    if (onTablet && this.state.isLandscape) return 2.5;
    if (onTablet && !this.state.isLandscape) return 1.8;
    return 1;
  }

  render() {
    return (
      <View style={styles.methodContainer}>
        <NavMenuHeaders
          isMethod={true}
          currentPage={'HOME'}
          parentPage={'HOME'}
        />
        {!this.state.refreshing ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentInsetAdjustmentBehavior={'never'}
            style={styles.methodContainer}
            refreshControl={
              <RefreshControl
                tintColor={'transparent'}
                onRefresh={() =>
                  this.setState(
                    {
                      refreshControl: true,
                      inprogressVideos: [],
                      allLessons: [],
                      page: 1
                    },
                    this.getContent
                  )
                }
                colors={[colors.secondBackground]}
                refreshing={isiOS ? false : this.state.refreshControl}
              />
            }
            onScroll={({ nativeEvent }) =>
              onTablet ? '' : this.handleScroll(nativeEvent)
            }
            scrollEventThrottle={400}
          >
            {isiOS && this.state.refreshControl && (
              <ActivityIndicator
                size='small'
                style={{ padding: 20 }}
                color={colors.pianoteGrey}
              />
            )}
            <ImageBackground
              resizeMode={'cover'}
              style={{
                width: '100%',
                aspectRatio: this.getAspectRatio(),
                justifyContent: 'flex-end'
              }}
              source={require('../../../src/assets/img/imgs/lisamethod.png')}
            >
              <GradientFeature
                color={'red'}
                opacity={1}
                height={'70%'}
                borderRadius={0}
              />
              <View
                style={{
                  position: 'absolute',
                  height: '100%',
                  width: '100%',
                  zIndex: 2,
                  elevation: 2,
                  justifyContent: 'flex-end'
                }}
              >
                <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                  <FastImage
                    style={{
                      width: '85%',
                      height: onTablet ? 100 : 60,
                      alignSelf: 'center',
                      marginBottom: onTablet ? '2%' : '4%'
                    }}
                    source={require('../../../src/assets/img/imgs/pianote-method.png')}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                </View>
                <View
                  style={{
                    height: onTablet ? 45 : 35,
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: '8.5%',
                    justifyContent: 'center'
                  }}
                >
                  <View style={{ flex: 1 }} />
                  <View style={{ width: onTablet ? 200 : '45%' }}>
                    <LongButton
                      type={
                        this.state.methodIsCompleted
                          ? 'RESET'
                          : !this.state.methodIsStarted
                          ? 'START'
                          : 'CONTINUE'
                      }
                      pressed={() => {
                        if (this.state.methodIsCompleted) {
                          this.setState({ showRestartCourse: true });
                        } else {
                          if (!this.context.isConnected)
                            return this.context.showNoConnectionAlert();
                          if (this.state.methodNextLessonUrl) {
                            navigate('VIEWLESSON', {
                              url: this.state.methodNextLessonUrl
                            });
                          }
                        }
                      }}
                    />
                  </View>
                  <View style={onTablet ? { width: 10 } : { flex: 0.5 }} />
                  <View style={{ width: onTablet ? 200 : '45%' }}>
                    <LongButton
                      type={'MORE INFO'}
                      pressed={() => {
                        navigate('METHOD', {
                          methodIsStarted: this.state.methodIsStarted,
                          methodIsCompleted: this.state.methodIsCompleted
                        });
                      }}
                    />
                  </View>
                  <View style={{ flex: 1 }} />
                </View>
              </View>
            </ImageBackground>
            <View style={{ marginTop: 10 / 2 }}>
              {this.state.progressLessons.length > 0 && (
                <HorizontalVideoList
                  hideFilterButton={true}
                  isMethod={true}
                  Title={'IN PROGRESS'}
                  seeAll={() =>
                    navigate('SEEALL', {
                      title: 'Continue',
                      parent: 'Lessons'
                    })
                  }
                  showType={true}
                  items={this.state.progressLessons}
                />
              )}
            </View>
            <View style={{ height: 10 / 2 }} />
            {this.state.liveLesson && this.state.timeDiffLive < 3600 * 4 && (
              // if there is a live lesson && it is less than 4 hours away
              <>
                <Text
                  numberOfLines={1}
                  style={{
                    textAlign: 'left',
                    fontSize: onTablet ? 20 : 16,
                    fontFamily: 'RobotoCondensed-Bold',
                    paddingTop: 5,
                    paddingBottom: 15,
                    color: 'white',
                    paddingLeft: 10
                  }}
                >
                  LIVE
                </Text>
                {this.state.timeDiffLive > 0 ? (
                  // prod: > 0
                  // live lesson has time to countdown
                  <View
                    style={{
                      width: Dimensions.get('window').width - 10,
                      paddingLeft: 10
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => navigate('LIVE')}
                      style={{ width: '100%' }}
                    >
                      {this.state.liveLesson?.live_event_start_time && (
                        <CountDown
                          timesUp={() =>
                            this.setState({
                              showLive: true,
                              timeDiffLive: 0
                            })
                          }
                          live_event_start_time={
                            this.state.liveLesson?.live_event_start_time
                          }
                        />
                      )}
                      <View style={{ width: '100%' }}>
                        {isiOS ? (
                          <FastImage
                            style={{
                              width: '100%',
                              borderRadius: 7.5,
                              aspectRatio: 16 / 9
                            }}
                            source={{
                              uri: this.state.liveLesson?.thumbnail_url
                                ? `https://cdn.musora.com/image/fetch/w_${Math.round(
                                    (Dimensions.get('window').width - 20) * 2
                                  )},ar_16:9,fl_lossy,q_auto:eco,c_fill,g_face/${
                                    this.state.liveLesson?.thumbnail_url
                                  }`
                                : fallbackThumb
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                          />
                        ) : (
                          <Image
                            style={{
                              width: '100%',
                              borderRadius: 7.5,
                              aspectRatio: 16 / 9,
                              backgroundColor: 'red'
                            }}
                            resizeMode='cover'
                            source={{
                              uri: this.state.liveLesson?.thumbnail_url
                                ? `https://cdn.musora.com/image/fetch/w_${Math.round(
                                    (Dimensions.get('window').width - 20) * 2
                                  )},ar_16:9,fl_lossy,q_auto:eco,c_fill,g_face/${
                                    this.state.liveLesson?.thumbnail_url
                                  }`
                                : fallbackThumb
                            }}
                          />
                        )}
                      </View>
                    </TouchableOpacity>
                    <View
                      style={{
                        width: '100%',
                        paddingVertical: 10,
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
                            fontSize: onTablet ? 16 : 14,
                            fontFamily: 'OpenSans-Bold',
                            color: 'white'
                          }}
                        >
                          Pianote Live Stream
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row'
                          }}
                        >
                          <Text
                            numberOfLines={1}
                            style={{
                              fontFamily: 'OpenSans-Regular',
                              color: colors.pianoteGrey,

                              fontSize: sizing.descriptionText
                            }}
                          >
                            {this.changeType(
                              this.state.liveLesson?.instructors
                            )}
                          </Text>
                        </View>
                      </View>
                      {!this.state.liveLesson?.is_added_to_primary_playlist ? (
                        <TouchableOpacity
                          onPress={() =>
                            this.addToMyList(this.state.liveLesson?.id)
                          }
                        >
                          <Icon.AntDesign
                            name={'plus'}
                            size={sizing.myListButtonSize}
                            color={colors.pianoteRed}
                          />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={() =>
                            this.removeFromMyList(this.state.liveLesson?.id)
                          }
                        >
                          <Icon.AntDesign
                            name={'close'}
                            size={sizing.myListButtonSize}
                            color={colors.pianoteRed}
                          />
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        style={{
                          paddingRight: 5
                        }}
                        onPress={() => {
                          this.addToCalendarLessonTitle = this.state.liveLesson?.title;
                          this.addToCalendatLessonPublishDate = this.state.liveLesson?.live_event_start_time;
                          this.setState({
                            addToCalendarModal: true
                          });
                        }}
                      >
                        <Icon.FontAwesome5
                          size={sizing.infoButtonSize}
                          name={'calendar-plus'}
                          color={colors.pianoteRed}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  // else if time ran out switch to live
                  <>
                    <TouchableOpacity
                      style={{
                        width: Dimensions.get('window').width - 10,
                        paddingLeft: 10
                      }}
                      onPress={() => navigate('LIVE')}
                    >
                      <View style={{ width: '100%' }}>
                        {isiOS ? (
                          <FastImage
                            style={{
                              width: '100%',
                              borderRadius: 7.5,
                              aspectRatio: 16 / 9
                            }}
                            source={{
                              uri: this.state.liveLesson
                                ? `https://cdn.musora.com/image/fetch/w_${Math.round(
                                    (Dimensions.get('window').width - 20) * 2
                                  )},ar_16:9,fl_lossy,q_auto:eco,c_fill,g_face/${
                                    this.state.liveLesson?.thumbnail_url
                                  }`
                                : fallbackThumb
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                          />
                        ) : (
                          <Image
                            style={{
                              width: '100%',
                              borderRadius: 7.5,
                              aspectRatio: 16 / 9
                            }}
                            resizeMode='cover'
                            source={{
                              uri: this.state.liveLesson
                                ? `https://cdn.musora.com/image/fetch/w_${Math.round(
                                    (Dimensions.get('window').width - 20) * 2
                                  )},ar_16:9,fl_lossy,q_auto:eco,c_fill,g_face/${
                                    this.state.liveLesson?.thumbnail_url
                                  }`
                                : fallbackThumb
                            }}
                          />
                        )}
                      </View>
                      <View
                        style={{
                          width: '100%',
                          paddingVertical: 10,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <View style={{ width: '80%' }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              width: 80,
                              marginBottom: 5,
                              marginTop: 2
                            }}
                          >
                            <View
                              style={{
                                borderRadius: onTablet ? 5 : 3,
                                backgroundColor: 'red',
                                paddingHorizontal: onTablet ? 7.5 : 5
                              }}
                            >
                              <Text
                                numberOfLines={1}
                                ellipsizeMode='tail'
                                style={{
                                  fontSize: onTablet ? 14 : 12,
                                  fontFamily: 'OpenSans-Regular',
                                  color: 'white'
                                }}
                              >
                                LIVE
                              </Text>
                            </View>
                            <View
                              style={{
                                paddingHorizontal: 10,
                                flexDirection: 'row'
                              }}
                            >
                              <View
                                style={{
                                  justifyContent: 'center'
                                }}
                              >
                                <PasswordVisible
                                  height={onTablet ? 22 : 18}
                                  width={onTablet ? 22 : 18}
                                  fill={'white'}
                                />
                              </View>
                              <View
                                style={{
                                  justifyContent: 'center'
                                }}
                              >
                                <Text
                                  numberOfLines={1}
                                  style={{
                                    fontSize: onTablet ? 14 : 12,
                                    fontFamily: 'OpenSans-Regular',
                                    color: 'white',
                                    paddingLeft: 5
                                  }}
                                >
                                  {this.state.liveViewers}
                                </Text>
                              </View>
                            </View>
                          </View>
                          <Text
                            numberOfLines={1}
                            ellipsizeMode='tail'
                            style={{
                              fontSize: onTablet ? 16 : 14,
                              fontFamily: 'OpenSans-Bold',
                              color: 'white'
                            }}
                          >
                            Pianote Live Stream
                          </Text>
                          <View
                            style={{
                              flexDirection: 'row'
                            }}
                          >
                            <Text
                              numberOfLines={1}
                              style={{
                                fontFamily: 'OpenSans-Regular',
                                color: colors.pianoteGrey,
                                marginTop: 2.5,
                                fontSize: sizing.descriptionText
                              }}
                            >
                              {this.changeType(
                                this.state.liveLesson?.instructors
                              )}
                            </Text>
                          </View>
                        </View>
                        {!this.state.liveLesson
                          ?.is_added_to_primary_playlist ? (
                          <TouchableOpacity
                            style={{ paddingRight: 2.5, paddingBottom: 10 }}
                            onPress={() =>
                              this.addToMyList(this.state.liveLesson?.id)
                            }
                          >
                            <Icon.AntDesign
                              name={'plus'}
                              size={sizing.myListButtonSize}
                              color={colors.pianoteRed}
                            />
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            style={{ paddingRight: 2.5, paddingBottom: 10 }}
                            onPress={() =>
                              this.removeFromMyList(this.state.liveLesson?.id)
                            }
                          >
                            <Icon.AntDesign
                              name={'close'}
                              size={sizing.myListButtonSize}
                              color={colors.pianoteRed}
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                    </TouchableOpacity>
                  </>
                )}
              </>
            )}
            <View style={{ height: 10 / 2 }} />
            {onTablet ? (
              <HorizontalVideoList
                isMethod={true}
                items={this.state.allLessons}
                Title={'ALL LESSONS'}
                showType={true}
                seeAll={() =>
                  navigate('SEEALL', {
                    title: 'All Lessons',
                    parent: 'Lessons'
                  })
                }
                hideFilterButton={false}
                isPaging={this.state.isPaging}
                filters={this.metaFilters}
                currentSort={this.state.currentSort}
                changeSort={sort => {
                  this.setState(
                    {
                      currentSort: sort,
                      isPaging: true,
                      allLessons: [],
                      page: 1
                    },
                    () => this.getAllLessons()
                  );
                }}
                applyFilters={filters =>
                  new Promise(res =>
                    this.setState({ allLessons: [], page: 1 }, () => {
                      this.filterQuery = filters;
                      this.getAllLessons().then(res);
                    })
                  )
                }
                callEndReached={true}
                reachedEnd={() => {
                  if (!this.state.isPaging) {
                    this.setState(
                      {
                        page: this.state.page + 1,
                        isPaging: true
                      },
                      () => this.getAllLessons()
                    );
                  }
                }}
              />
            ) : (
              <View style={{ marginTop: 5 }}>
                <VerticalVideoList
                  isMethod={true}
                  items={this.state.allLessons}
                  isLoading={false}
                  title={'ALL LESSONS'}
                  type={'LESSONS'}
                  showFilter={true}
                  isPaging={this.state.isPaging}
                  showType={true}
                  showArtist={true}
                  showSort={true}
                  showLength={false}
                  filters={this.metaFilters} // show filter list
                  currentSort={this.state.currentSort}
                  changeSort={sort => {
                    this.setState(
                      {
                        currentSort: sort,
                        isPaging: true,
                        allLessons: [],
                        page: 1
                      },
                      () => this.getAllLessons()
                    );
                  }}
                  applyFilters={filters =>
                    new Promise(res =>
                      this.setState(
                        {
                          allLessons: [],
                          page: 1
                        },
                        () => {
                          this.filterQuery = filters;
                          this.getAllLessons().then(res);
                        }
                      )
                    )
                  }
                  imageWidth={width * 0.26} // image width
                  getVideos={() => this.getVideos()}
                />
              </View>
            )}
          </ScrollView>
        ) : (
          <ActivityIndicator
            size={'small'}
            style={{ flex: 1 }}
            color={'white'}
          />
        )}
        <RestartCourse
          isVisible={this.state.showRestartCourse}
          onBackButtonPress={() => this.setState({ showRestartCourse: false })}
          hideRestartCourse={() =>
            this.setState({
              showRestartCourse: false
            })
          }
          type='method'
          onRestart={() => this.onRestartMethod()}
        />
        <Modal
          visible={this.state.showLive}
          transparent={true}
          style={{ margin: 0, flex: 1 }}
          animation={'slideInUp'}
          animationInTiming={250}
          animationOutTiming={250}
          coverScreen={true}
          hasBackdrop={true}
        >
          <Live
            hideLive={() => this.setState({ showLive: false })}
            liveLesson={this.state.liveLesson}
          />
        </Modal>
        <AddToCalendar
          isVisible={this.state.addToCalendarModal}
          hideAddToCalendar={() => this.setState({ addToCalendarModal: false })}
          addEventToCalendar={() => this.addEventToCalendar()}
        />
        <UserInfo
          isVisible={true} //this.state.showUserInfo}
          hideUserInfo={() =>
            this.setState({ showUserInfo: !this.state.showUserInfo })
          }
          isDark={true}
          appName={'PIANOTE'}
          appColor={colors.pianoteRed}
          postDict={{
            author_access_level: 'piano',
            author_avatar_url:
              'https://d2vyvo0tyx8ig5.cloudfront.net/avatars/412470_1610337691197-1610337692-412470.jpg',
            author_display_name: 'Mark Nicholson',
            author_id: 412470,
            category: 'General Piano Discussion',
            category_id: 1,
            category_slug: 'general-piano-discussion',
            created_at: '2021-01-26 02:43:27',
            deleted_at: null,
            id: 1886,
            is_followed: 0,
            is_read: 0,
            last_post_id: 36625,
            last_post_published_on: '2021-03-04 19:04:10',
            last_post_user_id: 405877,
            latest_post: {
              id: 36625,
              created_at: '2021-03-04 19:04:10',
              created_at_diff: '2 months ago',
              author_id: 405877,
              author_display_name: 'Michael F'
            },
            locked: 0,
            mobile_app_url:
              'http://staging.pianote.com/forums/api/thread/show/1886',
            pinned: 0,
            post_count: 60,
            published_on: '2021-01-26 02:43:27',
            published_on_formatted: 'Jan 26, 2021',
            slug: 'show-us-your-workspaces',
            state: 'published',
            title: 'Show Us Your Workspaces!',
            updated_at: '2021-01-26 02:43:27',
            version_master_id: null,
            version_saved_at: null
          }}
          data={{
            totalXP: 12232,
            totalPosts: 923,
            daysMember: 723,
            totalLikes: 123,
            user: 'kentonpalmer',
            date: '2019',
            rank: 'MASTER II',
            level: '2.3',
            url:
              'https://www.drumeo.com/laravel/public/assets/images/default-avatars/default-male-profile-thumbnail.png'
          }}
        />
        <NavigationBar currentPage={'LESSONS'} isMethod={true} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  methodContainer: {
    flex: 1,
    backgroundColor: 'black'
  }
});

const mapStateToProps = state => ({ lessonsCache: state.lessonsCache });
const mapDispatchToProps = dispatch =>
  bindActionCreators({ cacheAndWriteLessons }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Lessons);
