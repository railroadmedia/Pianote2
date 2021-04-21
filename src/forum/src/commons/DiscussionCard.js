import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import forumService from '../services/forum.service';

import { pin, coach, team, edge, lifetime } from '../assets/svgs';

let styles;
export default class DiscussionCard extends React.Component {
  constructor(props) {
    super(props);
    let { isDark } = props;
    DiscussionCard.contextType = forumService.NetworkContext;
    styles = setStyles(isDark);
  }

  get userBorderColor() {
    let borderColor, userTagIcon;
    switch (this.props.data.user.accessLevelName) {
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
      user,
      title,
      pinned,
      lastPost,
      topicName,
      repliesNo
    } = this.props.data;
    let { borderColor, userTagIcon } = this.userBorderColor;
    return (
      <View>
        <View
          style={{
            borderRadius: 99,
            overflow: 'hidden',
            borderWidth: 2,
            borderColor
          }}
        >
          <Image
            source={{ uri: user.avatarUrl }}
            style={{ height: 31, aspectRatio: 1 }}
          />
          <View
            style={{
              width: '100%',
              height: 5,
              backgroundColor: borderColor,
              position: 'absolute',
              bottom: 0,
              lineHeight: 5,
              alignItems: 'center'
            }}
          >
            {userTagIcon?.({ height: 5, fill: 'white' })}
          </View>
        </View>
      </View>
    );
  }
}
let setStyles = isDark => StyleSheet.create({});
