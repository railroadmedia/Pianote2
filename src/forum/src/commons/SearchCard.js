import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import AccessLevelAvatar from './AccessLevelAvatar';
import HTMLRenderer from './HTMLRenderer';

import { arrowRight } from '../assets/svgs';

let styles;

export default class SearchCard extends React.Component {
  constructor(props) {
    super(props);
    let { isDark } = props;
    styles = setStyles(isDark);
  }

  render() {
    const {
      item: {
        content,
        thread: {
          author_avatar_url,
          author_access_level,
          author_display_name,
          title,
          published_on_formatted,
          post_count,
          latest_post,
          category
        }
      },
      isDark,
      appColor,
      onNavigate
    } = this.props;

    return (
      <TouchableOpacity style={styles.container} onPress={onNavigate}>
        <View style={styles.centerWithSpacing}>
          <View style={styles.center}>
            <AccessLevelAvatar
              author={{
                avatar_url: author_avatar_url,
                access_level: author_access_level
              }}
              height={45}
              appColor={appColor}
              isDark={isDark}
              tagHeight={4}
            />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.text}>
                Started on {published_on_formatted} by {author_display_name}
              </Text>
            </View>
          </View>
          <Text style={styles.text}>{post_count} Replies</Text>
        </View>
        <View style={styles.centerWithSpacing}>
          <Text style={styles.content}>
            {content.replace(/<[^>]*>?/gm, '').slice(0, 200) + ' ...'}
          </Text>

          {arrowRight({ height: 15, fill: isDark ? 'white' : 'black' })}
        </View>
        <Text style={styles.text}>
          Replied {latest_post.created_at_diff} by{' '}
          {latest_post.author_display_name} - {category}
        </Text>
      </TouchableOpacity>
    );
  }
}

let setStyles = isDark =>
  StyleSheet.create({
    container: {
      backgroundColor: isDark ? '#081825' : 'white',
      padding: 10,
      marginBottom: 15
    },
    title: {
      fontFamily: 'OpenSans',
      color: isDark ? 'white' : 'black',
      fontSize: 20,
      fontWeight: '700'
    },
    text: {
      fontFamily: 'OpenSans',
      fontWeight: '100',
      color: '#445F74',
      fontSize: 14,
      paddingVertical: 5
    },
    centerWithSpacing: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      flex: 1
    },
    center: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center'
    },
    content: {
      color: isDark ? '#FFFFFF' : '#000000',
      fontFamily: 'OpenSans',
      fontSize: 14,
      maxWidth: '90%'
    }
  });
