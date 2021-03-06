import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  SafeAreaView
} from 'react-native';
import Icon from '../assets/icons';
import AsyncStorage from '@react-native-community/async-storage';
import { NetworkContext } from '../context/NetworkProvider';
import { navigate } from '../../AppNavigator';

const windowDim = Dimensions.get('window');
const height =
  windowDim.width > windowDim.height ? windowDim.width : windowDim.height;
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

  componentDidMount() {
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
                  this.props.parentPage === nav.title.toUpperCase()
                    ? 'OpenSans-ExtraBold'
                    : 'OpenSans',
                color:
                  this.props.parentPage === nav.title.toUpperCase()
                    ? this.props.isMethod
                      ? 'red'
                      : 'white'
                    : this.props.isMethod
                    ? 'white'
                    : colors.secondBackground,
                fontSize:
                  this.props.parentPage === nav.title.toUpperCase()
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
      <SafeAreaView
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
          indicatorStyle={'white'}
          showsVerticalScrollIndicator={true}
          style={{
            flex: 1,
            maxHeight: (height / 10) * 7,
            width: '100%'
          }}
        >
          {this.lessonNav()}
        </ScrollView>
        <TouchableOpacity
          onPress={() => this.props.onClose(false)}
          style={[
            styles.centerContent,
            styles.redButton,
            {
              height: onTablet ? 80 : 65,
              width: onTablet ? 80 : 65,
              marginTop: 10,
              borderRadius: 500,
              alignSelf: 'center'
            }
          ]}
        >
          <Icon.Feather
            size={onTablet ? 65 : 50}
            name={'x'}
            color={'white'}
            style={{ borderRadius: 500 }}
          />
        </TouchableOpacity>
      </SafeAreaView>
    );
  };
}

const localStyles = StyleSheet.create({
  navContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
