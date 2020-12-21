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
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ContentModel } from '@musora/models';
import NavMenuHeaders from '../../components/NavMenuHeaders';
import Filters from '../../components/FIlters.js';
import VerticalVideoList from '../../components/VerticalVideoList';
import HorizontalVideoList from '../../components/HorizontalVideoList';
import { getStartedContent, getAllContent } from '../../services/GetContent';
import { NetworkContext } from '../../context/NetworkProvider';
import NavigationBar from '../../components/NavigationBar';

import { cacheAndWriteCourses } from '../../redux/CoursesCacheActions';

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
      showFilters: false, 
      isPaging: false, // scrolling more
      filtering: false, // filtering
      filtersAvailable: null,
      filters: {
        displayTopics: [],
        topics: [],
        content_type: [],
        level: [],
        progress: [],
        instructors: []
      },
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
        this.state.filters
      ),
      getStartedContent('course')
    ]);
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
        filtersAvailable: content[0].meta.filterOptions,
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
      filtersAvailable: response.meta.filterOptions,
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
      <View style={{ backgroundColor: colors.mainBackground, flex: 1 }}>
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
            style={{
              flex: 1,
              backgroundColor: colors.mainBackground
            }}
          >
            {isiOS && this.state.refreshControl && (
              <ActivityIndicator
                size='large'
                style={{ padding: 10 }}
                color={colors.pianoteRed}
              />
            )}
            <Text
              style={{
                paddingLeft: 15,
                fontSize: 30 * factorRatio,
                color: 'white',
                fontFamily: 'OpenSans-ExtraBold'
              }}
            >
              Courses
            </Text>
            <View style={{height: 10*factorVertical}}/>
            {this.state.started && (
              <View
                key={'continueCourses'}
                style={{
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
                  items={this.state.progressCourses}
                />
              </View>
            )}
            {onTablet ? (
              <HorizontalVideoList
                Title={'COURSES'}
                seeAll={() =>
                  this.props.navigation.navigate('SEEALL', {
                    title: 'Courses',
                    parent: 'Courses'
                  })
                }
                items={this.state.allCourses}
              />
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
                filters={this.state.filters}
                currentSort={this.state.currentSort}
                changeSort={sort => this.changeSort(sort)}
                filterResults={() => this.setState({ showFilters: true })} // apply from filters page
                imageWidth={fullWidth * 0.26} // image width
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
            filtersAvailable={this.state.filtersAvailable}
            filters={this.state.filters}
            filtering={this.state.filtering}
            type={'Courses'}
            reset={filters => {
              this.setState(
                {
                  allCourses: [],
                  filters,
                  page: 1,
                },
                () => this.getAllCourses()
              );
            }}
            filterVideos={filters => {
              this.setState(
                {
                  allCourses: [],
                  outVideos: false,
                  page: 1,
                  filters
                },
                () => this.getAllCourses()
              );
            }}
          />
        </Modal>

        <NavigationBar currentPage={''} />
      </View>
    );
  }
}
const mapStateToProps = state => ({ coursesCache: state.coursesCache });
const mapDispatchToProps = dispatch =>
  bindActionCreators({ cacheAndWriteCourses }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Course);
