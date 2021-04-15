/**
 * SeeAll
 */
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  RefreshControl,
  StatusBar
} from 'react-native';
import Back from 'Pianote2/src/assets/img/svgs/back.svg';
import { SafeAreaView } from 'react-navigation';
import NavigationBar from '../../components/NavigationBar.js';
import VerticalVideoList from '../../components/VerticalVideoList.js';
import { getMyListContent, getStartedContent } from '../../services/GetContent';
import { NetworkContext } from '../../context/NetworkProvider';
import { goBack } from '../../../AppNavigator.js';

const windowDim = Dimensions.get('window');
const width =
  windowDim.width < windowDim.height ? windowDim.width : windowDim.height;
const height =
  windowDim.width > windowDim.height ? windowDim.width : windowDim.height;
const factor = (height / 812 + width / 375) / 2;

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
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    this.state = {
      title: props.route?.params?.title, // In Progress, Completed, Continue
      parent: props.route?.params?.parent, // My List, Packs, Student Focus, Foundations, Courses
      allLessons: [],
      currentSort: 'newest',
      page: 1,
      outVideos: false,
      refreshing: false,
      isLoadingAll: true, // all lessons
      isPaging: false, // scrolling more
      filtering: false // filtering
    };
  }

  componentDidMount() {
    let deepFilters = decodeURIComponent(this.props.route?.params?.url).split(
      '?'
    )[1];
    this.filterQuery = deepFilters && `&${deepFilters}`;
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
        this.filterQuery,
        this.state.title == 'In Progress' ? 'started' : 'completed'
      );
    } else if (this.state.parent === 'Lessons') {
      response = await getStartedContent('', this.state.page, this.filterQuery);
    } else if (this.state.parent === 'Courses') {
      response = await getStartedContent(
        'course',
        this.state.page,
        this.filterQuery
      );
    } else if (this.state.parent === 'Songs') {
      response = await getStartedContent(
        'song',
        this.state.page,
        this.filterQuery
      );
    } else if (this.state.parent === 'Student Focus') {
      response = await getStartedContent(
        'quick-tips&included_types[]=question-and-answer&included_types[]=student-review&included_types[]=boot-camps&included_types[]=podcast',
        this.state.page,
        this.filterQuery
      );
    }

    this.metaFilters = response?.meta?.filterOptions;
    const newContent = response.data;

    this.setState(state => ({
      allLessons: loadMore ? state.allLessons.concat(newContent) : newContent,
      outVideos:
        newContent.length == 0 || newContent.length < 10 ? true : false,
      isLoadingAll: false,
      refreshing: false,
      filtering: false,
      isPaging: false
    }));
  }

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
        style={styles.packsContainer}
      >
        <StatusBar
          backgroundColor={colors.thirdBackground}
          barStyle={'light-content'}
        />
        <View style={styles.childHeader}>
          <TouchableOpacity style={{ flex: 1 }} onPress={() => goBack()}>
            <Back
              width={backButtonSize}
              height={backButtonSize}
              fill={'white'}
            />
          </TouchableOpacity>
          <Text style={styles.childHeaderText}>{this.state.parent}</Text>
          <View style={{ flex: 1 }} />
        </View>
        <ScrollView
          style={styles.mainContainer}
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
        >
          <VerticalVideoList
            items={this.state.allLessons}
            isLoading={this.state.isLoadingAll}
            isPaging={this.state.isPaging}
            title={this.state.title}
            type={typeDict[this.state.parent]}
            showFilter={true}
            hideFilterButton={this.state.parent == 'Lessons' ? false : false} // only show filter button on lessons
            showType={false}
            showArtist={true}
            showSort={false}
            showLength={false}
            showLargeTitle={true}
            filters={this.metaFilters}
            currentSort={this.state.currentSort}
            changeSort={sort => {
              this.setState({
                currentSort: sort,
                allLessons: []
              }),
                this.getAllLessons();
            }} // change sort and reload videos
            imageWidth={(onTablet ? 0.225 : 0.3) * width}
            outVideos={this.state.outVideos} // if paging and out of videos
            applyFilters={filters =>
              new Promise(res =>
                this.setState(
                  {
                    allLessons: [],
                    outVideos: false,
                    page: 1
                  },
                  () => {
                    this.filterQuery = filters;
                    this.getAllLessons().then(res);
                  }
                )
              )
            }
          />
        </ScrollView>
        <NavigationBar currentPage={'SEEALL'} />
      </SafeAreaView>
    );
  }
}
