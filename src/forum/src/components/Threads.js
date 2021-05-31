import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { connect, batch } from 'react-redux';
import { bindActionCreators } from 'redux';

import Pagination from '../commons/Pagination';
import Search from '../commons/Search';
import ThreadCard from '../commons/ThreadCard';

import { setAllThreads, setFollowedThreads } from '../redux/ThreadActions';

import {
  getFollowedThreads,
  getAllThreads,
  connection
} from '../services/forum.service';

import { addThread } from '../assets/svgs';

let styles;
class Threads extends React.Component {
  followedPage = 1;
  allPage = 1;
  followedResultsTotal = 0;
  allResultsTotal = 0;
  followed = [];
  all = [];

  state = {
    followedLoadingMore: false,
    allLoadingMore: false,
    tab: 0,
    loading: true,
    createDiscussionHeight: 0,
    followedRefreshing: false,
    allRefreshing: false
  };

  constructor(props) {
    super(props);
    let { isDark } = props.route.params;
    styles = setStyles(isDark);
  }

  componentDidMount() {
    let reFocused;
    this.refreshOnFocusListener = this.props.navigation?.addListener(
      'focus',
      () => (reFocused ? this.refresh?.() : (reFocused = true))
    );
    let { discussionId } = this.props.route.params;
    Promise.all([
      getAllThreads(discussionId),
      getFollowedThreads(discussionId)
    ]).then(([all, followed]) => {
      this.all = all.results.map(r => r.id);
      this.followed = followed.results.map(r => r.id);
      this.followedResultsTotal = followed.total_results;
      this.allResultsTotal = all.total_results;
      batch(() => {
        this.props.setAllThreads(all.results);
        this.props.setFollowedThreads(followed.results);
        this.setState({ loading: false });
      });
    });
  }

  componentWillUnmount() {
    this.refreshOnFocusListener?.();
  }

  navigate = (route, params) =>
    connection(true) && this.props.navigation.navigate(route, params);

