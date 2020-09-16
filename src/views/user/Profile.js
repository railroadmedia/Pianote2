/**
 * Profile
 */
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import FastImage from 'react-native-fast-image';
import XpRank from 'Pianote2/src/modals/XpRank.js';
import Chat from 'Pianote2/src/assets/img/svgs/chat.svg';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Settings from 'Pianote2/src/assets/img/svgs/settings.svg';
import AsyncStorage from '@react-native-community/async-storage';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import ReplyNotification from 'Pianote2/src/modals/ReplyNotification.js';

export default class Profile extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {
      profileImage: '',
      notifications: [1, 2, 3, 4, 5],
      showXpRank: false,
      showReplyNotification: false,
      memberSince: ''
    };
  }

  componentWillMount = async () => {
    let data = await AsyncStorage.multiGet([
      'totalXP',
      'rank',
      'profileURI',
      'displayName',
      'joined'
    ]);

    await this.setState({
      xp: data[0][1],
      rank: data[1][1],
      profileImage: data[2][1],
      username: data[3][1],
      memberSince: data[4][1],
      lessonsStarted: false
    });
  };

  changeXP = num => {
    if (num !== '') {
      num = Number(num);
      if (num < 10000) {
        num = num.toString();
        return num;
      } else {
        num = (num / 1000).toFixed(1).toString();
        num = num + 'k';
        return num;
      }
    }
  };

  renderNotifications() {
    return this.state.notifications.map((data, index) => {
      return (
        <View
          style={{
            height: 90 * factorRatio,
            backgroundColor:
              index % 2 ? colors.mainBackground : colors.notificationColor,
            flexDirection: 'row'
          }}
        >
          <View
            style={{
              flex: 0.275,
              flexDirection: 'row'
            }}
          >
            <View style={{ flex: 1 }} />
            <View>
              <View style={{ flex: 1 }} />
              <View
                style={{
                  height: fullWidth * 0.175,
                  width: fullWidth * 0.175,
                  borderRadius: 150 * factorRatio,
                  backgroundColor: '#ececec'
                }}
              >
                <View
                  style={[
                    styles.centerContent,
                    {
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      height: fullWidth * 0.075,
                      width: fullWidth * 0.075,
                      backgroundColor: index % 2 ? 'orange' : 'blue',
                      borderRadius: 100 * factorRatio,
                      zIndex: 5
                    }
                  ]}
                >
                  <Chat
                    height={fullWidth * 0.05}
                    width={fullWidth * 0.05}
                    fill={'white'}
                  />
                </View>
                <FastImage
                  style={{ flex: 1, borderRadius: 100 }}
                  source={{
                    uri:
                      'https://facebook.github.io/react-native/img/tiny_logo.png'
                  }}
                  resizeMode={FastImage.resizeMode.stretch}
                />
              </View>
              <View style={{ flex: 1 }} />
            </View>
            <View style={{ flex: 1 }} />
          </View>
          <View style={{ flex: 0.675 }}>
            <View style={{ flex: 1 }}>
              <View style={{ flex: 1 }} />
              <Text
                style={{
                  fontFamily: 'OpenSans',
                  fontSize: 15 * factorRatio,
                  fontWeight: Platform.OS == 'ios' ? '700' : 'bold',
                  color: 'white'
                }}
              >
                <Text
                  style={{
                    fontFamily: 'OpenSans',
                    fontSize: 15 * factorRatio,
                    fontWeight: Platform.OS == 'ios' ? '700' : 'bold',
                    color: 'white'
                  }}
                >
                  {'NEW - '}
                </Text>
                Jordan Leibel
                <Text
                  style={{
                    fontFamily: 'OpenSans',
                    fontSize: 14 * factorRatio,
                    fontWeight: '400'
                  }}
                >
                  {' '}
                  replied to your comment.
                </Text>
              </Text>
              <View style={{ height: 5 * factorVertical }} />
              <Text
                style={{
                  fontFamily: 'OpenSans',
                  fontSize: 13 * factorRatio,
                  fontWeight: '400',
                  color: colors.secondBackground
                }}
              >
                Yesterday at 12:19 PM
              </Text>
              <View style={{ flex: 1 }} />
            </View>
          </View>
          <View>
            <View style={{ flex: 1 }} />
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1 }} />
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    showReplyNotification: true
                  });
                }}
                style={{
                  height: 35 * factorRatio,
                  justifyContent: 'center'
                }}
              >
                <EntypoIcon
                  size={20 * factorRatio}
                  name={'dots-three-horizontal'}
                  color={colors.secondBackground}
                />
              </TouchableOpacity>
              <View style={{ flex: 1 }} />
            </View>
            <View style={{ flex: 1 }} />
          </View>
        </View>
      );
    });
  }

  render() {
    return (
      <View styles={{ flex: 1, alignSelf: 'stretch' }}>
        <View
          style={{
            height: fullHeight - navHeight,
            alignSelf: 'stretch'
          }}
        >
          <View key={'contentContainer'} style={{ flex: 1 }}>
            <View
              style={[
                styles.centerContent,
                {
                  height:
                    Platform.OS == 'android'
                      ? fullHeight * 0.1
                      : isNotch
                      ? fullHeight * 0.12
                      : fullHeight * 0.1,
                  backgroundColor: colors.thirdBackground
                }
              ]}
            >
              <View style={{ flex: 1 }} />
              <View
                style={[
                  styles.centerContent,
                  {
                    backgroundColor: colors.thirdBackground
                  }
                ]}
              >
                <Text
                  style={{
                    fontSize: 22 * factorRatio,
                    fontWeight: 'bold',
                    color: 'white',
                    fontFamily: 'OpenSans'
                  }}
                >
                  My Profile
                </Text>
                <View
                  style={{
                    position: 'absolute',
                    right: 20 * factorHorizontal
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate('SETTINGS');
                    }}
                  >
                    <Settings
                      height={20 * factorRatio}
                      width={20 * factorRatio}
                      fill={colors.pianoteRed}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ height: 20 * factorVertical }} />
            </View>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentInsetAdjustmentBehavior={'never'}
              style={{
                flex: 1,
                backgroundColor: colors.mainBackground
              }}
            >
              <View style={{ height: 20 * factorVertical }} />
              <View
                key={'profilePicture'}
                style={[
                  styles.centerContent,
                  {
                    backgroundColor: colors.mainBackground
                  }
                ]}
              >
                <View
                  key={'imageProfile'}
                  style={{
                    borderRadius: 250,
                    borderWidth: 2 * factorRatio,
                    borderColor: colors.pianoteRed,
                    height: onTablet ? 112 * factorRatio : 140 * factorRatio,
                    width: onTablet ? 112 * factorRatio : 140 * factorRatio
                  }}
                >
                  <FastImage
                    style={{
                      height: '100%',
                      width: '100%',
                      borderRadius: 250,
                      backgroundColor: colors.secondBackground
                    }}
                    source={require('Pianote2/src/assets/img/imgs/lisa-witt.jpg')}
                    resizeMode={FastImage.resizeMode.cover}
                    //{uri: this.state.profileImage}
                  />
                </View>
                <View style={{ height: 10 * factorVertical }} />
                <View
                  key={'name'}
                  style={[
                    styles.centerContent,
                    {
                      alignSelf: 'stretch'
                    }
                  ]}
                >
                  <Text
                    style={{
                      fontFamily: 'OpenSans',
                      fontSize: 30 * factorRatio,
                      fontWeight: Platform.OS == 'ios' ? '900' : 'bold',
                      textAlign: 'center',
                      color: 'white'
                    }}
                  >
                    {this.state.username}
                  </Text>
                  <View style={{ height: 10 * factorVertical }} />
                  <Text
                    style={{
                      fontFamily: 'OpenSans',
                      fontSize: 14 * factorRatio,
                      textAlign: 'center',
                      color: colors.secondBackground
                    }}
                  >
                    MEMBER SINCE {this.state.memberSince.slice(0, 4)}
                  </Text>
                </View>
                <View style={{ flex: 1 }} />
              </View>
              <View style={{ height: 20 * factorVertical }} />
              <View
                key={'rank'}
                style={{
                  borderTopColor: colors.secondBackground,
                  borderTopWidth: 0.25,
                  borderBottomColor: colors.secondBackground,
                  borderBottomWidth: 0.25,
                  height: fullHeight * 0.1,
                  paddingTop: 10 * factorVertical,
                  paddingBottom: 10 * factorVertical,
                  backgroundColor: colors.mainBackground,
                  flexDirection: 'row'
                }}
              >
                <View
                  style={{
                    flex: 3,
                    flexDirection: 'row',
                    alignSelf: 'stretch'
                  }}
                >
                  <View style={{ flex: 1 }} />
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({ showXpRank: true });
                    }}
                  >
                    <View style={{ flex: 1 }} />
                    <View>
                      <Text
                        style={{
                          color: colors.pianoteRed,
                          fontSize: 12 * factorRatio,
                          fontWeight: 'bold',
                          textAlign: 'center'
                        }}
                      >
                        XP
                      </Text>
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 24 * factorRatio,
                          fontWeight: Platform.OS == 'ios' ? '800' : 'bold',
                          textAlign: 'center'
                        }}
                      >
                        {this.changeXP(this.state.xp)}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }} />
                  </TouchableOpacity>
                  <View style={{ flex: 1 }} />
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({ showXpRank: true });
                    }}
                  >
                    <View style={{ flex: 1 }} />
                    <View>
                      <Text
                        style={{
                          color: colors.pianoteRed,
                          fontSize: 12 * factorRatio,
                          fontWeight: 'bold',
                          textAlign: 'center'
                        }}
                      >
                        RANK
                      </Text>
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 24 * factorRatio,
                          fontWeight: Platform.OS == 'ios' ? '800' : 'bold',
                          textAlign: 'center'
                        }}
                      >
                        {this.state.rank}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }} />
                  </TouchableOpacity>
                  <View style={{ flex: 1 }} />
                </View>
              </View>
              <View
                key={'notifications'}
                style={{
                  paddingTop: 25 * factorVertical,
                  paddingBottom: 15 * factorVertical,
                  elevation: 1
                }}
              >
                <View style={{ flex: 0.5 }} />
                <Text
                  style={{
                    paddingLeft: fullWidth * 0.05,
                    fontSize: 18 * factorRatio,
                    fontFamily: 'OpenSans',
                    fontWeight: Platform.OS == 'ios' ? '800' : 'bold',
                    color: colors.secondBackground
                  }}
                >
                  NOTIFICATIONS
                </Text>
                <View style={{ flex: 1 }} />
              </View>
              {this.renderNotifications()}
            </ScrollView>
          </View>
          <Modal
            key={'XpRank'}
            isVisible={this.state.showXpRank}
            style={[
              styles.centerContent,
              {
                margin: 0,
                height: fullHeight,
                width: fullWidth
              }
            ]}
            animation={'slideInUp'}
            animationInTiming={250}
            animationOutTiming={250}
            coverScreen={true}
            hasBackdrop={true}
          >
            <XpRank
              hideXpRank={() => {
                this.setState({ showXpRank: false });
              }}
              xp={this.state.xp}
              rank={this.state.rank}
            />
          </Modal>
          <Modal
            key={'replyNotification'}
            isVisible={this.state.showReplyNotification}
            style={[
              styles.centerContent,
              {
                margin: 0,
                height: fullHeight,
                width: fullWidth
              }
            ]}
            animation={'slideInUp'}
            animationInTiming={250}
            animationOutTiming={250}
            coverScreen={true}
            hasBackdrop={true}
          >
            <ReplyNotification
              hideReplyNotification={() => {
                this.setState({ showReplyNotification: false });
              }}
            />
          </Modal>
          <NavigationBar currentPage={'PROFILE'} />
        </View>
      </View>
    );
  }
}
