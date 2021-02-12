/**
 * ProfileSettings
 */
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  StyleSheet,
  Dimensions
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Modal from 'react-native-modal';
import FastImage from 'react-native-fast-image';
import ImagePicker from 'react-native-image-picker';
import IonIcon from 'react-native-vector-icons/Ionicons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import Back from 'Pianote2/src/assets/img/svgs/back.svg';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-community/async-storage';
import {
  NavigationActions,
  SafeAreaView,
  StackActions
} from 'react-navigation';
import DisplayName from '../../modals/DisplayName.js';
import ProfileImage from '../../modals/ProfileImage.js';
import NavigationBar from '../../components/NavigationBar.js';
import commonService from '../../services/common.service.js';
import { NetworkContext } from '../../context/NetworkProvider.js';
import Loading from '../../components/Loading.js';

const windowDim = Dimensions.get('window');
const width =
  windowDim.width < windowDim.height ? windowDim.width : windowDim.height;
const height =
  windowDim.width > windowDim.height ? windowDim.width : windowDim.height;
const factor = (height / 812 + width / 375) / 2;

const resetAction = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: 'PROFILE' })]
});

export default class ProfileSettings extends React.Component {
  static navigationOptions = { header: null };
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    this.state = {
      showDisplayName: false,
      showProfileImage: false,
      currentlyView: 'Profile Settings',
      displayName: '',
      currentPassword: '',
      newPassword: '',
      retypeNewPassword: '',
      email: '',
      imageURI: '',
      imageType: '',
      imageName: '',
      passwordKey: '',
      imagePath: ''
    };
  }

  componentDidMount = async () => {
    let imageURI = await AsyncStorage.getItem('profileURI');
    this.setState({
      imageURI: imageURI || '',
      currentlyView:
        this.props.navigation.state.params?.data == 'Profile Photo'
          ? 'Profile Photo'
          : 'Profile Settings'
    });
  };

  async save() {
    this.loadingRef?.toggleLoading(true);
    if (this.state.currentlyView == 'Display Name') {
      await this.changeName();
    } else if (this.state.currentlyView == 'Profile Photo') {
      await this.changeImage();
    } else if (this.state.currentlyView == 'Password') {
      await this.changePassword();
    }
    this.loadingRef?.toggleLoading(false);
  }

  changePassword = async () => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    const email = await AsyncStorage.getItem('email');

    const { response, error } = await userForgotPassword({ email });

    this.setState({ showChangePassword: true });
  };

  changeName = async () => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }
    // check if display name available
    let response = await fetch(
      `${commonService.rootUrl}/usora/is-display-name-unique?display_name=${this.state.displayName}`
    );
    response = await response.json();

    if (response.unique) {
      let nameResponse = await commonService.tryCall(
        `${commonService.rootUrl}/api/profile/update`,
        'POST',
        {
          display_name: this.state.displayName
        }
      );
      await AsyncStorage.setItem('displayName', this.state.displayName);
      this.props.navigation.dispatch(resetAction);
    } else {
      this.setState({ showDisplayName: true });
    }
  };

  changeImage = async () => {
    if (!this.context.isConnected) {
      return this.context.showNoConnectionAlert();
    }

    const data = new FormData();

    data.append('file', {
      name: this.state.imageName,
      type: this.state.imageType,
      uri: this.state.imageURI
    });
    data.append('target', this.state.imageName);
    try {
      if (this.state.imageURI !== '') {
        let response = await fetch(
          `${commonService.rootUrl}/api/avatar/upload`,
          {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: data
          }
        );
        if (response.status == 413) {
          this.setState({ showProfileImage: true });
          return;
        }
        let url = await response.json();
        if (url.data[0].url) {
          await commonService.tryCall(
            `${commonService.rootUrl}/api/profile/update`,
            'POST',
            { file: url == '' ? url : url.data[0].url }
          );
          await AsyncStorage.setItem(
            'profileURI',
            url == '' ? url : url.data[0].url
          );
          this.props.navigation.dispatch(resetAction);
        }
      }
    } catch (error) {}
  };

  chooseImage = async () => {
    await ImagePicker.showImagePicker(
      {
        tintColor: '#147efb',
        storageOptions: {
          skipBackup: true,
          path: 'images'
        },
        maxWidth: 1000
      },
      response => {
        if (response.didCancel) {
        } else if (response.error) {
        } else {
          this.setState({
            imageURI: response.uri,
            imageType: response.type,
            imageName: response.fileName || 'avatar',
            imagePath: response.path
          });
        }
      }
    );
  };

  render() {
    return (
      <>
        <SafeAreaView style={styles.mainContainer}>
          <StatusBar
            backgroundColor={colors.mainBackground}
            barStyle={'light-content'}
          />
          <View style={localStyles.myProfileSettings}>
            <View style={{ flex: 1 }} />
            <Text
              style={[
                styles.childHeaderText,
                { color: colors.secondBackground }
              ]}
            >
              {this.state.currentlyView}
            </Text>
            {this.state.currentlyView !== 'Profile Settings' ? (
              <TouchableOpacity
                onPress={() => {
                  this.save();
                }}
                style={{ flex: 1 }}
              >
                <Text style={localStyles.save}>SAVE</Text>
              </TouchableOpacity>
            ) : (
              <View style={{ flex: 1 }} />
            )}
          </View>

          {this.state.currentlyView == 'Profile Settings' && (
            <ScrollView style={{ flex: 1 }}>
              <TouchableOpacity
                style={[styles.centerContent, localStyles.displayContainer]}
                onPress={() =>
                  this.setState({
                    currentlyView: 'Display Name'
                  })
                }
              >
                <Text style={styles.settingsText}>Display Name</Text>
                <View style={{ flex: 1 }} />
                <AntIcon
                  name={'right'}
                  size={(onTablet ? 20 : 25) * factor}
                  color={colors.secondBackground}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.centerContent, localStyles.profilePhoto]}
                onPress={() => {
                  this.setState({
                    currentlyView: 'Profile Photo'
                  });
                }}
              >
                <Text style={styles.settingsText}>Profile Photo</Text>
                <View style={{ flex: 1 }} />
                <AntIcon
                  name={'right'}
                  size={(onTablet ? 20 : 25) * factor}
                  color={colors.secondBackground}
                />
              </TouchableOpacity>
            </ScrollView>
          )}
          {this.state.currentlyView == 'Display Name' && (
            <ScrollView style={styles.mainContainer}>
              <TextInput
                ref={txt => {
                  this.txt = txt;
                }}
                placeholder={'Display Name'}
                value={this.state.displayName}
                placeholderTextColor={colors.secondBackground}
                onChangeText={displayName => this.setState({ displayName })}
                onSubmitEditing={() => {}}
                returnKeyType={'go'}
                style={[
                  styles.centerContent,
                  localStyles.displayContainer,
                  localStyles.textInput
                ]}
              />
              <Text style={localStyles.text}>
                This is the name that will appear on your comments and forum
                posts.
              </Text>
            </ScrollView>
          )}
          {this.state.currentlyView == 'Profile Photo' && (
            <ScrollView style={{ flex: 1 }}>
              <View style={[localStyles.scrollContainer, styles.centerContent]}>
                {this.state.imageURI !== '' && (
                  <View style={{ flex: 1 }}>
                    <FastImage
                      style={localStyles.image}
                      source={{ uri: this.state.imageURI }}
                      resizeMode={FastImage.resizeMode.cover}
                    />
                    <TouchableOpacity
                      style={{
                        ...localStyles.crossContainer,
                        right: -((onTablet ? 22.5 : 30) * factor + 10 + 4)
                      }}
                      onPress={() =>
                        this.setState({
                          imageURI: '',
                          imageType: '',
                          imageName: ''
                        })
                      }
                    >
                      <EntypoIcon
                        name={'cross'}
                        size={(onTablet ? 22.5 : 30) * factor}
                        color={colors.secondBackground}
                        style={{
                          width: (onTablet ? 22.5 : 30) * factor,
                          height: (onTablet ? 22.5 : 30) * factor
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                )}

                {this.state.imageURI == '' && (
                  <TouchableOpacity
                    onPress={() => this.chooseImage()}
                    style={styles.centerContent}
                  >
                    <AntIcon name={'plus'} size={65 * factor} color={'white'} />
                  </TouchableOpacity>
                )}
              </View>
              <Text style={localStyles.imageText}>
                This is the image that will appear with your comments and forum
                posts.
              </Text>

              <TouchableOpacity
                onPress={() => this.chooseImage()}
                style={[styles.centerContent, localStyles.imageContainer]}
              >
                <IonIcon
                  size={(onTablet ? 40 : 50) * factor}
                  name={'ios-camera'}
                  color={colors.secondBackground}
                  style={{ padding: 10 * factor }}
                />
              </TouchableOpacity>
            </ScrollView>
          )}

          {this.state.currentlyView == 'Profile Settings' && (
            <NavigationBar currentPage={'PROFILE'} pad={true} />
          )}

          <Modal
            isVisible={this.state.showDisplayName}
            style={[
              styles.centerContent,
              {
                margin: 0,
                flex: 1
              }
            ]}
            animation={'slideInUp'}
            animationInTiming={350}
            animationOutTiming={350}
            coverScreen={true}
            hasBackdrop={true}
          >
            <DisplayName
              hideDisplayName={() => {
                this.setState({
                  showDisplayName: false
                });
              }}
            />
          </Modal>
          <Modal
            isVisible={this.state.showProfileImage}
            style={[
              styles.centerContent,
              {
                margin: 0,
                flex: 1
              }
            ]}
            animation={'slideInUp'}
            animationInTiming={350}
            animationOutTiming={350}
            coverScreen={true}
            hasBackdrop={true}
          >
            <ProfileImage
              hideProfileImage={() => {
                this.setState({
                  showProfileImage: false
                });
              }}
            />
          </Modal>
        </SafeAreaView>
        <Loading ref={ref => (this.loadingRef = ref)} />
        <SafeAreaView style={{ position: 'absolute', zIndex: 3 }}>
          <View>
            <TouchableOpacity
              onPress={() => {
                this.loadingRef?.toggleLoading(false);
                this.state.currentlyView == 'Profile Settings'
                  ? this.props.navigation.goBack()
                  : this.setState({
                      currentlyView: 'Profile Settings'
                    });
              }}
              style={{
                position: 'absolute',
                padding: 15
              }}
            >
              <Back
                width={(onTablet ? 17.5 : 25) * factor}
                height={(onTablet ? 17.5 : 25) * factor}
                fill={colors.secondBackground}
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </>
    );
  }
}

