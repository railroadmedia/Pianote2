import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import ThreadCard from '../commons/ThreadCard';

import {
  getFollowedThreads,
  getAllThreads,
  connection
} from '../services/forum.service';

import { addThread } from '../assets/svgs';
import Pagination from '../commons/Pagination';
import SearchInput from '../commons/SearchInput';

let styles;
export default class Threads extends React.Component {
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
    let { discussionId } = this.props.route.params;
    Promise.all([
      getAllThreads(discussionId),
      getFollowedThreads(discussionId)
    ]).then(([all, followed]) => {
      console.log(all, followed);
      this.all = all.results;
      this.followed = followed.results;
      this.followedResultsTotal = followed.total_results;
      this.allResultsTotal = all.total_results;
      this.setState({ loading: false });
    });
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
              onPress={() => this.setState({ tab: i })}
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
        <SearchInput isDark={isDark} onSearch={s => console.log(s)} />
      </>
    );
  };

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

  changePage = page => {
    if (!connection()) return;
    let { tab } = this.state;
    let { discussionId } = this.props.route.params;
    let fORa = tab ? 'followed' : 'all';
    this[`${fORa}Page`] = page;
    this.setState({ [`${fORa}LoadingMore`]: true }, () =>
      (tab ? getFollowedThreads : getAllThreads)(discussionId, page).then(r => {
        this[fORa] = r.results;
        this.setState({ [`${fORa}LoadingMore`]: false }, () =>
          this.flatListRef.scrollToOffset({ offset: 0 })
        );
      })
    );
  };

  refresh = () => {
    if (!connection()) return;
    let { tab } = this.state;
    let { discussionId } = this.props.route.params;
    let fORa = tab ? 'followed' : 'all';
    this.setState({ [`${fORa}Refreshing`]: true }, () =>
      (tab ? getFollowedThreads : getAllThreads)(discussionId).then(r => {
        this[fORa] = r;
        this.setState({ [`${fORa}Refreshing`]: false });
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
    let { isDark, appColor } = this.props.route.params;
    return loading ? (
      <ActivityIndicator
        size='large'
        color={isDark ? 'white' : 'black'}
        animating={true}
        style={styles.loading}
      />
    ) : (
      <View style={{ flex: 1 }}>
        <FlatList
          key={tab}
          windowSize={10}
          data={this[tab ? 'followed' : 'all']}
          style={styles.fList}
          initialNumToRender={1}
          maxToRenderPerBatch={10}
          onEndReachedThreshold={0.01}
          removeClippedSubviews={true}
          keyboardShouldPersistTaps='handled'
          renderItem={this.renderFLItem}
          ListHeaderComponent={this.renderFLHeader}
          keyExtractor={item => item.id.toString()}
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
        <View
          onLayout={({ nativeEvent: { layout } }) =>
            this.setState({ createDiscussionHeight: layout.height + 15 })
          }
          onPress={() =>
            this.props.navigation.navigate('CRUD', {
              isDark,
              appColor
            })
          }
          style={{ ...styles.bottomTOpacity, backgroundColor: appColor }}
        >
          {addThread({ height: 25, width: 25, fill: 'white' })}
        </View>
      </View>
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
      position: 'absolute',
      borderRadius: 99,
      bottom: 15,
      right: 15
    }
  });
