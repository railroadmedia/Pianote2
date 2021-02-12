/**
 * SupportSignUp
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Linking
} from 'react-native';
import Intercom from 'react-native-intercom';
import Back from 'Pianote2/src/assets/img/svgs/back.svg';
import { SafeAreaView } from 'react-navigation';

const windowDim = Dimensions.get('window');
const width = windowDim.width < windowDim.height ? windowDim.width : windowDim.height;
const height = windowDim.width > windowDim.height ? windowDim.width : windowDim.height;
const factor = (height / 812 + width / 375) / 2;

export default class SupportSignUp extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = async () => {
    Intercom.registerUnidentifiedUser();
  };

  onIntercomPress = () => {
    Intercom.displayMessenger();
  };

  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <View
          style={{
            flex: 1,
            alignSelf: 'stretch',
            backgroundColor: colors.mainBackground
          }}
        >
          <View
            key={'header'}
            style={[
              styles.centerContent,
              {
                flex: 0.1
              }
            ]}
          >
            <View
              key={'goback'}
              style={[
                styles.centerContent,
                {
                  position: 'absolute',
                  left: 0,
                  paddingLeft: 5 * factor,
                  bottom: 0 * factor,
                  height: 50 * factor,
                  width: 50 * factor
                }
              ]}
            >
              <TouchableOpacity
                onPress={() => this.props.navigation.goBack()}
                style={[
                  styles.centerContent,
                  {
                    height: '100%',
                    width: '100%'
                  }
                ]}
              >
                <Back
                  width={(onTablet ? 17.5 : 25) * factor}
                  height={(onTablet ? 17.5 : 25) * factor}
                  fill={'white'}
                />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 0.66 }} />
            <Text
              style={{
                fontSize: 22 * factor,
                fontWeight: 'bold',
                fontFamily: 'OpenSans-Regular',
                color: colors.secondBackground
              }}
            >
              Support
            </Text>
            <View style={{ flex: 0.33 }} />
          </View>
          <ScrollView key={'contentContainer'} style={{ flex: 1 }}>
            <View style={{ height: '25%' }} />
            <View style={{ paddingHorizontal: '5%' }}>
              <Text
                style={{
                  fontFamily: 'OpenSans-Regular',
                  fontSize: 15.5 * factor,
                  color: colors.secondBackground
                }}
              ></Text>
            </View>
            <View style={{ height: '15%' }} />
            <View
              key={'chatSupport'}
              style={{
                height: '15%',
                width: '100%',
                flexDirection: 'row'
              }}
            >
              <View style={{ flex: 1 }} />
              <TouchableOpacity
                onPress={() => this.onIntercomPress()}
                style={[
                  styles.centerContent,
                  {
                    height: '100%',
                    width: '80%',
                    borderRadius: 200,
                    backgroundColor: '#fb1b2f'
                  }
                ]}
              >
                <Text
                  style={{
                    fontFamily: 'RobotoCondensed-Bold',
                    fontSize: 18 * factor,
                    color: 'white'
                  }}
                >
                  LIVE CHAT SUPPORT
                </Text>
              </TouchableOpacity>
              <View style={{ flex: 1 }} />
            </View>
            <View style={{ height: '4%' }} />
            <View
              key={'emailSupport'}
              style={{
                height: '15%',
                width: '100%',
                flexDirection: 'row'
              }}
            >
              <View style={{ flex: 1 }} />
              <TouchableOpacity
                onPress={() => Linking.openURL('mailto:support@musora.com')}
                style={[
                  styles.centerContent,
                  {
                    height: '100%',
                    width: '80%',
                    borderRadius: 200,
                    backgroundColor: '#fb1b2f'
                  }
                ]}
              >
                <Text
                  style={{
                    fontFamily: 'RobotoCondensed-Bold',
                    fontSize: 18 * factor,
                    color: 'white'
                  }}
                >
                  EMAIL SUPPORT
                </Text>
              </TouchableOpacity>
              <View style={{ flex: 1 }} />
            </View>
            <View style={{ height: '4%' }} />
            <View
              key={'phoneSupport'}
              style={{
                height: '15%',
                width: '100%',
                flexDirection: 'row'
              }}
            >
              <View style={{ flex: 1 }} />
              <TouchableOpacity
                onPress={() => Linking.openURL(`tel:${'18004398921'}`)}
                style={[
                  styles.centerContent,
                  {
                    height: '100%',
                    width: '80%',
                    borderRadius: 200,
                    backgroundColor: '#fb1b2f'
                  }
                ]}
              >
                <Text
                  style={{
                    fontFamily: 'RobotoCondensed-Bold',
                    fontSize: 18 * factor,
                    color: 'white'
                  }}
                >
                  PHONE SUPPORT
                </Text>
              </TouchableOpacity>
              <View style={{ flex: 1 }} />
            </View>
            <View style={{ height: 20 * factor }} />
            <Text
              key={'email'}
              style={{
                fontFamily: 'OpenSans-Regular',
                fontSize: 14 * factor,
                opacity: 0.8,
                color: colors.secondBackground,
                textAlign: 'center'
              }}
            >
              EMAIL
            </Text>
            <View style={{ height: 5 * factor }} />
            <Text
              key={'emailaddress'}
              style={{
                fontFamily: 'OpenSans-Regular',
                fontSize: 13.5 * factor,
                textAlign: 'center',
                color: 'white'
              }}
            >
              support@musora.com
            </Text>
            <View style={{ height: 20 * factor }} />
            <Text
              key={'phone'}
              style={{
                fontFamily: 'OpenSans-Regular',
                fontSize: 14 * factor,
                opacity: 0.8,
                color: colors.secondBackground,
                textAlign: 'center'
              }}
            >
              PHONE
            </Text>
            <View style={{ height: 5 * factor }} />
            <Text
              key={'phoneNumber'}
              style={{
                fontFamily: 'OpenSans-Regular',
                fontSize: 13.5 * factor,
                textAlign: 'center',
                color: 'white'
              }}
            >
              1-800-439-8921
            </Text>
            <View style={{ height: 5 * factor }} />
            <Text
              key={'phoneNumber2'}
              style={{
                fontFamily: 'OpenSans-Regular',
                fontSize: 13.5 * factor,
                textAlign: 'center',
                color: 'white'
              }}
            >
              1-604-921-6721
            </Text>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}
