/**
 * BlurredList
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { withNavigation } from 'react-navigation';
import FeatherIcon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-community/async-storage';
import { NetworkContext } from '../context/NetworkProvider';

const navigationOptions = [
  {
    title: 'Home',
    navigator: 'LESSONS'
  },
  {
    title: 'Method',
    navigator: 'METHOD'
  },
  {
    title: 'Courses',
    navigator: 'COURSE'
  },
  {
    title: 'Songs',
    navigator: 'SONGCATALOG'
  },
  {
    title: 'Student Focus',
    navigator: 'STUDENTFOCUSCATALOG'
  },
  {
    title: 'Podcasts',
    navigator: 'STUDENTFOCUSSHOW'
  },
  {
    title: 'Quick Tips',
    navigator: 'STUDENTFOCUSSHOW'
  }
];

class NavigationMenu extends React.Component {
  static contextType = NetworkContext;
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {
      methodIsStarted: false,
      methodIsCompleted: false
    };
  }

  UNSAFE_componentWillMount = async () => {
    let data = await AsyncStorage.multiGet([
      'methodIsStarted',
      'methodIsCompleted'
    ]);

    this.setState({
      methodIsStarted:
        typeof data[0][1] !== null ? JSON.parse(data[0][1]) : false,
      methodIsCompleted:
        typeof data[1][1] !== null ? JSON.parse(data[1][1]) : false
    });
  };

  lessonNav() {
    return (
      <View style={{ flex: 1 }}>
        {navigationOptions.map((nav, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              if (!this.context.isConnected)
                return this.context.showNoConnectionAlert();
              this.props.onClose(false);
              if (nav.title === 'Method') {
                this.props.navigation.navigate('METHOD', {
                  methodIsStarted: this.state.methodIsStarted,
                  methodIsCompleted: this.state.methodIsCompleted
                });
              } else if (nav.title === 'Quick Tips') {
                this.props.navigation.navigate(nav.navigator, {
                  type: 'quick-tips'
                });
              } else if (nav.title === 'Podcasts') {
                this.props.navigation.navigate(nav.navigator, {
                  type: 'podcasts'
                });
              } else {
                this.props.navigation.navigate(nav.navigator);
              }
            }}
            style={{ flex: 1, alignSelf: 'center' }}
          >
            <Text
              style={{
                fontFamily:
                  this.props.parentPage == nav.title.toUpperCase()
                    ? 'OpenSans-ExtraBold'
                    : 'OpenSans',
                color:
                  this.props.parentPage == nav.title.toUpperCase()
                    ? this.props.isMethod
                      ? 'red'
                      : 'white'
                    : this.props.isMethod
                    ? 'white'
                    : colors.secondBackground,
                fontSize:
                  this.props.parentPage == nav.title.toUpperCase()
                    ? 35 * factorVertical
                    : 25 * factorVertical
              }}
            >
              {nav.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  render = () => {
    return (
      <View
        style={[
          localStyles.navContainer, {
          backgroundColor: this.props.isMethod
            ? 'black'
            : colors.mainBackground,
        }]}
      >
        {this.lessonNav()}
        <View
          style={{alignSelf: 'center'}}
        >
          <TouchableOpacity
            onPress={() => {
              this.props.onClose(false);
            }}
            style={[
              styles.centerContent,
              styles.redButton,
              {
                height: 65 * factorVertical,
                width: 65 * factorVertical,
                borderRadius: 500
              }
            ]}
          >
            <View style={{ flex: 1 }} />
            <FeatherIcon
              size={40 * factorVertical}
              name={'x'}
              color={'white'}
              style={{ borderRadius: 500 }}
            />
            <View style={{ flex: 1 }} />
          </TouchableOpacity>
        </View>
        <View style={{ height: 30 * factorVertical }} />
      </View>
    );
  };
}

const localStyles = StyleSheet.create({
  navContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    paddingVertical: 30 * (
      Dimensions.get('window').height / 812 +
      Dimensions.get('window').width / 375 ) / 2,
  }
});

export default withNavigation(NavigationMenu);
