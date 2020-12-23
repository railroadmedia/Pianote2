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
import Modal from 'react-native-modal';
import { SafeAreaView } from 'react-navigation';
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
      <SafeAreaView
        style={{
          flexDirection: 'row',
          backgroundColor: this.props.isMethod ? 'black' : colors.mainBackground
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
            paddingTop: isNotch ? 5 * factorVertical : 0,
            paddingBottom: 10 * factorRatio,
            paddingRight: 10*factorHorizontal,
            paddingLeft: 5*factorHorizontal,
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
                                                                                                // TO DO FIX DIMENSIONS ON ANDROID
              height: Platform.OS == 'ios' ? (onTablet ? fullHeight*0.05 : fullHeight*0.035) : (onTablet ? fullHeight * 0.1 : fullHeight * 0.08),
              width: onTablet ? 0.14 * fullWidth : 0.3 * fullWidth,
              flexDirection: 'row',
            }}
          >
            <Pianote 
              fill={'#fb1b2f'} 
            />
            <View style={{flex: 1}}/>
          </TouchableOpacity>
          <View style={{width: 5*factorHorizontal}}/>
          <View style={{flex: 1}}/>
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
                size={18 * factorRatio}
                style={{ marginLeft: -2.5 }}
              />
            </View>
          </TouchableOpacity>
          <View style={{width: 7.5*factorHorizontal}}/>
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
          <View style={{width: 7.5*factorHorizontal}}/>
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
