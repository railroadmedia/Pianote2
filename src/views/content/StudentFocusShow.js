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

import NavigationBar from '../../components/NavigationBar.js';
import VerticalVideoList from '../../components/VerticalVideoList.js';
import { getAllContent, getStudentFocusTypes } from '../../services/GetContent';
import { NetworkContext } from '../../context/NetworkProvider';

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
      type: this.props.navigation.state.params.type,
      thumbnailUrl: this.props.navigation.state.params.thumbnailUrl,
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
    if (!this.state.thumbnailUrl) {
      this.getStudentFocus();
    }
  };

  async getStudentFocus() {
    let studentFocus = await getStudentFocusTypes();
    this.setState({ thumbnailUrl: studentFocus[this.state.type].thumbnailUrl });
  }

  getAllLessons = async isLoadingMore => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    let response = await getAllContent(
      this.state.type,
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
        publishedOn:
          newContent[i].publishedOn.slice(0, 10) +
          'T' +
          newContent[i].publishedOn.slice(11, 16),
        type: newContent[i].post.type,
        id: newContent[i].id,
        isAddedToList: newContent[i].isAddedToList,
        isStarted: newContent[i].isStarted,
        isCompleted: newContent[i].isCompleted,
        progress_percent: newContent[i].post.progress_percent
      });
    }

    this.setState(state => ({
      allLessons: isLoadingMore ? state.allLessons.concat(items) : items,
      outVideos: items.length == 0 || response.data.length < 20 ? true : false,
      page: this.state.page + 1,
      isLoadingAll: false,
      refreshing: false,
      filtering: false,
      isPaging: false
    }));
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
      this.setState({ page: this.state.page + 1 }, () =>
        this.getAllLessons(true)
      );
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
        () => this.getAllLessons(true)
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

  refresh = () => {
    this.setState({ refreshing: true, page: 1, outVideos: false }, () =>
      this.getAllLessons()
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
                source={{ uri: this.state.thumbnailUrl }}
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
            showFilter={this.state.type == 'quick-tips' ? true : false}
            showSort={this.state.type == 'quick-tips' ? true : false}
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
