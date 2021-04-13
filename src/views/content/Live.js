/**
 * Live
 */
import React from 'react';
import {
  View,
  Platform,
  StatusBar,
  TextInput,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  KeyboardAvoidingView,
  BackHandler,
  SafeAreaView,
} from 'react-native';
import Video from 'RNVideoEnhanced';
import Modal from 'react-native-modal';
import DeviceInfo from 'react-native-device-info';
import NavMenuHeaders from '../../components/NavMenuHeaders';
import NavigationBar from '../../components/NavigationBar.js';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { MusoraChat } from 'MusoraChat';
import { getLiveScheduleContent } from '../../services/GetContent';
import { getMediaSessionId, updateUsersVideoProgress, removeAllMessages, toggleBlockStudent } from '../../services/UserActions';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import ArrowLeft from 'Pianote2/src/assets/img/svgs/arrowLeft';
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import AddToCalendar from '../../modals/AddToCalendar';
import { addToMyList, removeFromMyList } from '../../services/UserActions';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { NetworkContext } from '../../context/NetworkProvider';
import { goBack } from '../../../AppNavigator';
import { getLiveContent } from 'Pianote2/src/services/GetContent';

const day = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
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
      items: [], // for scheduled live events
      liveLesson: [],
      month: '',
      addToCalendarModal: false
    };
  }

  componentDidMount = async () => {
    BackHandler.addEventListener('hardwareBackPress', this.onBack);
    await this.getLiveContent();
    let response = await getLiveScheduleContent();

    this.setState({ 
      items: response, 
      isLoadingAll: false,
      isLive: this.state.liveLesson[0]?.isLive,
    });
  };

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBack);
  }

  async getLiveContent() {
    let content = [await getLiveContent()];
    this.content = content[0];

    //watchers listener
    // let [{ apiKey, chatChannelName, userId, token }] = content;
    // watchersListener(apiKey, chatChannelName, userId, token, liveViewers =>
    // this.setState({ liveViewers })
    // ).then(rwl => (this.removeWatchersListener = rwl));
    ///////////////////

    let timeNow = Math.floor(Date.now() / 1000);
    let timeLive = new Date(content[0].live_event_start_time).getTime() / 1000;
    let timeDiff = timeLive - timeNow;
    var date = new Date(timeDiff * 1000);

    this.setState({
      liveLesson: content,
      timeDiffLive: {
        timeDiff,
        hours: date.getHours(),
        minutes: date.getMinutes(),
        seconds: date.getSeconds()
      }
    });

    if (!content[0].isLive) {
      this.interval = setInterval(() => this.timer(), 1000);
    }
  }

  async timer() {
    let timeNow = Math.floor(Date.now() / 1000);
    let timeLive = new Date(this.state.liveLesson[0].live_event_start_time).getTime() / 1000;
    let timeDiff = timeLive - timeNow;
    let date = new Date(timeDiff * 1000);
    this.setState({
      timeDiffLive: {
        timeDiff,
        hours: date.getHours(),
        minutes: date.getMinutes(),
        seconds: date.getSeconds()
      }
    });
    if (timeDiff < 0) {
      // prod: timeDiff < 0
      // test: date.getSeconds() == 1 || date.getSeconds() == 30

      // if time ran out show reminder, get rid of timer
      this.setState({ isLive: true });
      clearInterval(this.interval);
    }
  }

  onBack = () => goBack();

  timeVariables = time => {
    let date = new Date(time + ' UTC').getTime();
    let d = new Date(date);
    let amPM = 'AM';

    if(this.state.month == '' && (d instanceof Date && !isNaN(d.valueOf()))) {
      this.setState({ month: d.getMonth()});
    }

    if (d.getHours() > 11) {
      amPM = 'PM';
    }

    return {
      minutes: d.getMinutes(),
      hours:
        d.getHours() > 12
          ? d.getHours() - 12
          : d.getHours(),
      day: d.getDay(),
      date: d.getDate(),
      month: d.getMonth(),
      amPM
    };
  };

  changeType = word => {
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

  addToMyList =async contentID => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }

    this.state.items.find(
      item => item.id == contentID
    ).is_added_to_primary_playlist = true;

    this.setState({ items: this.state.items });

    addToMyList(contentID);
  };

  removeFromMyList = contentID => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }

    this.state.items.find(
      item => item.id == contentID
    ).is_added_to_primary_playlist = false;

    this.setState({ items: this.state.items });

    removeFromMyList(contentID);
  };

  render() {
    let {
      apiKey,
      chatChannelName,
      questionsChannelName,
      userId,
      token,
      youtube_video_id
    } = this.content;
    return (
      <> 
        {this.state.liveLesson.length > 0 ? (
          <SafeAreaView 
            forceInset={{ top: 'never', bottom: 'never' }}
            style={{
              backgroundColor: colors.mainBackground,
              flex: 1,
            }}
          >
            <StatusBar backgroundColor={'black'} barStyle={'light-content'} />
            <>
              {(this.state.timeDiffLive.timeDiff > 0 &&
                this.state.timeDiffLive.timeDiff < 3600 * 4) ? (
                  <>  
                    <TouchableOpacity
                      style={{
                        width: Dimensions.get('window').width
                      }}
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
                          <View
                            style={[
                              styles.centerContent,
                              {
                                height: '100%',
                                width: '100%',
                                borderRadius: 10
                              }
                            ]}
                          >
                            <LinearGradient
                              colors={[
                                'transparent',
                                'rgba(20, 20, 20, 0.5)',
                                'rgba(0, 0, 0, 1)'
                              ]}
                              style={{
                                borderRadius: 0,
                                width: '100%',
                                height: '100%',
                                position: 'absolute',
                                left: 0,
                                bottom: 0
                              }}
                            />
                            <Text
                              style={{
                                color: 'white',
                                fontFamily: 'OpenSans-Bold',
                                position: 'absolute',
                                fontSize: onTablet ? 16 : 12,
                                left: 5,
                                top: 10
                              }}
                            >
                              UPCOMING EVENT
                            </Text>
                            <Text>
                              <View>
                                <Text
                                  style={{
                                    color: 'white',
                                    fontFamily: 'OpenSans-Bold',
                                    fontSize: onTablet ? 60 : 40,
                                    textAlign: 'center'
                                  }}
                                >
                                  {this.state.timeDiffLive?.hours}
                                </Text>
                                <Text
                                  style={{
                                    color: 'white',
                                    fontFamily: 'OpenSans-Bold',
                                    top: 0,
                                    textAlign: 'center'
                                  }}
                                >
                                  HOURS
                                </Text>
                              </View>
                              <View>
                                <Text
                                  style={{
                                    color: 'white',
                                    fontFamily: 'OpenSans-Bold',
                                    fontSize: onTablet ? 60 : 40
                                  }}
                                >
                                  {' '}
                                  :{' '}
                                </Text>
                                <Text
                                  style={{
                                    color: 'white',
                                    fontFamily: 'OpenSans-Bold',
                                    top: 0,
                                    textAlign: 'center',
                                    color: 'transparent'
                                  }}
                                >
                                  h
                                </Text>
                              </View>
                              <View>
                                <Text
                                  style={{
                                    color: 'white',
                                    fontFamily: 'OpenSans-Bold',
                                    fontSize: onTablet ? 60 : 40,
                                    textAlign: 'center'
                                  }}
                                >
                                  {this.state.timeDiffLive?.minutes}
                                </Text>
                                <Text
                                  style={{
                                    color: 'white',
                                    fontFamily: 'OpenSans-Bold',
                                    top: 0,
                                    textAlign: 'center'
                                  }}
                                >
                                  MINUTES
                                </Text>
                              </View>
                              <View>
                                <Text
                                  style={{
                                    color: 'white',
                                    fontFamily: 'OpenSans-Bold',
                                    fontSize: onTablet ? 60 : 40
                                  }}
                                >
                                  {' '}
                                  :{' '}
                                </Text>
                                <Text
                                  style={{
                                    color: 'white',
                                    fontFamily: 'OpenSans-Bold',
                                    top: 0,
                                    textAlign: 'center',
                                    color: 'transparent'
                                  }}
                                >
                                  h
                                </Text>
                              </View>
                              <View>
                                <Text
                                  style={{
                                    color: 'white',
                                    fontFamily: 'OpenSans-Bold',
                                    fontSize: onTablet ? 60 : 40,
                                    textAlign: 'center'
                                  }}
                                >
                                  {this.state.timeDiffLive?.seconds}
                                </Text>
                                <Text
                                  style={{
                                    color: 'white',
                                    fontFamily: 'OpenSans-Bold',
                                    top: 0,
                                    textAlign: 'center'
                                  }}
                                >
                                  SECONDS
                                </Text>
                              </View>
                            </Text>
                          </View>
                        </View>
                        <View style={{ width: '100%' }}>
                          {Platform.OS === 'ios' ? (
                            <FastImage
                              style={{
                                width: '100%',
                                borderRadius: 7.5,
                                aspectRatio: 16 / 9
                              }}
                              source={{
                                uri:
                                  this.state.liveLesson[0].thumbnail_url !==
                                  'TBD'
                                    ? `https://cdn.musora.com/image/fetch/w_${Math.round(
                                        (Dimensions.get('window').width -
                                          20) *
                                          2
                                      )},ar_16:9,fl_lossy,q_auto:eco,c_fill,g_face/${
                                        this.state.liveLesson[0].thumbnail_url
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
                                uri:
                                  this.state.liveLesson[0].thumbnail_url !==
                                  'TBD'
                                    ? `https://cdn.musora.com/image/fetch/w_${Math.round(
                                        (Dimensions.get('window').width -
                                          20) *
                                          2
                                      )},ar_16:9},fl_lossy,q_auto:eco,c_fill,g_face/${
                                        this.state.liveLesson[0].thumbnail_url
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

                                fontSize: sizing.descriptionText
                              }}
                            >
                              {this.changeType(
                                this.state.liveLesson[0].instructors
                              )}
                            </Text>
                          </View>
                        </View>
                        {!this.state.liveLesson[0]
                          .is_added_to_primary_playlist ? (
                          <TouchableOpacity
                            onPress={() =>
                              this.addToMyList(this.state.liveLesson[0]?.id)
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
                                this.state.liveLesson[0]?.id
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
                        <TouchableOpacity
                          style={{ paddingRight: 5 }}
                          onPress={() => {
                            this.addToCalendarLessonTitle = this.state.liveLesson[0].title;
                            this.addToCalendatLessonPublishDate = this.state.liveLesson[0].live_event_start_time;
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
                ) : (
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
                      // TODO: FIX LIVE PLAYER HERE
                      <>
                        <View 
                          style={{
                            width: '100%', 
                            aspectRatio: 16/9,
                            backgroundColor: 'red',

                          }}>
                        
                        </View>
                      </>
                    )}                
                  </>
                )
              }
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
            </>
          </SafeAreaView>
        ) : (
          <View style={styles.mainContainer}>
            <NavMenuHeaders currentPage={'LESSONS'} parentPage={'LIVE'} />
            <StatusBar backgroundColor={colors.thirdBackground} barStyle={'light-content'} />
            <Text style={styles.contentPageHeader}>Live Schedule</Text>
            <FlatList
              data={this.state.items}
              extraData={this.state}
              keyExtractor={item => item.id.toString()}
              style={styles.mainContainer}
              ListHeaderComponent={() => (
                <Text
                  style={{
                    paddingLeft: 10,
                    paddingTop: 10,
                    color: colors.secondBackground,
                    fontSize: onTablet ? 14 : 12
                  }}
                >
                  {month[this.state.month]}
                </Text>
              )}
              ListEmptyComponent={() => this.state.isLoadingAll ? (
                <ActivityIndicator
                  size={'small'}
                  style={{
                    flex: 1,
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
                return (
                  <TouchableOpacity
                    style={{
                      padding: 10,
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
                        {
                          day[
                            this.timeVariables(item.live_event_start_time).day
                          ]
                        }{' '}
                        {this.timeVariables(item.live_event_start_time).date}
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
                        {this.timeVariables(item.live_event_start_time).hours}
                        :
                        {this.timeVariables(item.live_event_start_time)
                          .minutes == 0
                          ? '00'
                          : this.timeVariables(item.live_event_start_time)
                              .minutes}
                        {' ' +
                          this.timeVariables(item.live_event_start_time).amPM}
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
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
                          fontFamily: 'OpenSans-Regular'
                        }}
                      >
                        {this.changeType(item.type)}
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
                          onPress={() => this.addToMyList(item.id)}
                        >
                          <AntIcon
                            name={'plus'}
                            size={sizing.myListButtonSize}
                            color={colors.pianoteRed}
                          />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={() => this.removeFromMyList(item.id)}
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

const localStyles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: '#00101d'
  }
});
