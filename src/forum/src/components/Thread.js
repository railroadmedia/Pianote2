import React from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  Modal,
  TextInput
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
    refreshing: false,
    showMenu: false,
    menuIndex: -1,
    showReportModal: false
  };

  constructor(props) {
    super(props);
    let { isDark, appColor } = props.route.params;
    styles = setStyles(isDark, appColor);
  }

  componentDidMount() {
    const { threadId } = this.props.route.params;
    getThread(threadId).then(thread => {
      this.thread = thread;
      this.setState({ loading: false });
    });
  }

  navigate = (route, params) =>
    connection(true) && this.props.navigation.navigate(route, params);

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

  renderMenu = post => (
    <View style={styles.menuContainer}>
      <View style={styles.menu}>
        <TouchableOpacity
          style={styles.menuItemBtn}
          onPress={() => {
            this.setState({
              showReportModal: true,
              showMenu: false,
              menuIndex: -1
            });
          }}
        >
          <Text style={[styles.menuItem, styles.borderRight]}>Report</Text>
        </TouchableOpacity>
        {this.props.route.params.loggesInUserId === post.author_id && (
          <TouchableOpacity
            style={styles.menuItemBtn}
            onPress={this.props.onEdit}
          >
            <Text style={[styles.menuItem, styles.borderRight]}>Edit</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.menuItemBtn}
          onPress={this.props.onMultiQuote}
        >
          <Text style={styles.menuItem}>MultiQuote</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.triangle} />
    </View>
  );

  renderFLItem = ({ item, index }) => {
    let { isDark, appColor, loggesInUserId } = this.props.route.params;
    return (
      <View
        style={[
          this.state.showMenu && this.state.menuIndex === index
            ? { backgroundColor: '#002039' }
            : { backgroundColor: '#081825' }
        ]}
      >
        <View
          style={{ height: 35, backgroundColor: isDark ? '#00101D' : 'white' }}
        ></View>
        {this.state.showMenu &&
          this.state.menuIndex === index &&
          this.renderMenu(item, index)}
        <Post
          loggesInUserId={loggesInUserId}
          post={item}
          index={index + 1 + 10 * (this.page - 1)}
          appColor={appColor}
          isDark={isDark}
          onDelete={() => {}}
          onReplies={() => {}}
          onShowMenu={() => {
            this.setState(state => ({
              showMenu: index === state.menuIndex ? false : true,
              menuIndex: index === state.menuIndex ? -1 : index
            }));
          }}
        />
        {this.state.showReportModal && this.renderReportModal()}
      </View>
    );
  };

  renderReportModal = () => (
    <Modal
      visible={this.state.showReportModal}
      transparent={true}
      animationType={'slide'}
      onRequestClose={() => this.setState({ showReportModal: false })}
      supportedOrientations={['portrait', 'landscape']}
      style={styles.modalContainer}
    >
      <TouchableOpacity
        style={styles.modalContainer}
        onPress={() => this.setState({ showReportModal: false })}
      >
        <View style={styles.innerModal}>
          <Text style={styles.modalTitle}>Report Post</Text>
          <Text style={styles.modalText}>
            What's the reason you're reporting this post?
          </Text>
          <TextInput
            style={styles.titleInput}
            placeholderTextColor={isDark ? '#445F74' : '#00101D'}
            placeholder='Report'
            onChangeText={text => (this.text = text)}
          />
          <View style={styles.btnsContainer}>
            <TouchableOpacity
              style={styles.modalBtn}
              onPress={() => this.setState({ showReportModal: false })}
            >
              <Text style={styles.modalBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1 }}>
              <Text style={styles.modalBtnText}>Ok</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );

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
        onPress={() => this.setState({ showMenu: false, menuIndex: -1 })}
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
      </TouchableOpacity>
    );
  }
}
let setStyles = (isDark, appColor) =>
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
    },
    menuContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDark ? '#00101D' : '#F7F9FC',
      position: 'absolute',
      top: 0,
      alignSelf: 'center',
      zIndex: 50
    },
    triangle: {
      width: 0,
      height: 0,
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderTopWidth: 10,
      borderRightWidth: 5,
      borderBottomWidth: 0,
      borderLeftWidth: 5,
      borderTopColor: appColor,
      borderRightColor: 'transparent',
      borderBottomColor: 'transparent',
      borderLeftColor: 'transparent'
    },
    menu: {
      backgroundColor: appColor,
      flexDirection: 'row'
    },
    menuItemBtn: {
      width: 70
    },
    menuItem: {
      color: '#FFFFFF',
      fontFamily: 'OpenSans',
      fontSize: 10,
      flex: 1,
      paddingVertical: 5,
      textAlign: 'center'
    },
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,.3)',
      alignItems: 'center',
      justifyContent: 'center'
    },
    borderRight: {
      borderRightColor: '#00101D',
      borderRightWidth: 1
    },
    titleInput: {
      marginVertical: 10,
      backgroundColor: isDark ? '#000000' : '#FFFFFF',
      borderRadius: 5,
      color: isDark ? '#FFFFFF' : '#000000',
      height: 35
    },
    innerModal: {
      backgroundColor: isDark ? '#002039' : '#E1E6EB',
      padding: 15,
      paddingBottom: 0,
      borderRadius: 10
    },
    modalTitle: {
      fontFamily: 'OpenSans-Bold',
      fontSize: 14,
      color: isDark ? '#FFFFFF' : '#000000',
      alignSelf: 'center',
      textAlign: 'center',
      padding: 5
    },
    modalText: {
      fontFamily: 'OpenSans',
      fontSize: 12,
      color: isDark ? '#FFFFFF' : '#000000',
      alignSelf: 'center',
      textAlign: 'center',
      padding: 5
    },
    btnsContainer: {
      flexDirection: 'row',
      borderTopWidth: 1,
      borderTopColor: '#00101D'
    },
    modalBtnText: {
      fontFamily: 'OpenSans',
      fontSize: 12,
      color: isDark ? '#FFFFFF' : '#000000',
      textAlign: 'center',
      paddingVertical: 10
    },
    modalBtn: {
      flex: 1,
      borderRightColor: '#00101D',
      borderRightWidth: 1
    }
  });
