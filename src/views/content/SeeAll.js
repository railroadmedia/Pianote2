/**
 * SeeAll
 */
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StatusBar
} from 'react-native';
import { ContentModel } from '@musora/models';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { SafeAreaView } from 'react-navigation';
import Modal from 'react-native-modal';
import Filters from '../../components/FIlters.js';
import NavigationBar from '../../components/NavigationBar.js';
import VerticalVideoList from '../../components/VerticalVideoList.js';
import {
  seeAllContent,
  getMyListContent,
  getAllContent,
  getStartedContent
} from '../../services/GetContent';
import { NetworkContext } from '../../context/NetworkProvider';

// correlates to filters
const typeDict = {
  'My List': 'MYLIST',
  Packs: 'PACKS',
  Lessons: 'LESSONS',
  'Student Focus': 'STUDENTFOCUS',
  Songs: 'SONGS',
  Courses: 'COURSES'
};

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 20;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

export default class SeeAll extends React.Component {
  static navigationOptions = { header: null };
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.navigation.state.params.title, // In Progress, Completed, Continue
      parent: this.props.navigation.state.params.parent, // My List, Packs, Student Focus, Foundations, Courses
      allLessons: [],
      currentSort: 'newest',
      page: 1,
      outVideos: false,
      refreshing: false,
      isLoadingAll: true, // all lessons
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
      }
    };
  }

  componentDidMount() {
    this.getAllLessons();
  }

  async getAllLessons(loadMore) {
    this.setState({ filtering: true });
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    let response = null;
    if (this.state.parent === 'My List') {
      // use my list API call when navigating to see all from my list
      response = await getMyListContent(
        this.state.page,
        this.state.filters,
        this.state.title == 'In Progress' ? 'started' : 'completed'
      );
    } else if (this.state.parent === 'Lessons') {
      // lessons continue and new
      if (this.state.title.slice(0, 3) == 'New') {
        response = await seeAllContent(
          'lessons',
          'new',
          this.state.page,
          this.state.filters
        );
      } else if (this.state.title.includes('All')) {
        response = await getAllContent(
          '',
          'newest',
          this.state.page,
          this.state.filters
        );
      } else {
        response = await seeAllContent(
          'lessons',
          'continue',
          this.state.page,
          this.state.filters
        );
      }
    } else if (this.state.parent === 'Courses') {
      if (this.state.title === 'Continue') {
        response = await seeAllContent(
          'courses',
          'continue',
          this.state.page,
          this.state.filters
        );
      } else {
        response = await getAllContent(
          'course',
          'newest',
          this.state.page,
          this.state.filters
        );
      }
    } else if (this.state.parent === 'Songs') {
      if (this.state.title === 'Continue') {
        response = await seeAllContent(
          'song',
          'continue',
          this.state.page,
          this.state.filters
        );
      } else {
        response = await getAllContent(
          'song',
          'newest',
          this.state.page,
          this.state.filters
        );
      }
    } else if (this.state.parent === 'Student Focus') {
      response = await getStartedContent(
        'quick-tips&included_types[]=question-and-answer&included_types[]=student-review&included_types[]=boot-camps&included_types[]=podcast'
      );
    }

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
        duration: i,
        like_count: newContent[i].post.like_count,
        mobile_app_url: newContent[i].post.mobile_app_url,
        lesson_count: newContent[i].post.lesson_count,
        currentLessonId: newContent[i].post?.song_part_id,
        isLiked: newContent[i].post.is_liked_by_current_user,
        isAddedToList: newContent[i].isAddedToList,
        isStarted: newContent[i].isStarted,
        isCompleted: newContent[i].isCompleted,
        bundle_count: newContent[i].post.bundle_count,
        progress_percent: newContent[i].post.progress_percent
      });
    }

    this.setState(state => ({
      filtersAvailable: response.meta.filterOptions,
      allLessons: loadMore ? state.allLessons.concat(items) : items,
      outVideos: items.length == 0 || response.data.length < 20 ? true : false,
      page: this.state.page + 1,
      isLoadingAll: false,
      refreshing: false,
      filtering: false,
      isPaging: false
    }));
  }

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

  getVideos = () => {
    // change page before getting more lessons if paging
    if (!this.state.outVideos) {
      this.setState({ page: this.state.page + 1 }, () =>
        this.getAllLessons(true)
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
        () => this.getAllLessons(true)
      );
    }
  };

  refresh = () => {
    this.setState({ refreshing: true, outVideos: false, page: 1 }, () =>
      this.getAllLessons()
    );
  };

  render() {
    return (
      <SafeAreaView
        forceInset={{
          bottom: 'never'
        }}
        style={{ flex: 1, backgroundColor: colors.thirdBackground }}
      >
        <StatusBar
          backgroundColor={colors.thirdBackground}
          barStyle={'light-content'}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: colors.thirdBackground,
            padding: 15
          }}
        >
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => this.props.navigation.goBack()}
          >
            <EntypoIcon
              name={'chevron-thin-left'}
              size={25 * factorRatio}
              color={'white'}
            />
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 22 * factorRatio,
              color: 'white',
              fontFamily: 'OpenSans-Bold',
              alignSelf: 'center',
              textAlign: 'center'
            }}
          >
            {this.state.parent}
          </Text>
          <View id='placeholder' style={{ flex: 1 }} />
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior={'never'}
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
          onScroll={({ nativeEvent }) => this.handleScroll(nativeEvent)}
        >
          <View style={{ height: 15 * factorVertical }} />
          <VerticalVideoList
            items={this.state.allLessons}
            isLoading={this.state.isLoadingAll}
            isPaging={this.state.isPaging}
            title={this.state.title} // title for see all page
            type={typeDict[this.state.parent]} // the type of content on page
            showFilter={true}
            hideFilterButton={this.state.parent == 'Lessons' ? false : false} // only show filter button on lessons
            showType={false}
            showArtist={true}
            showSort={false}
            showLength={false}
            showLargeTitle={true}
            filters={this.state.filters} // show filter list
            currentSort={this.state.currentSort}
            changeSort={sort => {
              this.setState({
                currentSort: sort,
                allLessons: []
              }),
                this.getAllLessons();
            }} // change sort and reload videos
            filterResults={() => this.setState({ showFilters: true })} // apply from filters page
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
          />
        </ScrollView>
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
            animationInTiming={10}
            animationOutTiming={10}
            coverScreen={true}
            hasBackdrop={true}
          >
            <Filters
              hideFilters={() => {
                this.setState({ showFilters: false });
              }}
              filtersAvailable={this.state.filtersAvailable}
              filters={this.state.filters}
              filtering={this.state.filtering}
              type={'See All'}
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
        <NavigationBar currentPage={'SEEALL'} />
      </SafeAreaView>
    );
  }
}
