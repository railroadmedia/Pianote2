import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Modal } from 'react-native';

import { connect, batch } from 'react-redux';
import { bindActionCreators } from 'redux';

import AsyncStorage from '@react-native-community/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

import { updateThreads, toggleSignShown } from '../redux/ThreadActions';

import {
  connection,
  followThread,
  unfollowThread,
  updateThread
} from '../services/forum.service';

import { arrowLeft, lock, moderate, pin } from '../assets/svgs';

let styles;
class NavigationHeader extends React.Component {
  state = { showOptions: false };
  constructor(props) {
    super(props);
    let { isDark, appColor } = this.props.route.params;
    styles = setStyles(isDark, appColor);
  }

  componentDidMount() {
    AsyncStorage.getItem('signShown').then(
      ss => !!ss !== this.props.signShown && this.props.toggleSignShown()
    );
  }

  get options() {
    let options = {};
    if (this.props.route.name.match(/^(Thread)$/)) {
      let {
        signShown,
        thread: { locked, pinned, is_followed }
      } = this.props;
      options.toggleSign = {
        text: `${signShown ? 'Hide' : 'Show'} All Signatures`,
        action: this.toggleSign
      };
      options.toggleLock = {
        text: locked ? 'Unlock' : 'Lock',
        action: this.toggleLock
      };
      options.togglePin = {
        text: pinned ? 'Unpin' : 'Pin',
        action: this.togglePin
      };
      options.edit = { text: 'Edit', action: this.onEdit };
      options.toggleFollow = {
        text: `${is_followed ? 'Unfollow' : 'Follow'} Thread`,
        action: this.toggleFollow
      };
    }
    options.forumRules = {
      text: 'Forum Rules',
      action: () => this.navigate('Thread', { forumRules: true })
    };
    return options;
  }

  navigate = (route, params) =>
    connection(true) && this.props.navigation.navigate(route, params);

  toggleModal = () =>
    connection(true) &&
    this.setState(({ showOptions }) => ({ showOptions: !showOptions }));

  toggleSign = () =>
    batch(() => {
      this.props.toggleSignShown();
      this.setState({ showOptions: false });
    });

  toggleLock = () => {
    if (!connection(true)) return;
    let { thread } = this.props;
    updateThread(thread.id, { locked: !thread.locked });
    batch(() => {
      this.props.updateThreads({ ...thread, locked: !thread.locked });
      this.setState({ showOptions: false });
    });
  };

  togglePin = () => {
    if (!connection(true)) return;
    let { thread } = this.props;
    updateThread(thread.id, { pinned: !thread.pinned });
    batch(() => {
      this.props.updateThreads({ ...thread, pinned: !thread.pinned });
      this.setState({ showOptions: false });
    });
  };

  toggleFollow = () => {
    if (!connection(true)) return;
    let { thread } = this.props;
    (thread.is_followed ? unfollowThread : followThread)(thread.id);
    batch(() => {
      this.props.updateThreads({ ...thread, is_followed: !thread.is_followed });
      this.setState({ showOptions: false });
    });
  };

  onEdit = () => {
    if (connection(true)) {
      let { threadId, title } = this.props;
      this.setState(
        () => ({ showOptions: false }),
        () =>
          this.navigate('CRUD', {
            type: 'thread',
            action: 'edit',
            threadId,
            title
          })
      );
    }
  };

  render() {
    let {
      navigation,
      title,
      route: {
        name,
        params: { isDark }
      },
      thread: { locked, pinned } = {}
    } = this.props;
    let { showOptions } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.subContainer}>
          <View style={styles.titleContainer}>
            {!!locked && (
              <View style={{ marginRight: 5 }}>
                {lock({ width: 10, fill: isDark ? 'white' : 'black' })}
              </View>
            )}
            {!!pinned && (
              <View style={{ marginRight: 5 }}>
                {pin({ width: 10, fill: isDark ? 'white' : 'black' })}
              </View>
            )}
            <Text style={styles.titleText}>{title}</Text>
          </View>
          <TouchableOpacity
            style={{ paddingHorizontal: 15 }}
            onPress={navigation.goBack}
          >
            {arrowLeft({
              height: 20,
              fill: isDark ? 'white' : 'black'
            })}
          </TouchableOpacity>
          {name.match(/^(Discussions|Threads|Thread)$/) && (
            <>
              <TouchableOpacity
                style={{ padding: 15 }}
                onPress={this.toggleModal}
              >
                {moderate({ width: 20, fill: isDark ? 'white' : 'black' })}
              </TouchableOpacity>
              <Modal
                animationType={'slide'}
                onRequestClose={() => this.toggleModal()}
                supportedOrientations={['portrait', 'landscape']}
                transparent={true}
                visible={showOptions}
              >
                <TouchableOpacity
                  activeOpacity={1}
                  style={styles.optionsContainer}
                  onPress={this.toggleModal}
                >
                  <SafeAreaView style={styles.options}>
                    <View style={styles.pill} />
                    {Object.values(this.options).map(({ text, action }) => (
                      <TouchableOpacity key={text} onPress={action}>
                        <Text style={styles.optionText}>{text}</Text>
                      </TouchableOpacity>
                    ))}
                  </SafeAreaView>
                </TouchableOpacity>
              </Modal>
            </>
          )}
        </View>
      </SafeAreaView>
    );
  }
}
let setStyles = (isDark, appColor) =>
  StyleSheet.create({
    container: {
      backgroundColor: isDark ? '#00101d' : 'white',
      paddingVertical: 10
    },
    subContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      left: 50,
      right: 50
    },
    titleText: {
      fontFamily: 'OpenSans',
      fontSize: 20,
      fontWeight: '900',
      color: isDark ? 'white' : 'black',
      textAlign: 'center',
      textTransform: 'capitalize'
    },
    optionsContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0,0,0,.5)'
    },
    options: {
      backgroundColor: '#081825',
      padding: 20,
      borderTopEndRadius: 20,
      borderTopStartRadius: 20
    },
    pill: {
      width: '20%',
      height: 2,
      backgroundColor: 'white',
      borderRadius: 1,
      alignSelf: 'center'
    },
    optionText: {
      paddingVertical: 10,
      color: 'white',
      fontFamily: 'OpenSans'
    }
  });
const mapStateToProps = (
  { threads },
  {
    title,
    route: {
      name,
      params: { threadId }
    }
  }
) => {
  let thread;
  if (name.match(/^(Thread)$/))
    thread =
      threads?.discussions?.[threadId] ||
      threads?.all?.[threadId] ||
      threads?.followed?.[threadId] ||
      {};
  return {
    thread,
    signShown: name.match(/^(Thread)$/) ? threads.signShown : undefined,
    title: title || thread?.title
  };
};
const mapDispatchToProps = dispatch =>
  bindActionCreators({ updateThreads, toggleSignShown }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(NavigationHeader);
