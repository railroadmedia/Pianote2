import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import AccessLevelAvatar from './AccessLevelAvatar';

import { pin, arrowRight, post } from '../assets/svgs';

let styles;
export default class ThreadCard extends React.Component {
  constructor(props) {
    super(props);
    let { isDark } = props;
    styles = setStyles(isDark);
  }

  render() {
    let {
      appColor,
      isDark,
      data: {
        author_avatar_url,
        author_access_level,
        title,
        pinned,
        post_count,
        published_on_formatted,
        author_display_name,
        latest_post
      }
    } = this.props;
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={this.props.onNavigate}
      >
        <AccessLevelAvatar
          uri={author_avatar_url}
          height={60}
          appColor={appColor}
          tagHeight={8}
          accessLevelName={author_access_level}
        />
        <View style={{ paddingHorizontal: 10, flex: 1 }}>
          <Text style={styles.title}>
            {!!pinned && (
              <>{pin({ width: 10, fill: isDark ? 'white' : 'black' })} </>
            )}
            {title}
          </Text>
          <Text style={styles.lastPost}>
            Started On{' '}
            <Text style={{ fontWeight: '700' }}>{published_on_formatted}</Text>{' '}
            By <Text style={{ fontWeight: '700' }}>{author_display_name}</Text>
          </Text>
          <Text style={styles.topicName}>
            {`${post_count} Replies`} · {latest_post.created_at_diff} · By{' '}
            {latest_post.author_display_name}
          </Text>
        </View>
        {arrowRight({ height: 15, fill: isDark ? 'white' : 'black' })}
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
      marginBottom: 15,
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
      fontWeight: '700'
    },
    lastPost: {
      fontFamily: 'OpenSans',
      fontWeight: '100',
      color: '#445F74',
      fontSize: 14,
      paddingVertical: 5
    },
    topicName: {
      fontFamily: 'OpenSans',
      color: '#445F74',
      fontSize: 14,
      fontWeight: '100'
    }
  });
