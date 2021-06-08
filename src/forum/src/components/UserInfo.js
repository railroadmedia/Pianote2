import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import Icon from '../../../assets/icons';
import FastImage from 'react-native-fast-image';

const onTablet = global.onTablet;
let styles;

export default class UserInfo extends React.Component {
  constructor(props) {
    super(props);
    styles = setStyles(props.isDark, props.appColor);
  }

  render = () => {
    const { author, hideUserInfo, isVisible, isDark } = this.props;
    return (
      <Modal
        transparent={true}
        visible={isVisible}
        style={{ margin: 0, flex: 1 }}
        animation={'slideInUp'}
        animationInTiming={250}
        animationOutTiming={250}
        coverScreen={true}
        hasBackdrop={true}
        onBackButtonPress={() => hideUserInfo()}
      >
        <View style={styles.modalContainer} activeOpacity={1}>
          <TouchableOpacity
            onPress={() => hideUserInfo()}
            style={{ height: '15%' }}
          />
          <View style={styles.container}>
            <View style={styles.curveTopEdges}>
              <TouchableOpacity
                onPress={() => hideUserInfo()}
                style={styles.xContainer}
              >
                <Icon.Feather
                  size={onTablet ? 30 : 25}
                  name={'x'}
                  color={isDark ? 'white' : 'black'}
                />
              </TouchableOpacity>
              <Text style={styles.headerText}>{author?.display_name}</Text>
              <FastImage
                style={styles.profilePicture}
                source={{ uri: author?.avatar_url }}
                resizeMode={FastImage.resizeMode.cover}
              />
              <Text style={[styles.headerText, styles.rankText]}>
                {author?.xp_rank}
              </Text>
              <Text style={styles.levelText}>LEVEL {author?.level_rank}</Text>
              <Text style={styles.memberSinceText}>
                {this.props.appName} MEMBER SINCE{' '}
                {new Date(
                  Date.now() - author.days_as_member * 86400000
                ).getUTCFullYear()}
              </Text>
              <View style={styles.statsContainer}>
                <Text style={styles.numberText}>{author?.xp}</Text>
                <Text style={styles.itemText}>Total XP</Text>
              </View>
              <View style={styles.statsContainer}>
                <Text style={styles.numberText}>{author?.total_posts}</Text>
                <Text style={styles.itemText}>Total posts</Text>
              </View>
              <View style={styles.statsContainer}>
                <Text style={styles.numberText}>{author?.days_as_member}</Text>
                <Text style={styles.itemText}>Days as a member</Text>
              </View>
              <View style={styles.statsContainer}>
                <Text style={styles.numberText}>
                  {author?.total_post_likes}
                </Text>
                <Text style={styles.itemText}>Total post likes</Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };
}

let setStyles = (isDark, appColor) =>
  StyleSheet.create({
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,.5)',
      justifyContent: 'flex-end'
    },
    container: {
      borderTopRightRadius: onTablet ? 50 : 35,
      borderTopLeftRadius: onTablet ? 50 : 35,
      backgroundColor: isDark ? '#081826' : '#F7F9FC',
      height: '85%',
      elevation: 10
    },
    headerText: {
      fontSize: onTablet ? 24 : 18,
      color: isDark ? 'white' : 'black',
      fontFamily: 'OpenSans-ExtraBold',
      alignSelf: 'center',
      textAlign: 'center'
    },
    levelText: {
      fontSize: onTablet ? 16 : 14,
      color: isDark ? 'white' : 'black',
      fontFamily: 'OpenSans-Bold',
      alignSelf: 'center',
      textAlign: 'center',
      marginBottom: 15
    },
    centerContent: {
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'center',
      alignSelf: 'stretch'
    },
    profilePicture: {
      height: onTablet ? 150 : 120,
      aspectRatio: 1,
      borderRadius: 200,
      marginTop: onTablet ? 40 : 30,
      marginBottom: 5,
      alignSelf: 'center',
      borderWidth: 2,
      borderColor: appColor
    },
    memberSinceText: {
      fontFamily: 'OpenSans-Regular',
      fontSize: onTablet ? 16 : 14,
      textAlign: 'center',
      color: isDark ? '#445f73' : 'black',
      paddingBottom: 20
    },
    rankText: {
      paddingHorizontal: 10,
      textAlign: 'center',
      color: appColor,
      fontSize: onTablet ? 20 : 18,
      justifyContent: 'center',
      fontFamily: 'OpenSans-Bold',
      textAlign: 'center'
    },
    itemText: {
      fontFamily: 'OpenSans-Regular',
      fontSize: onTablet ? 16 : 14,
      textAlign: 'center',
      color: isDark ? '#445f73' : 'black',
      textAlign: 'left',
      flex: 0.8
    },
    numberText: {
      flex: 0.2,
      paddingHorizontal: 10,
      textAlign: 'center',
      color: appColor,
      fontSize: onTablet ? 20 : 18,
      justifyContent: 'center',
      fontFamily: 'OpenSans-Bold',
      textAlign: 'center',
      textAlign: 'center'
    },
    curveTopEdges: {
      marginTop: 30,
      height: '10%',
      width: '100%'
    },
    statsContainer: {
      padding: 10,
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomColor: isDark ? '#445f73' : 'black',
      borderBottomWidth: 0.25
    },
    xContainer: {
      height: '100%',
      width: '100%',
      zIndex: 10,
      position: 'absolute',
      left: onTablet ? 20 : 15,
      zIndex: 10
    }
  });
