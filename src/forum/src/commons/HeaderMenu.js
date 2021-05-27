/* 
Required fields:
    * appColor
    * id (message/post id)
    * onEdit
    * onDelete
*/
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-community/async-storage';

import {
  connection,
  followThread,
  unfollowThread,
  updateThread
} from '../services/forum.service';

import { moderate, lock, pin } from '../assets/svgs';

let styles;
export default class HeaderMenu extends React.Component {
  state = { showOptions: false };
  constructor(props) {
    super(props);
    styles = setStyles(props.isDark);
    const { locked, pinned, is_followed } = props;
    if (props.id !== undefined)
      Object.assign(this.state, { locked, pinned, is_followed });
  }

  componentDidMount() {
    this.props.setHeaderTitle?.(this.renderHeaderTitle());
    AsyncStorage.getItem('signShown').then(ss =>
      this.setState({ signShown: !ss })
    );
  }

  get options() {
    let options = {};
    let { locked, pinned, is_followed, signShown } = this.state;
    if (this.props.id !== undefined) {
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
      action: this.props.onForumRules
    };
    return options;
  }

  renderHeaderTitle = () => {
    let { title, isDark } = this.props;
    let { locked, pinned } = this.state;
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ marginRight: 5 }}>
          {!!locked && lock({ width: 10, fill: isDark ? 'white' : 'black' })}
        </View>
        <View style={{ marginRight: 5 }}>
          {!!pinned && pin({ width: 10, fill: isDark ? 'white' : 'black' })}
        </View>
        <Text style={styles.headerTitleText} numberOfLines={1}>
          {title}
        </Text>
      </View>
    );
  };

  toggleModal = () =>
    connection(true) &&
    this.setState(({ showOptions }) => ({ showOptions: !showOptions }));

  toggleSign = () =>
    this.setState(
      ({ signShown }) => ({ signShown: !signShown, showOptions: false }),
      () => {
        this.props.onToggleSign(this.state.signShown);
        AsyncStorage.setItem('signShown', this.state.signShown ? '' : '1');
      }
    );

  toggleLock = () =>
    connection(true) &&
    this.setState(
      ({ locked }) => ({ locked: !locked, showOptions: false }),
      () => {
        updateThread(this.props.id, { pinned: this.state.pinned });
        this.props.setHeaderTitle(this.renderHeaderTitle());
      }
    );

  togglePin = () =>
    connection(true) &&
    this.setState(
      ({ pinned }) => ({ pinned: !pinned, showOptions: false }),
      () => {
        updateThread(this.props.id, { locked: this.state.locked });
        this.props.setHeaderTitle(this.renderHeaderTitle());
      }
    );

  toggleFollow = () =>
    connection(true) &&
    this.setState(
      ({ is_followed }) => ({ is_followed: !is_followed, showOptions: false }),
      () =>
        this.state.is_followed
          ? followThread(this.props.id)
          : unfollowThread(this.props.id)
    );

  onEdit = () =>
    connection(true) &&
    this.setState(
      () => ({ showOptions: false }),
      () => this.props.onEdit()
    );

  render() {
    let { showOptions } = this.state;
    let { isDark } = this.props;
    return (
      <>
        <TouchableOpacity style={{ padding: 10 }} onPress={this.toggleModal}>
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
    );
  }
}
let setStyles = isDark =>
  StyleSheet.create({
    headerTitleText: {
      fontFamily: 'OpenSans-ExtraBold',
      fontSize: 20,
      color: isDark ? 'white' : 'black',
      paddingHorizontal: 20
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
