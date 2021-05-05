/**
 * Course
 */
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import Filters_V2 from '../../components/Filters_V2';
import NavigationBar from '../../components/NavigationBar';
import NavMenuHeaders from '../../components/NavMenuHeaders';
import RowCard from '../../components/Cards';
import Sort from '../../components/Sort';

import {
  getAllContent,
  getCache,
  getStartedContent,
  setCache
} from '../../services/GetContent';
import structuredState from '../../services/structuredState.service';

import { NetworkContext } from '../../context/NetworkProvider';

import { navigate, refreshOnFocusListener } from '../../../AppNavigator';

export default class Course extends React.PureComponent {
  static navigationOptions = { header: null };
  static contextType = NetworkContext;

  page = 1;
  all = [];
  inProgress = [];
  constructor(props) {
    super(props);
    let { all, inProgress } = getCache('courses');
    this.all = all;
    this.inProgress = inProgress;
    this.state = {
      loading: !all?.length,
      loadingMore: false,
      refreshControl: true
    };
  }

  componentDidMount() {
    let deepFilters = decodeURIComponent(this.props.route?.params?.url).split(
      '?'
    )[1];
    this.filterQuery = deepFilters && `&${deepFilters}`;
    this.getContent();
    this.refreshOnFocusListener = refreshOnFocusListener.call(this);
  }

  componentWillUnmount() {
    this.refreshOnFocusListener?.();
  }

  getContent = async () => {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    let content = await Promise.all([
      getAllContent(
        'course',
        this.sortRef?.sortQuery || 'newest',
        1,
        this.filterRef?.filterQuery
      ),
      getStartedContent('course')
    ]);
    this.metaFilters = content?.[0]?.meta?.filterOptions;
    let { all, inProgress } = structuredState({
      all: content[0],
      inProgress: content[1]
    });
    setCache('courses', { all, inProgress });
    this.all = all;
    this.inProgress = inProgress;
    this.setState({ loading: false, refreshControl: false });
  };

  getAll = async loadMore => {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    let response = await getAllContent(
      'course',
      this.sortRef?.sortQuery || 'newest',
      loadMore ? ++this.page : (this.page = 1),
      this.filterRef?.filterQuery
    );
    this.metaFilters = response?.meta?.filterOptions;
    let { all } = structuredState({ all: response });
    this.all = loadMore ? this.all.concat(all || []) : all;
    this.setState({ loadingMore: false, refreshControl: false });
  };

  refresh = () => {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    this.setState({ refreshControl: true }, this.getContent);
  };

  navigate = data =>
    navigate('PATHOVERVIEW', {
      data
    });

  filter = () => {
    this.setState({ refreshControl: true });
    return this.getAll();
  };

  sort = () => {
    this.setState({ refreshControl: true });
    return this.getAll();
  };

  renderFLHeader = () => {
    let { refreshControl } = this.state;
    return (
      <>
        {!!this.inProgress?.length && (
          <>
            <View style={lStyle.continueHeaderContainer}>
              <Text style={lStyle.continueText}>CONTINUE</Text>
              <TouchableOpacity
                onPress={() =>
                  navigate('SEEALL', { title: 'Continue', parent: 'Courses' })
                }
                style={{ padding: 10, paddingRight: 0 }}
              >
                <Text
                  style={{ fontSize: onTablet ? 16 : 12, color: '#fb1b2f' }}
                >
                  See All
                </Text>
              </TouchableOpacity>
            </View>
            <FlatList
              windowSize={10}
              data={this.inProgress}
              horizontal={true}
              initialNumToRender={5}
              maxToRenderPerBatch={10}
              onEndReachedThreshold={0.01}
              removeClippedSubviews={true}
              keyboardShouldPersistTaps='handled'
              contentContainerStyle={{
                width: `${(onTablet ? 33 : 80) * this.inProgress?.length}%`
              }}
              renderItem={({ item, index }) => (
                <View style={{ width: `${100 / this.inProgress?.length}%` }}>
                  <View
                    style={{
                      width: `${100 * this.inProgress?.length}%`,
                      paddingRight:
                        index === this.inProgress?.length - 1 ? 10 : 0
                    }}
                  >
                    <RowCard {...item} compact onNavigate={this.navigate} />
                  </View>
                </View>
              )}
              keyExtractor={({ id }) => id.toString()}
            />
          </>
        )}
        <View style={lStyle.allHeaderContainer}>
          <Text style={lStyle.allCoursesText}>
            COURSES
            {this.filterRef?.filterAppliedText ? `\n` : ''}
            {this.filterRef?.filterAppliedText}
          </Text>
          <Sort
            disabled={refreshControl}
            onSort={this.sort}
            ref={r => (this.sortRef = r)}
          />
          <Filters_V2
            disabled={refreshControl}
            onApply={this.filter}
            meta={this.metaFilters}
            reference={r => (this.filterRef = r)}
          />
        </View>
      </>
    );
  };

  render() {
    console.log('rend course');
    let { loading, loadingMore, refreshControl } = this.state;
    return (
      <View style={{ backgroundColor: '#00101d', flex: 1 }}>
        <NavMenuHeaders currentPage={'HOME'} parentPage={'COURSES'} />
        {loading ? (
          <ActivityIndicator
            size='large'
            style={{ flex: 1 }}
            color={colors.secondBackground}
          />
        ) : (
          <FlatList
            windowSize={10}
            testID='flatList'
            data={this.all}
            style={{ flex: 1 }}
            initialNumToRender={5}
            maxToRenderPerBatch={10}
            onEndReachedThreshold={0.01}
            removeClippedSubviews={true}
            keyboardShouldPersistTaps='handled'
            columnWrapperStyle={onTablet ? { width: '33%' } : null}
            renderItem={({ item }) => (
              <RowCard
                {...item}
                compact={onTablet}
                onNavigate={this.navigate}
                onToggleLike={this.toggleLike}
                onToggleMyList={this.toggleMyList}
              />
            )}
            onEndReached={() =>
              !refreshControl &&
              this.setState({ loadingMore: true }, () => this.getAll(true))
            }
            ListHeaderComponent={this.renderFLHeader}
            keyExtractor={({ id }) => id.toString()}
            numColumns={onTablet ? 3 : 1}
            ListEmptyComponent={
              <Text style={lStyle.noResultsText}>
                There are no results for this content type.
              </Text>
            }
            ListFooterComponent={
              <ActivityIndicator
                size='small'
                color={colors.pianoteRed}
                animating={loadingMore}
                style={{ padding: 10 }}
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
        )}
        <NavigationBar currentPage={''} />
      </View>
    );
  }
}

let lStyle = StyleSheet.create({
  continueHeaderContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center'
  },
  continueText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'RobotoCondensed-Bold',
    color: '#445f73'
  },
  allHeaderContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 10,
    paddingVertical: 5
  },
  allCoursesText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'RobotoCondensed-Bold',
    color: '#445f73'
  },
  noResultsText: { color: 'white', textAlign: 'center', padding: 20 }
});
