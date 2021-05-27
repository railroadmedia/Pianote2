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

import AsyncStorage from '@react-native-community/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

import HeaderMenu from '../commons/HeaderMenu';
import Pagination from '../commons/Pagination';
import Post, { closeMenu } from '../commons/Post';

import { connection, getThread } from '../services/forum.service';

import { post } from '../assets/svgs';

let styles;
export default class Thread extends React.Component {
  page = 1;
  thread = {};
  state = {
    loading: true,
    signShown: true,
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
    Promise.all([getThread(threadId), AsyncStorage.getItem('signShown')]).then(
      ([thread, signShown]) => {
        this.thread = thread;
        this.setHeader({ ...this.props.route.params, ...thread });
        this.setState({ loading: false, signShown: !!signShown });
      }
    );
  }

  navigate = (route, params) =>
    connection(true) && this.props.navigation.navigate(route, params);

  setHeader = params => {
    let { navigation } = this.props;
    navigation.setOptions({
      headerRight: () => (
        <HeaderMenu
          title={params.title}
          isDark={params.isDark}
          locked={params.locked}
          pinned={params.pinned}
          is_followed={params.is_followed}
          id={params.id}
          onEdit={() =>
            navigate('CRUD', {
              type: 'thread',
              action: 'edit',
              threadId: params.threadId,
              title: params.title,
              onDone: params.onDone
            })
          }
          onForumRules={() => navigate('Thread', { forumRules: true })}
          setHeaderTitle={headerTitle => navigation.setOptions({ headerTitle })}
          onToggleSign={signShown => this.setState({ signShown })}
        />
      )
    });
  };

  renderFLHeader = () => {
    let { isDark, appColor } = this.props.route.params;
    let { loadingMore } = this.state;
    return (
      <View
        style={{
          borderBottomWidth: 1,
          borderColor: '#445F74',
          marginHorizontal: 15,
          marginBottom: 20
        }}
      >
        <Pagination
          active={this.page}
          isDark={isDark}
          appColor={appColor}
          length={this.thread.post_count}
          onChangePage={this.changePage}
        />
        {loadingMore && (
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

  renderFLItem = ({ item, index }) => {
    let { isDark, appColor } = this.props.route.params;
    return (
      <Post
        signShown={this.state.signShown}
        post={item}
        index={index + 1 + 10 * (this.page - 1)}
        appColor={appColor}
        isDark={isDark}
        onEdit={() => navigate('CRUD')}
        onDelete={() => {}}
        onReplies={() => {}}
      />
    );
  };

  renderFLFooter = () => {
    let { isDark, appColor } = this.props.route.params;
    let { createPostHeight, loadingMore } = this.state;
    return (
      <View
        style={{
          borderTopWidth: 1,
          borderColor: '#445F74',
          marginHorizontal: 15,
          marginBottom: createPostHeight
        }}
      >
        <Pagination
          active={this.page}
          isDark={isDark}
          appColor={appColor}
          length={this.thread.post_count}
          onChangePage={this.changePage}
        />
        {loadingMore && (
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
    let { loading, refreshing } = this.state;
    let { isDark, appColor, threadId } = this.props.route.params;
    return loading ? (
      <ActivityIndicator
        size='large'
        color={isDark ? 'white' : 'black'}
        animating={true}
        style={styles.loading}
      />
    ) : (
      <TouchableOpacity
        activeOpacity={1}
        style={{ flex: 1 }}
        onPress={closeMenu}
      >
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
          ListHeaderComponent={this.renderFLHeader}
          keyExtractor={item => item.id.toString()}
          ref={r => (this.flatListRef = r)}
          ListEmptyComponent={
            <Text style={styles.emptyList}>{'No posts.'}</Text>
          }
          ListFooterComponent={this.renderFLFooter}
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
              this.setState({ createPostHeight: layout.height + 15 })
            }
            onPress={() =>
              this.navigate('CRUD', {
                isDark,
                appColor,
                action: 'create',
                type: 'post',
                threadId,
                onDone: this.refresh
              })
            }
            style={{ ...styles.bottomTOpacity, backgroundColor: appColor }}
          >
            {post({ height: 25, width: 25, fill: 'white' })}
          </TouchableOpacity>
        </SafeAreaView>
      </TouchableOpacity>
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
