import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import { arrowRight, drum } from '../assets/svgs';

let styles;
export default class DiscussionCard extends React.Component {
  constructor(props) {
    super(props);
    let { isDark } = props;
    styles = setStyles(isDark);
  }

  render() {
    let {
      appColor,
      data: { title, icon, post_count, description, latest_post }
    } = this.props;

    return (
      <TouchableOpacity
        onPress={this.props.onNavigate}
        style={styles.container}
      >
        <View style={styles.titleContainer}>
          <View style={styles.icon}>
            {drum({ height: 25, width: 25, fill: appColor })}
            {/* TODO: replace with icon from BE */}
          </View>
          <View style={{ marginLeft: 5 }}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{post_count} Replies</Text>
          </View>
        </View>
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>{description}</Text>
          {arrowRight({ height: 10, width: 10, fill: appColor })}
        </View>
        {latest_post && (
          <Text style={styles.tags}>
            {latest_post.created_at_diff} - In: {latest_post.thread_title} - By:{' '}
            {latest_post.author_display_name}
          </Text>
        )}
      </TouchableOpacity>
    );
  }
}
let setStyles = isDark =>
  StyleSheet.create({
    container: {
      backgroundColor: isDark ? '#081825' : '#F7F9FC',
      padding: 10,
      margin: 5
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    icon: {
      height: 35,
      aspectRatio: 1,
      borderRadius: 17,
      backgroundColor: isDark ? '#002039' : '#F7F9FC',
      alignItems: 'center',
      justifyContent: 'center'
    },
    title: {
      fontFamily: 'OpenSans-Bold',
      color: isDark ? '#FFFFFF' : '#00101D',
      fontSize: 14
    },
    subtitle: {
      fontFamily: 'OpenSans',
      color: isDark ? '#445F74' : '#00101D',
      fontSize: 10
    },
    descriptionContainer: {
      flexDirection: 'row',
      padding: 5,
      justifyContent: 'space-between'
    },
    description: {
      fontFamily: 'OpenSans',
      color: isDark ? '#FFFFFF' : '#00101D',
      fontSize: 12,
      width: '90%'
    },
    tags: {
      fontFamily: 'OpenSans',
      color: isDark ? '#445F74' : '#00101D',
      fontSize: 10,
      padding: 5
    }
  });
