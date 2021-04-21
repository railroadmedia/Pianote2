/**
 * Lessons
 */
import React from 'react';
import {
  View,
  Platform,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  Text,
} from 'react-native';
import {connect} from 'react-redux';
import Modal from 'react-native-modal';
import {bindActionCreators} from 'redux';
import {ContentModel} from '@musora/models';
import FastImage from 'react-native-fast-image';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-community/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import PasswordVisible from 'Pianote2/src/assets/img/svgs/passwordVisible.svg';
import Orientation from 'react-native-orientation-locker';
import AntIcon from 'react-native-vector-icons/AntDesign';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import {watchersListener} from 'MusoraChat';
import DeviceInfo from 'react-native-device-info';
import StartIcon from '../../components/StartIcon';
import ResetIcon from '../../components/ResetIcon';
import MoreInfoIcon from '../../components/MoreInfoIcon';
import ContinueIcon from '../../components/ContinueIcon';
import NavigationBar from '../../components/NavigationBar';
import NavMenuHeaders from '../../components/NavMenuHeaders';
import GradientFeature from '../../components/GradientFeature';
import VerticalVideoList from '../../components/VerticalVideoList';
import HorizontalVideoList from '../../components/HorizontalVideoList';
import methodService from '../../services/method.service.js';
import {getStartedContent, getAllContent} from '../../services/GetContent';
import {addToMyList, removeFromMyList} from '../../services/UserActions';
import RestartCourse from '../../modals/RestartCourse';
import AddToCalendar from '../../modals/AddToCalendar';
import {cacheAndWriteLessons} from '../../redux/LessonsCacheActions';
import {NetworkContext} from '../../context/NetworkProvider';
import {navigate, refreshOnFocusListener} from '../../../AppNavigator';

