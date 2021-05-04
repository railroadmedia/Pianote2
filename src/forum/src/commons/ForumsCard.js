import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import AccessLevelAvatar from './AccessLevelAvatar';

import { pin, arrowRight, post } from '../assets/svgs';

let styles;
export default class ForumsCard extends React.Component {
  constructor(props) {
    super(props);
    let { isDark } = props;
    styles = setStyles(isDark);
  }

  get lastPostTime() {
    let dif = new Date() - new Date(this.props.data.lastPost.date);
    if (dif < 120 * 1000) return `1 Minute Ago`;
    if (dif < 60 * 1000 * 60)
      return `${(dif / 1000 / 60).toFixed()} Minutes Ago`;
    if (dif < 60 * 1000 * 60 * 2) return `1 Hour Ago`;
    if (dif < 60 * 1000 * 60 * 24)
      return `${(dif / 1000 / 60 / 60).toFixed()} Hours Ago`;
    if (dif < 60 * 1000 * 60 * 48) return `1 Day Ago`;
    if (dif < 60 * 1000 * 60 * 24 * 30)
      return `${(dif / 1000 / 60 / 60 / 24).toFixed()} Days Ago`;
    if (dif < 60 * 1000 * 60 * 24 * 60) return `1 Month Ago`;
    if (dif < 60 * 1000 * 60 * 24 * 30 * 12)
      return `${(dif / 1000 / 60 / 60 / 24 / 30).toFixed()} Months Ago`;
    if (dif < 60 * 1000 * 60 * 24 * 365 * 2) return `1 Year Ago`;
    return `${(dif / 1000 / 60 / 60 / 24 / 365).toFixed()} Years Ago`;
  }

  render() {
    let {
      appColor,
      isDark,
      data: {
        user,
        title,
        pinned,
        lastPost,
        postsNo,
        topicName,
        repliesNo,
        image
      }
    } = this.props;
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={this.props.onNavigate}
      >
        <AccessLevelAvatar
          uri={image || user.avatarUrl}
          height={60}
          appColor={appColor}
          tagHeight={8}
          accessLevelName={user.accessLevelName}
        />
        <View style={{ paddingHorizontal: 10, flex: 1 }}>
          <Text style={styles.title}>
            {pinned && pin({ width: 10, fill: isDark ? 'white' : 'black' })}
            {pinned && ' '}
            {title}
          </Text>
          <Text style={styles.lastPost}>
            Last Post{' '}
            <Text style={{ fontWeight: '900' }}>{this.lastPostTime}</Text> By{' '}
            <Text style={{ fontWeight: '900' }}>{lastPost.user.name}</Text>
          </Text>
          <Text style={styles.topicName}>
            {repliesNo
              ? `${topicName} - ${repliesNo} Replies`
              : post({ height: 10, fill: '#445F74' })}
            {!repliesNo && ` ${postsNo} Posts`}
          </Text>
        </View>
        {arrowRight({ height: 10, fill: isDark ? 'white' : 'black' })}
      </TouchableOpacity>
    );
  }
}
let setStyles = isDark =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: isDark ? '#081825' : 'white',
      alignItems: 'center',
      padding: 10,
      margin: 15,
      marginBottom: 0,
      borderRadius: 5,
      elevation: 5,
      shadowColor: 'black',
      shadowOffset: { width: 3, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 4
    },
    title: {
      fontFamily: 'OpenSans',
      color: isDark ? 'white' : 'black',
      fontSize: 20,
      fontWeight: '900'
    },
    lastPost: {
      fontFamily: 'OpenSans',
      fontWeight: '100',
      color: '#445F74',
      fontSize: 14,
      fontStyle: 'italic',
      paddingVertical: 5
    },
    topicName: {
      fontFamily: 'OpenSans',
      color: '#445F74',
      fontSize: 14,
      fontWeight: '100'
    }
  });
