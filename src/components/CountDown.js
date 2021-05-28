import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Back from 'Pianote2/src/assets/img/svgs/back.svg';
import { goBack } from '../../AppNavigator';

export default class CountDown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeDiff: '',
      hours: '',
      minutes: '',
      seconds: ''
    };
  }

  componentDidMount() {
    this.interval = setInterval(() => this.timer(), 1000);
  }

  timer() {
    let timeNow = Math.floor(Date.now() / 1000);
    let timeLive =
      new Date(this.props.live_event_start_time + ' UTC').getTime() / 1000;
    let timeDiff = timeLive - timeNow;
    let hours = Math.floor(timeDiff / 3600);
    let minutes = Math.floor((timeDiff - hours * 3600) / 60);
    let seconds = timeDiff - hours * 3600 - minutes * 60;

    this.setState({
      timeDiffLive: {
        timeDiff,
        hours,
        minutes,
        seconds
      }
    });
    if (timeDiff <= 0) {
      this.props.timesUp();
      clearInterval(this.interval);
    }
  }

  render = () => {
    return (
      <View
        style={{
          position: 'absolute',
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
          alignSelf: 'stretch',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1
        }}
      >
        <View
          style={{
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            alignSelf: 'stretch',
            height: '100%',
            width: '100%',
            borderRadius: 10
          }}
        >
          <LinearGradient
            colors={[
              'transparent',
              'rgba(20, 20, 20, 0.5)',
              'rgba(0, 0, 0, 1)'
            ]}
            style={{
              borderRadius: 0,
              width: '100%',
              height: '100%',
              position: 'absolute',
              left: 0,
              bottom: 0
            }}
          />
          {this.props.onLivePage && (
            <TouchableOpacity
              style={{
                position: 'absolute',
                padding: 10,
                left: 0,
                top: 0
              }}
              onPress={() => goBack()}
            >
              <Back
                width={backButtonSize}
                height={backButtonSize}
                fill={'white'}
              />
            </TouchableOpacity>
          )}
          {!this.props.onLivePage && (
            <Text
              style={{
                color: 'white',
                fontFamily: 'OpenSans-Bold',
                position: 'absolute',
                fontSize: onTablet ? 16 : 12,
                left: 5,
                top: 10
              }}
            >
              UPCOMING EVENT
            </Text>
          )}
          <Text>
            <View>
              <Text
                style={{
                  color: 'white',
                  fontFamily: 'OpenSans-Bold',
                  fontSize: onTablet ? 60 : 40,
                  textAlign: 'center'
                }}
              >
                {this.state.timeDiffLive?.hours}
              </Text>
              <Text
                style={{
                  color: 'white',
                  fontFamily: 'OpenSans-Bold',
                  top: 0,
                  textAlign: 'center'
                }}
              >
                HOURS
              </Text>
            </View>
            <View>
              <Text
                style={{
                  color: 'white',
                  fontFamily: 'OpenSans-Bold',
                  fontSize: onTablet ? 60 : 40
                }}
              >
                {' '}
                :{' '}
              </Text>
              <Text
                style={{
                  color: 'white',
                  fontFamily: 'OpenSans-Bold',
                  top: 0,
                  textAlign: 'center',
                  color: 'transparent'
                }}
              >
                h
              </Text>
            </View>
            <View>
              <Text
                style={{
                  color: 'white',
                  fontFamily: 'OpenSans-Bold',
                  fontSize: onTablet ? 60 : 40,
                  textAlign: 'center'
                }}
              >
                {this.state.timeDiffLive?.minutes}
              </Text>
              <Text
                style={{
                  color: 'white',
                  fontFamily: 'OpenSans-Bold',
                  top: 0,
                  textAlign: 'center'
                }}
              >
                MINUTES
              </Text>
            </View>
            <View>
              <Text
                style={{
                  color: 'white',
                  fontFamily: 'OpenSans-Bold',
                  fontSize: onTablet ? 60 : 40
                }}
              >
                {' '}
                :{' '}
              </Text>
              <Text
                style={{
                  color: 'white',
                  fontFamily: 'OpenSans-Bold',
                  top: 0,
                  textAlign: 'center',
                  color: 'transparent'
                }}
              >
                h
              </Text>
            </View>
            <View>
              <Text
                style={{
                  color: 'white',
                  fontFamily: 'OpenSans-Bold',
                  fontSize: onTablet ? 60 : 40,
                  textAlign: 'center'
                }}
              >
                {this.state.timeDiffLive?.seconds}
              </Text>
              <Text
                style={{
                  color: 'white',
                  fontFamily: 'OpenSans-Bold',
                  top: 0,
                  textAlign: 'center'
                }}
              >
                SECONDS
              </Text>
            </View>
          </Text>
        </View>
      </View>
    );
  };
}
