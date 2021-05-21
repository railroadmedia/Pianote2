import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View
} from 'react-native';

import DiscussionCard from '../commons/DiscussionCard';
import ThreadCard from '../commons/ThreadCard';
import SearchInput from '../commons/SearchInput';
import Pagination from '../commons/Pagination';
import {
  connection,
  getDiscussions,
  getFollowedThreads
} from '../services/forum.service';

let styles;
export default class Discussions extends React.Component {
  page = 1;
  discussions = [];
  followedThreads = [];
  followedThreadsTotal = 0;

  state = {
    loadingMore: false,
    loading: true,
    refreshing: false
  };

  constructor(props) {
    super(props);
    let { isDark, appColor } = props.route.params;
    styles = setStyles(isDark, appColor);
  }

  componentDidMount() {
    Promise.all([getDiscussions(), getFollowedThreads()]).then(
      ([discussions, followed]) => {
        this.discussions = discussions.results;
        this.followedThreads = followed.results;

        this.followedThreadsTotal = followed.total_results;
        this.setState({ loading: false });
      }
    );
  }

  navigate = (route, params) =>
    connection(true) && this.props.navigation.navigate(route, params);

  renderFLItem = ({ item }) => (
    <ThreadCard
      onNavigate={() =>
        this.navigate('Thread', {
          title: item.title,
          isDark: this.props.route.params.isDark,
          appColor: this.props.route.params.appColor
        })
      }
      appColor={this.props.route.params.appColor}
      isDark={this.props.route.params.isDark}
      data={item}
    />
  );

  renderDiscussion = item => (
    <DiscussionCard
      key={item.id}
      data={item}
      appColor={this.props.route.params.appColor}
      isDark={this.props.route.params.isDark}
      onNavigate={() =>
        this.navigate('Threads', {
          mobile_app_url: item.mobile_app_url,
          title: item.title,
          discussionId: item.id
        })
      }
    />
  );

  refresh = () => {
    if (!connection()) return;

    this.setState({ refreshing: true }, () => {
      Promise.all([getDiscussions(), getFollowedThreads()]).then(
        ([discussions, followed]) => {
          this.discussions = discussions.results;
          this.followedThreads = followed.results;
          this.setState({ refreshing: false });
        }
      );
    });
  };

  changePage = page => {
    if (!connection()) return;
    console.log(page);
    this.page = page;
    this.setState({ loadingMore: true }, () =>
      getFollowedThreads(page).then(r => {
        this.followedThreads = r.results;
        this.setState({ loadingMore: false }, () =>
          this.flatListRef.scrollToOffset({ offset: 0 })
        );
      })
    );
  };

  search = text => {
    if (!connection()) return;
  };

  render() {
    let { loadingMore, loading, refreshing } = this.state;
    let { appColor, BottomNavigator, isDark } = this.props.route.params;
    return (
      <>
        {loading ? (
          <ActivityIndicator
            size='large'
            color={appColor}
            animating={true}
            style={styles.loading}
          />
        ) : (
          <FlatList
            windowSize={10}
            data={this.followedThreads}
            style={styles.fList}
            initialNumToRender={1}
            maxToRenderPerBatch={10}
            removeClippedSubviews={true}
            keyboardShouldPersistTaps='handled'
            renderItem={this.renderFLItem}
            keyExtractor={item => item.id.toString()}
            ref={r => (this.flatListRef = r)}
            refreshControl={
              <RefreshControl
                colors={[appColor]}
                tintColor={appColor}
                onRefresh={this.refresh}
                refreshing={refreshing}
              />
            }
            ListEmptyComponent={
              <Text style={styles.emptyList}>You don't follow any threads</Text>
            }
            ListFooterComponent={
              <View
                style={{
                  borderTopWidth: 1,
                  borderColor: '#445F74',
                  marginHorizontal: 15,
                  marginBottom: 10
                }}
              >
                <Pagination
                  active={this.page}
                  isDark={isDark}
                  appColor={appColor}
                  length={this.followedThreadsTotal}
                  onChangePage={this.changePage}
                />
                <ActivityIndicator
                  size='small'
                  color={appColor}
                  animating={loadingMore}
                  style={{ padding: 15 }}
                />
              </View>
            }
            ListHeaderComponent={
              <>
                <SearchInput
                  isDark={this.props.route.params.isDark}
                  onSearch={text => this.search(text)}
                />
                {this.discussions.map(item => this.renderDiscussion(item))}
                <Text style={styles.sectionTitle}>FOLLOWED THREADS</Text>
              </>
            }
          />
        )}

        <BottomNavigator />
      </>
    );
  }
}

let setStyles = (isDark, appColor) =>
  StyleSheet.create({
    fList: {
      flex: 1,
      backgroundColor: isDark ? '#00101D' : 'white'
    },
    loading: {
      flex: 1,
      backgroundColor: isDark ? '#00101D' : 'white',
      alignItems: 'center'
    },
    emptyList: {
      color: isDark ? '#445F74' : 'black',
      fontFamily: 'OpenSans',
      padding: 15
    },
    createDiscussionIcon: {
      position: 'absolute',
      bottom: 60,
      right: 15,
      height: 55,
      aspectRatio: 1,
      borderRadius: 27,
      backgroundColor: appColor,
      justifyContent: 'center',
      alignItems: 'center'
    },
    sectionTitle: {
      fontFamily: 'RobotoCondensed-Bold',
      fontSize: 16,
      color: isDark ? '#445F74' : '#97AABE',
      margin: 5,
      marginLeft: 15
    }
  });
