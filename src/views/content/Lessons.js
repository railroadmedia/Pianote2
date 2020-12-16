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

import Modal from 'react-native-modal';
import { ContentModel } from '@musora/models';
import FastImage from 'react-native-fast-image';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-community/async-storage';
import DeviceInfo, { isTablet } from 'react-native-device-info';
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

import commonService from '../../services/common.service';
import foundationsService from '../../services/foundations.service';
import { getStartedContent, getAllContent } from '../../services/GetContent';

import Pianote from '../../assets/img/svgs/pianote';

import RestartCourse from '../../modals/RestartCourse';

import { NetworkContext } from '../../context/NetworkProvider';

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 20;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

export default class Lessons extends React.Component {
  static navigationOptions = { header: null };
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    this.state = {
      foundations: [],
      progressLessons: [],
      allLessons: [],
      currentSort: 'newest',
      page: 1,
      outVideos: false,
      showFilters: false,
      isPaging: false, // scrolling more
      filtering: false, // filtering
      filtersAvailable: null,
      filters: {
        displayTopics: [],
        topics: [],
        level: [],
        progress: [],
        instructors: []
      },
      profileImage: '',
      xp: '',
      rank: '',
      currentLesson: [],
      foundationIsStarted: false,
      foundationIsCompleted: false,
      foundationNextLesson: null,
      showRestartCourse: false,
      lessonsStarted: true, // for showing continue lessons horizontal list
      refreshing: true,
      refreshControl: true,
      isLandscape:
        Dimensions.get('window').height < Dimensions.get('window').width
    };
  }

  componentDidMount = () => {
    Orientation.addDeviceOrientationListener(this.orientationListener);

    AsyncStorage.multiGet([
      'totalXP',
      'rank',
      'profileURI',
      'foundationsIsStarted',
      'foundationsIsCompleted'
    ]).then(data => {
      this.setState({
        xp: data[0][1],
        rank: data[1][1],
        profileImage: data[2][1],
        foundationIsStarted:
          typeof data[3][1] !== null ? JSON.parse(data[3][1]) : false,
        foundationIsCompleted:
          typeof data[4][1] !== null ? JSON.parse(data[4][1]) : false
      });
    });

    this.getContent();

    messaging().requestPermission();
  };

  componentWillUnmount() {
    Orientation.removeDeviceOrientationListener(this.orientationListener);
  }

  async getContent() {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    commonService.cacheSystem(
      'lessons',
      [
        foundationsService.getFoundation('foundations-2019'),
        getAllContent(
          '',
          this.state.currentSort,
          this.state.page,
          this.state.filters
        ),
        getStartedContent('')
      ],
      (content, fromCache) => {
        let foundation = content[0];
        let allVideos = this.setData(
          content[1].data.map(data => {
            return new ContentModel(data);
          })
        );

        let inprogressVideos = this.setData(
          content[2].data.map(data => {
            return new ContentModel(data);
          })
        );

        if (maxLevel.lessons == null) {
          maxLevel.lessons = Number(
            content[1].meta.filterOptions.difficulty.length - 1
          );
        }

        this.setState({
          foundationIsStarted: foundation.started,
          foundationIsCompleted: foundation.completed,
          foundationNextLesson: foundation.next_lesson,
          filtersAvailable: content[1].meta.filterOptions,
          allLessons: allVideos,
          progressLessons: inprogressVideos,
          outVideos:
            allVideos.length == 0 || content[1].data.length < 20 ? true : false,
          filtering: false,
          isPaging: false,
          lessonsStarted: inprogressVideos.length !== 0,
          refreshing: false,
          refreshControl: fromCache
        });

        AsyncStorage.multiSet([
          ['foundationsIsStarted', foundation.started.toString()],
          ['foundationsIsCompleted', foundation.completed.toString()]
        ]);
      }
    );
  }

  getFoundations = async () => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    const response = new ContentModel(
      await foundationsService.getFoundation('foundations-2019')
    );

    await AsyncStorage.multiSet([
      ['foundationsIsStarted', response.isStarted.toString()],
      ['foundationsIsCompleted', response.isCompleted.toString()]
    ]);
    this.setState({
      foundationIsStarted: response.isStarted,
      foundationIsCompleted: response.isCompleted,
      foundationNextLesson: response.post.next_lesson
    });
  };

  getAllLessons = async () => {
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

  onRestartFoundation = async () => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    resetProgress(this.state.id);
    this.setState(
      {
        foundationIsStarted: false,
        foundationIsCompleted: false,
        showRestartCourse: false
      },
      () => this.getFoundations()
    );
  };

  getDurationFoundations = newContent => {
    newContent.post.current_lesson.fields
      .find(f => f.key === 'video')
      ?.value.fields.find(f => f.key === 'length_in_seconds')?.value;
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

  changeFilters = filters => {
    // after leaving filter page. set filters here
    this.setState(
      {
        allLessons: [],
        outVideos: false,
        page: 1,
        filters:
          filters.instructors.length == 0 &&
          filters.level.length == 0 &&
          filters.progress.length == 0 &&
          filters.topics.length == 0
            ? {
                displayTopics: [],
                level: [],
                topics: [],
                progress: [],
                instructors: []
              }
            : filters
      },
      () => this.getAllLessons()
    );
  };

  refresh() {
    this.setState(
      {
        refreshControl: true,
        inprogressVideos: [],
        allLessons: [],
        page: 1
      },
      () => this.getContent()
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
      <View style={{ flex: 1, backgroundColor: 'black' }}>
        <NavMenuHeaders
          isMethod={true}
          currentPage={'HOME'}
          parentPage={'HOME'}
        />
        {!this.state.refreshing ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentInsetAdjustmentBehavior={'never'}
            style={{
              flex: 1,
              backgroundColor: 'black'
            }}
            refreshControl={
              <RefreshControl
                colors={[colors.secondBackground]}
                tintColor={colors.secondBackground}
                refreshing={this.state.refreshControl}
                onRefresh={() => this.refresh()}
              />
            }
            onScroll={({ nativeEvent }) => this.handleScroll(nativeEvent)}
            scrollEventThrottle={400}
          >
            <ImageBackground
              resizeMode={'cover'}
              style={{
                width: '100%',
                aspectRatio: this.getAspectRatio(),
                justifyContent: 'flex-end'
              }}
              source={require('../../assets/img/imgs/lisamethod.png')}
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
                  <Pianote
                    height={fullHeight * 0.03}
                    width={fullWidth * 0.35}
                    fill={colors.pianoteRed}
                  />
                </View>
                <View style={{ height: 7.5 * factorVertical }} />
                <FastImage
                  style={{
                    width: fullWidth,
                    height: 40 * factorVertical,
                    alignSelf: 'center'
                  }}
                  source={require('Pianote2/src/assets/img/imgs/method-logo.png')}
                  resizeMode={FastImage.resizeMode.contain}
                />
                <View style={{ height: 22.5 * factorVertical }} />

                <View
                  style={{
                    flex: onTablet ? 0.2 : 0.15,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                    paddingHorizontal: 25 * factorRatio
                  }}
                >
                  {this.state.foundationIsCompleted ? (
                    <ResetIcon
                      pressed={() =>
                        this.setState({
                          showRestartCourse: true
                        })
                      }
                    />
                  ) : !this.state.foundationIsStarted ? (
                    <StartIcon
                      pressed={() => {
                        if (this.state.foundationNextLesson)
                          this.props.navigation.navigate('VIDEOPLAYER', {
                            url: this.state.foundationNextLesson.mobile_app_url
                          });
                      }}
                    />
                  ) : (
                    <ContinueIcon
                      pressed={() => {
                        if (this.state.foundationNextLesson)
                          this.props.navigation.navigate('VIDEOPLAYER', {
                            url: this.state.foundationNextLesson.mobile_app_url
                          });
                      }}
                    />
                  )}
                  <View style={{ flex: 0.1 }} />
                  <MoreInfoIcon
                    pressed={() => {
                      this.props.navigation.navigate('FOUNDATIONS', {
                        foundationIsStarted: this.state.foundationIsStarted,
                        foundationIsCompleted: this.state.foundationIsCompleted
                      });
                    }}
                  />
                </View>
                <View style={{ flex: 0.1 }} />
              </View>
            </ImageBackground>

            <View>
              {this.state.lessonsStarted && (
                <View
                  key={'progressCourses'}
                  style={{
                    minHeight: fullHeight * 0.225,
                    backgroundColor: 'black'
                  }}
                >
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
                </View>
              )}
              <View style={{ height: 5 * factorRatio }} />
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
                !this.state.filtering && (
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
                )
              )}
            </View>
          </ScrollView>
        ) : (
          <ActivityIndicator size='small' style={{ flex: 1 }} color={'white'} />
        )}
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
            hideRestartCourse={() =>
              this.setState({
                showRestartCourse: false
              })
            }
            type='foundation'
            onRestart={() => this.onRestartFoundation()}
          />
        </Modal>
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
          animationInTiming={10}
          animationOutTiming={10}
          coverScreen={true}
          hasBackdrop={true}
        >
          <Filters
            hideFilters={() => this.setState({ showFilters: false })}
            filtersAvailable={this.state.filters}
            filters={this.state.filters}
            type={'Lessons'}
            reset={filters => {
              this.setState(
                {
                  allLessons: [],
                  filters
                },
                () => this.getAllLessons()
              );
            }}
            onGoBack={filters => {
              this.setState(
                {
                  allLessons: [],
                  filters:
                    filters.instructors.length == 0 &&
                    filters.level.length == 0 &&
                    filters.progress.length == 0 &&
                    filters.topics.length == 0
                      ? null
                      : filters
                },
                () => this.getAllLessons()
              );
            }}
          />
        </Modal>

        <NavigationBar currentPage={'LESSONS'} isMethod={true} />
      </View>
    );
  }
}
