import React from 'react';
import { Text, TouchableOpacity, StatusBar } from 'react-native';
import Modal from 'react-native-modal';
import Icon from '../assets/icons';
import Pianote from '../assets/img/svgs/pianote.svg';
import NavigationMenu from '../../src/components/NavigationMenu.js';
import { NetworkContext } from '../context/NetworkProvider';
import { SafeAreaView } from 'react-navigation';
import { navigate } from '../../AppNavigator';

export default class NavMenuHeaders extends React.Component {
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    this.state = { showModalMenu: false };
  }

  render = () => {
    return (
      <SafeAreaView
        forceInset={{ top: 'always' }}
        style={{
          flexDirection: 'row',
          backgroundColor: this.props.isMethod
            ? 'black'
            : colors.mainBackground,
          width: '100%',
          padding: 10,
          justifyContent: 'space-between'
        }}
      >
        <StatusBar
          backgroundColor={
            this.props.isMethod ? 'black' : colors.mainBackground
          }
          barStyle={'light-content'}
        />
        <TouchableOpacity
          onPress={() => {
            !this.context.isConnected
              ? this.context.showNoConnectionAlert()
              : navigate(isPackOnly ? 'PACKS' : 'LESSONS');
          }}
          style={{
            height: onTablet ? 45 : 30,
            width: onTablet ? 135 : 88
          }}
        >
          <Pianote fill={'#fb1b2f'} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.centerContent,
            {
              flexDirection: 'row',
              paddingRight: 10,
              flex: 1,
              justifyContent: 'flex-end'
            }
          ]}
          onPress={() => {
            !this.context.isConnected
              ? this.context.showNoConnectionAlert()
              : isPackOnly
              ? expirationDate
                ? navigate('MEMBERSHIPEXPIRED')
                : navigate('NEWMEMBERSHIP', {
                    data: { type: 'PACKONLY' }
                  })
              : this.setState({ showModalMenu: true });
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              fontSize: onTablet ? 20 : 14,
              fontFamily: 'OpenSans-ExtraBold',
              color:
                this.props.currentPage === 'LESSONS' || this.props.isMethod
                  ? 'white'
                  : colors.secondBackground
            }}
          >
            LESSONS{' '}
          </Text>
          <Icon.Entypo
            name={'chevron-down'}
            color={
              this.props.currentPage === 'LESSONS' || this.props.isMethod
                ? 'white'
                : colors.secondBackground
            }
            size={onTablet ? 26 : 18}
            style={{ marginLeft: -2.5 }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.centerContent, { paddingRight: 10 }]}
          onPress={() => {
            !this.context.isConnected
              ? this.context.showNoConnectionAlert()
              : navigate('PACKS');
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              fontSize: onTablet ? 20 : 14,
              fontFamily: 'OpenSans-ExtraBold',
              color:
                this.props.currentPage === 'PACKS' || this.props.isMethod
                  ? 'white'
                  : colors.secondBackground
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
                this.props.currentPage === 'MYLIST' || this.props.isMethod
                  ? 'white'
                  : colors.secondBackground
            }}
          >
            MY LIST{' '}
          </Text>
        </TouchableOpacity>
        <Modal
          isVisible={this.state.showModalMenu}
          style={styles.modalContainer}
          animation={'slideInUp'}
          animationInTiming={250}
          animationOutTiming={250}
          coverScreen={true}
          hasBackdrop={false}
          onBackButtonPress={() => this.setState({ showModalMenu: false })}
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
