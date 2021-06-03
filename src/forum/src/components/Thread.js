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

import Pagination from '../commons/Pagination';
import Post from '../commons/Post';

import { connection, getThread } from '../services/forum.service';

import { post } from '../assets/svgs';

let styles;
export default class Thread extends React.Component {
  page = 1;
  thread = {};
  state = {
    loading: true,
    createPostHeight: 0,
    loadingMore: false,
    refreshing: false
  };

  constructor(props) {
    super(props);
    let { isDark, appColor } = props.route.params;
    styles = setStyles(isDark, appColor);
  }

  componentDidMount() {
    const { threadId } = this.props.route.params;
    getThread(threadId).then(thread => {
      console.log(thread);
      this.thread = thread;
      this.setState({ loading: false });
    });
  }

  navigate = (route, params) =>
    connection(true) && this.props.navigation.navigate(route, params);

  renderFLItem = ({ item, index }) => {
    let { isDark, appColor, loggesInUserId } = this.props.route.params;
    return (
      <Post
        loggesInUserId={loggesInUserId}
        post={item}
        index={index + 1 + 10 * (this.page - 1)}
        appColor={appColor}
        isDark={isDark}
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
          length={this.thread.post_count}
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
        this.thread = thread;
        this.setState({ refreshing: false });
      })
    );
  };

  changePage = page => {
    if (!connection()) return;
    let { threadId } = this.props.route.params;
    this.setState({ loadingMore: true }, () =>
      getThread(threadId, page).then(thread => {
        this.page = page;
        this.thread = thread;
        this.setState({ loadingMore: false }, () =>
          this.flatListRef.scrollToOffset({ offset: 0 })
        );
      })
    );
  };

  render() {
    let { loading, refreshing, createPostHeight } = this.state;
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
          data={this.thread.posts}
          style={styles.fList}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          onEndReachedThreshold={0.01}
          removeClippedSubviews={false}
          keyboardShouldPersistTaps='handled'
          renderItem={this.renderFLItem}
          ListHeaderComponent={this.renderPagination(20, 0, 1)}
          keyExtractor={item => item.id.toString()}
          ref={r => (this.flatListRef = r)}
          ListEmptyComponent={
            <Text style={styles.emptyList}>{'No posts.'}</Text>
          }
          ListFooterComponent={this.renderPagination(createPostHeight, 1, 0)}
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
              !this.state.createPostHeight &&
              this.setState({ createPostHeight: layout.height + 15 })
            }
            onPress={() =>
              this.navigate('CRUD', {
                isDark,
                appColor,
                action: 'create',
                type: 'post',
                threadId
              })
            }
            style={{ ...styles.bottomTOpacity, backgroundColor: appColor }}
          >
            {post({ height: 25, width: 25, fill: 'white' })}
          </TouchableOpacity>
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
    }
  });
