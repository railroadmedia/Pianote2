/**
 * Course
 */
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Platform,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { ContentModel } from '@musora/models';
import NavMenuHeaders from '../../components/NavMenuHeaders';
import VerticalVideoList from '../../components/VerticalVideoList';
import HorizontalVideoList from '../../components/HorizontalVideoList';
import { getStartedContent, getAllContent } from '../../services/GetContent';
import { NetworkContext } from '../../context/NetworkProvider';
import NavigationBar from '../../components/NavigationBar';

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 20;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

export default class Course extends React.Component {
  static navigationOptions = { header: null };
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    this.state = {
      progressCourses: [],
      allCourses: [],
      currentSort: 'newest',
      page: 1,
      outVideos: false,
      isPaging: false, // scrolling more
      filtering: false, // filtering
      filters: {
        displayTopics: [],
        topics: [],
        level: [],
        progress: [],
        instructors: []
      },
      started: true, // if started lesson
      refreshing: true,
      refreshControl: false
    };
  }

  componentDidMount() {
    this.getContent();
  }

  async getContent() {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    let content = await Promise.all([
      getAllContent(
        'course',
        this.state.currentSort,
        this.state.page,
        this.state.filters
      ),
      getStartedContent('course')
    ]);
    let allVideos = this.setData(
      content[0].data.map(data => {
        return new ContentModel(data);
      })
    );

    let inprogressVideos = this.setData(
      content[1].data.map(data => {
        return new ContentModel(data);
      })
    );

    this.setState({
      allCourses: allVideos,
      progressCourses: inprogressVideos,
      refreshing: false,
      refreshControl: false,
      outVideos:
        allVideos.length == 0 || content[0].data.length < 20 ? true : false,
      filtering: false,
      isPaging: false,
      page: this.state.page + 1,
      started: inprogressVideos.length !== 0
    });
  }

  getAllCourses = async loadMore => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    let response = await getAllContent(
      'course',
      this.state.currentSort,
      this.state.page,
      this.state.filters
    );
    const newContent = await response.data.map(data => {
      return new ContentModel(data);
    });

    let items = this.setData(newContent);

    this.setState(state => ({
      allCourses: loadMore ? state.allCourses.concat(items) : items,
      outVideos: items.length == 0 || response.data.length < 20 ? true : false,
      filtering: false,
      isPaging: false,
      refreshControl: false,
      page: this.state.page + 1
    }));
  };

  setData(newContent) {
    let items = [];
    for (let i in newContent) {
      items.push({
        title: newContent[i].getField('title'),
        artist: newContent[i].getField('instructor').fields[0].value,
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
        like_count: newContent[i].likeCount,
        isLiked: newContent[i].post.is_liked_by_current_user,
        isAddedToList: newContent[i].isAddedToList,
        isStarted: newContent[i].isStarted,
        isCompleted: newContent[i].isCompleted,
        progress_percent: newContent[i].post.progress_percent
      });
    }

    return items;
  }

  filterResults = () => {
    this.props.navigation.navigate('FILTERS', {
      filters: this.state.filters,
      type: 'COURSES',
      onGoBack: filters => {
        this.setState({
          filters:
            filters.instructors.length == 0 &&
            filters.level.length == 0 &&
            filters.progress.length == 0 &&
            filters.topics.length == 0
              ? null
              : filters
        });
        this.getAllCourses();
      }
    });
  };

  changeSort = currentSort => {
    this.setState(
      {
        currentSort,
        outVideos: false,
        isPaging: false,
        page: 1
      },
      () => this.getAllCourses()
    );
  };

  getVideos = async () => {
    // change page before getting more lessons if paging
    if (!this.state.outVideos) {
      this.setState({ page: this.state.page + 1 }, () =>
        this.getAllCourses(true)
      );
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
        () => this.getAllCourses(true)
      );
    }
  };

  filterResults = async () => {
    // function to be sent to filters page
    await this.props.navigation.navigate('FILTERS', {
      filters: this.state.filters,
      type: 'COURSES',
      onGoBack: filters => this.changeFilters(filters)
    });
  };

  changeFilters = filters => {
    // after leaving filter page. set filters here
    this.setState(
      {
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
      () => this.getAllCourses()
    );
  };

  refresh() {
    this.setState({ refreshControl: true, page: 1 }, () => this.getContent());
  }

  render() {
    return (
      <View
        style={[styles.container, { backgroundColor: colors.mainBackground }]}
      >
        <View
          style={{
            height: fullHeight * 0.1,
            width: fullWidth,
            position: 'absolute',
            zIndex: 2,
            elevation: 2,
            alignSelf: 'stretch'
          }}
        >
          <NavMenuHeaders currentPage={'LESSONS'} parentPage={'COURSES'} />
        </View>
        {!this.state.refreshing ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentInsetAdjustmentBehavior={'never'}
            onScroll={({ nativeEvent }) => this.handleScroll(nativeEvent)}
            refreshControl={
              <RefreshControl
                colors={[colors.pianoteRed]}
                refreshing={this.state.refreshControl}
                onRefresh={() => this.refresh()}
              />
            }
            style={{
              flex: 1,
              backgroundColor: colors.mainBackground
            }}
          >
            <View
              key={'header'}
              style={{
                height: fullHeight * 0.1,
                backgroundColor: colors.thirdBackground
              }}
            />
            <View
              key={'backgroundColoring'}
              style={{
                backgroundColor: colors.thirdBackground,
                position: 'absolute',
                height: fullHeight,
                top: -fullHeight,
                left: 0,
                right: 0,
                zIndex: 10,
                elevation: 10
              }}
            />
            <View style={{ height: 25 * factorVertical }} />
            <Text
              style={{
                paddingLeft: 12 * factorHorizontal,
                fontSize: 30 * factorRatio,
                color: 'white',
                fontFamily: 'OpenSans-ExtraBold'
              }}
            >
              Courses
            </Text>
            <View style={{ height: 15 * factorVertical }} />
            {this.state.started && (
              <View
                key={'continueCourses'}
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
                      parent: 'Courses'
                    })
                  }
                  showArtist={true}
                  items={this.state.progressCourses}
                  isLoading={false}
                  itemWidth={
                    isNotch
                      ? fullWidth * 0.6
                      : onTablet
                      ? fullWidth * 0.425
                      : fullWidth * 0.55
                  }
                  itemHeight={isNotch ? fullHeight * 0.155 : fullHeight * 0.175}
                />
              </View>
            )}
            <VerticalVideoList
              items={this.state.allCourses}
              isLoading={false}
              title={'COURSES'}
              type={'COURSES'}
              isPaging={this.state.isPaging}
              showFilter={true}
              showType={true}
              showArtist={true}
              showLength={false}
              showSort={true}
              filters={this.state.filters}
              imageRadius={5 * factorRatio}
              containerBorderWidth={0}
              currentSort={this.state.currentSort}
              changeSort={sort => this.changeSort(sort)}
              filterResults={() => this.filterResults()}
              containerWidth={fullWidth}
              containerHeight={
                onTablet
                  ? fullHeight * 0.15
                  : Platform.OS == 'android'
                  ? fullHeight * 0.115
                  : fullHeight * 0.095
              } // height per row
              imageHeight={
                onTablet
                  ? fullHeight * 0.12
                  : Platform.OS == 'android'
                  ? fullHeight * 0.095
                  : fullHeight * 0.0825
              } // image height
              imageWidth={fullWidth * 0.26} // image width
              outVideos={this.state.outVideos}
              getVideos={() => this.getVideos()}
            />
            <View style={{ height: fullHeight * 0.025 }} />
          </ScrollView>
        ) : (
          <ActivityIndicator
            size='large'
            style={{ flex: 1 }}
            color={colors.secondBackground}
          />
        )}
        <NavigationBar currentPage={''} />
      </View>
    );
  }
}
