/**
 * BlurredList
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import FeatherIcon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-community/async-storage';
import { NetworkContext } from '../context/NetworkProvider';
import { navigate } from '../../AppNavigator';

const windowDim = Dimensions.get('window');
const height =
  windowDim.width > windowDim.height ? windowDim.width : windowDim.height;

const navigationOptions = [
  {
    title: 'Home',
    navigator: 'HOME'
  },
  {
    title: 'Method',
    navigator: 'METHOD'
  },
  {
    title: 'Foundations',
    navigator: 'FOUNDATIONS'
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
    title: 'Quick Tips',
    navigator: 'STUDENTFOCUSSHOW'
  },
  {
    title: 'Student Focus',
    navigator: 'STUDENTFOCUSCATALOG'
  },
  {
    title: 'Live',
    navigator: 'LIVE'
  },
  {
    title: 'Schedule',
    navigator: 'SCHEDULE'
  },
  {
    title: 'Podcasts',
    navigator: 'STUDENTFOCUSSHOW'
  },
  {
    title: 'Bootcamps',
    navigator: 'STUDENTFOCUSSHOW'
  }
];

export default class NavigationMenu extends React.Component {
  static contextType = NetworkContext;

  constructor(props) {
    super(props);
    this.state = {
      methodIsStarted: false,
      methodIsCompleted: false
    };
  }

  async componentDidMount() {
    AsyncStorage.multiGet(['methodIsStarted', 'methodIsCompleted']).then(data =>
      this.setState({
        methodIsStarted:
          typeof data[0][1] !== null ? JSON.parse(data[0][1]) : false,
        methodIsCompleted:
          typeof data[1][1] !== null ? JSON.parse(data[1][1]) : false
      })
    );
  }

  lessonNav() {
    return (
      <>
        {navigationOptions.map((nav, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              if (!this.context.isConnected)
                return this.context.showNoConnectionAlert();
              this.props.onClose(false);
              if (nav.title === 'Method') {
                navigate('METHOD', {
                  methodIsStarted: this.state.methodIsStarted,
                  methodIsCompleted: this.state.methodIsCompleted
                });
              } else if (nav.title === 'Quick Tips') {
                navigate(nav.navigator, {
                  type: 'quick-tips'
                });
              } else if (nav.title === 'Podcasts') {
                navigate(nav.navigator, {
                  type: 'podcasts'
                });
              } else if (nav.title === 'Bootcamps') {
                navigate(nav.navigator, {
                  type: 'boot-camps'
                });
              } else if (nav.title === 'Live') {
                navigate(nav.navigator, {
                  title: nav.title,
                  parent: 'live'
                });
              } else if (nav.title === 'Schedule') {
                return navigate(nav.navigator, {
                  title: nav.title,
                  parent: 'SCHEDULE'
                });
              } else {
                navigate(nav.navigator);
              }
            }}
            style={[
              styles.centerContent,
              {
                height: height / 10
              }
            ]}
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
                    ? onTablet
                      ? 40
                      : 30
                    : onTablet
                    ? 25
                    : 20
              }}
            >
              {nav.title}
            </Text>
          </TouchableOpacity>
        ))}
      </>
    );
  }

  render = () => {
    return (
      <View
        style={[
          localStyles.navContainer,
          {
            backgroundColor: this.props.isMethod
              ? 'black'
              : colors.mainBackground
          }
        ]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            flex: 1,
            maxHeight: (height / 10) * 7
          }}
        >
          {this.lessonNav()}
        </ScrollView>
        <View style={{ alignSelf: 'center' }}>
          <TouchableOpacity
            onPress={() => {
              this.props.onClose(false);
            }}
            style={[
              styles.centerContent,
              styles.redButton,
              {
                height: onTablet ? 80 : 65,
                width: onTablet ? 80 : 65,
                marginTop: 10,
                borderRadius: 500
              }
            ]}
          >
            <View style={{ flex: 1 }} />
            <FeatherIcon
              size={onTablet ? 65 : 50}
              name={'x'}
              color={'white'}
              style={{ borderRadius: 500 }}
            />
            <View style={{ flex: 1 }} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
}

const localStyles = StyleSheet.create({
  navContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: DeviceInfo.hasNotch() ? 50 : 30,
    paddingBottom: DeviceInfo.hasNotch() ? 30 : 10
  }
});
