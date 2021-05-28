import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import Icon from '../../../assets/icons';
import FastImage from 'react-native-fast-image';

const onTablet = global.onTablet;
let styles;

export default class UserInfo extends React.Component {
  constructor(props) {
    super(props);
    styles = setStyles(this.props.isDark, this.props.appColor);
  }

  render = () => {
    let data = this.props.data;
    return (
      <Modal
        transparent={true}
        visible={this.props.isVisible}
        style={{ margin: 0, flex: 1 }}
        animation={'slideInUp'}
        animationInTiming={250}
        animationOutTiming={250}
        coverScreen={true}
        hasBackdrop={true}
        onBackButtonPress={() => this.props.hideUserInfo()}
      >
        <View style={styles.modalContainer} activeOpacity={1}>
          <TouchableOpacity
            onPress={() => this.props.hideUserInfo()}
            style={{ height: '15%' }}
          />
          <View style={styles.container}>
            <View style={styles.curveTopEdges}>
              <TouchableOpacity
                onPress={() => this.props.hideUserInfo()}
                style={styles.xContainer}
              >
                <Icon.Feather
                  size={onTablet ? 30 : 25}
                  name={'x'}
                  color={this.props.isDark ? 'white' : 'black'}
                />
              </TouchableOpacity>
              <Text style={styles.headerText}>{data.user}</Text>
              <FastImage
                style={styles.profilePicture}
                source={{
                  uri:
                    'https://www.drumeo.com/laravel/public/assets/images/default-avatars/default-male-profile-thumbnail.png'
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
              <Text style={[styles.headerText, styles.rankText]}>
                {data.rank}
              </Text>
              <Text style={styles.levelText}>LEVEL {data.level}</Text>
              <Text style={styles.memberSinceText}>
                {this.props.appName} MEMBER SINCE {data.date}
              </Text>
              <View style={styles.statsContainer}>
                <Text style={styles.numberText}>{data.totalXP}</Text>
                <Text style={styles.itemText}>Total XP</Text>
              </View>
              <View style={styles.statsContainer}>
                <Text style={styles.numberText}>{data.totalPosts}</Text>
                <Text style={styles.itemText}>Total posts</Text>
              </View>
              <View style={styles.statsContainer}>
                <Text style={styles.numberText}>{data.daysMember}</Text>
                <Text style={styles.itemText}>Days as a member</Text>
              </View>
              <View style={styles.statsContainer}>
                <Text style={styles.numberText}>{data.totalLikes}</Text>
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
