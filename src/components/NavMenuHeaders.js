/**
 * NavMenuHeaders
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Platform,
  StatusBar
} from 'react-native';
import {
  StackActions,
  withNavigation,
  NavigationActions
} from 'react-navigation';
import DeviceInfo from 'react-native-device-info';
import Modal from 'react-native-modal';
import { SafeAreaView } from 'react-navigation';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Pianote from 'Pianote2/src/assets/img/svgs/pianote.svg';
import NavigationMenu from 'Pianote2/src/components/NavigationMenu.js';
import { NetworkContext } from '../context/NetworkProvider';

const windowDim = Dimensions.get('window');
const width =
  windowDim.width < windowDim.height ? windowDim.width : windowDim.height;
const height =
  windowDim.width > windowDim.height ? windowDim.width : windowDim.height;
const factor = (height / 812 + width / 375) / 2;

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
      <SafeAreaView
        style={{
          flexDirection: 'row',
          backgroundColor: this.props.isMethod
            ? 'black'
            : colors.mainBackground,
          paddingTop: DeviceInfo.hasNotch() ? 0 : 5
        }}
        forceInset={{ top: 'always' }}
      >
        <StatusBar
          backgroundColor={
            this.props.isMethod ? 'black' : colors.mainBackground
          }
          barStyle={'light-content'}
        />
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: isNotch
              ? 5 * factor
              : Platform.OS == 'android'
              ? 0
              : onTablet
              ? 0
              : 4,
            paddingBottom: (onTablet ? 5 : 10) * factor,
            paddingRight: 10 * factor,
            paddingLeft: 5 * factor
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
            style={{
              height:
                Platform.OS == 'ios'
                  ? onTablet
                    ? height * 0.0345
                    : height * 0.035
                  : onTablet
                  ? height * 0.1
                  : height * 0.04,
              width: (onTablet ? 0.12 : 0.25) * width,
              flexDirection: 'row',
              marginRight: 5 * factor,
              paddingLeft: onTablet ? 10 : 0
            }}
          >
            <Pianote fill={'#fb1b2f'} />
            <View style={{ flex: 1 }} />
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
          <TouchableOpacity
            key={'lessons'}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center'
            }}
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
            <Text
              numberOfLines={1}
              style={{
                fontSize: onTablet ? 16 : 14 * factor,
                fontFamily: 'OpenSans-ExtraBold',
                color:
                  this.props.currentPage == 'LESSONS'
                    ? 'white'
                    : this.props.isMethod
                    ? 'white'
                    : colors.secondBackground
              }}
            >
              LESSONS{' '}
            </Text>
            <View>
              <EntypoIcon
                name={'chevron-down'}
                color={
                  this.props.currentPage == 'LESSONS'
                    ? 'white'
                    : this.props.isMethod
                    ? 'white'
                    : colors.secondBackground
                }
                size={(onTablet ? 12 : 16) * factor}
                style={{ marginLeft: -2.5 }}
              />
            </View>
          </TouchableOpacity>
          <View style={{ width: 7.5 * factor }} />
          <TouchableOpacity
            key={'packs'}
            onPress={() => {
              !this.context.isConnected
                ? this.context.showNoConnectionAlert()
                : this.props.navigation.navigate('PACKS');
            }}
            style={{ alignItems: 'center', justifyContent: 'center' }}
          >
            <Text
              numberOfLines={1}
              style={{
                fontSize: onTablet ? 16 : 14 * factor,
                fontFamily: 'OpenSans-ExtraBold',
                color:
                  this.props.currentPage == 'PACKS'
                    ? 'white'
                    : this.props.isMethod
                    ? 'white'
                    : colors.secondBackground
              }}
            >
              PACKS{' '}
            </Text>
          </TouchableOpacity>
          <View style={{ width: 7.5 * factor }} />
          <TouchableOpacity
            key={'mylist'}
            onPress={() => {
              !this.context.isConnected
                ? this.context.showNoConnectionAlert()
                : this.props.navigation.navigate('MYLIST');
            }}
            style={{ alignItems: 'center', justifyContent: 'center' }}
          >
            <Text
              numberOfLines={1}
              style={{
                fontSize: onTablet ? 16 : 14 * factor,
                shadowOpacity: 0.3,
                fontFamily: 'OpenSans-Regular',
                fontFamily: 'OpenSans-ExtraBold',
                color:
                  this.props.currentPage == 'MYLIST'
                    ? 'white'
                    : this.props.isMethod
                    ? 'white'
                    : colors.secondBackground
              }}
            >
              MY LIST{' '}
            </Text>
          </TouchableOpacity>
        </View>

        <Modal
          key={'navMenu'}
          isVisible={this.state.showModalMenu}
          style={{
            margin: 0,
            flex: 1
          }}
          animation={'slideInUp'}
          animationInTiming={250}
          animationOutTiming={250}
          coverScreen={true}
          hasBackdrop={false}
        >
          <NavigationMenu
            isMethod={this.props.isMethod}
            onClose={e => this.setState({ showModalMenu: e })}
            menu={this.state.menu}
            parentPage={this.props.parentPage}
          />
        </Modal>
      </SafeAreaView>
    );
  };
}

export default withNavigation(NavMenuHeaders);
