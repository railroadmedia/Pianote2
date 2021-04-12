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
  ActivityIndicator,
  KeyboardAvoidingView,
  BackHandler
} from 'react-native';
import Video from 'RNVideoEnhanced';
import Modal from 'react-native-modal';
import NavMenuHeaders from '../../components/NavMenuHeaders';
import NavigationBar from '../../components/NavigationBar.js';
import FastImage from 'react-native-fast-image';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { MusoraChat } from 'MusoraChat';

import { getLiveScheduleContent } from '../../services/GetContent';
import {
  getMediaSessionId,
  updateUsersVideoProgress,
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
      showMakeComment: false,
      showVideo: true,
      isLive: false,
      items: [], // for scheduled live events
      items: [],
      month: '',
      addToCalendarModal: false
    };
  }

  componentDidMount = async () => {
    BackHandler.addEventListener('hardwareBackPress', this.onBack);

    let content = [await getLiveContent()];
    if (!content[0]?.isLive) {
      this.content = content[0];
      this.setState({ isLive: true, isLoadingAll: false });
    } else {
      let response = await getLiveScheduleContent();
      this.setState({ items: response });
    }
  };

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBack);
  }

  onBack = () => goBack();

  timeVariables = time => {
    let date = new Date(time + ' UTC').getTime();
    let localDate = new Date(date);
    let amPM = 'AM';

    if (this.state.month == '') {
      this.setState({
        month: localDate.getMonth()
      });
    }

    if (localDate.getHours() > 11) {
      amPM = 'PM';
    }

    return {
      minutes: localDate.getMinutes(),
      hours:
        localDate.getHours() > 12
          ? localDate.getHours() - 12
          : localDate.getHours(),
      day: localDate.getDay(),
      date: localDate.getDate(),
      month: localDate.getMonth(),
      amPM
    };
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
        {this.state.isLive ? (
          <View style={localStyles.container}>
            <StatusBar backgroundColor={'black'} barStyle={'light-content'} />
            <>
              {this.state.showVideo && (
                // LIVE PLAYER HERE
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
                    <Video
                      youtubeId={youtube_video_id}
                      toSupport={() => {}}
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
                      goToNextLesson={() => {
                        if (this.state.nextLesson)
                          this.switchLesson(
                            this.state.nextLesson.id,
                            this.state.nextLesson.post.mobile_app_url
                          );
                      }}
                      goToPreviousLesson={() => {
                        if (this.state.previousLesson)
                          this.switchLesson(
                            this.state.previousLesson.id,
                            this.state.previousLesson.post.mobile_app_url
                          );
                      }}
                      onUpdateVideoProgress={async (
                        videoId,
                        id,
                        lengthInSec,
                        currentTime,
                        mediaCategory
                      ) => {
                        if (!this.context.isConnected) return;
                        updateUsersVideoProgress(
                          (
                            await getMediaSessionId(
                              videoId,
                              id,
                              lengthInSec,
                              mediaCategory
                            )
                          )?.session_id.id,
                          currentTime,
                          lengthInSec
                        );
                      }}
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
                  )}
                </>
              )}
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
                  size='small'
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                  color={colors.secondBackground}
                />
              )}

              {this.state.showMakeComment && (
                <Modal
                  isVisible={this.state.showMakeComment}
                  style={styles.modalContainer}
                  backdropColor={'transparent'}
                  animation={'slideInUp'}
                  animationInTiming={350}
                  animationOutTiming={350}
                  coverScreen={false}
                  hasBackdrop={true}
                  transparent={true}
                  onBackdropPress={() =>
                    this.setState({ showMakeComment: false })
                  }
                >
                  <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => this.setState({ showMakeComment: false })}
                  >
                    <KeyboardAvoidingView
                      behavior={`${isiOS ? 'padding' : ''}`}
                      style={{ flex: 1, justifyContent: 'flex-end' }}
                    >
                      <View
                        style={{
                          backgroundColor: colors.mainBackground,
                          flexDirection: 'row',
                          padding: 10,
                          alignItems: 'center',
                          borderTopWidth: 0.5,
                          borderTopColor: colors.secondBackground
                        }}
                      >
                        <FastImage
                          style={{
                            height: onTablet ? 60 : 40,
                            width: onTablet ? 60 : 40,
                            paddingVertical: 10,
                            borderRadius: 100,
                            marginRight: 10
                          }}
                          source={{
                            uri:
                              this.state.profileImage ||
                              'https://www.drumeo.com/laravel/public/assets/images/default-avatars/default-male-profile-thumbnail.png'
                          }}
                          resizeMode={FastImage.resizeMode.stretch}
                        />
                        <TextInput
                          autoFocus={true}
                          multiline={true}
                          style={{
                            fontFamily: 'OpenSans-Regular',
                            fontSize: sizing.descriptionText,
                            flex: 1,
                            backgroundColor: colors.mainBackground,
                            color: colors.secondBackground,
                            paddingVertical: 10
                          }}
                          onSubmitEditing={() => {
                            this.makeComment();
                          }}
                          returnKeyType={'go'}
                          onChangeText={comment => this.setState({ comment })}
                          placeholder={'Add a comment'}
                          placeholderTextColor={colors.secondBackground}
                        />
                        <TouchableOpacity
                          style={{
                            marginBottom: Platform.OS == 'android' ? 10 : 0,
                            marginLeft: 20
                          }}
                          onPress={() => this.makeComment()}
                        >
                          <IonIcon
                            name={'md-send'}
                            size={onTablet ? 25 : 17.5}
                            color={colors.pianoteRed}
                          />
                        </TouchableOpacity>
                      </View>
                    </KeyboardAvoidingView>
                  </TouchableOpacity>
                </Modal>
              )}
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
            <View style={{ flex: 1 }}>
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
                ListEmptyComponent={() => (
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
                )}
                renderItem={({ item }) => {
                  let type = item.lesson ? 'lesson' : 'overview';
                  return (
                    <TouchableOpacity
                      onPress={() => this.navigate(item)}
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
            </View>
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
