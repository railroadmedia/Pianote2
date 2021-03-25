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
import { SafeAreaView } from 'react-navigation';
import DisplayName from '../../modals/DisplayName.js';
import ProfileImage from '../../modals/ProfileImage.js';
import NavigationBar from '../../components/NavigationBar.js';
import commonService from '../../services/common.service.js';
import { NetworkContext } from '../../context/NetworkProvider.js';
import Loading from '../../components/Loading.js';
import { goBack, reset } from '../../../AppNavigator.js';

const windowDim = Dimensions.get('window');
const width =
  windowDim.width < windowDim.height ? windowDim.width : windowDim.height;
const height =
  windowDim.width > windowDim.height ? windowDim.width : windowDim.height;
const factor = (height / 812 + width / 375) / 2;

export default class ProfileSettings extends React.Component {
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    this.state = {
      showDisplayName: false,
      showProfileImage: false,
      isLoading: false,
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
        this.props.route?.params?.data == 'Profile Photo'
          ? 'Profile Photo'
          : 'Profile Settings'
    });
  };

  async save() {
    this.setState({ isLoading: true });
    this.loadingRef?.toggleLoading(true);
    if (this.state.currentlyView == 'Display Name') {
      await this.changeName();
    } else if (this.state.currentlyView == 'Profile Photo') {
      await this.changeImage();
    } else if (this.state.currentlyView == 'Password') {
      await this.changePassword();
    }
    this.loadingRef?.toggleLoading(false);
    this.setState({ isLoading: false });
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
      reset('PROFILE');
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
          reset('PROFILE');
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
          <View style={[localStyles.myProfileSettings]}>
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
                <Text style={localStyles.settingsText}>Display Name</Text>
                <View style={{ flex: 1 }} />
                <AntIcon
                  name={'right'}
                  size={onTablet ? 30 : 20}
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
                <Text style={localStyles.settingsText}>Profile Photo</Text>
                <View style={{ flex: 1 }} />
                <AntIcon
                  name={'right'}
                  size={onTablet ? 30 : 20}
                  color={colors.secondBackground}
                />
              </TouchableOpacity>
            </ScrollView>
          )}
          {this.state.currentlyView == 'Display Name' && (
            <ScrollView style={styles.mainContainer}>
              <TextInput
                autoCapitalize={'none'}
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
                        right: -(onTablet ? 22.5 : 15)
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
                        size={onTablet ? 30 : 22.5}
                        color={colors.secondBackground}
                        style={{
                          width: onTablet ? 30 : 22.5,
                          height: onTablet ? 30 : 22.5
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
                    <AntIcon
                      name={'plus'}
                      size={onTablet ? 80 : 65}
                      color={'white'}
                    />
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
                  size={onTablet ? 50 : 35}
                  name={'ios-camera'}
                  color={colors.secondBackground}
                  style={{ padding: 10 }}
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
            style={[styles.centerContent, styles.modalContainer]}
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
          <TouchableOpacity
            onPress={() => {
              this.state.isLoading
                ? null
                : this.state.currentlyView == 'Profile Settings'
                ? goBack()
                : this.setState({ currentlyView: 'Profile Settings' });
            }}
            style={{ padding: 10 }}
          >
            <View style={{ flex: 1 }} />
            <Back
              width={backButtonSize}
              height={backButtonSize}
              fill={colors.secondBackground}
            />
          </TouchableOpacity>
        </SafeAreaView>
      </>
    );
  }
}

const localStyles = StyleSheet.create({
  settingsText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: DeviceInfo.isTablet() ? 20 : 16,
    color: '#445f73'
  },
  myProfileSettings: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15
  },
  save: {
    fontSize: DeviceInfo.isTablet() ? 20 : 14,
    fontFamily: 'OpenSans-Bold',
    color: '#fb1b2f',
    textAlign: 'right',
    alignSelf: 'flex-end'
  },
  displayContainer: {
    height: DeviceInfo.isTablet() ? 70 : 50,
    width: '100%',
    borderBottomColor: '#445f73',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderTopColor: '#445f73',
    flexDirection: 'row',
    paddingHorizontal: 10
  },
  profilePhoto: {
    height: DeviceInfo.isTablet() ? 70 : 50,
    width: '100%',
    borderBottomColor: '#445f73',
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 10
  },
  textInput: {
    fontFamily: 'OpenSans-Regular',
    paddingHorizontal: 10,
    width: '100%',
    fontSize: DeviceInfo.isTablet() ? 20 : 16,
    color: '#445f73'
  },
  text: {
    fontFamily: 'OpenSans-Regular',
    fontSize: DeviceInfo.isTablet() ? 18 : 14,
    paddingVertical: '2%',
    paddingHorizontal: 10,
    color: '#445f73'
  },
  scrollContainer: {
    alignSelf: 'center',
    marginTop: 10
  },
  image: {
    width: DeviceInfo.isTablet() ? 200 : 150,
    aspectRatio: 1,
    borderRadius: 200,
    marginTop: 25
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
    fontSize: DeviceInfo.isTablet() ? 18 : 14,
    paddingVertical: 30,
    paddingHorizontal: 20,
    color: '#445f73',
    textAlign: 'center'
  },
  imageContainer: {
    alignSelf: 'center',
    height: DeviceInfo.isTablet() ? 90 : 70,
    width: DeviceInfo.isTablet() ? 90 : 70,
    borderRadius: 500,
    borderColor: '#445f73',
    borderWidth: 2
  }
});