  renderFLHeader = () => {
    let { tab } = this.state;
    let { isDark, appColor } = this.props.route.params;
    return (
      <>
        <View style={styles.headerContainer}>
          {['All Threads', 'Followed Threads'].map((t, i) => (
            <TouchableOpacity
              key={t}
              onPress={() => this.setState({ tab: i }, this.refresh)}
              style={[
                styles.headerTOpacity,
                tab === i ? { borderColor: appColor } : {}
              ]}
            >
              <Text
                style={[
                  styles.headerText,
                  tab === i ? { color: isDark ? 'white' : 'black' } : {}
                ]}
              >
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Search isDark={isDark} />
      </>
    );
  };

  renderFLItem = ({ item: id }) => (
    <ThreadCard
      onNavigate={() => {
        this.navigate('Thread', {
          threadId: id,
          isDark: this.props.route.params.isDark,
          appColor: this.props.route.params.appColor,
          onDone: this.refresh
        });
      }}
      appColor={this.props.route.params.appColor}
      isDark={this.props.route.params.isDark}
      id={id}
      reduxKey={this.state.tab ? 'followed' : 'all'}
    />
  );

  changePage = page => {
    if (!connection()) return;
    let { tab } = this.state;
    let { discussionId } = this.props.route.params;
    let fORa = tab ? 'followed' : 'all';
    this[`${fORa}Page`] = page;
    this.setState({ [`${fORa}LoadingMore`]: true }, () =>
      (tab ? getFollowedThreads : getAllThreads)(discussionId, page).then(r => {
        this[fORa] = r.results.map(r => r.id);
        batch(() => {
          this.props[tab ? 'setFollowedThreads' : 'setAllThreads'](r.results);
          this.setState({ [`${fORa}LoadingMore`]: false }, () =>
            this.flatListRef.scrollToOffset({ offset: 0 })
          );
        });
      })
    );
  };

  refresh = () => {
    if (!connection()) return;
    let { tab } = this.state;
    let { discussionId } = this.props.route.params;
    let fORa = tab ? 'followed' : 'all';
    this.setState({ [`${fORa}Refreshing`]: true }, () =>
      (tab ? getFollowedThreads : getAllThreads)(
        discussionId,
        this[`${fORa}Page`]
      ).then(r => {
        this[fORa] = r.results.map(r => r.id);
        batch(() => {
          this.props[tab ? 'setFollowedThreads' : 'setAllThreads'](r.results);
          this.setState({ [`${fORa}Refreshing`]: false });
        });
      })
    );
  };

  render() {
    let {
      followedLoadingMore,
      allLoadingMore,
      tab,
      loading,
      createDiscussionHeight,
      allRefreshing,
      followedRefreshing
    } = this.state;
    let { isDark, appColor, discussionId } = this.props.route.params;
    return loading ? (
      <ActivityIndicator
        size='large'
        color={isDark ? 'white' : 'black'}
        animating={true}
        style={styles.loading}
      />
    ) : (
      <>
        <FlatList
          key={tab}
          windowSize={10}
          data={this[tab ? 'followed' : 'all']}
          style={styles.fList}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          onEndReachedThreshold={0.01}
          removeClippedSubviews={true}
          keyboardShouldPersistTaps='handled'
          renderItem={this.renderFLItem}
          ListHeaderComponent={this.renderFLHeader}
          keyExtractor={item => item.toString()}
          ref={r => (this.flatListRef = r)}
          ListEmptyComponent={
            <Text style={styles.emptyList}>
              {tab ? 'You are not following any threads.' : 'No threads.'}
            </Text>
          }
          ListFooterComponent={
            <View
              style={{
                borderTopWidth: 1,
                borderColor: '#445F74',
                marginHorizontal: 15,
                marginBottom: createDiscussionHeight
              }}
            >
              <Pagination
                active={this[`${tab ? 'followed' : 'all'}Page`]}
                isDark={isDark}
                appColor={appColor}
                length={this[`${tab ? 'followed' : 'all'}ResultsTotal`]}
                onChangePage={this.changePage}
              />
              {(followedLoadingMore || allLoadingMore) && (
                <ActivityIndicator
                  size='small'
                  color={isDark ? 'white' : 'black'}
                  animating={true}
                  style={{ padding: 15 }}
                />
              )}
            </View>
          }
          refreshControl={
            <RefreshControl
              colors={[isDark ? 'white' : 'black']}
              tintColor={isDark ? 'white' : 'black'}
              onRefresh={this.refresh}
              refreshing={tab ? followedRefreshing : allRefreshing}
            />
          }
        />
        <SafeAreaView style={styles.bottomTOpacitySafeArea}>
          <TouchableOpacity
            onLayout={({ nativeEvent: { layout } }) =>
              !this.state.createDiscussionHeight &&
              this.setState({ createDiscussionHeight: layout.height + 15 })
            }
            onPress={() =>
              this.navigate('CRUD', {
                isDark,
                appColor,
                action: 'create',
                type: 'thread',
                discussionId,
                onDone: this.refresh
              })
            }
            style={{ ...styles.bottomTOpacity, backgroundColor: appColor }}
          >
            {addThread({ height: 25, width: 25, fill: 'white' })}
          </TouchableOpacity>
        </SafeAreaView>
      </>
    );
  }
}
let setStyles = isDark =>
  StyleSheet.create({
    headerContainer: {
      paddingHorizontal: 15,
      flexDirection: 'row',
      backgroundColor: isDark ? '#00101D' : 'white',
      flexWrap: 'wrap'
    },
    headerTOpacity: {
      paddingVertical: 15,
      marginRight: 15,
      borderBottomWidth: 2,
      borderColor: isDark ? '#00101D' : 'white'
    },
    headerText: {
      fontFamily: 'OpenSans',
      fontSize: 20,
      fontWeight: '700',
      color: '#445F74'
    },
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
    bottomTOpacity: {
      padding: 15,
      margin: 15,
      borderRadius: 99
    },
    bottomTOpacitySafeArea: {
      position: 'absolute',
      bottom: 0,
      alignSelf: 'flex-end'
    }
  });
const mapDispatchToProps = dispatch =>
  bindActionCreators({ setAllThreads, setFollowedThreads }, dispatch);

export default connect(null, mapDispatchToProps)(Threads);
