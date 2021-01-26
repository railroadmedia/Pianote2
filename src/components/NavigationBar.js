/**
 * Taskbar for navigation
 */
import React from 'react';
import FastImage from 'react-native-fast-image';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import DeviceInfo from 'react-native-device-info';
import AntIcon from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AsyncStorage from '@react-native-community/async-storage';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  withNavigation,
  NavigationActions,
  StackActions
} from 'react-navigation';
import { NetworkContext } from '../context/NetworkProvider';

class NavigationBar extends React.Component {
  static contextType = NetworkContext;
  static navigationOptions = { header: null };
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
      onMain:
        this.props.currentPage == 'LESSONS' ||
        this.props.currentPage == 'SEARCH' ||
        this.props.currentPage == 'DOWNLOADS' ||
        this.props.currentPage == 'PROFILE'
          ? true
          : false
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
          size={27.5 * factorRatio}
        />
      );
    } else {
      return (
        <FastImage
          style={{
            flex: 1,
            borderRadius: 100,
            backgroundColor: this.props.isMethod ? colors.pianoteGrey : colors.secondBackground,
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
        <View style={localStyles.navContainer}>
          <TouchableOpacity
            onPress={() => {
              !this.context.isConnected
                ? this.context.showNoConnectionAlert()
                : this.state.onMain
                ? this.props.navigation.dispatch(
                    StackActions.reset({
                      index: 0,
                      actions: [
                        NavigationActions.navigate({
                          routeName: isPackOnly ? 'PACKS' : 'LESSONS'
                        })
                      ]
                    })
                  )
                : this.props.navigation.navigate(
                    isPackOnly ? 'PACKS' : 'LESSONS'
                  );
            }}
          >
            <SimpleLineIcon
              name={'home'}
              size={30 * factorRatio}
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
                : this.state.onMain
                ? this.props.navigation.dispatch(
                    StackActions.reset({
                      index: 0,
                      actions: [
                        NavigationActions.navigate({
                          routeName: 'SEARCH'
                        })
                      ]
                    })
                  )
                : this.props.navigation.navigate('SEARCH');
            }}
          >
            <EvilIcons
              name={'search'}
              size={40 * factorRatio}
              color={
                this.props.currentPage == 'SEARCH'
                  ? this.state.primaryColor
                  : this.state.secondaryColor
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.state.onMain
                ? this.props.navigation.dispatch(
                    StackActions.reset({
                      index: 0,
                      actions: [
                        NavigationActions.navigate({
                          routeName: 'DOWNLOADS'
                        })
                      ]
                    })
                  )
                : this.props.navigation.navigate('DOWNLOADS');
            }}
          >
            <MaterialIcon
              name={'arrow-collapse-down'}
              size={30 * factorRatio}
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
                : this.state.onMain
                ? this.props.navigation.dispatch(
                    StackActions.reset({
                      index: 0,
                      actions: [
                        NavigationActions.navigate({
                          routeName: 'PROFILE'
                        })
                      ]
                    })
                  )
                : this.props.navigation.navigate('PROFILE');
            }}
          >
            <View
              style={[
                localStyles.navIconContainer,
                this.state.profileImage.length > 0
                  ? null
                  : styles.centerContent,
                {
                  paddingTop: isNotch ? 2 : 0,
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
      </SafeAreaView>
    );
  };
}

const localStyles = StyleSheet.create({
  navIconContainer: {
    borderRadius: 100,
    width:
      (37.5 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
    height:
      (37.5 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
    borderWidth:
      (2.25 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
    marginBottom: DeviceInfo.hasNotch() ? 0 : 5
  },
  navContainer: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    paddingTop: 10 * (Dimensions.get('window').height / 812),
    justifyContent: 'space-around',
    alignContent: 'space-around'
  }
});

export default withNavigation(NavigationBar);
