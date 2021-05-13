/**
 * Live
 */
import React from 'react';
import {
  View,
  Platform,
  StatusBar,
  Image,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  BackHandler,
  SafeAreaView
} from 'react-native';
import Video from 'RNVideoEnhanced';
import Modal from 'react-native-modal';
import DeviceInfo from 'react-native-device-info';
import NavMenuHeaders from '../../components/NavMenuHeaders';
import NavigationBar from '../../components/NavigationBar.js';
import CountDown from '../../components/CountDown';
import FastImage from 'react-native-fast-image';
import PasswordVisible from 'Pianote2/src/assets/img/svgs/passwordVisible.svg';
import { MusoraChat, watchersListener } from 'MusoraChat';
import { getLiveScheduleContent } from '../../services/GetContent';
import {
  removeAllMessages,
  toggleBlockStudent
} from '../../services/UserActions';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import ArrowLeft from 'Pianote2/src/assets/img/svgs/arrowLeft';
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import AddToCalendar from '../../modals/AddToCalendar';
import { addToMyList, removeFromMyList } from '../../services/UserActions';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { NetworkContext } from '../../context/NetworkProvider';
import { goBack } from '../../../AppNavigator';
import { getLiveContent } from 'Pianote2/src/services/GetContent';

const month = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

export default class Live extends React.Component {
  static contextType = NetworkContext;
  content = {};
  constructor(props) {
    super(props);
    this.state = {
      isLoadingAll: true,
      isLive: false,
      items: [],
      liveLesson: null,
      timeDiffLive: '',
      addToCalendarModal: false,
      liveViewers: 0
    };
  }

