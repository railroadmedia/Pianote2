import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import Icon from '../../../assets/icons';
import FastImage from 'react-native-fast-image';

const onTablet = global.onTablet;

export default class UserInfo extends React.Component {
  constructor(props) {
    super(props);
    let { isDark, appColor, data } = props.route.params;
    styles = setStyles(isDark, appColor);
  }

  componentDidMount = () => {
    console.log('get profile details');
  };

  render = () => {
    return (
      <Modal
        transparent={true}
        visible={true}
        style={styles.modalContainer}
        animation={'slideInUp'}
        animationInTiming={250}
        animationOutTiming={250}
        coverScreen={true}
        hasBackdrop={true}
        onBackButtonPress={() => this.props.hideUserInfo()}
      >
        <TouchableOpacity
          style={localStyles.modalContainer}
          activeOpacity={1}
          onPress={() => this.props.hideUserInfo()}
        >
          <View style={localStyles.container}>
            <View
              style={{
                marginTop: 30,
                height: '10%',
                width: '100%'
              }}
            >
              <View
                style={{
                  position: 'absolute',
                  left: onTablet ? 20 : 15,
                  zIndex: 10
                }}
              >
                <TouchableOpacity
                  onPress={() => this.props.hideUserInfo()}
                  style={{ height: '100%', width: '100%', zIndex: 10 }}
                >
                  <Icon.Feather
                    size={onTablet ? 50 : 27.5}
                    name={'x'}
                    color={'white'}
                  />
                </TouchableOpacity>
              </View>
              <Text
                style={{
                  justifyContent: 'center',
                  textAlign: 'center',
                  fontSize: onTablet ? 24 : 20,
                  fontFamily: 'OpenSans-Bold',
                  color: 'white'
                }}
              >
                Jim Jones
              </Text>
              <FastImage
                style={localStyles.profilePicture}
                source={{
                  uri:
                    'https://www.drumeo.com/laravel/public/assets/images/default-avatars/default-male-profile-thumbnail.png'
                }}
                resizeMode={FastImage.resizeMode.cover}
              />

              <Text style={[styles.childHeaderText, localStyles.rankText]}>
                MASTER LEVEL II
              </Text>
              <Text style={[localStyles.usernameText, styles.childHeaderText]}>
                kenton
              </Text>
              <Text style={[localStyles.memberSinceText]}>kenton</Text>
              <View
                style={{
                  marginTop: 20,
                  padding: 10,
                  flexDirection: 'row',
                  borderBottomColor: '#445f73',
                  borderBottomWidth: 0.25
                }}
              >
                <Text
                  style={{
                    flex: 0.2,
                    paddingHorizontal: 10,
                    textAlign: 'center',
                    color: '#fb1b2f',
                    fontSize: 20,
                    justifyContent: 'center',
                    fontFamily: 'OpenSans-Bold',
                    textAlign: 'left'
                  }}
                >
                  12,234
                </Text>
                <Text
                  style={{
                    flex: 0.8,
                    color: '#445f73',
                    fontFamily: 'OpenSans-Regular',
                    fontSize: 16,
                    alignSelf: 'center'
                  }}
                >
                  Total XP
                </Text>
              </View>
              <View
                style={{
                  padding: 10,
                  flexDirection: 'row',
                  borderBottomColor: '#445f73',
                  borderBottomWidth: 0.25
                }}
              >
                <Text
                  style={{
                    flex: 0.2,
                    paddingHorizontal: 10,
                    textAlign: 'center',
                    color: '#fb1b2f',
                    fontSize: 20,
                    justifyContent: 'center',
                    fontFamily: 'OpenSans-Bold',
                    textAlign: 'left'
                  }}
                >
                  912
                </Text>
                <Text
                  style={{
                    flex: 0.8,
                    color: '#445f73',
                    fontFamily: 'OpenSans-Regular',
                    fontSize: 16,
                    alignSelf: 'center'
                  }}
                >
                  Total posts
                </Text>
              </View>
              <View
                style={{
                  padding: 10,
                  flexDirection: 'row',
                  borderBottomColor: '#445f73',
                  borderBottomWidth: 0.25
                }}
              >
                <Text
                  style={{
                    flex: 0.2,
                    paddingHorizontal: 10,
                    textAlign: 'center',
                    color: '#fb1b2f',
                    fontSize: 20,
                    justifyContent: 'center',
                    fontFamily: 'OpenSans-Bold',
                    textAlign: 'left'
                  }}
                >
                  735
                </Text>
                <Text
                  style={{
                    flex: 0.8,
                    color: '#445f73',
                    fontFamily: 'OpenSans-Regular',
                    fontSize: 16,
                    alignSelf: 'center'
                  }}
                >
                  Days as a member
                </Text>
              </View>
              <View
                style={{
                  padding: 10,
                  flexDirection: 'row',
                  borderBottomColor: '#445f73',
                  borderBottomWidth: 0.25
                }}
              >
                <Text
                  style={{
                    flex: 0.2,
                    paddingHorizontal: 10,
                    textAlign: 'center',
                    color: '#fb1b2f',
                    fontSize: 20,
                    justifyContent: 'center',
                    fontFamily: 'OpenSans-Bold',
                    textAlign: 'left'
                  }}
                >
                  627
                </Text>
                <Text
                  style={{
                    flex: 0.8,
                    color: '#445f73',
                    fontFamily: 'OpenSans-Regular',
                    fontSize: 16,
                    alignSelf: 'center'
                  }}
                >
                  Total post likes
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };
}

const localStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.5)',
    justifyContent: 'flex-end'
  },
  profilePicture: {
    height: 125,
    aspectRatio: 1,
    borderRadius: 65,
    marginTop: 40,
    marginBottom: 15,
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: 'red'
  },
  container: {
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    backgroundColor: '#081826',
    height: '80%',
    elevation: 10
  },
  memberSinceText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: onTablet ? 16 : 20,
    textAlign: 'center',
    color: '#445f73'
  },
  rankText: {
    paddingHorizontal: 10,
    textAlign: 'center',
    color: '#fb1b2f',
    fontSize: 20,
    justifyContent: 'center',
    fontFamily: 'OpenSans-Bold',
    textAlign: 'left'
  }
});