const localStyles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 15 * factor,
    margin: 20 * factor,
    height: 200,
    width: '80%'
  },
  myProfileSettings: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15
  },
  save: {
    fontSize: DeviceInfo.isTablet() ? 20 : 15 * factor,
    fontFamily: 'OpenSans-Bold',
    color: '#fb1b2f',
    textAlign: 'right',
    alignSelf: 'flex-end'
  },
  displayContainer: {
    height: (DeviceInfo.isTablet() ? 40 : 50) * factor,
    width: '100%',
    borderBottomColor: '#445f73',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderTopColor: '#445f73',
    flexDirection: 'row',
    paddingHorizontal: 15 * factor
  },
  profilePhoto: {
    height: (DeviceInfo.isTablet() ? 40 : 50) * factor,
    width: '100%',
    borderBottomColor: '#445f73',
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 15 * factor
  },
  textInput: {
    fontFamily: 'OpenSans-Regular',
    paddingHorizontal: 10 * factor,
    width: '100%',
    fontSize: (DeviceInfo.isTablet() ? 14 : 18) * factor,
    color: '#445f73'
  },
  text: {
    fontFamily: 'OpenSans-Regular',
    fontSize: (DeviceInfo.isTablet() ? 14 : 16) * factor,
    paddingVertical: '2%',
    paddingHorizontal: 10 * factor,
    color: '#445f73'
  },
  scrollContainer: {
    alignSelf: 'center',
    marginTop: 10
  },
  image: {
    width: (DeviceInfo.isTablet() ? 150 : 200) * factor,
    aspectRatio: 1,
    borderRadius: 200,
    marginTop: 15 * factor
  },
  crossContainer: {
    position: 'absolute',
    padding: 5,
    borderColor: '#445f73',
    borderWidth: 2,
    borderRadius: 100
  },
  imageText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: (DeviceInfo.isTablet() ? 14 : 16) * factor,
    padding: 30,
    paddingHorizontal: 20 * factor,
    color: '#445f73',
    textAlign: 'center'
  },
  imageContainer: {
    alignSelf: 'center',
    height: (DeviceInfo.isTablet() ? 75 : 100) * factor,
    width: (DeviceInfo.isTablet() ? 75 : 100) * factor,
    borderRadius: 200 * factor,
    borderColor: '#445f73',
    borderWidth: 2 * factor
  }
});
