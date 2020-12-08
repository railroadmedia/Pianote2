/**
 * BlurredList
 */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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
      foundationIsStarted: false,
      foundationIsCompleted: false
    };
  }

  UNSAFE_componentWillMount = async () => {
    let data = await AsyncStorage.multiGet([
      'foundationsIsStarted',
      'foundationsIsCompleted'
    ]);

    this.setState({
      foundationIsStarted:
        typeof data[0][1] !== null ? JSON.parse(data[0][1]) : false,
      foundationIsCompleted:
        typeof data[1][1] !== null ? JSON.parse(data[1][1]) : false
    });
  };

  lessonNav() {
    return (
      <View style={{ flex: 0.85 }}>
        {navigationOptions.map((nav, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              if (!this.context.isConnected)
                return this.context.showNoConnectionAlert();
              this.props.onClose(false);
              if (nav.title === 'Foundations') {
                this.props.navigation.navigate('FOUNDATIONS', {
                  foundationIsStarted: this.state.foundationIsStarted,
                  foundationIsCompleted: this.state.foundationIsCompleted
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
                    : 'OpenSans-Bold',
                color:
                  this.props.parentPage == nav.title.toUpperCase()
                    ? 'white'
                    : (this.props.isMethod ? colors.pianoteGrey : colors.secondBackground),
                fontSize:
                  (this.props.parentPage == nav.title.toUpperCase()
                    ? 32.5 * factorRatio
                    : 27.5 * factorRatio) + (onTablet ? 5 : 0)
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
        key={'componentContainer'}
        style={{
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: this.props.isMethod ? 'black' : colors.mainBackground,
          paddingVertical: 30 * factorRatio
        }}
      >
        <View style={{height: 30*factorVertical}}/>
        {this.lessonNav()}
        <View
          style={{
            flex: 0.1,
            alignSelf: 'center'
          }}
        >
          <TouchableOpacity
            onPress={() => {
              this.props.onClose(false);
            }}
            style={styles.redButton}
          >
            <FeatherIcon
              size={40 * factorRatio}
              name={'x'}
              color={'white'}
              style={{ padding: 10 }}
            />
          </TouchableOpacity>
        </View>
        <View style={{height: 30*factorVertical}}/>
      </View>
    );
  };
}

export default withNavigation(NavigationMenu);
