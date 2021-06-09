import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { connect, batch } from 'react-redux';
import { bindActionCreators } from 'redux';

import ForumCard from '../commons/ForumCard';
import ThreadCard from '../commons/ThreadCard';
import Search from '../commons/Search';
import Pagination from '../commons/Pagination';
import {
  connection,
  getForums,
  getFollowedThreads,
  search
} from '../services/forum.service';

import { setForumsThreads } from '../redux/ThreadActions';

let styles;
class Forums extends React.Component {
  page = 1;
  forums = [];
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
    let reFocused;
    this.refreshOnFocusListener = this.props.navigation?.addListener(
      'focus',
      () => (reFocused ? this.refresh?.() : (reFocused = true))
    );
    Promise.all([getForums(), getFollowedThreads()]).then(
      ([forums, followed]) => {
        this.forums = forums.results;
        this.followedThreads = followed.results.map(r => r.id);
        this.followedThreadsTotal = followed.total_results;
        batch(() => {
          this.props.setForumsThreads(followed.results);
          this.setState({ loading: false });
        });
      }
    );
  }

  componentWillUnmount = () => this.refreshOnFocusListener?.();

  navigate = (route, params) =>
    connection(true) && this.props.navigation.navigate(route, params);

  renderFLItem = ({ item: id }) => (
    <ThreadCard
      onNavigate={() => {
        this.navigate('Thread', {
          threadId: id,
          isDark: this.props.route.params.isDark,
          appColor: this.props.route.params.appColor
        });
      }}
      appColor={this.props.route.params.appColor}
      isDark={this.props.route.params.isDark}
      id={id}
      reduxKey={'forums'}
    />
  );

  renderForum = item => (
    <ForumCard
      key={item.id}
      data={item}
      appColor={this.props.route.params.appColor}
      isDark={this.props.route.params.isDark}
      onNavigate={() =>
        this.navigate('Threads', {
          title: item.title,
          forumId: item.id
        })
      }
    />
  );

  refresh = () => {
    if (!connection()) return;
    this.setState({ refreshing: true }, () => {
      Promise.all([getForums(), getFollowedThreads()]).then(
        ([forums, followed]) => {
          this.forums = forums.results;
          this.followedThreads = followed.results.map(r => r.id);
          batch(() => {
            this.props.setForumsThreads(followed.results);
            this.setState({ refreshing: false });
          });
        }
      );
    });
  };

  changePage = page => {
    if (!connection()) return;
    this.page = page;
    this.setState({ loadingMore: true }, () =>
      getFollowedThreads(page).then(r => {
        this.followedThreads = r.results.map(r => r.id);
        batch(() => {
          this.props.setForumsThreads(r.results);
          this.setState({ loadingMore: false }, () =>
            this.flatListRef.scrollToOffset({ offset: 0 })
          );
        });
      })
    );
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
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            removeClippedSubviews={true}
            keyboardShouldPersistTaps='handled'
            renderItem={this.renderFLItem}
            keyExtractor={item => item.toString()}
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
                <Search isDark={isDark} appColor={appColor} />
                {this.forums?.map(item => this.renderForum(item))}
                <Text style={styles.sectionTitle}>FOLLOWED THREADS</Text>
              </>
            }
          />
        )}
        <BottomNavigator currentPage={'FORUM'} />
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
    createForumIcon: {
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
const mapDispatchToProps = dispatch =>
  bindActionCreators({ setForumsThreads }, dispatch);

export default connect(null, mapDispatchToProps)(Forums);