/**
 * NavMenuHeaders
 */
import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import {
  withNavigation,
  NavigationActions,
  StackActions
} from 'react-navigation';
import Modal from 'react-native-modal';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Pianote from 'Pianote2/src/assets/img/svgs/pianote.svg';
import NavigationMenu from 'Pianote2/src/components/NavigationMenu.js';
import { NetworkContext } from '../context/NetworkProvider';

class NavMenuHeaders extends React.Component {
  static contextType = NetworkContext;
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {
      showModalMenu: false
    };
  }

  render = () => {
    return (
      <View
        style={[
          styles.centerContent,
          {
            top: 0,
            height: fullHeight * 0.1 + (isNotch ? 10 * factorVertical : 0),
            flexDirection: 'row',
            left: 0,
            backgroundColor: colors.mainBackground
          }
        ]}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: colors.thirdBackground,
            alignSelf: 'stretch'
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              width: fullWidth,
              backgroundColor: colors.thirdBackground
            }}
          >
            <View
              key={'pianoteSign'}
              style={{
                position: 'relative',
                left: 0,
                bottom: 0,
                height: fullHeight * 0.1,
                width: 0.33 * fullWidth,
                paddingBottom: Platform.OS == 'android' ? 5 * factorVertical : 0
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  !this.context.isConnected
                    ? this.context.showNoConnectionAlert()
                    : this.props.navigation.dispatch(
                        StackActions.reset({
                          index: 0,
                          actions: [
                            NavigationActions.navigate({
                              routeName: isPackOnly ? 'PACKS' : 'LESSONS'
                            })
                          ]
                        })
                      );
                }}
                style={[
                  styles.centerContent,
                  {
                    height: '100%',
                    width: '100%'
                  }
                ]}
              >
                <View style={{ flex: 2.5 }} />
                <Pianote
                  height={30 * factorHorizontal}
                  width={fullWidth * 0.25}
                  fill={'#fb1b2f'}
                />
                <View style={{ flex: 0.25 }} />
                {!isNotch && <View style={{ flex: 0.5 }} />}
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              key={'lessons'}
              onPress={() => {
                !this.context.isConnected
                  ? this.context.showNoConnectionAlert()
                  : isPackOnly
                  ? this.props.navigation.navigate('NEWMEMBERSHIP', {
                      data: {
                        type: 'PACKONLY',
                        email: null,
                        password: null
                      }
                    })
                  : this.setState({ showModalMenu: true });
              }}
            >
              <View style={{ flex: 2 }} />
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  paddingBottom:
                    Platform.OS == 'android' ? 5 * factorVertical : 0
                }}
              >
                <Text
                  style={{
                    fontSize: 14 * factorRatio,
                    fontFamily: 'OpenSans-ExtraBold',
                    color:
                      this.props.currentPage == 'LESSONS'
                        ? 'white'
                        : colors.secondBackground
                  }}
                >
                  LESSONS{' '}
                </Text>
                <EntypoIcon
                  name={'chevron-down'}
                  color={
                    this.props.currentPage == 'LESSONS'
                      ? 'white'
                      : colors.secondBackground
                  }
                  size={20 * factorRatio}
                />
              </View>
              {!isNotch && <View style={{ flex: 0.5 }} />}
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
            <TouchableOpacity
              key={'packs'}
              onPress={() => {
                !this.context.isConnected
                  ? this.context.showNoConnectionAlert()
                  : this.props.navigation.navigate('PACKS');
              }}
            >
              <View style={{ flex: 2 }} />
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  paddingBottom:
                    Platform.OS == 'android' ? 5 * factorVertical : 0
                }}
              >
                <Text
                  style={{
                    fontSize: 14 * factorRatio,
                    fontFamily: 'OpenSans-ExtraBold',
                    color:
                      this.props.currentPage == 'PACKS'
                        ? 'white'
                        : colors.secondBackground
                  }}
                >
                  PACKS{' '}
                </Text>
              </View>
              {!isNotch && <View style={{ flex: 0.5 }} />}
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
            <TouchableOpacity
              key={'mylist'}
              onPress={() => {
                !this.context.isConnected
                  ? this.context.showNoConnectionAlert()
                  : this.props.navigation.navigate('MYLIST');
              }}
            >
              <View style={{ flex: 2 }} />
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  paddingBottom:
                    Platform.OS == 'android' ? 5 * factorVertical : 0
                }}
              >
                <Text
                  style={{
                    fontSize: 14 * factorRatio,
                    fontFamily: 'OpenSans-Regular',
                    fontFamily: 'OpenSans-ExtraBold',
                    color:
                      this.props.currentPage == 'MYLIST'
                        ? 'white'
                        : colors.secondBackground
                  }}
                >
                  MY LIST{' '}
                </Text>
              </View>
              {!isNotch && <View style={{ flex: 0.5 }} />}
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
          </View>
        </View>
        <Modal
          key={'navMenu'}
          isVisible={this.state.showModalMenu}
          style={{
            margin: 0,
            height: fullHeight,
            width: fullWidth
          }}
          animation={'slideInUp'}
          animationInTiming={250}
          animationOutTiming={250}
          coverScreen={true}
          hasBackdrop={false}
        >
          <NavigationMenu
            onClose={e => this.setState({ showModalMenu: e })}
            menu={this.state.menu}
            parentPage={this.props.parentPage}
          />
        </Modal>
      </View>
    );
  };
}

export default withNavigation(NavMenuHeaders);
