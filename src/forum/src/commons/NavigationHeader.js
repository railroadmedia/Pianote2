import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Modal } from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  connection,
  followThread,
  unfollowThread,
  updateThread
} from '../services/forum.service';

import { arrowLeft, lock, moderate, pin } from '../assets/svgs';

let styles;
export default class NavigationHeader extends React.Component {
  state = { showOptions: false };
  constructor(props) {
    super(props);
    let {
      name,
      params: { isDark, appColor, locked, pinned, is_followed }
    } = this.props.route;
    if (name.match(/^(Thread)$/))
      Object.assign(this.state, { locked, pinned, is_followed });
    styles = setStyles(isDark, appColor);
  }

  componentDidMount() {
    AsyncStorage.getItem('signShown').then(ss =>
      this.setState({ signShown: !ss })
    );
  }

  get options() {
    let options = {};
    if (this.props.route.name === 'Thread') {
      let { locked, pinned, is_followed, signShown } = this.state;
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
    this.setState(
      ({ signShown }) => ({ signShown: !signShown, showOptions: false }),
      () => {
        this.props.onToggleSign?.(this.state.signShown);
        AsyncStorage.setItem('signShown', this.state.signShown ? '' : '1');
      }
    );

  toggleLock = () =>
    connection(true) &&
    this.setState(
      ({ locked }) => ({ locked: !locked, showOptions: false }),
      () =>
        updateThread(this.props.route.params.id, { pinned: this.state.pinned })
    );

  togglePin = () =>
    connection(true) &&
    this.setState(
      ({ pinned }) => ({ pinned: !pinned, showOptions: false }),
      () =>
        updateThread(this.props.route.params.id, { locked: this.state.locked })
    );

  toggleFollow = () =>
    connection(true) &&
    this.setState(
      ({ is_followed }) => ({ is_followed: !is_followed, showOptions: false }),
      () =>
        (this.state.is_followed ? followThread : unfollowThread)(
          this.props.route.params.id
        )
    );

  onEdit = () => {
    if (connection(true)) {
      let { threadId, title } = this.props.route.params;
      this.setState(
        () => ({ showOptions: false }),
        () =>
          this.navigate('CRUD', {
            type: 'thread',
            action: 'edit',
            threadId,
            title,
            onDone: () => {}
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
      }
    } = this.props;
    let { showOptions, locked, pinned } = this.state;
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
