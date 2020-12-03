/**
 * Lessons
 */
import React from 'react';
import {
  View,
  Text,
  Platform,
  ScrollView,
  RefreshControl,
  ActivityIndicator
} from 'react-native';

import Modal from 'react-native-modal';
import { ContentModel } from '@musora/models';
import FastImage from 'react-native-fast-image';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-community/async-storage';
import DeviceInfo from 'react-native-device-info';
import Orientation from 'react-native-orientation-locker';

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
      isLandscape: fullHeight < fullWidth
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

        this.setState(
          {
            foundationIsStarted: foundation.started,
            foundationIsCompleted: foundation.completed,
            foundationNextLesson: foundation.next_lesson,
            filtersAvailable: content[1].meta.filterOptions,
            allLessons: allVideos,
            progressLessons: inprogressVideos,
            outVideos:
              allVideos.length == 0 || content[1].data.length < 20
                ? true
                : false,
            filtering: false,
            isPaging: false,
            lessonsStarted: inprogressVideos.length !== 0,
            refreshing: false,
            refreshControl: fromCache
          },
          () => console.log(this.state.filtersAvailable)
        );

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
    console.log('get all lessons')
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

      console.log('response: ', this.state.filtersAvailable)

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

  filterResults = () => {
    this.props.navigation.navigate('FILTERS', {
      filters: this.state.filters,
      type: 'LESSONS',
      onGoBack: filters => {
        console.log(filters),
        this.setState({
          allLessons: [],
          filters:
            filters.instructors.length == 0 &&
            filters.level.length == 0 &&
            filters.progress.length == 0 &&
            filters.topics.length == 0
              ? null
              : filters
        });
        this.getAllLessons();
      }
    });
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

  filterResults = async () => {
    // function to be sent to filters page
    await this.props.navigation.navigate('FILTERS', {
      filters: this.state.filters,
      filtersAvailable: this.state.filtersAvailable,
      type: 'LESSONS',
      onGoBack: filters => this.changeFilters(filters)
    });
  };

  changeFilters = filters => {
    // after leaving filter page. set filters here
    console.log('FILTERS: ', filters)
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
      if (DeviceInfo.isTablet()) this.setState({ isLandscape });
    } else {
      Orientation.getAutoRotateState(isAutoRotateOn => {
        if (isAutoRotateOn && DeviceInfo.isTablet())
          this.setState({ isLandscape });
      });
    }
  };

  getAspectRatio() {
    if (DeviceInfo.isTablet() && this.state.isLandscape) return 3;
    if (DeviceInfo.isTablet() && !this.state.isLandscape) return 2;
    return 1.8;
  }

  render() {
    return (
      <View
        style={[styles.container, { backgroundColor: colors.mainBackground }]}
      >
        <NavMenuHeaders currentPage={'LESSONS'} parentPage={'LESSONS'} />
        {!this.state.refreshing ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentInsetAdjustmentBehavior={'never'}
            style={{
              flex: 1,
              backgroundColor: colors.mainBackground
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
            <View
              key={'image'}
              style={[
                styles.centerContent,
                {
                  width: '100%',
                  aspectRatio: this.getAspectRatio()
                }
              ]}
            >
              <GradientFeature
                color={'blue'}
                opacity={1}
                height={'100%'}
                borderRadius={0}
              />
              <FastImage
                style={{
                  flex: 1,
                  alignSelf: 'stretch',
                  backgroundColor: colors.mainBackground
                }}
                source={require('Pianote2/src/assets/img/imgs/foundations-background-image.png')}
                resizeMode={FastImage.resizeMode.cover}
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
                <View style={{ flex: 0.4 }} />
                <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                  <Pianote
                    height={fullHeight * 0.03}
                    width={fullWidth * 0.35}
                    fill={'white'}
                  />
                </View>
                <Text
                  key={'foundations'}
                  style={{
                    fontSize: 50 * factorRatio,
                    color: 'white',
                    fontFamily: 'RobotoCondensed-Bold',
                    transform: [{ scaleX: 0.7 }],
                    textAlign: 'center'
                  }}
                >
                  FOUNDATIONS
                </Text>
                <View style={{ flex: 0.4 }} />

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                    paddingHorizontal: 15
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
              </View>
            </View>
            <View
              key={'profile'}
              style={{
                borderTopWidth: 0.25,
                borderBottomWidth: 0.25,
                borderTopColor: colors.secondBackground,
                borderBottomColor: colors.secondBackground,
                backgroundColor: colors.mainBackground,
                paddingTop: 10,
                paddingBottom: 10,
                marginVertical: 10*factorVertical,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-evenly'
              }}
            >
              <FastImage
                style={{
                  height: 60*factorRatio,
                  aspectRatio: 1,
                  borderRadius: 100,
                  backgroundColor: colors.secondBackground
                }}
                source={{
                  uri:
                    this.state.profileImage ||
                    'https://www.drumeo.com/laravel/public/assets/images/default-avatars/default-male-profile-thumbnail.png'
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
              <View>
                <Text
                  style={{
                    color: colors.pianoteRed,
                    fontSize: 12 * factorRatio,
                    fontWeight: 'bold',
                    textAlign: 'center'
                  }}
                >
                  XP
                </Text>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 24 * factorRatio,
                    fontFamily: 'OpenSans-ExtraBold',
                    textAlign: 'center'
                  }}
                >
                  {this.state.xp?.length > 4
                    ? (Number(this.state.xp) / 1000).toFixed(1).toString() + 'k'
                    : this.state.xp?.toString()}
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    color: colors.pianoteRed,
                    fontSize: 12 * factorRatio,
                    fontWeight: 'bold',
                    textAlign: 'center'
                  }}
                >
                  RANK
                </Text>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 24 * factorRatio,
                    fontFamily: 'OpenSans-ExtraBold',
                    textAlign: 'center'
                  }}
                >
                  {this.state.rank}
                </Text>
              </View>
            </View>

            <View>
              {this.state.lessonsStarted && (
                <View
                  key={'progressCourses'}
                  style={{
                    minHeight: fullHeight * 0.225,
                    paddingLeft: fullWidth * 0.035,
                    backgroundColor: colors.mainBackground
                  }}
                >
                  <HorizontalVideoList
                    Title={'CONTINUE'}
                    seeAll={() =>
                      this.props.navigation.navigate('SEEALL', {
                        title: 'Continue',
                        parent: 'Lessons'
                      })
                    }
                    showArtist={true}
                    showType={true}
                    items={this.state.progressLessons}
                    isLoading={false}
                    itemWidth={
                      isNotch
                        ? fullWidth * 0.6
                        : onTablet
                        ? fullWidth * 0.425
                        : fullWidth * 0.55
                    }
                    itemHeight={
                      isNotch ? fullHeight * 0.155 : fullHeight * 0.175
                    }
                  />
                </View>
              )}
              <View style={{ height: 5 * factorRatio }} />
              {!this.state.filtering && (
                <VerticalVideoList
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
                  imageRadius={5 * factorRatio} // radius of image shown
                  containerBorderWidth={0} // border of box
                  containerWidth={fullWidth} // width of list
                  currentSort={this.state.currentSort}
                  changeSort={sort => this.changeSort(sort)} // change sort and reload videos
                  filterResults={() => this.filterResults()} // apply from filters page
                  containerHeight={
                    onTablet
                      ? fullHeight * 0.15
                      : Platform.OS == 'android'
                      ? fullHeight * 0.115
                      : fullHeight * 0.0925
                  } // height per row
                  imageHeight={
                    onTablet
                      ? fullHeight * 0.12
                      : Platform.OS == 'android'
                      ? fullHeight * 0.09
                      : fullHeight * 0.0825
                  } // image height
                  imageWidth={fullWidth * 0.26} // image width
                  outVideos={this.state.outVideos} // if paging and out of videos
                  getVideos={() => this.getVideos()}
                />
              )}
            </View>
          </ScrollView>
        ) : (
          <ActivityIndicator
            size='small'
            style={{ flex: 1 }}
            color={colors.secondBackground}
          />
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
        <NavigationBar currentPage={'LESSONS'} />
      </View>
    );
  }
}
