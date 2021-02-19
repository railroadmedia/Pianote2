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
import { ContentModel } from '@musora/models';
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
import NextVideo from '../../components/NextVideo';
import { ScrollView } from 'react-native-gesture-handler';

let greaterWDim;
const windowDim = Dimensions.get('window');
const width =
  windowDim.width < windowDim.height ? windowDim.width : windowDim.height;
const height =
  windowDim.width > windowDim.height ? windowDim.width : windowDim.height;
const factor = (height / 812 + width / 375) / 2;

export default class PathOverview extends React.Component {
  static contextType = NetworkContext;
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.navigation.state.params.data,
      items: this.props.navigation.state.params.items || [],
      isAddedToList: this.props.navigation.state.params.data?.isAddedToList,
      thumbnail: this.props.navigation.state.params.data?.thumbnail,
      artist: this.props.navigation.state.params.data?.artist,
      isMethod: this.props.navigation.state.params.isMethod,
      xp: this.props.navigation.state.params.data.total_xp,
      type: '',
      showInfo: false,
      totalLength: 0,
      isLiked: false,
      likeCount: 0,
      started: this.props.navigation.state.params.data.started,
      completed: this.props.navigation.state.params.data.completed,
      showRestartCourse: false,
      nextLesson: this.props.navigation.state.params.data.next_lesson,
      progress: 0,
      isLoadingAll: this.props.navigation.state.params.items?.length
        ? false
        : true,
      difficulty: 0,
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
    if (!this.state.items.length && this.context.isConnected) this.getItems();
  }

  componentWillUnmount() {
    Orientation.removeDeviceOrientationListener(this.orientationListener);
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
    if (this.state.isMethod) {
      res = await methodService.getMethodContent(
        this.state.data.mobile_app_url
      );
    } else {
      res = await contentService.getContent(this.state.data.id);
    }
    this.setState({
      likeCount: res.like_count,
      isLiked: res.is_liked_by_current_user,
      isAddedToList: res.is_added_to_primary_playlist,
      totalLength: res.length_in_seconds,
      started: res.started,
      completed: res.completed,
      nextLesson: res.next_lesson ? new ContentModel(res.next_lesson) : null,
      levelNum: res.level_position + '.' + res.course_position,
      progress: res.progress_percent,
      difficulty: res.fields.find(f => f.key === 'difficulty')?.value,
      thumbnail: res.data.find(f => f.key === 'thumbnail_url')?.value,
      xp: res.total_xp,
      type: res.type,
      bannerNextLessonUrl: res.banner_button_url,
      artist:
        res.type === 'song'
          ? res.fields.find(f => f.key === 'artist')?.value
          : new ContentModel(
              res.fields.find(f => f.key === 'instructor')?.value
            )?.getField('name'),
      isLoadingAll: false,
      refreshing: false,
      items:
        res?.lessons?.map(l => {
          l = new ContentModel(l);
          let duration = l.post.fields.find(f => f.key === 'video')
            ? new ContentModel(l.getFieldMulti('video')[0])?.getField(
                'length_in_seconds'
              )
            : 0;
          return {
            title: l.getField('title'),
            thumbnail: l.getData('thumbnail_url'),
            type: l.type,
            id: l.id,
            mobile_app_url: l.post.mobile_app_url,
            duration: duration < 60 ? 60 : duration,
            isAddedToList: l.isAddedToList,
            isStarted: l.isStarted,
            isCompleted: l.isCompleted,
            progress_percent: l.post.progress_percent
          };
        }) || []
    });
  };

  toggleMyList = id => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    if (id === this.state.data.id) {
      if (this.state.isAddedToList) {
        removeFromMyList(id);
      } else {
        addToMyList(id);
      }
    } else {
      const lesson = this.state.items.find(f => f.id === id);
      if (lesson.isAddedToList) {
        removeFromMyList(id);
      } else {
        addToMyList(id);
      }
    }

    this.setState(state => ({
      isAddedToList:
        id === state.data.id ? !state.isAddedToList : state.isAddedToList,
      items: state.items.map(c =>
        c.id === id
          ? {
              ...c,
              isAddedToList: !c.isAddedToList
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
      unlikeContent(this.state.data.id);
    } else {
      likeContent(this.state.data.id);
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
    resetProgress(this.state.data.id);
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
    if (this.state.isMethod) {
      return this.props.navigation.navigate('VIDEOPLAYER', {
        url: lesson,
        parentId: this.state.data?.id
      });
    }
    return this.props.navigation.navigate('VIDEOPLAYER', {
      id: lesson,
      parentId: this.state.data?.id
    });
  }

  renderHeader = () => {
    let { thumbnail } = this.state;
    return (
      <View>
        <ImageBackground
          resizeMethod='resize'
          style={{
            width: '100%',
            aspectRatio: this.getAspectRatio(),
            resizeMode: 'cover'
          }}
          source={{
            uri: thumbnail.includes('https')
              ? `https://cdn.musora.com/image/fetch/fl_lossy,q_auto:eco,w_${Math.round(
                  width
                )},ar_${this.getAspectRatio()},${
                  this.state.isMethod ? 'c_pad,g_south' : 'c_fill,g_face'
                }/${this.state.thumbnail}`
              : thumbnail
          }}
        >
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.goBack();
            }}
            style={[
              styles.centerContent,
              {
                position: 'absolute',
                left: 10 * factor,
                top: 10 * factor,
                borderRadius: 100,
                height: 35 * factor,
                width: 35 * factor
              }
            ]}
          >
            <Back
              width={(onTablet ? 17.5 : 25) * factor}
              height={(onTablet ? 17.5 : 25) * factor}
              fill={'white'}
            />
          </TouchableOpacity>
        </ImageBackground>
        <View
          key={'title'}
          style={[
            this.state.isLandscape ? { marginHorizontal: '10%' } : {}
          ]}
        >
          {!this.state.isMethod && (
            <Text
              numberOfLines={2}
              style={{
                fontFamily: 'OpenSans-Bold',
                color: 'white',
                textAlign: 'center',
                fontSize: (onTablet ? 12.5 : 20) * factor,
                marginTop: 10 * factor,
              }}
            >
              {this.state.data.title}
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
                fontSize: (onTablet ? 8 : 14) * factor,
                paddingVertical: (onTablet ? 10 : 20) * factor,
              },
            ]}
          >
            {this.state.artist?.toUpperCase()} |{' '}
            {this.state.isMethod
              ? 'LEVEL ' + this.state.levelNum
              : this.formatDifficulty()}{' '}
            | {this.state.xp} XP
          </Text>
          <View
            style={{
              height: (onTablet ? 30 : 40) * factor,
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center'
            }}
          >
            <View style={{ flex: 1 }} />
            <View style={{width: '45%',}}>
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: -50 * factor,
                  zIndex: 5,
                  elevation: 5
                }}
                onPress={() => this.toggleMyList(this.state.data.id)}
              >
                <View style={[styles.centerContent,{flexDirection: 'row'}]}>
                {!this.state.isAddedToList ? (
                  <AntIcon
                    name={'plus'}
                    size={(onTablet ? 20 : 27.5) * factor}
                    color={colors.pianoteRed}
                  />
                ) : (
                  <AntIcon
                    name={'close'}
                    size={(onTablet ? 20 : 27.5) * factor}
                    color={colors.pianoteRed}
                  />
                )}
                </View>
                <Text
                  style={{
                    fontFamily: 'OpenSans-Regular',
                    color: 'white',
                    fontSize: (onTablet ? 8 : 12 ) * factor,
                  }}
                >
                  {this.state.isAddedToList ? 'Added' : 'My List'}
                </Text>
              </TouchableOpacity>
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
                        : this.state.nextLesson.id
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
                        : this.state.nextLesson.id
                    )
                  }
                />
              )}
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: -50 * factor,
                  zIndex: 5,
                  elevation: 5
                }}
                onPress={() => {
                  this.setState({
                    showInfo: !this.state.showInfo
                  });
                }}
              >
                <View style={[styles.centerContent,{flexDirection: 'row'}]}>
                  <AntIcon
                    name={this.state.showInfo ? 'infocirlce' : 'infocirlceo'}
                    size={(onTablet ? 15 : 22.5) * factor}
                    color={colors.pianoteRed}
                  />
                </View>
                <Text
                  style={{
                    fontFamily: 'OpenSans-Regular',
                    color: 'white',
                    marginTop: 2,
                    fontSize: (onTablet ? 8 : 12 ) * factor,
                  }}
                >
                  Info
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{flex: 1}}/>
          </View>              
        </View>

        {this.state.showInfo && (
          <View
            key={'info'}
            style={[
              {
                paddingHorizontal: 20 * factor,
              },
              this.state.isLandscape
                ? { marginHorizontal: '10%' }
                : { width: '100%' }
            ]}
          >
            {this.state.data.description !== 'TBD' && (
              <Text
                style={{
                  fontFamily: 'OpenSans-Regular',
                  marginTop: 10 * factor,
                  paddingHorizontal: 10 * factor,
                  fontSize: (onTablet ? 9 : 15) * factor,
                  color: 'white',
                  textAlign: 'center'
                }}
              >
                {this.state.data.description}
              </Text>
            )}
            <View key={'containStats'}>
              <View
                key={'stats'}
                style={[
                  styles.centerContent,
                  {  flexDirection: 'row' }
                ]}
              >
                <View
                  style={[
                    styles.centerContent,
                    {
                      flex: 1,
                      alignItems: 'flex-end'
                    }
                  ]}
                >
                  <Text
                    style={{
                      fontSize: (onTablet ? 15 : 17) * factor,
                      textAlign: 'center',
                      color: 'white',
                      fontFamily: 'OpenSans-Bold',
                      marginTop: 10 * factor
                    }}
                  >
                    {this.state.items.length}
                    {`\n`}
                    <Text
                      style={{
                        fontSize: (onTablet ? 10 : 13) * factor,
                        textAlign: 'center',
                        color: 'white',
                        fontFamily: 'OpenSans-Regular',
                        marginTop: 5 * factor
                      }}
                    >
                      LESSONS
                    </Text>
                  </Text>
                </View>
                <View
                  style={[
                    styles.centerContent,
                    {
                      flex: 1
                    }
                  ]}
                >
                  <Text
                    style={{
                      fontSize: (onTablet ? 15 : 17) * factor,
                      textAlign: 'center',
                      color: 'white',
                      fontFamily: 'OpenSans-Bold',
                      marginTop: 10 * factor
                    }}
                  >
                    {Math.floor(this.state.totalLength / 60)}
                    {`\n`}
                    <Text
                      style={{
                        fontSize: (onTablet ? 10 : 13) * factor,
                        textAlign: 'center',
                        color: 'white',
                        fontFamily: 'OpenSans-Regular',
                        marginTop: 10 * factor
                      }}
                    >
                      MINS
                    </Text>
                  </Text>
                </View>
                <View
                  style={[
                    styles.centerContent,
                    {
                      flex: 1,
                      alignItems: 'flex-start'
                    }
                  ]}
                >
                  <Text
                    style={{
                      fontSize: (onTablet ? 15 : 17) * factor,
                      textAlign: 'center',
                      color: 'white',
                      fontFamily: 'OpenSans-Bold',
                      marginTop: 10 * factor
                    }}
                  >
                    {this.state.xp}
                    {`\n`}
                    <Text
                      style={{
                        fontSize: (onTablet ? 10 : 13) * factor,
                        textAlign: 'center',
                        color: 'white',
                        fontFamily: 'OpenSans-Regular',
                        marginTop: 10 * factor
                      }}
                    >
                      XP
                    </Text>
                  </Text>
                </View>
              </View>
              <View
                key={'buttons'}
                style={[
                  styles.centerContent,
                  {
                    flexDirection: 'row',
                    marginTop: 15 * factor
                  }
                ]}
              >
                <TouchableOpacity
                  onPress={() => this.toggleLike()}
                  style={[
                    styles.centerContent,
                    {
                      flex: 1,
                      alignItems: 'flex-end'
                    }
                  ]}
                >
                  <Text
                    style={{
                      fontSize: (onTablet ? 10 : 13) * factor,
                      textAlign: 'center',
                      color: 'white',
                      fontFamily: 'OpenSans-Regular',
                      marginTop: 5
                    }}
                  >
                    <AntIcon
                      name={this.state.isLiked ? 'like1' : 'like2'}
                      size={(onTablet ? 20 : 27.5) * factor}
                      color={colors.pianoteRed}
                    />
                    {`\n`}
                    {this.state.likeCount}
                  </Text>
                </TouchableOpacity>
                <Download_V2
                  entity={{
                    id: this.state.data.id,
                    content: contentService.getContent(this.state.data.id, true)
                  }}
                  styles={{
                    touchable: { flex: 1 },
                    iconSize: {
                      width: (onTablet ? 20 : 27.5) * factor,
                      height: (onTablet ? 20 : 27.5) * factor
                    },
                    iconDownloadColor: colors.pianoteRed,
                    activityIndicatorColor: colors.pianoteRed,
                    animatedProgressBackground: colors.pianoteRed,
                    textStatus: {
                      color: '#ffffff',
                      fontSize: (onTablet ? 10 : 13) * factor,
                      fontFamily: 'OpenSans-Regular',
                      marginTop: 5
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
                      flex: 1,
                      alignItems: 'flex-start'
                    }
                  ]}
                >
                  <Text
                    style={{
                      fontSize: (onTablet ? 10 : 13) * factor,
                      textAlign: 'center',
                      color: 'white',
                      fontFamily: 'OpenSans-Regular',
                      marginTop: 5
                    }}
                  >
                    <MaterialIcon
                      name={'replay'}
                      size={(onTablet ? 20 : 27.5) * factor}
                      color={colors.pianoteRed}
                    />
                    {`\n`}
                    Restart
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ height: 30 * factor }} />
            </View>
          </View>
        )}
        <View style={{ height: 15 * factor }} />
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
              marginLeft: isLandscape ? '10%' : '2%',
              backgroundColor: isMethod ? 'black' : colors.mainBackground,
              marginBottom: 10,
              alignSelf: 'center',
              paddingHorizontal: onTablet ? 0 : 10 * factor,
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
                    paddingVertical: 3.5 * factor,
                    flexDirection: onTablet ? 'column' : 'row'
                  },
                  isLandscape && index % 3 === 2
                    ? { marginRight: '10%' }
                    : { marginRight: '2%' }
                ]}
              >
                <ImageBackground
                  imageStyle={{ borderRadius: 5 * factor }}
                  style={{
                    width: onTablet ? '100%' : width * 0.26,
                    aspectRatio: 16 / 9
                  }}
                  source={{
                    uri: item.thumbnail.includes('https')
                      ? `https://cdn.musora.com/image/fetch/w_${Math.round(
                          width
                        )},ar_16:9,fl_lossy,q_auto:eco,c_fill,g_face/${
                          item.thumbnail
                        }`
                      : item.thumbnail
                  }}
                  resizeMode='cover'
                >
                  {item.isCompleted && (
                    <View
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        aspectRatio: 16 / 9,
                        borderRadius: 5 * factor,
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
                    {item.isStarted ? (
                      <Progress
                        height={40 * factor}
                        width={40 * factor}
                        fill={'white'}
                      />
                    ) : item.isCompleted ? (
                      <ApprovedTeacher
                        height={50 * factor}
                        width={50 * factor}
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
                        fontSize: onTablet ? 15 : 15 * factor,
                        textAlign: 'left',
                        fontFamily: 'OpenSans-Bold',
                        color: 'white',
                        paddingHorizontal: onTablet ? 0 : 7.5 * factor,
                        marginTop: onTablet ? 10 : 2.5,
                      }}
                    >
                      {item.title}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: onTablet ? 13 : 12 * factor,
                        color: this.props.isMethod
                          ? colors.pianoteGrey
                          : colors.secondBackground,
                        textAlign: 'left',
                        fontFamily: 'OpenSans-Regular',
                        paddingHorizontal: onTablet ? 0 : 7.5 * factor
                      }}
                    >
                      {Math.floor(item.duration / 60)}{' '}
                      {Math.floor(item.duration / 60) == 1 ? 'min' : 'mins'}
                    </Text>
                    <View style={{ flex: 1 }} />
                  </View>

                  <TouchableOpacity onPress={() => this.toggleMyList(item.id)}>
                    <AntIcon
                      name={item.isAddedToList ? 'close' : 'plus'}
                      size={onTablet ? 17.5 * factor : 30 * factor}
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
            type={isMethod ? 'COURSE' : this.state.type.toUpperCase()}
            onNextLesson={() =>
              this.goToLesson(
                this.state.isMethod
                  ? nextLesson.post.mobile_app_url
                  : nextLesson.id
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
