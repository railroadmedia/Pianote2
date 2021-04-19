import React from 'react';
import {View, Text, TouchableOpacity, StatusBar} from 'react-native';
import Modal from 'react-native-modal';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Pianote from 'Pianote2/src/assets/img/svgs/pianote.svg';
import NavigationMenu from 'Pianote2/src/components/NavigationMenu.js';
import {NetworkContext} from '../context/NetworkProvider';
import {SafeAreaView} from 'react-navigation';
import {navigate} from '../../AppNavigator';

export default class NavMenuHeaders extends React.Component {
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    this.state = {
      showModalMenu: false,
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
        }}
        forceInset={{top: 'always'}}
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
            width: '100%',
            padding: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              !this.context.isConnected
                ? this.context.showNoConnectionAlert()
                : navigate(isPackOnly ? 'PACKS' : 'LESSONS');
            }}
            style={{
              height: onTablet ? 45 : 30,
              width: onTablet ? 135 : 88,
            }}
          >
            <Pianote fill={'#fb1b2f'} />
          </TouchableOpacity>
          <View style={{flex: 1}} />
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              style={[
                styles.centerContent,
                {
                  flexDirection: 'row',
                  paddingRight: 10,
                },
              ]}
              onPress={() => {
                !this.context.isConnected
                  ? this.context.showNoConnectionAlert()
                  : isPackOnly
                  ? expirationDate
                    ? navigate('MEMBERSHIPEXPIRED')
                    : navigate('NEWMEMBERSHIP', {
                        data: {type: 'PACKONLY'},
                      })
                  : this.setState({showModalMenu: true});
              }}
            >
              <Text
                numberOfLines={1}
                style={{
                  fontSize: onTablet ? 20 : 14,
                  fontFamily: 'OpenSans-ExtraBold',
                  color:
                    this.props.currentPage == 'LESSONS'
                      ? 'white'
                      : this.props.isMethod
                      ? 'white'
                      : colors.secondBackground,
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
                  size={onTablet ? 26 : 18}
                  style={{marginLeft: -2.5}}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                !this.context.isConnected
                  ? this.context.showNoConnectionAlert()
                  : navigate('PACKS');
              }}
              style={[
                styles.centerContent,
                {
                  paddingRight: 10,
                },
              ]}
            >
              <Text
                numberOfLines={1}
                style={{
                  fontSize: onTablet ? 20 : 14,
                  fontFamily: 'OpenSans-ExtraBold',
                  color:
                    this.props.currentPage == 'PACKS'
                      ? 'white'
                      : this.props.isMethod
                      ? 'white'
                      : colors.secondBackground,
                }}
              >
                PACKS{' '}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                !this.context.isConnected
                  ? this.context.showNoConnectionAlert()
                  : navigate('MYLIST');
              }}
              style={styles.centerContent}
            >
              <Text
                numberOfLines={1}
                style={{
                  fontSize: onTablet ? 20 : 14,
                  shadowOpacity: 0.3,
                  fontFamily: 'OpenSans-Regular',
                  fontFamily: 'OpenSans-ExtraBold',
                  color:
                    this.props.currentPage == 'MYLIST'
                      ? 'white'
                      : this.props.isMethod
                      ? 'white'
                      : colors.secondBackground,
                }}
              >
                MY LIST{' '}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <Modal
          isVisible={this.state.showModalMenu}
          style={styles.modalContainer}
          animation={'slideInUp'}
          animationInTiming={250}
          animationOutTiming={250}
          coverScreen={true}
          hasBackdrop={false}
        >
          <NavigationMenu
            isMethod={this.props.isMethod}
            onClose={e => this.setState({showModalMenu: e})}
            menu={this.state.menu}
            parentPage={this.props.parentPage}
          />
        </Modal>
      </SafeAreaView>
    );
  };
}
