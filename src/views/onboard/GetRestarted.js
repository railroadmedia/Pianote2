/**
 * GetRestarted
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import FastImage from 'react-native-fast-image';

export default class GetRestarted extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.centerContent}>
        <View
          style={{
            height: '100%',
            width: '100%'
          }}
        >
          <View
            style={[
              styles.centerContent,
              {
                flex: 0.53,
                alignSelf: 'stretch'
              }
            ]}
          >
            <View style={[styles.centerContent, localStyles.outerContainer]}>
              <View style={localStyles.innerContainer}>
                <View style={{ flex: 1 }}>
                  <FastImage
                    style={localStyles.image}
                    source={require('Pianote2/src/assets/img/imgs/onboarding-welcome-back.png')}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                </View>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 0.47,
              backgroundColor: 'white',
              alignSelf: 'stretch'
            }}
          >
            <Text style={localStyles.pianoteText}>
              Welcome to the Pianote app!
            </Text>
            <Text style={localStyles.description}>
              We're so glad you decided to give us{'\n'}another chance. Pick up
              where you{'\n'}left off or you can start exploring!
            </Text>
            <View style={localStyles.skip}>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('WELCOMEBACK')}
                style={[styles.centerContent, localStyles.getStartedContainer]}
              >
                <Text style={localStyles.getStarted}>GET STARTED</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const localStyles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 15,
    margin: 20,
    height: 200,
    width: '80%'
  },
  pianoteText: {
    fontFamily: 'OpenSans-Bold',
    fontSize: DeviceInfo.isTablet() ? 24 : 18,
    textAlign: 'center',
    marginBottom: 20
  },
  outerContainer: {
    position: 'absolute',
    height: '80%',
    width: '100%',
    zIndex: 2
  },
  innerContainer: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 15,
    flexDirection: 'row',
    zIndex: 5
  },
  image: {
    height: '100%',
    width: '100%',
    borderRadius: 15
  },
  description: {
    fontFamily: 'OpenSans-Regular',
    fontSize: DeviceInfo.isTablet() ? 22 : 16,
    textAlign: 'center',
    flex: 1
  },
  skip: {
    width: '100%',
    height: '13.5%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 100,
    marginBottom: 20
  },
  getStartedContainer: {
    width: '85%',
    height: '100%',
    borderRadius: 300,
    backgroundColor: '#fb1b2f',
    zIndex: 5
  },
  getStarted: {
    fontFamily: 'RobotoCondensed-Bold',
    fontSize: DeviceInfo.isTablet() ? 24 : 18,
    color: 'white'
  }
});
