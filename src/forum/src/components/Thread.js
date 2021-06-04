import React from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { connect, batch } from 'react-redux';
import { bindActionCreators } from 'redux';

import Pagination from '../commons/Pagination';
import Post from '../commons/Post';
import UserInfo from '../components/UserInfo.js';
import { connection, getThread } from '../services/forum.service';
import { post, multiQuote } from '../assets/svgs';

import { setPosts } from '../redux/ThreadActions';

let styles;
class Thread extends React.Component {
  page = 1;
  state = {
    loading: true,
    postHeight: 0,
    loadingMore: false,
    refreshing: false,
    multiQuoting: false,
    showUserInfo: false
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
    const { threadId } = this.props.route.params;
    getThread(threadId).then(thread => {
      this.post_count = thread.post_count;
      this.posts = thread.posts.map(p => p.id);
      batch(() => {
        this.props.setPosts(thread.posts);
        this.setState({ loading: false });
      });
    });
  }

  componentWillUnmount() {
    this.refreshOnFocusListener?.();
  }

  navigate = (route, params) =>
    connection(true) && this.props.navigation.navigate(route, params);

  renderFLItem = ({ item: id, index }) => {
    let { isDark, appColor, loggesInUserId } = this.props.route.params;
    return (
      <Post
        loggesInUserId={loggesInUserId}
        id={id}
        index={index + 1 + 10 * (this.page - 1)}
        appColor={appColor}
        isDark={isDark}
        onMultiQuote={() =>
          this.setState({ multiQuoting: !!Post.multiQuotes.length })
        }
      />
    );
  };

  renderPagination = (marginBottom, borderTopWidth, borderBottomWidth) => {
    let { isDark, appColor } = this.props.route.params;
    return (
      <View
        style={{
          borderTopWidth,
          borderBottomWidth,
          borderColor: '#445F74',
          marginHorizontal: 15,
          marginBottom
        }}
      >
        <Pagination
          key={this.page}
          active={this.page}
          isDark={isDark}
          appColor={appColor}
          length={this.post_count}
          onChangePage={this.changePage}
        />
        {this.state.loadingMore && (
          <ActivityIndicator
            size='small'
            color={isDark ? 'white' : 'black'}
            animating={true}
            style={{ padding: 15 }}
          />
        )}
      </View>
    );
  };

  refresh = () => {
    if (!connection()) return;
    let { threadId } = this.props.route.params;
    this.setState({ refreshing: true }, () =>
      getThread(threadId, this.page).then(thread => {
        this.post_count = thread.post_count;
        this.posts = thread.posts.map(p => p.id);
        batch(() => {
          this.props.setPosts(thread.posts);
          this.setState({ refreshing: false });
        });
      })
    );
  };

  changePage = page => {
    if (!connection()) return;
    let { threadId } = this.props.route.params;
    this.setState({ loadingMore: true }, () =>
      getThread(threadId, page).then(thread => {
        this.page = page;
        this.post_count = thread.post_count;
        this.posts = thread.posts.map(p => p.id);
        batch(() => {
          this.props.setPosts(thread.posts);
          this.setState({ loadingMore: false }, () =>
            this.flatListRef.scrollToOffset({ offset: 0 })
          );
        });
      })
    );
  };

  render() {
    let { loading, refreshing, postHeight, multiQuoting } = this.state;
    let { isDark, appColor, threadId } = this.props.route.params;
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
          windowSize={10}
          data={this.posts}
          style={styles.fList}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          onEndReachedThreshold={0.01}
          removeClippedSubviews={false}
          keyboardShouldPersistTaps='handled'
          renderItem={this.renderFLItem}
          ListHeaderComponent={this.renderPagination(20, 0, 1)}
          keyExtractor={id => id.toString()}
          ref={r => (this.flatListRef = r)}
          ListEmptyComponent={
            <Text style={styles.emptyList}>{'No posts.'}</Text>
          }
          ListFooterComponent={this.renderPagination(postHeight, 1, 0)}
          refreshControl={
            <RefreshControl
              colors={[isDark ? 'white' : 'black']}
              tintColor={isDark ? 'white' : 'black'}
              onRefresh={this.refresh}
              refreshing={refreshing}
            />
          }
        />
        <SafeAreaView style={styles.bottomTOpacitySafeArea}>
          <TouchableOpacity
            onLayout={({ nativeEvent: { layout } }) =>
              !this.state.postHeight &&
              this.setState({ postHeight: layout.height + 15 })
            }
            onPress={() =>
              this.navigate('CRUD', {
                type: 'post',
                action: 'create',
                threadId,
                quotes: Post.multiQuotes
              })
            }
            style={{ ...styles.bottomTOpacity, backgroundColor: appColor }}
          >
            {(multiQuoting ? multiQuote : post)({
              height: 25,
              width: 25,
              fill: 'white'
            })}
            {multiQuoting && (
              <View style={styles.multiQuoteBadge}>
                <Text style={{ color: appColor, fontSize: 10 }}>
                  +{Post.multiQuotes.length}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          <UserInfo
            isVisible={this.state.showUserInfo}
            hideUserInfo={() =>
              this.setState({ showUserInfo: !this.state.showUserInfo })
            }
            isDark={true}
            appName={'PIANOTE'}
            appColor={colors.pianoteRed}
            threadId={1674}
          />
        </SafeAreaView>
      </>
    );
  }
}

let setStyles = isDark =>
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
    bottomTOpacity: {
      padding: 15,
      margin: 15,
      borderRadius: 99
    },
    bottomTOpacitySafeArea: {
      position: 'absolute',
      bottom: 0,
      alignSelf: 'flex-end'
    },
    multiQuoteBadge: {
      aspectRatio: 1,
      backgroundColor: 'white',
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 99,
      position: 'absolute',
      padding: 4,
      bottom: 0
    }
  });

const mapDispatchToProps = dispatch =>
  bindActionCreators({ setPosts }, dispatch);

export default connect(null, mapDispatchToProps)(Thread);
