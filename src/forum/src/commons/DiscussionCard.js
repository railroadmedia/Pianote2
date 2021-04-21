import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

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

  get lastPostTime() {
    let dif = new Date() - this.props.data.lastPost.date;
    if (dif < 120 * 1000) return `1 Minute Ago`;
    if (dif < 60 * 1000 * 60)
      return `${(dif / 1000 / 60).toFixed()} Minutes Ago`;
    if (dif < 60 * 1000 * 60 * 2) return `1 Hour Ago`;
    if (dif < 60 * 1000 * 60 * 24)
      return `${(dif / 1000 / 60 / 60).toFixed()} Hours Ago`;
    if (dif < 60 * 1000 * 60 * 48) return `1 Day Ago`;
    return `${(dif / 1000 / 60 / 60 / 24).toFixed()} Days Ago`;
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
      <View style={{ flexDirection: 'row' }}>
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
        <Text>
          {title}
          {'\n'}
          <Text>{this.lastPostTime}</Text>
        </Text>
      </View>
    );
  }
}
let setStyles = isDark => StyleSheet.create({});