  componentDidMount = async () => {
    BackHandler.addEventListener('hardwareBackPress', this.onBack);
    await this.getLiveContent();
    let items = await getLiveScheduleContent();
    for (i in response) {
      let time = response[i].live_event_start_time || response[i].published_on;
      let d = new Date(time + ' UTC');
      response[i].timeData = { month: d.getMonth() };
    }

    this.setState({
      items,
      isLoadingAll: false,
      isLive: this.state.liveLesson?.isLive
    });
  };

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBack);
  }

  async getLiveContent() {
    let content = await getLiveContent();
    this.content = content;
    let timeNow = Math.floor(Date.now() / 1000);
    let timeLive =
      new Date(content.live_event_start_time + ' UTC').getTime() / 1000;
    let timeDiff = timeLive - timeNow;
    if (timeDiff < 1800) {
      // if 30 minutes to go show live lesson and setup chat
      this.setState({ liveLesson: content, timeDiffLive: timeDiff });
      let [{ apiKey, chatChannelName, userId, token }] = content;
      watchersListener(apiKey, chatChannelName, userId, token, liveViewers =>
        this.setState({ liveViewers })
      ).then(rwl => (this.removeWatchersListener = rwl));
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

  onBack = () => goBack();

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

  addToMyList = async (contentID, type) => {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();

    if (type === 'live') {
      this.state.liveLesson.is_added_to_primary_playlist = true;
    } else {
      this.state.items.find(
        item => item.id == contentID
      ).is_added_to_primary_playlist = true;
    }

    this.setState({
      items: this.state.items,
      liveLesson: this.state.liveLesson
    });

    addToMyList(contentID);
  };

  removeFromMyList = (contentID, type) => {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();

    if (type === 'live') {
      this.state.liveLesson.is_added_to_primary_playlist = false;
    } else {
      this.state.items.find(
        item => item.id == contentID
      ).is_added_to_primary_playlist = false;
    }

    this.setState({
      items: this.state.items,
      liveLesson: this.state.liveLesson
    });

    removeFromMyList(contentID);
  };

  checkShouldRender = item => {
    for (i in this.state.items) {
      if (this.state.items[i].id == item.id) {
        if (Number(i) === 0) return true;
        else if (
          item.timeData.month !== this.state.items[Number(i) - 1].timeData.month
        ) {
          return true;
        } else return false;
      }
    }
  };

  render() {
    let {
      apiKey,
      chatChannelName,
      questionsChannelName,
      userId,
      token
    } = this.content;
    return (
      <>
        {this.state.liveLesson && this.state.timeDiffLive < 1800 ? (
          <View
            style={{
              backgroundColor: colors.mainBackground,
              flex: 1
            }}
          >
            {/* COUNTDOWN or LIVE */}
            <>
              {this.state.timeDiffLive > 0 ? (
                // UPCOMING EVENT (< 30 mins)
                <>
                  <SafeAreaView
                    style={{
                      width: Dimensions.get('window').width
                    }}
                  >
                    <View style={{ width: '100%' }}>
                      {this.state.liveLesson?.live_event_start_time && (
                        <CountDown
                          onLivePage={true}
                          timesUp={() =>
                            this.setState({
                              showLive: true,
                              timeDiffLive: 0
                            })
                          }
                          live_event_start_time={
                            this.state.liveLesson.live_event_start_time
                          }
                        />
                      )}
                      <View style={{ width: '100%' }}>
                        {Platform.OS === 'ios' ? (
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
                              aspectRatio: 16 / 9
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
                    </View>
                    <View
                      style={{
                        width: '100%',
                        padding: 10,
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
                            fontSize: DeviceInfo.isTablet() ? 16 : 14,
                            fontFamily: 'OpenSans-Bold',
                            color: 'white'
                          }}
                        >
                          Pianote Live Stream
                        </Text>
                        <View style={{ flexDirection: 'row' }}>
                          <Text
                            numberOfLines={1}
                            style={{
                              fontFamily: 'OpenSans-Regular',
                              color: colors.pianoteGrey,
                              textTransform: 'capitalize',
                              fontSize: sizing.descriptionText
                            }}
                          >
                            {this.changeType(
                              this.state.liveLesson?.instructors
                            )}
                          </Text>
                        </View>
                      </View>
                      {!this.state.liveLesson.is_added_to_primary_playlist ? (
                        <TouchableOpacity
                          onPress={() =>
                            this.addToMyList(this.state.liveLesson?.id, 'live')
                          }
                        >
                          <AntIcon
                            name={'plus'}
                            size={sizing.myListButtonSize}
                            color={colors.pianoteRed}
                          />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={() =>
                            this.removeFromMyList(
                              this.state.liveLesson?.id,
                              'live'
                            )
                          }
                        >
                          <AntIcon
                            name={'close'}
                            size={sizing.myListButtonSize}
                            color={colors.pianoteRed}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  </SafeAreaView>
                </>
              ) : (
                // LIVE PLAYER (0 minutes)
                <>
                  {this.state.isLoadingAll ? (
                    <View style={{ backgroundColor: 'black' }}>
                      <View
                        style={{
                          aspectRatio: 16 / 9,
                          justifyContent: 'center'
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => this.onBack()}
                          style={{
                            top: 0,
                            left: 0,
                            padding: 15,
                            position: 'absolute',
                            justifyContent: 'center'
                          }}
                        >
                          <ArrowLeft
                            width={onTablet ? 25 : 18}
                            height={onTablet ? 25 : 18}
                            fill={'white'}
                          />
                        </TouchableOpacity>
                        <ActivityIndicator size='large' color='#ffffff' />
                      </View>
                    </View>
                  ) : (
                    <>
                      <Video
                        youtubeId={this.state.liveLesson?.youtube_video_id}
                        onRefresh={() => {}}
                        content={this.state}
                        maxFontMultiplier={1}
                        settingsMode={'bottom'}
                        onFullscreen={() => {}}
                        ref={r => (this.video = r)}
                        type={false ? 'audio' : 'video'}
                        connection={this.context.isConnected}
                        onBack={this.onBack}
                        showControls={true}
                        paused={true}
                        styles={{
                          timerCursorBackground: colors.pianoteRed,
                          beforeTimerCursorBackground: colors.pianoteRed,
                          settings: {
                            cancel: {
                              color: 'black'
                            },
                            separatorColor: 'rgb(230, 230, 230)',
                            background: 'white',
                            optionsBorderColor: 'rgb(230, 230, 230)',
                            downloadIcon: {
                              width: 20,
                              height: 20,
                              fill: colors.pianoteRed
                            }
                          }
                        }}
                      />
                      <View
                        style={{
                          width: '100%',
                          paddingHorizontal: 10,
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
                              <View style={{ justifyContent: 'center' }}>
                                <PasswordVisible
                                  height={onTablet ? 22 : 18}
                                  width={onTablet ? 22 : 18}
                                  fill={'white'}
                                />
                              </View>
                              <View style={{ justifyContent: 'center' }}>
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
                        </View>
                        {!this.state.liveLesson.is_added_to_primary_playlist ? (
                          <TouchableOpacity
                            style={{ paddingRight: 2.5, paddingVertical: 5 }}
                            onPress={() =>
                              this.addToMyList(this.state.liveLesson.id, 'live')
                            }
                          >
                            <AntIcon
                              name={'plus'}
                              size={sizing.myListButtonSize}
                              color={colors.pianoteRed}
                            />
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            style={{ paddingRight: 2.5, paddingBottom: 5 }}
                            onPress={() =>
                              this.removeFromMyList(
                                this.state.liveLesson.id,
                                'live'
                              )
                            }
                          >
                            <AntIcon
                              name={'close'}
                              size={sizing.myListButtonSize}
                              color={colors.pianoteRed}
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                    </>
                  )}
                </>
              )}

              {/* CHAT */}
              <SafeAreaView
                forceInset={{ bottom: 'never' }}
                style={{
                  backgroundColor: colors.mainBackground,
                  flex: 1
                }}
              >
                {!this.state.isLoadingAll ? (
                  <MusoraChat
                    appColor={colors.pianoteRed}
                    chatId={chatChannelName}
                    clientId={apiKey}
                    isDark={true}
                    onRemoveAllMessages={removeAllMessages}
                    onToggleBlockStudent={toggleBlockStudent}
                    questionsId={questionsChannelName}
                    user={{ id: `${userId}`, gsToken: token }}
                  />
                ) : (
                  <ActivityIndicator
                    size={'small'}
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                    color={colors.secondBackground}
                  />
                )}
              </SafeAreaView>
            </>
          </View>
        ) : (
          <View style={styles.mainContainer}>
            <NavMenuHeaders currentPage={'LESSONS'} parentPage={'LIVE'} />
            <StatusBar
              backgroundColor={colors.thirdBackground}
              barStyle={'light-content'}
            />
            <Text style={styles.contentPageHeader}>Live Schedule</Text>
            <FlatList
              data={this.state.items}
              extraData={this.state}
              keyExtractor={item => item.id.toString()}
              style={styles.mainContainer}
              ListEmptyComponent={() =>
                this.state.isLoadingAll ? (
                  <ActivityIndicator
                    size={'small'}
                    style={{
                      padding: 50,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                    color={colors.secondBackground}
                  />
                ) : (
                  <Text
                    style={{
                      paddingLeft: 10,
                      color: 'white',
                      textAlign: 'left',
                      fontSize: onTablet ? 16 : 14
                    }}
                  >
                    Sorry, there are no upcoming events!
                  </Text>
                )
              }
              renderItem={({ item }) => {
                let type = item.lesson ? 'lesson' : 'overview';
                let date = new Date(
                  `${item?.live_event_start_time || item?.published_on} UTC`
                );
                return (
                  <>
                    {this.checkShouldRender(item) && (
                      <Text
                        style={{
                          padding: 10,
                          color: colors.secondBackground,
                          fontSize: onTablet ? 14 : 12
                        }}
                      >
                        {month[item.timeData.month]}
                      </Text>
                    )}
                    <TouchableOpacity
                      style={{
                        paddingHorizontal: 10,
                        flexDirection: 'row',
                        height: 80
                      }}
                    >
                      <View
                        style={[
                          styles.centerContent,
                          {
                            width: '26%',
                            aspectRatio: 16 / 9,
                            backgroundColor: 'black',
                            borderRadius: 10,
                            marginRight: 10
                          }
                        ]}
                      >
                        <Text
                          numberOfLines={1}
                          style={{
                            fontSize: sizing.descriptionText,
                            color: 'white',
                            textAlign: 'left',
                            fontFamily: 'OpenSans-Bold',
                            textAlign: 'center'
                          }}
                        >
                          {date.toLocaleString([], { weekday: 'short' })}{' '}
                          {date.getDate()}
                        </Text>
                        <Text
                          numberOfLines={1}
                          style={{
                            fontSize: sizing.descriptionText,
                            color: 'white',
                            textAlign: 'left',
                            fontFamily: 'OpenSans-Regular',
                            textAlign: 'center'
                          }}
                        >
                          {date.toLocaleString([], {
                            hour: 'numeric',
                            minute: '2-digit'
                          })}
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center'
                        }}
                      >
                        <Text
                          style={{
                            fontSize: sizing.videoTitleText,
                            marginBottom: 2,
                            color: 'white',
                            fontFamily: 'OpenSans-Bold'
                          }}
                        >
                          {item.title}
                        </Text>
                        <Text
                          numberOfLines={1}
                          style={{
                            fontSize: sizing.descriptionText,
                            color: colors.secondBackground,
                            textAlign: 'left',
                            fontFamily: 'OpenSans-Regular',
                            textTransform: 'capitalize'
                          }}
                        >
                          {item?.type.toString().replace(/-/g, ' ')}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.centerContent,
                          {
                            paddingLeft: 20,
                            flexDirection: 'row'
                          }
                        ]}
                      >
                        {!item.is_added_to_primary_playlist ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.addToMyList(item.id, 'schedule')
                            }
                          >
                            <AntIcon
                              name={'plus'}
                              size={sizing.myListButtonSize}
                              color={colors.pianoteRed}
                            />
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            onPress={() =>
                              this.removeFromMyList(item.id, 'schedule')
                            }
                          >
                            <AntIcon
                              name={'close'}
                              size={sizing.myListButtonSize}
                              color={colors.pianoteRed}
                            />
                          </TouchableOpacity>
                        )}

                        <TouchableOpacity
                          style={{ marginLeft: 10 }}
                          onPress={() => {
                            this.addToCalendarLessonTitle = item.title;
                            this.addToCalendatLessonPublishDate =
                              item.live_event_start_time;
                            this.setState({ addToCalendarModal: true });
                          }}
                        >
                          <FontIcon
                            size={sizing.infoButtonSize}
                            name={'calendar-plus'}
                            color={colors.pianoteRed}
                          />
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  </>
                );
              }}
            />
            <Modal
              isVisible={this.state.addToCalendarModal}
              style={styles.modalContainer}
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
            <NavigationBar currentPage={'LIVE'} />
          </View>
        )}
      </>
    );
  }
}
