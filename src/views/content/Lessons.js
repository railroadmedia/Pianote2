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
  ImageBackground
} from 'react-native';

import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import { bindActionCreators } from 'redux';
import { ContentModel } from '@musora/models';
import FastImage from 'react-native-fast-image';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-community/async-storage';
import Orientation from 'react-native-orientation-locker';
import Filters from '../../components/FIlters.js';
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
import { getStartedContent, getAllContent } from '../../services/GetContent';
import RestartCourse from '../../modals/RestartCourse';
import { cacheAndWriteLessons } from '../../redux/LessonsCacheActions';
import { NetworkContext } from '../../context/NetworkProvider';

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 20;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

class Lessons extends React.Component {
  static navigationOptions = { header: null };
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    let { lessonsCache } = props;
    this.state = {
      progressLessons: [],
      allLessons: [],
      currentSort: 'newest',
      page: 1,
      outVideos: false,
      isPaging: false, // scrolling more
      filtering: false, // filtering
      filtersAvailable: null,
      showFilters: false,
      filters: {
        displayTopics: [],
        topics: [],
        content_type: [],
        level: [],
        progress: [],
        instructors: []
      },
      profileImage: '',
      xp: '',
      rank: '',
      currentLesson: [],
      methodId: 0,
      methodIsStarted: false,
      methodIsCompleted: false,
      methodNextLessonUrl: null,
      showRestartCourse: false,
      lessonsStarted: true, // for showing continue lessons horizontal list
      refreshing: !lessonsCache,
      refreshControl: true,
      isLandscape:
        Dimensions.get('window').height < Dimensions.get('window').width,
      ...this.initialValidData(lessonsCache, true)
    };
  }

  componentDidMount = () => {
    Orientation.addDeviceOrientationListener(this.orientationListener);

    AsyncStorage.multiGet([
      'totalXP',
      'rank',
      'profileURI',
      'methodIsStarted',
      'methodIsCompleted'
    ]).then(data => {
      this.setState({
        xp: data[0][1],
        rank: data[1][1],
        profileImage: data[2][1],
        methodIsStarted:
          typeof data[3][1] !== null ? JSON.parse(data[3][1]) : false,
        methodIsCompleted:
          typeof data[4][1] !== null ? JSON.parse(data[4][1]) : false
      });
    });

    this.getContent();
    messaging().requestPermission();
    this.willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      () =>
        !this.firstTimeFocused ? (this.firstTimeFocused = true) : this.refresh()
    );
  };

  componentWillUnmount() {
    this.willFocusSubscription.remove();
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
        this.state.filters
      ),
      getStartedContent('')
    ]);
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

  initialValidData = (content, fromCache) => {
    try {
      if (!content) return {};
      let { method } = content;
      let allVideos = this.setData(
        content.all.data.map(data => {
          return new ContentModel(data);
        })
      );

      let inprogressVideos = this.setData(
        content.inProgress.data.map(data => {
          return new ContentModel(data);
        })
      );
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
        filtersAvailable: content.all.meta.filterOptions,
        progressLessons: inprogressVideos,
        outVideos:
          allVideos.length == 0 || content.all.data.length < 20 ? true : false,
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
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
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
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }

    try {
      let response = await getAllContent(
        '',
        this.state.currentSort,
        this.state.page,
        this.state.filters
      );
      const newContent = await response.data.map(data => {
        return new ContentModel(data);
      });

      let items = this.setData(newContent);

      this.setState({
        filtersAvailable: response.meta.filterOptions,
        allLessons: [...this.state.allLessons, ...items],
        outVideos:
          items.length == 0 || response.data.length < 20 ? true : false,
        filtering: false,
        isPaging: false
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
        progress_percent: newContent[i].post.progress_percent
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
        showRestartCourse: false
      },
      () => this.getMethod()
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
      if (newContent.getField('instructor') !== 'TBD') {
        return newContent.getField('instructor').fields[0].value;
      } else {
        return newContent.getField('instructor').name;
      }
    }
  };

  getDuration = newContent => {
    newContent.post.fields.find(f => f.key === 'video')?.length_in_seconds;
  };

  changeSort = currentSort => {
    // change sort
    this.setState(
      {
        currentSort,
        outVideos: false,
        isPaging: false,
        allLessons: [],
        page: 1
      },
      () => this.getAllLessons()
    );
  };

  getVideos = () => {
    // change page before getting more lessons if paging
    if (!this.state.outVideos) {
      this.setState({ page: this.state.page + 1 }, () => this.getAllLessons());
    }
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
          isPaging: true
        },
        () => this.getAllLessons()
      );
    }
  };

  refresh() {
    this.setState(
      {
        refreshControl: true,
        inprogressVideos: [],
        allLessons: [],
        page: 1
      },
      this.getContent
    );
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
            onScroll={({ nativeEvent }) => this.handleScroll(nativeEvent)}
            scrollEventThrottle={400}
          >
            {isiOS && this.state.refreshControl && (
              <ActivityIndicator
                size='small'
                style={{ padding: 10 }}
                color={colors.pianoteGrey}
              />
            )}
            <ImageBackground
              onLayout={() => console.log(this.getAspectRatio())}
              resizeMode={'cover'}
              style={{
                width: '100%',
                aspectRatio: this.getAspectRatio(),
                justifyContent: 'flex-end'
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
                key={'pianoteSVG'}
                style={{
                  position: 'absolute',
                  height: '100%',
                  width: '100%',
                  zIndex: 2,
                  elevation: 2
                }}
              >
                <View style={{ flex: 0.9 }} />
                <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                  <FastImage
                    style={{
                      width: fullWidth * 0.75,
                      height: (onTablet ? 55 : 65) * factorRatio,
                      alignSelf: 'center',
                      marginBottom: 12.5 * factorRatio
                    }}
                    source={require('Pianote2/src/assets/img/imgs/pianote-method.png')}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                </View>
                <View
                  style={{
                    flex: onTablet ? 0.2 : 0.15,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                    paddingHorizontal: 25 * factorRatio,
                    marginBottom: Platform.OS == 'android' ? -5 : -1
                  }}
                >
                  {this.state.methodIsCompleted ? (
                    <ResetIcon
                      pressed={() =>
                        this.setState({
                          showRestartCourse: true
                        })
                      }
                    />
                  ) : !this.state.methodIsStarted ? (
                    <StartIcon
                      pressed={() => {
                        if (this.state.methodNextLessonUrl)
                          this.props.navigation.navigate('VIDEOPLAYER', {
                            url: this.state.methodNextLessonUrl
                          });
                      }}
                    />
                  ) : (
                    <ContinueIcon
                      pressed={() => {
                        if (this.state.methodNextLessonUrl)
                          this.props.navigation.navigate('VIDEOPLAYER', {
                            url: this.state.methodNextLessonUrl
                          });
                      }}
                    />
                  )}
                  <View style={{ flex: 0.1 }} />
                  <MoreInfoIcon
                    pressed={() => {
                      this.props.navigation.navigate('METHOD', {
                        methodIsStarted: this.state.methodIsStarted,
                        methodIsCompleted: this.state.methodIsCompleted
                      });
                    }}
                  />
                </View>
                <View style={{ flex: 0.1 }} />
              </View>
            </ImageBackground>

            <View>
              {this.state.lessonsStarted && (
                <HorizontalVideoList
                  isMethod={true}
                  Title={'IN PROGRESS'}
                  seeAll={() =>
                    this.props.navigation.navigate('SEEALL', {
                      title: 'Continue',
                      parent: 'Lessons'
                    })
                  }
                  showType={true}
                  items={this.state.progressLessons}
                />
              )}
              <View style={{ height: onTablet ? -20 : 5 * factorRatio }} />
              {onTablet ? (
                <HorizontalVideoList
                  isMethod={true}
                  Title={'ALL LESSONS'}
                  seeAll={() =>
                    this.props.navigation.navigate('SEEALL', {
                      title: 'All Lessons',
                      parent: 'Lessons'
                    })
                  }
                  showType={true}
                  items={this.state.allLessons}
                />
              ) : (
                <VerticalVideoList
                  isMethod={true}
                  items={this.state.allLessons}
                  isLoading={false}
                  title={'ALL LESSONS'} // title for see all page
                  type={'LESSONS'} // the type of content on page
                  showFilter={true}
                  isPaging={this.state.isPaging}
                  showType={true} // show course / song by artist name
                  showArtist={true} // show artist name
                  showSort={true}
                  showLength={false}
                  filters={this.state.filters} // show filter list
                  currentSort={this.state.currentSort}
                  changeSort={sort => this.changeSort(sort)} // change sort and reload videos
                  filterResults={() => this.setState({ showFilters: true })} // apply from filters page
                  imageWidth={fullWidth * 0.26} // image width
                  outVideos={this.state.outVideos} // if paging and out of videos
                  getVideos={() => this.getVideos()}
                />
              )}
            </View>
          </ScrollView>
        ) : (
          <ActivityIndicator size='small' style={{ flex: 1 }} color={'white'} />
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
            hideRestartCourse={() =>
              this.setState({
                showRestartCourse: false
              })
            }
            type='method'
            onRestart={() => this.onRestartMethod()}
          />
        </Modal>
        {this.state.showFilters && (
          <Modal
            isVisible={this.state.showFilters}
            style={[
              styles.centerContent,
              {
                margin: 0,
                height: '100%',
                width: '100%'
              }
            ]}
            animation={'slideInUp'}
            animationInTiming={1}
            animationOutTiming={1}
            coverScreen={true}
            hasBackdrop={true}
          >
            <Filters
              hideFilters={() => this.setState({ showFilters: false })}
              filtersAvailable={this.state.filtersAvailable}
              filters={this.state.filters}
              filtering={this.state.filtering}
              type={'Lessons'}
              reset={filters => {
                this.setState(
                  {
                    allLessons: [],
                    filters,
                    page: 1
                  },
                  () => this.getAllLessons()
                );
              }}
              filterVideos={filters => {
                this.setState(
                  {
                    allLessons: [],
                    outVideos: false,
                    page: 1,
                    filters
                  },
                  () => this.getAllLessons()
                );
              }}
            />
          </Modal>
        )}
        <NavigationBar currentPage={'LESSONS'} isMethod={true} />
      </View>
    );
  }
}
const mapStateToProps = state => ({ lessonsCache: state.lessonsCache });
const mapDispatchToProps = dispatch =>
  bindActionCreators({ cacheAndWriteLessons }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Lessons);