const windowDim = Dimensions.get('window');
const width =
  windowDim.width < windowDim.height ? windowDim.width : windowDim.height;

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
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
    let {lessonsCache} = props;
    this.state = {
      progressLessons: [],
      allLessons: [],
      currentSort: 'newest',
      page: 1,
      outVideos: false,
      isPaging: false, // scrolling more
      filtering: false, // filtering
      profileImage: '',
      xp: '',
      rank: '',
      currentLesson: [],
      addToCalendarModal: false,
      methodId: 0,
      methodIsStarted: false,
      methodIsCompleted: false,
      methodNextLessonUrl: null,
      showRestartCourse: false,
      lessonsStarted: true,
      refreshing: !lessonsCache,
      refreshControl: true,
      isLandscape:
        Dimensions.get('window').height < Dimensions.get('window').width,
      ...this.initialValidData(lessonsCache, true),
    };
  }

  componentDidMount = () => {
    let deepFilters = decodeURIComponent(this.props.route?.params?.url).split(
      '?',
    )[1];
    this.filterQuery = deepFilters && `&${deepFilters}`;
    Orientation.addDeviceOrientationListener(this.orientationListener);
    AsyncStorage.multiGet([
      'totalXP',
      'rank',
      'profileURI',
      'methodIsStarted',
      'methodIsCompleted',
    ]).then(data => {
      this.setState({
        xp: data[0][1],
        rank: data[1][1],
        profileImage: data[2][1],
        methodIsStarted:
          typeof data[3][1] !== null ? JSON.parse(data[3][1]) : false,
        methodIsCompleted:
          typeof data[4][1] !== null ? JSON.parse(data[4][1]) : false,
      });
    });

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
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }

    let content = await Promise.all([
      methodService.getMethod(),
      getAllContent(
        '',
        this.state.currentSort,
        this.state.page,
        this.filterQuery,
      ),
      getStartedContent(''),
    ]);

    this.metaFilters = content?.[1]?.meta?.filterOptions;
    this.props.cacheAndWriteLessons({
      all: content[1],
      method: content[0],
      inProgress: content[2],
    });

    this.setState(
      this.initialValidData({
        all: content[1],
        method: content[0],
        inProgress: content[2],
      }),
    );
  }

  changeType = word => {
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
  };

  initialValidData = (content, fromCache) => {
    try {
      if (!content) return {};
      let {method} = content;
      let allVideos = this.setData(
        content.all.data.map(data => {
          return new ContentModel(data);
        }),
      );

      let inprogressVideos = this.setData(
        content.inProgress.data.map(data => {
          return new ContentModel(data);
        }),
      );
      AsyncStorage.multiSet([
        ['methodIsStarted', method.started.toString()],
        ['methodIsCompleted', method.completed.toString()],
      ]);
      return {
        methodId: method.id,
        methodIsStarted: method.started,
        methodIsCompleted: method.completed,
        methodNextLessonUrl: method.banner_button_url,
        allLessons: allVideos,
        progressLessons: inprogressVideos,
        outVideos:
          allVideos.length == 0 || content.all.data.length < 20 ? true : false,
        filtering: false,
        isPaging: false,
        lessonsStarted: inprogressVideos.length !== 0,
        refreshing: false,
        refreshControl: fromCache,
      };
    } catch (e) {
      return {};
    }
  };

  getMethod = async () => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    const response = await methodService.getMethod();

    await AsyncStorage.multiSet([
      ['methodIsStarted', response.started.toString()],
      ['methodIsCompleted', response.completed.toString()],
    ]);
    this.setState({
      methodId: response.id,
      methodIsStarted: response.started,
      methodIsCompleted: response.completed,
      methodNextLessonUrl: response.banner_button_url,
    });
  };

  getAllLessons = async () => {
    this.setState({filtering: true});
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }

    try {
      let response = await getAllContent(
        '',
        this.state.currentSort,
        this.state.page,
        this.filterQuery,
      );
      this.metaFilters = response?.meta?.filterOptions;
      const newContent = await response.data.map(data => {
        return new ContentModel(data);
      });
      let items = this.setData(newContent);

      this.setState({
        allLessons: [...this.state.allLessons, ...items],
        outVideos:
          items.length == 0 || response.data.length < 20 ? true : false,
        filtering: false,
        isPaging: false,
      });
    } catch (error) {}
  };

  setData(newContent) {
    let items = [];
    for (let i in newContent) {
      items.push({
        title: newContent[i].getField('title'),
        artist: this.getArtist(newContent[i]),
        thumbnail: newContent[i].getData('thumbnail_url'),
        type: newContent[i].post.type,
        publishedOn:
          newContent[i].publishedOn.slice(0, 10) +
          'T' +
          newContent[i].publishedOn.slice(11, 16),
        description: newContent[i]
          .getData('description')
          .replace(/(<([^>]+)>)/g, '')
          .replace(/&nbsp;/g, '')
          .replace(/&amp;/g, '&')
          .replace(/&#039;/g, "'")
          .replace(/&quot;/g, '"')
          .replace(/&gt;/g, '>')
          .replace(/&lt;/g, '<'),
        xp: newContent[i].post.xp,
        id: newContent[i].id,
        mobile_app_url: newContent[i].post.mobile_app_url,
        lesson_count: newContent[i].post.lesson_count,
        currentLessonId: newContent[i].post?.song_part_id,
        like_count: newContent[i].post.like_count,
        duration: this.getDuration(newContent[i]),
        isLiked: newContent[i].post.is_liked_by_current_user,
        isAddedToList: newContent[i].isAddedToList,
        isStarted: newContent[i].isStarted,
        isCompleted: newContent[i].isCompleted,
        progress_percent: newContent[i].post.progress_percent,
      });
    }
    return items;
  }

  onRestartMethod = async () => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    resetProgress(this.state.methodId);
    this.setState(
      {
        methodIsStarted: false,
        methodIsCompleted: false,
        showRestartCourse: false,
      },
      () => this.getMethod(),
    );
  };

  getArtist = newContent => {
    if (newContent.post.type == 'song') {
      if (typeof newContent.post.artist !== 'undefined') {
        return newContent.post.artist;
      } else {
        for (i in newContent.post.fields) {
          if (newContent.post.fields[i].key == 'artist') {
            return newContent.post.fields[i].value;
          }
        }
      }
    } else {
      try {
        if (newContent.getField('instructor') !== 'TBD') {
          return newContent.getField('instructor').fields[0].value;
        } else {
          return newContent.getField('instructor').name;
        }
      } catch (error) {
        return '';
      }
    }
  };

  getDuration = newContent => {
    newContent.post.fields.find(f => f.key === 'video')?.length_in_seconds;
  };

  changeSort = async currentSort => {
    // change sort
    await this.setState(
      {
        currentSort,
        outVideos: false,
        isPaging: true,
        allLessons: [],
        page: 0,
      },
      () => this.getAllLessons(),
    );
  };

  getVideos = () => {
    // change page before getting more lessons if paging
    if (!this.state.outVideos) {
      this.setState({page: this.state.page + 1}, () => this.getAllLessons());
    }
  };

  addEventToCalendar = () => {
    const eventConfig = {
      title: this.addToCalendarLessonTitle,
      startDate: new Date(this.addToCalendatLessonPublishDate),
      endDate: new Date(this.addToCalendatLessonPublishDate),
    };
    AddCalendarEvent.presentEventCreatingDialog(eventConfig)
      .then(eventInfo => {
        this.addToCalendarLessonTitle = '';
        this.addToCalendatLessonPublishDate = '';
        this.setState({addToCalendarModal: false});
      })
      .catch(e => {});
  };

  handleScroll = event => {
    if (
      isCloseToBottom(event) &&
      !this.state.isPaging &&
      !this.state.outVideos
    ) {
      this.setState(
        {
          page: this.state.page + 1,
          isPaging: true,
        },
        () => this.getAllLessons(),
      );
    }
  };

  refresh() {
    this.setState(
      {
        refreshControl: true,
        inprogressVideos: [],
        allLessons: [],
        page: 1,
      },
      this.getContent,
    );
  }

  orientationListener = o => {
    if (o === 'UNKNOWN') return;
    let isLandscape = o.indexOf('LAND') >= 0;

    if (Platform.OS === 'ios') {
      if (onTablet) this.setState({isLandscape});
    } else {
      Orientation.getAutoRotateState(isAutoRotateOn => {
        if (isAutoRotateOn && onTablet) this.setState({isLandscape});
      });
    }
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
                onRefresh={() => this.refresh()}
                colors={[colors.secondBackground]}
                refreshing={isiOS ? false : this.state.refreshControl}
              />
            }
            onScroll={({nativeEvent}) => {
              onTablet ? '' : this.handleScroll(nativeEvent);
            }}
            scrollEventThrottle={400}
          >
            {isiOS && this.state.refreshControl && (
              <ActivityIndicator
                size="small"
                style={styles.activityIndicator}
                color={colors.pianoteGrey}
              />
            )}
            <ImageBackground
              resizeMode={'cover'}
              style={{
                width: '100%',
                aspectRatio: this.getAspectRatio(),
                justifyContent: 'flex-end',
              }}
              source={require('Pianote2/src/assets/img/imgs/lisamethod.png')}
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
                }}
              >
                <View style={{flex: 0.9}} />
                <View
                  style={{
                    flexDirection: 'row',
                    alignSelf: 'center',
                  }}
                >
                  <FastImage
                    style={{
                      width: '85%',
                      height: onTablet ? 100 : 60,
                      alignSelf: 'center',
                      marginBottom: onTablet ? '2%' : '4%',
                    }}
                    source={require('Pianote2/src/assets/img/imgs/pianote-method.png')}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                </View>
                <View
                  style={[
                    styles.heightButtons,
                    {
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: '1%',
                    },
                  ]}
                >
                  <View style={{flex: 1}} />
                  <View
                    style={{
                      width: onTablet ? 200 : '45%',
                    }}
                  >
                    {this.state.methodIsCompleted ? (
                      <ResetIcon
                        pressed={() =>
                          this.setState({
                            showRestartCourse: true,
                          })
                        }
                      />
                    ) : !this.state.methodIsStarted ? (
                      <StartIcon
                        pressed={() => {
                          if (!this.context.isConnected) {
                            return this.context.showNoConnectionAlert();
                          }
                          if (this.state.methodNextLessonUrl)
                            navigate('VIDEOPLAYER', {
                              url: this.state.methodNextLessonUrl,
                            });
                        }}
                      />
                    ) : (
                      <ContinueIcon
                        pressed={() => {
                          if (!this.context.isConnected) {
                            return this.context.showNoConnectionAlert();
                          }
                          if (this.state.methodNextLessonUrl)
                            navigate('VIDEOPLAYER', {
                              url: this.state.methodNextLessonUrl,
                            });
                        }}
                      />
                    )}
                  </View>
                  <View style={onTablet ? {width: 10} : {flex: 0.5}} />
                  <View
                    style={{
                      width: onTablet ? 200 : '45%',
                    }}
                  >
                    <MoreInfoIcon
                      pressed={() => {
                        navigate('METHOD', {
                          methodIsStarted: this.state.methodIsStarted,
                          methodIsCompleted: this.state.methodIsCompleted,
                        });
                      }}
                    />
                  </View>
                  <View style={{flex: 1}} />
                </View>
              </View>
            </ImageBackground>
            {this.state.progressLessons.length > 0 && (
              <View style={{marginTop: 5}}>
                <HorizontalVideoList
                  hideFilterButton={true}
                  isMethod={true}
                  Title={'IN PROGRESS'}
                  seeAll={() =>
                    navigate('SEEALL', {
                      title: 'Continue',
                      parent: 'Lessons',
                    })
                  }
                  showType={true}
                  items={this.state.progressLessons}
                />
              </View>
            )}
            {onTablet ? (
              <View style={{marginTop: 5}}>
                <HorizontalVideoList
                  isMethod={true}
                  items={this.state.allLessons}
                  Title={'ALL LESSONS'}
                  showType={true}
                  seeAll={() =>
                    navigate('SEEALL', {
                      title: 'All Lessons',
                      parent: 'Lessons',
                    })
                  }
                  hideFilterButton={false}
                  isPaging={this.state.isPaging}
                  filters={this.metaFilters}
                  currentSort={this.state.currentSort}
                  changeSort={sort => this.changeSort(sort)}
                  applyFilters={filters =>
                    new Promise(res =>
                      this.setState(
                        {
                          allLessons: [],
                          outVideos: false,
                          page: 1,
                        },
                        () => {
                          this.filterQuery = filters;
                          this.getAllLessons().then(res);
                        },
                      ),
                    )
                  }
                  outVideos={this.state.outVideos} // if paging and out of videos
                  getVideos={() => this.getVideos()}
                  callEndReached={true}
                  reachedEnd={() => {
                    if (!this.state.isPaging && !this.state.outVideos) {
                      this.setState(
                        {
                          page: this.state.page + 1,
                          isPaging: true,
                        },
                        () => this.getAllLessons(),
                      );
                    }
                  }}
                />
              </View>
            ) : (
              <View style={{marginTop: 5}}>
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
                  changeSort={sort => this.changeSort(sort)} // change sort and reload videos
                  applyFilters={filters =>
                    new Promise(res =>
                      this.setState(
                        {
                          allLessons: [],
                          outVideos: false,
                          page: 1,
                        },
                        () => {
                          this.filterQuery = filters;
                          this.getAllLessons().then(res);
                        },
                      ),
                    )
                  }
                  imageWidth={width * 0.26} // image width
                  outVideos={this.state.outVideos} // if paging and out of videos
                  getVideos={() => this.getVideos()}
                />
              </View>
            )}
          </ScrollView>
        ) : (
          <ActivityIndicator size="small" style={{flex: 1}} color={'white'} />
        )}
        <Modal
          isVisible={this.state.showRestartCourse}
          style={styles.modalContainer}
          animation={'slideInUp'}
          animationInTiming={250}
          animationOutTiming={250}
          coverScreen={true}
          hasBackdrop={true}
          onBackButtonPress={() => this.setState({showRestartCourse: false})}
        >
          <RestartCourse
            hideRestartCourse={() =>
              this.setState({
                showRestartCourse: false,
              })
            }
            type="method"
            onRestart={() => this.onRestartMethod()}
          />
        </Modal>
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
            hideAddToCalendar={() => this.setState({addToCalendarModal: false})}
            addEventToCalendar={() => {
              this.addEventToCalendar();
            }}
          />
        </Modal>
        <NavigationBar currentPage={'LESSONS'} isMethod={true} />
      </View>
    );
  }
}
const mapStateToProps = state => ({lessonsCache: state.lessonsCache});
const mapDispatchToProps = dispatch =>
  bindActionCreators({cacheAndWriteLessons}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Lessons);
