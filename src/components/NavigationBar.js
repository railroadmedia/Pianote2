/**
 * Taskbar for navigation
 */
import React from 'react';
import FastImage from 'react-native-fast-image';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import DeviceInfo from 'react-native-device-info';
import AntIcon from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AsyncStorage from '@react-native-community/async-storage';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NetworkContext } from '../context/NetworkProvider';
import { navigate, reset } from '../../AppNavigator';

export default class NavigationBar extends React.Component {
  static contextType = NetworkContext;

  constructor(props) {
    super(props);
    this.state = {
      profileImage: '',
      onMain: false,
      secondaryColor: this.props.isMethod
        ? colors.pianoteGrey
        : colors.secondBackground,
      primaryColor: this.props.isMethod ? colors.pianoteRed : 'white'
    };
  }

  componentDidMount = async () => {
    let profileImage = await AsyncStorage.getItem('profileURI');
    this.setState({
      profileImage: profileImage || '',
    });
  };

  profile = () => {
    if (this.state.profileImage.length == 0) {
      return (
        <AntIcon
          name={'user'}
          color={
            this.props.currentPage == 'PROFILE'
              ? 'white'
              : this.state.secondaryColor
          }
          size={onTablet ? 40 : 30}
        />
      );
    } else {
      return (
        <FastImage
          style={{
            flex: 1,
            borderRadius: 100,
            backgroundColor: this.props.isMethod
              ? colors.pianoteGrey
              : colors.secondBackground
          }}
          source={{ uri: this.state.profileImage }}
          resizeMode={FastImage.resizeMode.cover}
        />
      );
    }
  };

  render = () => {
    return (
      <SafeAreaView
        forceInset={{
          left: 'never',
          right: 'never',
          top: 'never',
          bottom: this.props.pad ? 'never' : 'always'
        }}
        style={{
          backgroundColor: this.props.isMethod ? 'black' : colors.mainBackground
        }}
      >
        <View style={{ justifyContent: 'center' }}>
          <View style={localStyles.navContainer}>
            <TouchableOpacity
              onPress={() => {
                !this.context.isConnected
                  ? this.context.showNoConnectionAlert() 
                  : navigate(isPackOnly ? 'PACKS' : 'LESSONS');
              }}
            >
              <SimpleLineIcon
                name={'home'}
                size={onTablet ? 35 : 27.5}
                color={
                  this.props.currentPage == 'LESSONS'
                    ? this.state.primaryColor
                    : this.state.secondaryColor
                }
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                !this.context.isConnected
                  ? this.context.showNoConnectionAlert()
                  : navigate('SEARCH');
              }}
            >
              <EvilIcons
                name={'search'}
                size={onTablet ? 55 : 40}
                color={
                  this.props.currentPage == 'SEARCH'
                    ? this.state.primaryColor
                    : this.state.secondaryColor
                }
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigate('DOWNLOADS');
              }}
            >
              <MaterialIcon
                name={'arrow-collapse-down'}
                size={onTablet ? 40 : 30}
                color={
                  this.props.currentPage == 'DOWNLOAD'
                    ? this.state.primaryColor
                    : this.state.secondaryColor
                }
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                !this.context.isConnected
                  ? this.context.showNoConnectionAlert()
                  : navigate('PROFILE');
              }}
            >
              <View
                style={[
                  localStyles.navIconContainer,
                  this.state.profileImage.length > 0
                    ? null
                    : styles.centerContent,
                  {
                    borderColor:
                      this.props.currentPage == 'PROFILE' &&
                      this.state.profileImage.length > 0
                        ? 'white'
                        : 'transparent'
                  }
                ]}
              >
                {this.profile()}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  };
}

const localStyles = StyleSheet.create({
  navIconContainer: {
    borderRadius: 100,
    borderWidth: 2.25,
    height: DeviceInfo.isTablet() ? 40 : 30,
    width: DeviceInfo.isTablet() ? 40 : 30
  },
  navContainer: {
    alignSelf: 'stretch',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignContent: 'space-around'
  }
});
