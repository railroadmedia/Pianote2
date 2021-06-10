import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { coach, team, edge, lifetime } from '../assets/svgs';
import UserInfo from '../components/UserInfo';

export default class AccessLevelAvatar extends React.Component {
  state = {
    showUserInfo: false
  };

  get userBorderColor() {
    let borderColor, userTagIcon;
    let { appColor, author } = this.props;
    switch (author.access_level) {
      case 'edge': {
        borderColor = appColor;
        userTagIcon = edge;
        break;
      }
      case 'team': {
        borderColor = 'black';
        userTagIcon = team;
        break;
      }
      case 'piano': {
        borderColor = appColor;
        break;
      }
      case 'lifetime': {
        borderColor = '#07B3FF';
        userTagIcon = lifetime;
        break;
      }
      case 'coach': {
        borderColor = '#FAA300';
        userTagIcon = coach;
        break;
      }
    }
    return { borderColor, userTagIcon };
  }

  render() {
    let {
      author,
      height,
      tagHeight,
      showUserInfo,
      isDark,
      appColor
    } = this.props;
    let { borderColor, userTagIcon } = this.userBorderColor;
    return (
      <>
        <TouchableOpacity
          style={{ ...styles.imgContainer, borderColor }}
          onPress={() => showUserInfo && this.setState({ showUserInfo: true })}
        >
          <Image
            source={{
              uri: `https://cdn.musora.com/image/fetch/w_100,fl_lossy,q_auto:eco,c_fill,g_face/${author.avatar_url}`
            }}
            style={{ height, aspectRatio: 1 }}
          />
          <View
            style={{
              ...styles.userTagContainer,
              backgroundColor: borderColor,
              height: tagHeight + 2,
              lineHeight: tagHeight + 2
            }}
          >
            {userTagIcon?.({ height: tagHeight, fill: 'white' })}
          </View>
        </TouchableOpacity>
        <UserInfo
          isVisible={this.state.showUserInfo}
          hideUserInfo={() => this.setState({ showUserInfo: false })}
          author={author}
          isDark={isDark}
          appColor={appColor}
        />
      </>
    );
  }
}
let styles = StyleSheet.create({
  imgContainer: {
    borderRadius: 99,
    overflow: 'hidden',
    borderWidth: 2
  },
  userTagContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
