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
import EntypoIcon from 'react-native-vector-icons/Entypo';
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

let greaterWDim;

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
      isMethod: true, ///// TO DO : connect to previous page
      showInfo: false,
      totalLength: 0,
      isLiked: false,
      likeCount: 0,
      started: false,
      completed: false,
      showRestartCourse: false,
      nextLessonId: 0,
      isLoadingAll: this.props.navigation.state.params.items?.length
        ? false
        : true,
      difficulty: 0,
      refreshing: false,
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
    // let response = await contentService.getContent(this.state.data.id);
    contentService.getContent(this.state.data.id).then(r => {
      this.setState({
        likeCount: r.like_count,
        isLiked: r.is_liked_by_current_user,
        isAddedToList: r.is_added_to_primary_playlist,
        totalLength: r.length_in_seconds,
        started: r.started,
        completed: r.completed,
        nextLessonId: r.next_lesson.id,
        difficulty: r.fields.find(f => f.key === 'difficulty')?.value,
        thumbnail: r.data.find(f => f.key === 'thumbnail_url')?.value,
        artist:
          r.type === 'song'
            ? r.fields.find(f => f.key === 'artist')?.value
            : new ContentModel(
                r.fields.find(f => f.key === 'instructor')?.value
              )?.getField('name'),
        isLoadingAll: false,
        refreshing: false,
        items:
          r?.lessons?.map(l => {
            l = new ContentModel(l);
            let duration = new ContentModel(
              l.getFieldMulti('video')[0]
            )?.getField('length_in_seconds');
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
    if (onTablet && this.state.isLandscape) return 2.5;
    if (onTablet && !this.state.isLandscape) return 2;
    return 1.8;
  }

  goToLesson(id) {
    this.props.navigation.navigate('VIDEOPLAYER', { id });
  }

  renderHeader = () => (
    <>
      <ImageBackground
        resizeMode={'cover'}
        style={{
          width: '100%',
          aspectRatio: this.getAspectRatio()
        }}
        source={{
          uri: `https://cdn.musora.com/image/fetch/fl_lossy,q_auto:eco,w_${
            (greaterWDim >> 0) * 2
          },ar_${this.getAspectRatio()},c_fill,g_face/${this.state.thumbnail}`
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
              left: 15,
              top: 10,
              borderRadius: 100,
              height: 35 * factorRatio,
              width: 35 * factorRatio
            }
          ]}
        >
          <EntypoIcon
            name={'chevron-thin-left'}
            size={22.5 * factorRatio}
            color={'white'}
          />
        </TouchableOpacity>
      </ImageBackground>
      <View key={'title'} style={{ paddingHorizontal: 20 * factorRatio }}>
        <View style={{ height: 20 * factorVertical }} />
        <View style={{ flex: 1 }}>
          <Text
            numberOfLines={2}
            style={{
              fontFamily: 'OpenSans-Bold',
              color: 'white',
              textAlign: 'center',
              fontSize: 24 * factorRatio
            }}
          >
            {this.state.data.title}
          </Text>
          <View style={{ height: 10 * factorVertical }} />
          <Text
            numberOfLines={2}
            style={{
              fontFamily: 'OpenSans-Regular',
              color: this.state.isMethod
                ? colors.pianoteGrey
                : colors.secondBackground,
              textAlign: 'center',
              fontSize: 14 * factorRatio
            }}
          >
            {this.state.artist?.toUpperCase()} | {this.formatDifficulty()} |{' '}
            {this.state.data.xp} XP
          </Text>
        </View>
        <View style={{ height: 15 * factorVertical }} />
        <View
          key={'thumb/Start/Info'}
          style={{
            width: '80%',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            alignSelf: 'center',
            flexDirection: 'row'
          }}
        >
          <TouchableOpacity
            onPress={() => this.toggleMyList(this.state.data.id)}
            style={{
              alignItems: 'center',
              flex: 0.5
            }}
          >
            <AntIcon
              name={this.state.isAddedToList ? 'close' : 'plus'}
              size={22 * factorRatio}
              color={colors.pianoteRed}
            />
            <Text
              style={{
                fontFamily: 'OpenSans-Regular',
                color: 'white',
                marginTop: 5,
                fontSize: 12 * factorRatio
              }}
            >
              {!this.state.isAddedToList ? 'My List' : 'Added'}
            </Text>
          </TouchableOpacity>

          {this.state.completed ? (
            <ResetIcon
              pressed={() => this.setState({ showRestartCourse: true })}
            />
          ) : this.state.started ? (
            <ContinueIcon
              pressed={() => this.goToLesson(this.state.nextLessonId)}
            />
          ) : (
            <StartIcon
              pressed={() => this.goToLesson(this.state.nextLessonId)}
            />
          )}

          <TouchableOpacity
            onPress={() => this.setState({ showInfo: !this.state.showInfo })}
            style={{
              alignItems: 'center',
              flex: 0.5
            }}
          >
            <AntIcon
              name={this.state.showInfo ? 'infocirlce' : 'infocirlceo'}
              size={22 * factorRatio}
              color={colors.pianoteRed}
            />
            <Text
              style={{
                fontFamily: 'OpenSans-Regular',
                color: 'white',
                marginTop: 5,
                fontSize: 12 * factorRatio
              }}
            >
              Info
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {this.state.showInfo && (
        <View
          key={'info'}
          style={{
            width: '100%',
            paddingHorizontal: 20 * factorRatio
          }}
        >
          <View style={{ height: 20 * factorVertical }} />
          <Text
            style={{
              fontFamily: 'OpenSans-Regular',
              marginTop: 5 * factorVertical,
              fontSize: 15 * factorRatio,
              color: 'white',
              textAlign: 'center'
            }}
          >
            {this.state.data.description}
          </Text>
          <View key={'containStats'}>
            <View style={{ height: 10 * factorVertical }} />
            <View
              key={'stats'}
              style={[styles.centerContent, { flexDirection: 'row' }]}
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
                    fontSize: 17 * factorRatio,
                    textAlign: 'center',
                    color: 'white',
                    fontFamily: 'OpenSans-Bold',
                    marginTop: 10 * factorVertical
                  }}
                >
                  {this.state.items.length}
                  {`\n`}
                  <Text
                    style={{
                      fontSize: 13 * factorRatio,
                      textAlign: 'center',
                      color: 'white',
                      fontFamily: 'OpenSans-Regular',
                      marginTop: 10 * factorVertical
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
                    fontSize: 17 * factorRatio,
                    textAlign: 'center',
                    color: 'white',
                    fontFamily: 'OpenSans-Bold',
                    marginTop: 10 * factorVertical
                  }}
                >
                  {Math.floor(this.state.totalLength / 60)}
                  {`\n`}
                  <Text
                    style={{
                      fontSize: 13 * factorRatio,
                      textAlign: 'center',
                      color: 'white',
                      fontFamily: 'OpenSans-Regular',
                      marginTop: 10 * factorVertical
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
                    fontSize: 17 * factorRatio,
                    textAlign: 'center',
                    color: 'white',
                    fontFamily: 'OpenSans-Bold',
                    marginTop: 10 * factorVertical
                  }}
                >
                  {this.state.data.xp}
                  {`\n`}
                  <Text
                    style={{
                      fontSize: 13 * factorRatio,
                      textAlign: 'center',
                      color: 'white',
                      fontFamily: 'OpenSans-Regular',
                      marginTop: 10 * factorVertical
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
                  marginTop: 15 * factorVertical
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
                    fontSize: 13 * factorRatio,
                    textAlign: 'center',
                    color: 'white',
                    fontFamily: 'OpenSans-Regular',
                    marginTop: 5
                  }}
                >
                  <AntIcon
                    name={this.state.isLiked ? 'like1' : 'like2'}
                    size={27.5 * factorRatio}
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
                    width: 27.5 * factorRatio,
                    height: 27.5 * factorRatio
                  },
                  iconDownloadColor: colors.pianoteRed,
                  activityIndicatorColor: colors.pianoteRed,
                  animatedProgressBackground: colors.pianoteRed,
                  textStatus: {
                    color: '#ffffff',
                    fontSize: 13 * factorRatio,
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
                    fontSize: 13 * factorRatio,
                    textAlign: 'center',
                    color: 'white',
                    fontFamily: 'OpenSans-Regular',
                    marginTop: 5
                  }}
                >
                  <MaterialIcon
                    name={'replay'}
                    size={27.5 * factorRatio}
                    color={colors.pianoteRed}
                  />
                  {`\n`}
                  Restart
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ height: 30 * factorVertical }} />
          </View>
        </View>
      )}
      <View style={{ height: 30 * factorRatio }} />
    </>
  );

  render() {
    return (
      <SafeAreaView
        forceInset={{
          bottom: 'never'
        }}
        style={[
          {
            flex: 1,
            width: '100%',
            backgroundColor: this.state.isMethod
              ? 'black'
              : colors.mainBackground
          }
        ]}
      >
        <StatusBar
          backgroundColor={
            this.state.isMethod ? 'black' : colors.mainBackground
          }
          barStyle={'light-content'}
        />
        <FlatList
          style={{
            flex: 1,
            backgroundColor: this.state.isMethod
              ? 'black'
              : colors.mainBackground
          }}
          numColumns={onTablet ? 3 : 1}
          data={this.state.items}
          keyboardShouldPersistTaps='handled'
          keyExtractor={content => content.id.toString()}
          removeClippedSubviews={true}
          refreshControl={
            <RefreshControl
              colors={[colors.pianoteRed]}
              refreshing={this.state.refreshing}
              onRefresh={() => this.refresh()}
            />
          }
          ListHeaderComponent={this.renderHeader}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => this.goToLesson(item.id)}
              style={{
                width: onTablet ? `${100 / 3}%` : '100%',
                paddingHorizontal: 15,
                paddingVertical: onTablet ? 0 : 10,
                flexDirection: onTablet ? 'column' : 'row'
              }}
            >
              <ImageBackground
                imageStyle={{ borderRadius: 5 * factorRatio }}
                style={{
                  width: onTablet ? '100%' : fullWidth * 0.26,
                  aspectRatio: 16 / 9
                }}
                source={{
                  uri: `https://cdn.musora.com/image/fetch/w_${Math.round(
                    fullWidth
                  )},ar_16:9,fl_lossy,q_auto:eco,c_fill,g_face/${
                    item.thumbnail
                  }`
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
                      borderRadius: 5 * factorRatio,
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
                      height={40 * factorRatio}
                      width={40 * factorRatio}
                      fill={'white'}
                    />
                  ) : item.isCompleted ? (
                    <ApprovedTeacher
                      height={50 * factorRatio}
                      width={50 * factorRatio}
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
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 15 * factorRatio,
                      textAlign: 'left',
                      fontFamily: 'OpenSans-Bold',
                      color: 'white',
                      paddingVertical: 5,
                      paddingHorizontal: onTablet ? 0 : 15
                    }}
                  >
                    {item.title}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 12 * factorRatio,
                      color:
                        this.props.isMethod || this.props.foundationsLevel
                          ? colors.pianoteGrey
                          : colors.secondBackground,
                      textAlign: 'left',
                      fontFamily: 'OpenSans-Regular',
                      paddingBottom: 10,
                      paddingHorizontal: onTablet ? 0 : 15
                    }}
                  >
                    {Math.floor(item.duration / 60)}{' '}
                    {Math.floor(item.duration / 60) == 1 ? 'min' : 'mins'}
                  </Text>
                </View>

                <TouchableOpacity onPress={() => this.toggleMyList(item.id)}>
                  <AntIcon
                    name={item.isAddedToList ? 'close' : 'plus'}
                    size={onTablet ? 20 * factorRatio : 30 * factorRatio}
                    color={colors.pianoteRed}
                  />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />

        <Modal
          key={'restartCourse'}
          isVisible={this.state.showRestartCourse}
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
          <RestartCourse
            hideRestartCourse={() => {
              this.setState({
                showRestartCourse: false
              });
            }}
            type='course'
            onRestart={this.onRestartCourse}
          />
        </Modal>
        <NavigationBar
          currentPage={'LessonsPathOverview'}
          isMethod={this.state.isMethod ? 'black' : colors.mainBackground}
        />
      </SafeAreaView>
    );
  }
}
