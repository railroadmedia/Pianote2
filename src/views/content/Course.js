import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import NavMenuHeaders from '../../components/NavMenuHeaders';
import VerticalVideoList from '../../components/VerticalVideoList';
import HorizontalVideoList from '../../components/HorizontalVideoList';
import {getStartedContent, getAllContent} from '../../services/GetContent';
import {NetworkContext} from '../../context/NetworkProvider';
import NavigationBar from '../../components/NavigationBar';
import {cacheAndWriteCourses} from '../../redux/CoursesCacheActions';
import {navigate, refreshOnFocusListener} from '../../../AppNavigator';

var page = 1;
const windowDim = Dimensions.get('window');
const width =
  windowDim.width < windowDim.height ? windowDim.width : windowDim.height;
const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 20;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

class Course extends React.Component {
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    let {coursesCache} = props;
    this.state = {
      progressCourses: [],
      allCourses: [],
      currentSort: 'newest',
      isPaging: false,
      refreshing: true,
      refreshControl: false,
      ...this.initialValidData(coursesCache, true),
    };
  }

  componentDidMount() {
    let deepFilters = decodeURIComponent(this.props.route?.params?.url).split(
      '?',
    )[1];
    this.filterQuery = deepFilters && `&${deepFilters}`;
    this.getContent();
    this.refreshOnFocusListener = refreshOnFocusListener.call(this);
  }

  componentWillUnmount = () => this.refreshOnFocusListener?.();

  async getContent() {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    let content = await Promise.all([
      getAllContent('course', this.state.currentSort, page, this.filterQuery),
      getStartedContent('course', 1),
    ]);
    this.metaFilters = content?.[0]?.meta?.filterOptions;
    this.props.cacheAndWriteCourses({
      all: content[0],
      inProgress: content[1],
    });
    this.setState(
      this.initialValidData({
        all: content[0],
        inProgress: content[1],
      }),
    );
  }

  initialValidData = (content, fromCache) => {
    let allVideos = content?.all?.data;
    let inprogressVideos = content?.inProgress?.data;
    return {
      allCourses: allVideos,
      progressCourses: inprogressVideos,
      refreshing: false,
      refreshControl: fromCache,
      filtering: false,
      isPaging: false,
      page: 1,
    };
  };

  getAllCourses = async (loadMore) => {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    let response = await getAllContent(
      'course',
      this.state.currentSort,
      page,
      this.filterQuery,
    );

    this.metaFilters = response?.meta?.filterOptions;
    this.setState((state) => ({
      allCourses: loadMore
        ? state.allCourses.concat(response.data)
        : response.data,
      filtering: false,
      isPaging: false,
      refreshControl: false,
    }));
  };

  handleScroll = (event) => {
    if (isCloseToBottom(event) && !this.state.isPaging) {
      page = page + 1;
      this.setState({isPaging: true}, () => this.getAllCourses(true));
    }
  };

  render() {
    return (
      <View style={styles.mainContainer}>
        <NavMenuHeaders currentPage={'LESSONS'} parentPage={'COURSES'} />
        {!this.state.refreshing ? (
          <ScrollView
            style={styles.mainContainer}
            showsVerticalScrollIndicator={false}
            contentInsetAdjustmentBehavior={'never'}
            onScroll={({nativeEvent}) => this.handleScroll(nativeEvent)}
            refreshControl={
              <RefreshControl
                tintColor={'transparent'}
                colors={[colors.pianoteRed]}
                onRefresh={() =>
                  this.setState(
                    {refreshControl: true, page: 1},
                    this.getContent,
                  )
                }
                refreshing={isiOS ? false : this.state.refreshControl}
              />
            }
          >
            {isiOS && this.state.refreshControl && (
              <ActivityIndicator
                size='small'
                style={styles.activityIndicator}
                color={colors.secondBackground}
              />
            )}
            <Text style={styles.contentPageHeader}>Courses</Text>
            {!!this.state.progressCourses?.length && (
              <HorizontalVideoList
                hideFilterButton={true}
                Title={'CONTINUE'}
                seeAll={() =>
                  navigate('SEEALL', {
                    title: 'Continue',
                    parent: 'Courses',
                  })
                }
                items={this.state.progressCourses}
              />
            )}
            {onTablet ? (
              <HorizontalVideoList
                isTile={true}
                Title={'COURSES'}
                seeAll={() =>
                  navigate('SEEALL', {
                    title: 'Courses',
                    parent: 'Courses',
                  })
                }
                items={this.state.allCourses}
                hideFilterButton={false}
                isPaging={this.state.isPaging}
                filters={this.state.filters}
                currentSort={this.state.currentSort}
                changeSort={(sort) =>
                  this.setState(
                    {
                      currentSort: sort,
                      isPaging: false,
                      page: 1,
                    },
                    () => this.getAllCourses(),
                  )
                }
                filterResults={() => this.setState({showFilters: true})}
                applyFilters={(filters) =>
                  new Promise((res) =>
                    this.setState({allCourses: [], page: 1}, () => {
                      this.filterQuery = filters;
                      this.getAllCourses().then(res);
                    }),
                  )
                }
                callEndReached={true}
                reachedEnd={() => {
                  if (!this.state.isPaging) {
                    (page = page + 1),
                      this.setState({isPaging: true}, () =>
                        this.getAllCourses(),
                      );
                  }
                }}
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
                filters={this.metaFilters}
                currentSort={this.state.currentSort}
                changeSort={(sort) =>
                  this.setState(
                    {
                      currentSort: sort,
                      isPaging: false,
                      page: 1,
                    },
                    () => this.getAllCourses(),
                  )
                }
                applyFilters={(filters) =>
                  new Promise((res) =>
                    this.setState({allCourses: [], page: 1}, () => {
                      this.filterQuery = filters;
                      this.getAllCourses().then(res);
                    }),
                  )
                }
                imageWidth={width * 0.26}
              />
            )}
          </ScrollView>
        ) : (
          <ActivityIndicator
            size='large'
            style={{flex: 1}}
            color={colors.secondBackground}
          />
        )}
        <NavigationBar currentPage={''} />
      </View>
    );
  }
}
const mapStateToProps = (state) => ({coursesCache: state.coursesCache});
const mapDispatchToProps = (dispatch) =>
  bindActionCreators({cacheAndWriteCourses}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Course);
