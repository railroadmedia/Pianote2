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

import database from '@react-native-firebase/database';

import Filters_V2 from '../../components/Filters_V2';
import NavigationBar from '../../components/NavigationBar';
import NavMenuHeaders from '../../components/NavMenuHeaders';
import { RowCard } from '../../components/Cards';
import Sort from '../../components/Sort';

import { getStartedContent, getAllContent } from '../../services/GetContent';
import structuredState from '../../services/structuredState.service';

import { NetworkContext } from '../../context/NetworkProvider';

let cacheDB = database().ref('/courses');
export default class Course extends React.PureComponent {
  static navigationOptions = { header: null };
  static contextType = NetworkContext;

  page = 1;
  state = {
    all: [],
    inProgress: [],
    refreshControl: true,
    loading: true,
    loadingMore: false
  };

  componentDidMount() {
    cacheDB.once('value', snapshot => {
      let { all, inProgress } = snapshot.val() || {};
      this.setState({
        loading: false,
        all: all || [],
        inProgress: inProgress || []
      });
    });
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
    cacheDB.set({ all, inProgress });
    this.setState({
      loading: false,
      refreshControl: false,
      all: all || [],
      inProgress: inProgress || []
    });
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
    this.setState({
      loadingMore: false,
      refreshControl: false,
      all: loadMore ? this.state.all.concat(all || []) : all
    });
  };

  refresh = () => {
    if (!this.context.isConnected) return this.context.showNoConnectionAlert();
    this.setState({ refreshControl: true }, this.getContent);
  };

  toggleMyList = id =>
    this.setState(
      ({ all, inProgress }) => ({
        all: all.map(a =>
          a.id === id ? { ...a, isAddedToList: !a.isAddedToList } : a
        ),
        inProgress: inProgress.map(ip =>
          ip.id === id ? { ...ip, isAddedToList: !ip.isAddedToList } : ip
        )
      }),
      () => cacheDB.update(this.state)
    );

  toggleLike = id => {
    this.setState(
      ({ all, inProgress }) => ({
        all: all.map(a =>
          a.id === id
            ? {
                ...a,
                isLiked: !a.isLiked,
                like_count: a.like_count + (a.isLiked ? -1 : 1)
              }
            : a
        ),
        inProgress: inProgress.map(ip =>
          ip.id === id
            ? {
                ...ip,
                isLiked: !ip.isLiked,
                like_count: ip.like_count + (ip.isLiked ? -1 : 1)
              }
            : ip
        )
      }),
      () => cacheDB.update(this.state)
    );
  };

  navigate = data =>
    this.props.navigation.navigate('PATHOVERVIEW', {
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
    let { refreshControl, inProgress } = this.state;
    return (
      <>
        {!!inProgress?.length && (
          <>
            <View style={lStyle.continueHeaderContainer}>
              <Text style={lStyle.continueText}>CONTINUE</Text>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('SEEALL', {
                    title: 'Continue',
                    parent: 'Courses'
                  })
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
              data={inProgress}
              horizontal={true}
              initialNumToRender={5}
              maxToRenderPerBatch={10}
              onEndReachedThreshold={0.01}
              removeClippedSubviews={true}
              keyboardShouldPersistTaps='handled'
              contentContainerStyle={{
                width: `${(onTablet ? 33 : 80) * inProgress?.length}%`
              }}
              renderItem={({ item, index }) => (
                <View style={{ width: `${100 / inProgress?.length}%` }}>
                  <View
                    style={{
                      width: `${100 * inProgress?.length}%`,
                      paddingRight: index === inProgress?.length - 1 ? 10 : 0
                    }}
                  >
                    <RowCard
                      item={item}
                      compact
                      onNavigate={this.navigate}
                      onToggleLike={this.toggleLike}
                      onToggleMyList={this.toggleMyList}
                    />
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
    let { loading, loadingMore, refreshControl } = this.state;
    return (
      <View style={{ backgroundColor: '#00101d', flex: 1 }}>
        <NavMenuHeaders currentPage={'LESSONS'} parentPage={'COURSES'} />
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
            data={this.state.all}
            style={{ flex: 1 }}
            initialNumToRender={5}
            maxToRenderPerBatch={10}
            onEndReachedThreshold={0.01}
            removeClippedSubviews={true}
            keyboardShouldPersistTaps='handled'
            columnWrapperStyle={onTablet ? { width: '33%' } : null}
            renderItem={({ item }) => (
              <RowCard
                item={item}
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
