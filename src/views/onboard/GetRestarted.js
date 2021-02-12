/**
 * GetRestarted
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from 'react-native';
import FastImage from 'react-native-fast-image';

const windowDim = Dimensions.get('window');
const width = windowDim.width < windowDim.height ? windowDim.width : windowDim.height;
const height = windowDim.width > windowDim.height ? windowDim.width : windowDim.height;
const factor = (height / 812 + width / 375) / 2;

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
            height: height,
            width: width
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
              <View style={{ flex: 1 }} />
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('WELCOMEBACK')}
                style={[styles.centerContent, localStyles.getStartedContainer]}
              >
                <Text style={localStyles.getStarted}>GET STARTED</Text>
              </TouchableOpacity>
              <View style={{ flex: 1 }} />
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
    borderRadius: 15 * factor,
    margin: 20 * factor,
    height: 200,
    width: '80%'
  },
  pianoteText: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 18 * factor,
    textAlign: 'center',
    marginBottom: 20 * factor
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
    borderRadius: 15 * factor,
    flexDirection: 'row',
    zIndex: 5
  },
  image: {
    height: '100%',
    width: '100%',
    borderRadius: 15 * factor
  },
  description: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 18 * factor,
    textAlign: 'center',
    marginBottom: (155 * Dimensions.get('window').height) / 812
  },
  skip: {
    width: Dimensions.get('window').width,
    height: '13.5%',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 30 * factor
  },
  getStartedContainer: {
    width: '85%',
    height: '100%',
    borderRadius: 30 * factor,
    backgroundColor: '#fb1b2f',
    zIndex: 5
  },
  getStarted: {
    fontFamily: 'RobotoCondensed-Bold',
    fontSize: 18 * factor,
    color: 'white'
  }
});
