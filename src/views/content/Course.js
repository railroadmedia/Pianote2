/**
 * Course
 */
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ContentModel } from '@musora/models';
import NavMenuHeaders from '../../components/NavMenuHeaders';
import VerticalVideoList from '../../components/VerticalVideoList';
import HorizontalVideoList from '../../components/HorizontalVideoList';
import { getStartedContent, getAllContent } from '../../services/GetContent';
import { NetworkContext } from '../../context/NetworkProvider';
import NavigationBar from '../../components/NavigationBar';

import { cacheAndWriteCourses } from '../../redux/CoursesCacheActions';

const windowDim = Dimensions.get('window');
const width =
  windowDim.width < windowDim.height ? windowDim.width : windowDim.height;
const height =
  windowDim.width > windowDim.height ? windowDim.width : windowDim.height;
const factor = (height / 812 + width / 375) / 2;
const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 20;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

class Course extends React.Component {
  static navigationOptions = { header: null };
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    let { coursesCache } = props;
    this.state = {
      progressCourses: [],
      allCourses: [],
      currentSort: 'newest',
      page: 1,
      outVideos: false,
      isPaging: false, // scrolling more
      filtering: false, // filtering
      started: true, // if started lesson
      refreshing: true,
      refreshControl: false,
      ...this.initialValidData(coursesCache, true)
    };
  }

  componentDidMount() {
    this.getContent();
    this.willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      () =>
        !this.firstTimeFocused ? (this.firstTimeFocused = true) : this.refresh()
    );
  }

  componentWillUnmount() {
    this.willFocusSubscription.remove();
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
        this.filterQuery
      ),
      getStartedContent('course')
    ]);
    this.metaFilters = content?.[0]?.meta?.filterOptions;
    this.props.cacheAndWriteCourses({
      all: content[0],
      inProgress: content[1]
    });
    this.setState(
      this.initialValidData({
        all: content[0],
        inProgress: content[1]
      })
    );
  }

  initialValidData = (content, fromCache) => {
    try {
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

      return {
        allCourses: allVideos,
        progressCourses: inprogressVideos,
        refreshing: false,
        refreshControl: fromCache,
        outVideos:
          allVideos.length == 0 || content.all.data.length < 20 ? true : false,
        filtering: false,
        isPaging: false,
        page: this.state?.page + 1 || 1,
        started: inprogressVideos.length !== 0
      };
    } catch (e) {
      return {};
    }
  };

  getAllCourses = async loadMore => {
    this.setState({ filtering: true });
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    let response = await getAllContent(
      'course',
      this.state.currentSort,
      this.state.page,
      this.filterQuery
    );
    this.metaFilters = response?.meta?.filterOptions;
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

  refresh() {
    this.setState({ refreshControl: true, page: 1 }, this.getContent);
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <NavMenuHeaders currentPage={'LESSONS'} parentPage={'COURSES'} />

        {!this.state.refreshing ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentInsetAdjustmentBehavior={'never'}
            onScroll={({ nativeEvent }) => this.handleScroll(nativeEvent)}
            refreshControl={
              <RefreshControl
                tintColor={'transparent'}
                colors={[colors.pianoteRed]}
                onRefresh={() => this.refresh()}
                refreshing={isiOS ? false : this.state.refreshControl}
              />
            }
            style={styles.mainContainer}
          >
            {isiOS && this.state.refreshControl && (
              <ActivityIndicator
                size='small'
                style={{ padding: 10 }}
                color={colors.secondBackground}
              />
            )}
            <Text style={styles.contentPageHeader}>Courses</Text>
            {this.state.started && (
              <View
                key={'continueCourses'}
                style={{
                  backgroundColor: colors.mainBackground,
                  paddingLeft: 10 * factor
                }}
              >
                <HorizontalVideoList
                  hideFilterButton={true}
                  Title={'CONTINUE'}
                  seeAll={() =>
                    this.props.navigation.navigate('SEEALL', {
                      title: 'Continue',
                      parent: 'Courses'
                    })
                  }
                  items={this.state.progressCourses}
                />
              </View>
            )}
            {onTablet ? (
              <View style={{ paddingLeft: 10 * factor }}>
                <HorizontalVideoList
                  Title={'COURSES'}
                  seeAll={() =>
                    this.props.navigation.navigate('SEEALL', {
                      title: 'Courses',
                      parent: 'Courses'
                    })
                  }
                  items={this.state.allCourses}
                  // if horizontal replace vertical on tablet include below
                  hideFilterButton={false} // if on tablet & should be filter list not see all
                  isPaging={this.state.isPaging}
                  filters={this.metaFilters}
                  currentSort={this.state.currentSort}
                  changeSort={sort => this.changeSort(sort)} // change sort and reload videos
                  applyFilters={filters =>
                    new Promise(res =>
                      this.setState(
                        {
                          allCourses: [],
                          outVideos: false,
                          page: 1
                        },
                        () => {
                          this.filterQuery = filters;
                          this.getAllCourses().then(res);
                        }
                      )
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
                          isPaging: true
                        },
                        () => this.getAllCourses()
                      );
                    }
                  }}
                />
              </View>
            ) : (
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
                filters={this.metaFilters}
                currentSort={this.state.currentSort}
                changeSort={sort => this.changeSort(sort)}
                applyFilters={filters =>
                  new Promise(res =>
                    this.setState(
                      {
                        allCourses: [],
                        outVideos: false,
                        page: 1
                      },
                      () => {
                        this.filterQuery = filters;
                        this.getAllCourses().then(res);
                      }
                    )
                  )
                }
                imageWidth={width * 0.26} // image width
                outVideos={this.state.outVideos}
                getVideos={() => this.getVideos()}
              />
            )}
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
const mapStateToProps = state => ({ coursesCache: state.coursesCache });
const mapDispatchToProps = dispatch =>
  bindActionCreators({ cacheAndWriteCourses }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Course);
