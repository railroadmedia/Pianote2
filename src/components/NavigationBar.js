import React from 'react';
import FastImage from 'react-native-fast-image';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Icon from '../assets/icons';
import { NetworkContext } from '../context/NetworkProvider';
import { navigate } from '../../AppNavigator';
import { connect } from 'react-redux';
import commonService from '../services/common.service';

const onTablet = global.onTablet;

class NavigationBar extends React.Component {
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    this.state = {
      secondaryColor: this.props.isMethod
        ? colors.pianoteGrey
        : colors.secondBackground,
      primaryColor: this.props.isMethod ? colors.pianoteRed : 'white'
    };
  }

  profile = () => {
    if (this.props.user?.profile_picture_url) {
      return (
        <FastImage
          style={{
            flex: 1,
            borderRadius: 100,
            backgroundColor: this.props.isMethod
              ? colors.pianoteGrey
              : colors.secondBackground
          }}
          source={{ uri: this.props.user.profile_picture_url }}
          resizeMode={FastImage.resizeMode.cover}
        />
      );
    }

    return (
      <Icon.AntDesign
        name={'user'}
        color={
          this.props.currentPage === 'PROFILE'
            ? 'white'
            : this.state.secondaryColor
        }
        size={onTablet ? 40 : 30}
      />
    );
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
              <Icon.SimpleLineIcons
                name={'home'}
                size={onTablet ? 35 : 27.5}
                color={
                  this.props.currentPage === 'LESSONS'
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
              <Icon.EvilIcons
                name={'search'}
                size={onTablet ? 55 : 40}
                color={
                  this.props.currentPage === 'SEARCH'
                    ? this.state.primaryColor
                    : this.state.secondaryColor
                }
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                aspectRatio: 1,
                justifyContent: 'center',
                alignItems: 'center'
              }}
              onPress={() => {
                !this.context.isConnected
                  ? this.context.showNoConnectionAlert()
                  : navigate('FORUM', {
                      NetworkContext,
                      tryCall: commonService.tryCall.bind(commonService),
                      rootUrl: commonService.rootUrl,
                      isDark: true,
                      BottomNavigator: NavigationBar,
                      appColor: colors.pianoteRed,
                      user: this.props.user
                    });
              }}
            >
              <Icon.Ionicons
                name={'chatbubbles-outline'}
                size={onTablet ? 40 : 30}
                color={
                  this.props.currentPage === 'FORUM'
                    ? this.state.primaryColor
                    : this.state.secondaryColor
                }
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigate('DOWNLOADS')}>
              <Icon.MaterialCommunityIcons
                name={'arrow-collapse-down'}
                size={onTablet ? 40 : 30}
                color={
                  this.props.currentPage === 'DOWNLOAD'
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
                  this.props.user?.profile_picture_url
                    ? null
                    : localStyles.centerContent,
                  {
                    borderColor:
                      this.props.currentPage == 'PROFILE' &&
                      this.props.user?.profile_picture_url
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

const mapStateToProps = state => ({
  user: state.userState?.user
});

export default connect(mapStateToProps, null)(NavigationBar);

const localStyles = StyleSheet.create({
  navIconContainer: {
    borderRadius: 100,
    borderWidth: 2.25,
    height: onTablet ? 40 : 30,
    width: onTablet ? 40 : 30
  },
  navContainer: {
    alignSelf: 'stretch',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignContent: 'space-around'
  },
  centerContent: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch'
  }
});
