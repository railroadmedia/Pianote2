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
import { SafeAreaView } from 'react-navigation';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Pianote from 'Pianote2/src/assets/img/svgs/pianote.svg';
import NavigationMenu from 'Pianote2/src/components/NavigationMenu.js';
import { NetworkContext } from '../context/NetworkProvider';
import DeviceInfo from 'react-native-device-info';

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
          backgroundColor: this.props.isMethod ? 'black' : colors.mainBackground
        }}
        forceInset={{ top: 'always' }}
      >
        <View
          style={{
            marginTop: DeviceInfo.isTablet() ? 10 : 0,
            paddingBottom: 12.5*factorVertical,
            paddingTop: (isNotch) ? 0 : 10*factorVertical,
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
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
                height: fullHeight * 0.035,
                width: DeviceInfo.isTablet()
                  ? 0.25 * fullWidth
                  : 0.3 * fullWidth
              }
            ]}
          >
            <Pianote
              width={DeviceInfo.isTablet() ? 0.2 * fullWidth : 0.25 * fullWidth}
              fill={'#fb1b2f'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            key={'lessons'}
            style={{
              flexDirection: 'row',
              flex: 1,
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
              style={{
                fontSize: 14 * factorRatio,
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
            <EntypoIcon
              name={'chevron-down'}
              color={
                this.props.currentPage == 'LESSONS'
                  ? 'white'
                  : this.props.isMethod
                  ? 'white'
                  : colors.secondBackground
              }
              size={18 * factorRatio}
              style={{ marginLeft: -5 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            key={'packs'}
            onPress={() => {
              !this.context.isConnected
                ? this.context.showNoConnectionAlert()
                : this.props.navigation.navigate('PACKS');
            }}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text
              style={{
                fontSize: 14 * factorRatio,
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
          <TouchableOpacity
            key={'mylist'}
            onPress={() => {
              !this.context.isConnected
                ? this.context.showNoConnectionAlert()
                : this.props.navigation.navigate('MYLIST');
            }}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text
              style={{
                fontSize: 14 * factorRatio,
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
            height: '100%',
            width: '100%'
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
