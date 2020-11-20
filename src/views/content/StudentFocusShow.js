/**
 * StudentFocusShow
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl
} from 'react-native';
import { ContentModel } from '@musora/models';
import FastImage from 'react-native-fast-image';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import VerticalVideoList from 'Pianote2/src/components/VerticalVideoList.js';
import { getAllContent } from '../../services/GetContent';
import { NetworkContext } from '../../context/NetworkProvider';

const packDict = {
  Podcasts: require('Pianote2/src/assets/img/imgs/podcasts.png'),
  Bootcamps: require('Pianote2/src/assets/img/imgs/bootcamps.jpg'),
  'Q&A': require('Pianote2/src/assets/img/imgs/questionAnswer.jpg'),
  'Quick Tips': require('Pianote2/src/assets/img/imgs/quickTips.jpg'),
  'Student Review': require('Pianote2/src/assets/img/imgs/studentReview.jpg')
};

const typeDict = {
  Bootcamps: 'boot-camps',
  Podcasts: 'podcasts',
  'Q&A': 'question-and-answer',
  'Quick Tips': 'quick-tips',
  'Student Review': 'student-review'
};

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 20;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

export default class StudentFocusShow extends React.Component {
  static navigationOptions = { header: null };
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    this.state = {
      pack: this.props.navigation.state.params.pack,
      allLessons: [],
      currentSort: 'newest',
      page: 1,
      outVideos: false,
      refreshing: false,
      isLoadingAll: true, // all lessons
      isPaging: false, // scrolling more
      filtering: false, // filtering
      filters: {
        displayTopics: [],
        topics: [],
        level: [],
        progress: [],
        instructors: []
      }
    };
  }

  componentDidMount = () => {
    this.getAllLessons();
  };

  getAllLessons = async () => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    let response = await getAllContent(
      typeDict[this.state.pack],
      this.state.currentSort,
      this.state.page,
      this.state.filters
    );
    const newContent = await response.data.map(data => {
      return new ContentModel(data);
    });

    let items = [];
    for (let i in newContent) {
      items.push({
        title: newContent[i].getField('title'),
        artist: this.getArtist(newContent[i]),
        thumbnail: newContent[i].getData('thumbnail_url'),
        type: newContent[i].post.type,
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
        like_count: newContent[i].likeCount,
        duration: this.getDuration(newContent[i]),
        isLiked: newContent[i].post.is_liked_by_current_user,
        isAddedToList: newContent[i].isAddedToList,
        isStarted: newContent[i].isStarted,
        isCompleted: newContent[i].isCompleted,
        bundle_count: newContent[i].post.bundle_count,
        progress_percent: newContent[i].post.progress_percent
      });
    }

    this.setState({
      allLessons: [...this.state.allLessons, ...items],
      outVideos: items.length == 0 || response.data.length < 20 ? true : false,
      page: this.state.page + 1,
      isLoadingAll: false,
      refreshing: false,
      filtering: false,
      isPaging: false
    });
  };

  changeSort = async currentSort => {
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

  getVideos = async () => {
    // change page before getting more lessons if paging
    if (!this.state.outVideos) {
      this.setState({ page: this.state.page + 1 }, () => this.getAllLessons());
    }
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

  handleScroll = async event => {
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
    await this.props.navigation.navigate('FILTERS', {
      filters: this.state.filters,
      type: 'STUDENTFOCUSSHOW',
      onGoBack: filters => this.changeFilters(filters)
    });
  };

  changeFilters = async filters => {
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

  getDuration = async newContent => {
    // iterator for get content call
    if (newContent.post.fields[0].key == 'video') {
      return newContent.post.fields[0].value.fields[1].value;
    } else if (newContent.post.fields[1].key == 'video') {
      return newContent.post.fields[1].value.fields[1].value;
    } else if (newContent.post.fields[2].key == 'video') {
      return newContent.post.fields[2].value.fields[1].value;
    }
  };

  refresh = () => {
    this.setState(
      { refreshing: true, page: 1, allLessons: [], outVideos: false },
      () => this.getAllLessons()
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior={'never'}
          onScroll={({ nativeEvent }) => this.handleScroll(nativeEvent)}
          refreshControl={
            <RefreshControl
              colors={[colors.pianoteRed]}
              refreshing={this.state.refreshing}
              onRefresh={() => this.refresh()}
            />
          }
          style={{
            flex: 1,
            backgroundColor: colors.mainBackground
          }}
        >
          <View
            key={'backgroundColoring'}
            style={{
              backgroundColor: colors.mainBackground,
              position: 'absolute',
              height: fullHeight,
              top: -fullHeight,
              left: 0,
              right: 0,
              zIndex: 10
            }}
          />
          <View
            key={'imageContainer'}
            style={{
              width: fullWidth
            }}
          >
            <View
              key={'goBackIcon'}
              style={[
                styles.centerContent,
                {
                  top: isNotch ? 50 * factorVertical : 30 * factorVertical,
                  width: fullWidth,
                  position: 'absolute',
                  zIndex: 5
                }
              ]}
            >
              <View style={{ flex: 1 }} />
              <View
                style={[
                  styles.centerContent,
                  {
                    flexDirection: 'row'
                  }
                ]}
              >
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <View style={{ flex: 0.1 }} />
                  <View>
                    <View style={{ flex: 1 }} />
                    <TouchableOpacity
                      onPress={() => this.props.navigation.goBack()}
                      style={{
                        paddingLeft: 10 * factorRatio,
                        paddingRight: 10 * factorRatio
                      }}
                    >
                      <EntypoIcon
                        name={'chevron-thin-left'}
                        size={25 * factorRatio}
                        color={'white'}
                      />
                    </TouchableOpacity>
                    <View style={{ flex: 1 }} />
                  </View>
                </View>
                <Text
                  style={{
                    fontSize: 22 * factorRatio,
                    fontWeight: 'bold',
                    color: colors.mainBackground,
                    fontFamily: 'OpenSans-Regular'
                  }}
                >
                  Filter Courses
                </Text>
                <View style={{ flex: 1 }} />
              </View>
              <View style={{ height: 20 * factorVertical }} />
            </View>
            <View
              key={'bootcampImage'}
              style={[
                styles.centerContent,
                {
                  paddingTop: fullHeight * 0.1,
                  width: fullWidth,
                  zIndex: 2
                }
              ]}
            >
              <FastImage
                style={{
                  height: onTablet
                    ? fullWidth * 0.45
                    : Platform.OS == 'ios'
                    ? fullWidth * 0.625
                    : fullWidth * 0.525,
                  width: onTablet
                    ? fullWidth * 0.45
                    : Platform.OS == 'ios'
                    ? fullWidth * 0.625
                    : fullWidth * 0.525,
                  zIndex: 2,
                  borderRadius: 10 * factorRatio,
                  borderColor: colors.thirdBackground,
                  borderWidth: 5
                }}
                source={packDict[this.state.pack]}
                resizeMode={FastImage.resizeMode.stretch}
              />
            </View>
          </View>
          <View style={{ height: 25 * factorVertical }} />
          <VerticalVideoList
            items={this.state.allLessons}
            title={'EPISODES'}
            isPaging={this.state.isPaging}
            isLoading={this.state.isLoadingAll}
            type={'STUDENTFOCUSSHOW'}
            showType={true}
            showArtist={true}
            showLength={false}
            showFilter={this.state.pack == 'Quick Tips' ? true : false}
            showSort={this.state.pack == 'Quick Tips' ? true : false}
            filters={this.state.filters}
            containerWidth={fullWidth}
            imageRadius={5 * factorRatio}
            containerBorderWidth={0}
            currentSort={this.state.currentSort}
            changeSort={sort => this.changeSort(sort)}
            filterResults={() => this.filterResults()}
            containerHeight={
              onTablet
                ? fullHeight * 0.15
                : Platform.OS == 'android'
                ? fullHeight * 0.115
                : fullHeight * 0.0925
            }
            imageHeight={
              onTablet
                ? fullHeight * 0.125
                : Platform.OS == 'android'
                ? fullHeight * 0.0925
                : fullHeight * 0.0825
            }
            imageWidth={fullWidth * 0.26}
            outVideos={this.state.outVideos}
            getVideos={() => this.getVideos()}
          />
        </ScrollView>
        <NavigationBar currentPage={'NONE'} />
      </View>
    );
  }
}
