import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { coach, team, edge, lifetime } from '../assets/svgs';

export default class AccessLevelAvatar extends React.Component {
  get userBorderColor() {
    let borderColor, userTagIcon;
    let { appColor } = this.props;
    switch (this.props.accessLevelName) {
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
    let { uri, height, tagHeight } = this.props;
    let { borderColor, userTagIcon } = this.userBorderColor;
    return (
      <View style={{ ...styles.imgContainer, borderColor }}>
        <Image source={{ uri }} style={{ height, aspectRatio: 1 }} />
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
      </View>
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
