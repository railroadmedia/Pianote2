/**
 * Course
 */
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View
} from 'react-native';

import { bindActionCreators } from 'redux';
import { cacheAndWriteCourses } from '../../redux/CoursesCacheActions';
import { connect } from 'react-redux';

import HorizontalVideoList from '../../components/HorizontalVideoList';
import NavigationBar from '../../components/NavigationBar';
import NavMenuHeaders from '../../components/NavMenuHeaders';
import { RowCard } from '../../components/Cards';

import { getStartedContent, getAllContent } from '../../services/GetContent';
import structuredState from '../../services/structuredState.service';

import { NetworkContext } from '../../context/NetworkProvider';

class Course extends React.Component {
  static navigationOptions = { header: null };
  static contextType = NetworkContext;
  page = 1;

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
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    let content = await Promise.all([
      getAllContent(
        'course',
        this.props.courses.currentSort,
        1,
        this.filterQuery
      ),
      getStartedContent('course')
    ]);
    this.metaFilters = content?.[0]?.meta?.filterOptions;
    this.props.cacheAndWriteCourses({
      refreshing: false,
      refreshControl: false,
      ...structuredState({
        all: content[0],
        inProgress: content[1]
      })
    });
  }

  getAllCourses = async loadMore => {
    // if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    // let response = await getAllContent(
    //   'course',
    //   this.state.currentSort,
    //   loadMore ? ++this.page : (this.page = 1),
    //   this.filterQuery
    // );
    // this.metaFilters = response?.meta?.filterOptions;
    // this.setState(state => ({
    //   all: state.all,
    //   refreshControl: false
    // }));
  };

  changeSort = currentSort => {
    // this.setState({ currentSort }, this.getAllCourses);
  };

  getVideos = async () => {};

  refresh = () => {
    // this.setState({ refreshControl: true }, this.getContent);
  };

  renderFLItem = ({ item }) => <RowCard item={item} key={item.isAddedToList} />;

  renderFLHeader = () => (
    <View>
      {!!this.props.courses.inProgress?.length && (
        <HorizontalVideoList
          hideFilterButton={true}
          Title={'CONTINUE'}
          seeAll={() =>
            this.props.navigation.navigate('SEEALL', {
              title: 'Continue',
              parent: 'Courses'
            })
          }
          items={this.props.courses.inProgress}
        />
      )}
      <Text
        style={{
          padding: 10,
          fontSize: onTablet ? 20 : 16,
          fontFamily: 'RobotoCondensed-Bold',
          paddingVertical: 5,
          color: this.props.isMethod ? 'white' : colors.secondBackground
        }}
      >
        COURSES
      </Text>
    </View>
  );

  render() {
    let { refreshing, refreshControl, all } = this.props.courses;
    console.log(this.props.courses);
    return (
      <View style={styles.mainContainer}>
        <NavMenuHeaders currentPage={'LESSONS'} parentPage={'COURSES'} />
        {!refreshing ? (
          <FlatList
            windowSize={10}
            testID='flatList'
            data={all}
            style={{ flex: 1 }}
            initialNumToRender={5}
            maxToRenderPerBatch={10}
            onEndReachedThreshold={0.01}
            removeClippedSubviews={true}
            keyboardShouldPersistTaps='handled'
            renderItem={this.renderFLItem}
            onEndReached={() => !refreshControl && this.getAllCourses(true)}
            ListHeaderComponent={this.renderFLHeader}
            keyExtractor={({ id }) => id.toString()}
            numColumns={onTablet ? 3 : 1}
            ListEmptyComponent={<Text style={{}}>There is no content</Text>}
            ListFooterComponent={
              <ActivityIndicator
                size='small'
                color={colors.pianoteRed}
                animating={refreshControl}
                style={{}}
              />
            }
            refreshControl={
              <RefreshControl
                colors={[colors.pianoteRed]}
                tintColor={colors.pianoteRed}
                onRefresh={this.refresh}
                refreshing={refreshControl}
              />
            }
          />
        ) : (
          // <ScrollView
          //   style={styles.mainContainer}
          //   showsVerticalScrollIndicator={false}
          //   contentInsetAdjustmentBehavior={'never'}
          //   onScroll={this.handleScroll}
          //   refreshControl={
          //     <RefreshControl
          //       tintColor={colors.pianoteRed}
          //       colors={[colors.pianoteRed]}
          //       onRefresh={this.refresh}
          //       refreshing={refreshControl}
          //     />
          //   }
          // >
          //   <Text style={styles.contentPageHeader}>Courses</Text>
          //   {!!progressCourses?.length && (
          //     <HorizontalVideoList
          //       hideFilterButton={true}
          //       Title={'CONTINUE'}
          //       seeAll={() =>
          //         this.props.navigation.navigate('SEEALL', {
          //           title: 'Continue',
          //           parent: 'Courses'
          //         })
          //       }
          //       items={progressCourses}
          //     />
          //   )}
          //   {onTablet ? (
          //     <HorizontalVideoList
          //       isTile={true}
          //       Title={'COURSES'}
          //       seeAll={() =>
          //         this.props.navigation.navigate('SEEALL', {
          //           title: 'Courses',
          //           parent: 'Courses'
          //         })
          //       }
          //       items={allCourses}
          //       filters={this.metaFilters}
          //       currentSort={this.state.currentSort}
          //       changeSort={this.changeSort}
          //       applyFilters={filters =>
          //         new Promise(res =>
          //           this.setState(
          //             {
          //               allCourses: [],
          //               outVideos: false,
          //               page: 1
          //             },
          //             () => {
          //               this.filterQuery = filters;
          //               this.getAllCourses().then(res);
          //             }
          //           )
          //         )
          //       }
          //       callEndReached={true}
          //       reachedEnd={() => {
          //         if (!this.state.isPaging && !this.state.outVideos) {
          //           this.setState(
          //             {
          //               page: this.state.page + 1,
          //               isPaging: true
          //             },
          //             () => this.getAllCourses()
          //           );
          //         }
          //       }}
          //     />
          //   ) : (
          //     <VerticalVideoList
          //       items={allCourses}
          //       isLoading={false}
          //       title={'COURSES'}
          //       type={'COURSES'}
          //       isPaging={this.state.isPaging}
          //       showFilter={true}
          //       showType={true}
          //       showArtist={true}
          //       showLength={false}
          //       showSort={true}
          //       filters={this.metaFilters}
          //       currentSort={this.state.currentSort}
          //       changeSort={sort => this.changeSort(sort)}
          //       applyFilters={filters =>
          //         new Promise(res =>
          //           this.setState(
          //             {
          //               allCourses: [],
          //               outVideos: false,
          //               page: 1
          //             },
          //             () => {
          //               this.filterQuery = filters;
          //               this.getAllCourses().then(res);
          //             }
          //           )
          //         )
          //       }
          //       imageWidth={width * 0.26} // image width
          //       outVideos={this.state.outVideos}
          //       getVideos={() => this.getVideos()}
          //     />
          //   )}
          // </ScrollView>
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
const mapStateToProps = state => ({
  courses: {
    all: state.coursesCache?.all || [],
    currentSort: 'newest',
    inProgress: state.coursesCache?.inProgress || [],
    refreshControl: true,
    refreshing: !state.coursesCache?.all
  }
});
const mapDispatchToProps = dispatch =>
  bindActionCreators({ cacheAndWriteCourses }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Course);
