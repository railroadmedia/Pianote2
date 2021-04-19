/**
 * PathOverview
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  ImageBackground,
  StatusBar,
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Modal from 'react-native-modal';
import { Download_V2 } from 'RNDownload';
import AntIcon from 'react-native-vector-icons/AntDesign';
import Back from 'Pianote2/src/assets/img/svgs/back.svg';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Orientation from 'react-native-orientation-locker';

import StartIcon from '../../components/StartIcon';
import ContinueIcon from '../../components/ContinueIcon';
import ResetIcon from '../../components/ResetIcon';
import NavigationBar from '../../components/NavigationBar';
import ApprovedTeacher from 'Pianote2/src/assets/img/svgs/approved-teacher.svg';
import Progress from 'Pianote2/src/assets/img/svgs/progress.svg';
import RestartCourse from '../../modals/RestartCourse';
import contentService from '../../services/content.service';
import { NetworkContext } from '../../context/NetworkProvider';
import {
  addToMyList,
  likeContent,
  removeFromMyList,
  resetProgress,
  unlikeContent
} from '../../services/UserActions';
import methodService from '../../services/method.service';
import foundationsService from '../../services/foundations.service';
import NextVideo from '../../components/NextVideo';
import { ScrollView } from 'react-native-gesture-handler';
import { goBack, navigate } from '../../../AppNavigator';

let greaterWDim;
const windowDim = Dimensions.get('window');
const width =
  windowDim.width < windowDim.height ? windowDim.width : windowDim.height;

export default class PathOverview extends React.Component {
  static contextType = NetworkContext;

  constructor(props) {
    super(props);
    this.state = {
      id: props.route?.params?.data?.id,
      mobile_app_url: props.route?.params?.data?.mobile_app_url,
      items: props.route?.params?.items || [],
      isAddedToList: props.route?.params?.data?.isAddedToList,
      thumbnail: props.route?.params?.data?.thumbnail,
      description: props.route?.params?.data?.description,
      title: props.route?.params?.data?.title,
      artist: '',
      isMethod: props.route?.params?.isMethod,
      isFoundations: props.route?.params?.isFoundations,
      xp: props.route?.params?.data?.total_xp,
      started: props.route?.params?.data?.started,
      completed: props.route?.params?.data?.completed,
      nextLesson: props.route?.params?.data?.next_lesson,
      difficulty: props.route?.params?.data?.difficulty,
      type: '',
      showInfo: false,
      totalLength: 0,
      isLiked: false,
      likeCount: 0,
      showRestartCourse: false,
      progress: 0,
      isLoadingAll: props.route?.params?.items?.length ? false : true,
      refreshing: false,
      levelNum: 0,
      bannerNextLessonUrl: '',
      isLandscape:
        Dimensions.get('window').height < Dimensions.get('window').width
    };
    greaterWDim = fullHeight < fullWidth ? fullHeight : fullWidth;
  }

  componentDidMount() {
    Orientation.addDeviceOrientationListener(this.orientationListener);
    Orientation.removeDeviceOrientationListener(this.orientationListener);
    if (!this.state.items.length && this.context.isConnected) this.getItems();
  }

  orientationListener = o => {
    if (o === 'UNKNOWN') return;
    let isLandscape = o.indexOf('LAND') >= 0;
    if (Platform.OS === 'ios') {
      if (onTablet) this.setState({ isLandscape });
    } else {
      Orientation.getAutoRotateState(isAutoRotateOn => {
        if (isAutoRotateOn && onTablet) this.setState({ isLandscape });
      });
    }
  };

  getItems = async () => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    let res;
    if (this.state.isFoundations) {
      res = await foundationsService.getUnit(this.state.mobile_app_url);
    } else if (this.state.isMethod) {
      res = await methodService.getMethodContent(this.state.mobile_app_url);
    } else {
      res = await contentService.getContent(this.state.id);
    }

    this.setState({
      id: res.id,
      mobile_app_url: res.mobile_app_url,
      likeCount: res.like_count,
      isLiked: res.is_liked_by_current_user,
      isAddedToList: res.is_added_to_primary_playlist,
      totalLength: res.length_in_seconds,
      started: res.started,
      completed: res.completed,
      nextLesson: res.next_lesson,
      levelNum: res.level_position + '.' + res.course_position,
      progress: res.progress_percent,
      difficulty: res.difficulty,
      thumbnail: res.thumbnail_url,
      description: res.description,
      title: res.title,
      xp: res.xp,
      type: res.type,
      bannerNextLessonUrl: res.banner_button_url,
      artist: res.artist,
      instructor: res.instructor,
      isLoadingAll: false,
      refreshing: false,
      items: res.lessons
    });
  };

  toggleMyList = id => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    if (id === this.state.id) {
      if (this.state.isAddedToList) {
        removeFromMyList(id);
      } else {
        addToMyList(id);
      }
    } else {
      const lesson = this.state.items.find(f => f.id === id);
      if (lesson.is_added_to_primary_playlist) {
        removeFromMyList(id);
      } else {
        addToMyList(id);
      }
    }

    this.setState(state => ({
      isAddedToList:
        id === state.id ? !state.isAddedToList : state.isAddedToList,
      items: state.items.map(c =>
        c.id === id
          ? {
              ...c,
              is_added_to_primary_playlist: !c.is_added_to_primary_playlist
            }
          : c
      )
    }));
  };

  toggleLike = () => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    if (this.state.isLiked) {
      unlikeContent(this.state.id);
    } else {
      likeContent(this.state.id);
    }
    this.setState({
      isLiked: !this.state.isLiked,
      likeCount: this.state.isLiked
        ? this.state.likeCount - 1
        : this.state.likeCount + 1
    });
  };

  onRestartCourse = async () => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    resetProgress(this.state.id);
    this.setState(
      {
        started: false,
        completed: false,
        showRestartCourse: false,
        refreshing: true
      },
      () => this.getItems()
    );
  };

  refresh = () => {
    this.setState({ refreshing: true }, () => {
      this.getItems();
    });
  };

  formatDifficulty() {
    const { difficulty } = this.state;
    try {
      let text = '';
      if (difficulty) {
        difficulty < 5
          ? (text = 'BEGINNER ' + difficulty)
          : difficulty < 8
          ? (text = 'INTERMEDIATE ' + difficulty)
          : (text = 'ADVANCED ' + difficulty);
      }
      return text;
    } catch (e) {
      return '';
    }
  }

  getAspectRatio() {
    if (onTablet && this.state.isLandscape) return 2.2;
    if (onTablet && !this.state.isLandscape) return 1.9;
    return 1.8;
  }

  goToLesson(lesson) {
    if (lesson) {
      if (this.state.isMethod) {
        return navigate('VIDEOPLAYER', {
          url: lesson,
          parentId: this.state.id
        });
      }
      return navigate('VIDEOPLAYER', {
        id: lesson,
        parentId: this.state.id
      });
    }
  }

  renderHeader = () => {
    let { thumbnail } = this.state;
    return (
      <View style={{ marginBottom: '4%' }}>
        <ImageBackground
          resizeMethod='resize'
          style={{
            width: '100%',
            aspectRatio: this.getAspectRatio(),
            resizeMode: 'cover'
          }}
          source={{
            uri: thumbnail?.includes('https')
              ? `https://cdn.musora.com/image/fetch/fl_lossy,q_auto:eco,w_${Math.round(
                  width
                )},ar_${this.getAspectRatio()},${
                  this.state.isMethod && !this.state.isFoundations
                    ? 'c_pad,g_south'
                    : 'c_fill,g_face'
                }/${this.state.thumbnail}`
              : thumbnail
          }}
        >
          <TouchableOpacity
            onPress={() => goBack()}
            style={[
              styles.centerContent,
              {
                position: 'absolute',
                height: 40,
                width: 40,
                borderRadius: 100,
                left: 10,
                top: 10,
                zIndex: 4
              }
            ]}
          >
            <Back
              width={backButtonSize}
              height={backButtonSize}
              fill={'white'}
            />
          </TouchableOpacity>
        </ImageBackground>
        <View
          style={[this.state.isLandscape ? { marginHorizontal: '10%' } : {}]}
        >
          {!this.state.isMethod && (
            <Text
              numberOfLines={2}
              style={{
                fontFamily: 'OpenSans-Bold',
                color: 'white',
                textAlign: 'center',
                fontSize: sizing.titleVideoPlayer,
                marginTop: 10
              }}
            >
              {this.state.title}
            </Text>
          )}
          <Text
            numberOfLines={2}
            style={[
              {
                fontFamily: 'OpenSans-Regular',
                color: this.state.isMethod
                  ? colors.pianoteGrey
                  : colors.secondBackground,
                textAlign: 'center',
                fontSize: sizing.descriptionText,
                paddingVertical: onTablet ? 20 : 10
              }
            ]}
          >
            {this.state.artist?.toUpperCase() ||
              this.state.instructor
                ?.map(i => i.name)
                .join(', ')
                .toUpperCase()}
            |{' '}
            {this.state.isMethod && !this.state.isFoundations
              ? 'LEVEL ' + this.state.levelNum
              : this.formatDifficulty()}{' '}
            | {this.state.xp} XP
          </Text>
          <View
            style={[
              styles.heightButtons,
              {
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center'
              }
            ]}
          >
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ flex: 0.5 }} />
              <TouchableOpacity
                style={{
                  flex: 0.5,
                  alignItems: 'center'
                }}
                onPress={() => this.toggleMyList(this.state.id)}
              >
                <View style={[styles.centerContent, { flexDirection: 'row' }]}>
                  {!this.state.isAddedToList ? (
                    <AntIcon
                      name={'plus'}
                      size={sizing.myListButtonSize}
                      color={colors.pianoteRed}
                    />
                  ) : (
                    <AntIcon
                      name={'close'}
                      size={sizing.myListButtonSize}
                      color={colors.pianoteRed}
                    />
                  )}
                </View>
                <Text
                  style={{
                    fontFamily: 'OpenSans-Regular',
                    color: 'white',
                    fontSize: sizing.descriptionText
                  }}
                >
                  {this.state.isAddedToList ? 'Added' : 'My List'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ width: '50%' }}>
              {this.state.completed ? (
                <ResetIcon
                  isMethod={true}
                  pressed={() => this.setState({ showRestartCourse: true })}
                />
              ) : this.state.started ? (
                <ContinueIcon
                  isMethod={true}
                  pressed={() =>
                    this.goToLesson(
                      this.state.isMethod
                        ? this.state.bannerNextLessonUrl
                        : this.state.nextLesson?.id
                    )
                  }
                />
              ) : (
                <StartIcon
                  isMethod={true}
                  pressed={() =>
                    this.goToLesson(
                      this.state.isMethod
                        ? this.state.bannerNextLessonUrl
                        : this.state.nextLesson?.id
                    )
                  }
                />
              )}
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <TouchableOpacity
                style={{
                  flex: 0.5,
                  alignItems: 'center'
                }}
                onPress={() => {
                  this.setState({
                    showInfo: !this.state.showInfo
                  });
                }}
              >
                <View style={[styles.centerContent, { flexDirection: 'row' }]}>
                  <AntIcon
                    name={this.state.showInfo ? 'infocirlce' : 'infocirlceo'}
                    size={sizing.infoButtonSize}
                    color={colors.pianoteRed}
                  />
                </View>
                <Text
                  style={{
                    fontFamily: 'OpenSans-Regular',
                    color: 'white',
                    fontSize: sizing.descriptionText
                  }}
                >
                  Info
                </Text>
              </TouchableOpacity>
              <View style={{ flex: 0.5 }} />
            </View>
          </View>
        </View>

        {this.state.showInfo && (
          <View
            style={[
              {
                paddingHorizontal: 10 * 2
              },
              this.state.isLandscape
                ? { marginHorizontal: '10%' }
                : { width: '100%' }
            ]}
          >
            {!!this.state.description && (
              <Text
                style={{
                  fontFamily: 'OpenSans-Regular',
                  marginTop: '5%',
                  fontSize: sizing.descriptionText,
                  color: 'white',
                  textAlign: 'center'
                }}
              >
                {this.state.description}
              </Text>
            )}
            <View style={{ paddingHorizontal: '20%' }}>
              <View style={[styles.centerContent, { flexDirection: 'row' }]}>
                <Text
                  style={{
                    flex: 1,
                    fontSize: onTablet ? 25 : 17.5,
                    textAlign: 'center',
                    color: 'white',
                    fontFamily: 'OpenSans-Bold',
                    marginTop: 10
                  }}
                >
                  {this.state.items.length}
                  {`\n`}
                  <Text
                    style={{
                      fontSize: sizing.descriptionText,
                      textAlign: 'center',
                      color: 'white',
                      fontFamily: 'OpenSans-Regular',
                      marginTop: 5
                    }}
                  >
                    Lessons
                  </Text>
                </Text>
                <Text
                  style={{
                    flex: 1,
                    fontSize: onTablet ? 25 : 17.5,
                    textAlign: 'center',
                    color: 'white',
                    fontFamily: 'OpenSans-Bold',
                    marginTop: 10
                  }}
                >
                  {Math.floor(this.state.totalLength / 60)}
                  {`\n`}
                  <Text
                    style={{
                      fontSize: sizing.descriptionText,
                      textAlign: 'center',
                      color: 'white',
                      fontFamily: 'OpenSans-Regular',
                      marginTop: 10
                    }}
                  >
                    Mins
                  </Text>
                </Text>
                <Text
                  style={{
                    flex: 1,
                    fontSize: onTablet ? 25 : 17.5,
                    textAlign: 'center',
                    color: 'white',
                    fontFamily: 'OpenSans-Bold',
                    marginTop: 10
                  }}
                >
                  {this.state.xp}
                  {`\n`}
                  <Text
                    style={{
                      fontSize: sizing.descriptionText,
                      textAlign: 'center',
                      color: 'white',
                      fontFamily: 'OpenSans-Regular',
                      marginTop: 10
                    }}
                  >
                    XP
                  </Text>
                </Text>
              </View>
              <View
                style={[
                  styles.centerContent,
                  {
                    flexDirection: 'row',
                    marginTop: 20,
                    marginBottom: onTablet ? '2%' : '4%'
                  }
                ]}
              >
                <TouchableOpacity
                  onPress={() => this.toggleLike()}
                  style={[
                    styles.centerContent,
                    {
                      flex: 1
                    }
                  ]}
                >
                  <Text
                    style={{
                      fontSize: sizing.descriptionText,
                      textAlign: 'center',
                      color: 'white',
                      fontFamily: 'OpenSans-Regular',
                      marginTop: 5
                    }}
                  >
                    <AntIcon
                      name={this.state.isLiked ? 'like1' : 'like2'}
                      size={sizing.myListButtonSize}
                      color={colors.pianoteRed}
                    />
                    {`\n`}
                    {this.state.likeCount}
                  </Text>
                </TouchableOpacity>
                <Download_V2
                  entity={{
                    id: this.state.id,
                    content: contentService.getContent(this.state.id, true)
                  }}
                  styles={{
                    flex: 1,
                    touchable: { flex: 1 },
                    iconSize: {
                      width: sizing.myListButtonSize,
                      height: sizing.myListButtonSize
                    },
                    iconDownloadColor: colors.pianoteRed,
                    activityIndicatorColor: colors.pianoteRed,
                    animatedProgressBackground: colors.pianoteRed,
                    textStatus: {
                      color: '#ffffff',
                      fontSize: sizing.descriptionText,
                      fontFamily: 'OpenSans-Regular',
                      marginTop: 0
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
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      showRestartCourse: true
                    });
                  }}
                  style={[
                    styles.centerContent,
                    {
                      flex: 1
                    }
                  ]}
                >
                  <Text
                    style={{
                      fontSize: sizing.descriptionText,
                      textAlign: 'center',
                      color: 'white',
                      fontFamily: 'OpenSans-Regular',
                      marginTop: 5
                    }}
                  >
                    <MaterialIcon
                      name={'replay'}
                      size={sizing.myListButtonSize}
                      color={colors.pianoteRed}
                    />
                    {`\n`}
                    Restart
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  };

  render() {
    const { isMethod, items, refreshing, isLandscape, nextLesson } = this.state;
    return (
      <SafeAreaView
        forceInset={{ top: onTablet ? 'never' : 'never' }}
        style={[
          {
            flex: 1,
            backgroundColor: isMethod ? 'black' : colors.mainBackground
          }
        ]}
      >
        <StatusBar
          backgroundColor={isMethod ? 'black' : colors.mainBackground}
          barStyle={'light-content'}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              colors={[colors.pianoteRed]}
              refreshing={refreshing}
              onRefresh={() => this.refresh()}
            />
          }
        >
          {this.renderHeader()}
          <FlatList
            style={{
              flex: 1,
              marginLeft: onTablet ? (isLandscape ? '10%' : '2%') : 0,
              backgroundColor: isMethod ? 'black' : colors.mainBackground,
              marginBottom: 10,
              alignSelf: 'center',
              paddingHorizontal: onTablet ? 0 : 10,
              width: '100%'
            }}
            numColumns={onTablet ? 3 : 1}
            data={items}
            keyboardShouldPersistTaps='handled'
            keyExtractor={content => content.id.toString()}
            removeClippedSubviews={true}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() =>
                  this.goToLesson(isMethod ? item.mobile_app_url : item.id)
                }
                style={[
                  {
                    width: onTablet
                      ? `${isLandscape ? 86 / 3 : 94 / 3}%` // 86 = 100 - 10(=marginRight) - 4(=2*marginleft); 94 = 100 - 2(=marginRight) - 4 (=2*marginLeft)
                      : '100%',
                    paddingVertical: 3.5,
                    flexDirection: onTablet ? 'column' : 'row'
                  },
                  isLandscape && index % 3 === 2
                    ? { marginRight: '10%' }
                    : { marginRight: '2%' }
                ]}
              >
                <ImageBackground
                  imageStyle={{ borderRadius: 5 }}
                  style={{
                    width: onTablet ? '100%' : width * 0.26,
                    aspectRatio: 16 / 9
                  }}
                  source={{
                    uri: item.thumbnail_url?.includes('https')
                      ? `https://cdn.musora.com/image/fetch/w_${Math.round(
                          width
                        )},ar_16:9,fl_lossy,q_auto:eco,c_fill,g_face/${
                          item.thumbnail_url
                        }`
                      : item.thumbnail_url
                  }}
                  resizeMode='cover'
                >
                  {item.completed && (
                    <View
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        aspectRatio: 16 / 9,
                        borderRadius: 5,
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
                        width: '100%',
                        aspectRatio: 16 / 9,
                        zIndex: 2
                      }
                    ]}
                  >
                    {item.started ? (
                      <Progress
                        height={onTablet ? 60 : 35}
                        width={onTablet ? 60 : 35}
                        fill={'white'}
                      />
                    ) : item.completed ? (
                      <ApprovedTeacher
                        height={onTablet ? 70 : 45}
                        width={onTablet ? 70 : 45}
                        fill={'white'}
                      />
                    ) : null}
                  </View>
                </ImageBackground>
                <View
                  style={[
                    {
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    },
                    onTablet ? { width: '100%' } : { flex: 1 }
                  ]}
                >
                  <View style={{ width: '80%' }}>
                    <View style={{ flex: 1 }} />
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: onTablet ? 16 : 14,
                        textAlign: 'left',
                        fontFamily: 'OpenSans-Bold',
                        color: 'white',
                        paddingHorizontal: onTablet ? 0 : 5,
                        marginTop: onTablet ? 10 : 2.5
                      }}
                    >
                      {item.title}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: sizing.descriptionText,
                        color: this.props.isMethod
                          ? colors.pianoteGrey
                          : colors.secondBackground,
                        textAlign: 'left',
                        fontFamily: 'OpenSans-Regular',
                        paddingHorizontal: onTablet ? 0 : 5
                      }}
                    >
                      {item.length_in_seconds
                        ? Math.floor(item.length_in_seconds / 60)
                        : 0}{' '}
                      {Math.floor(item.length_in_seconds / 60) == 1
                        ? 'min'
                        : 'mins'}
                    </Text>
                    <View style={{ flex: 1 }} />
                  </View>

                  <TouchableOpacity onPress={() => this.toggleMyList(item.id)}>
                    <AntIcon
                      name={
                        item.is_added_to_primary_playlist ? 'close' : 'plus'
                      }
                      size={sizing.myListButtonSize}
                      color={colors.pianoteRed}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            )}
          />
        </ScrollView>
        {nextLesson && (
          <NextVideo
            item={nextLesson}
            progress={this.state.progress}
            type={
              this.state.isFoundations
                ? 'Lesson'
                : isMethod
                ? 'COURSE'
                : this.state.type.toUpperCase()
            }
            onNextLesson={() =>
              this.goToLesson(
                this.state.isMethod ? nextLesson.mobile_app_url : nextLesson.id
              )
            }
            isMethod={isMethod}
          />
        )}
        <Modal
          key={'restartCourse'}
          isVisible={this.state.showRestartCourse}
          style={{
            margin: 0,
            flex: 1
          }}
          animation={'slideInUp'}
          animationInTiming={250}
          animationOutTiming={250}
          coverScreen={true}
          hasBackdrop={true}
          onBackButtonPress={() => this.setState({ showRestartCourse: false })}
        >
          <RestartCourse
            hideRestartCourse={() => {
              this.setState({
                showRestartCourse: false
              });
            }}
            type={this.state.type}
            onRestart={this.onRestartCourse}
          />
        </Modal>
        <NavigationBar
          currentPage={'LessonsPathOverview'}
          isMethod={isMethod}
        />
      </SafeAreaView>
    );
  }
}
