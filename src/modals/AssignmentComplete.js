/**
 * AssignmentComplete
 */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation';
import { BlurView } from '@react-native-community/blur';
import IonIcon from 'react-native-vector-icons/Ionicons';

class AssignmentComplete extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {};
  }

  render = () => {
    return (
      <BlurView style={{ flex: 1 }} blurAmount={5}>
        <TouchableOpacity
          key={'content'}
          onPress={() => this.props.hideAssignmentComplete()}
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent'
          }}
        >
          <View
            key={'content'}
            style={{
              backgroundColor: 'white',
              borderRadius: 10 * factorRatio,
              padding: 30
            }}
          >
            <View
              key={'trophy'}
              style={[styles.centerContent, { padding: 5 * factorRatio }]}
            >
              <IonIcon
                name={'ios-trophy'}
                size={36 * factorRatio}
                color={'#fb1b2f'}
              />
            </View>
            <View
              key={'complete'}
              style={[styles.centerContent, { padding: 5 * factorRatio }]}
            >
              <Text
                style={{
                  fontFamily: 'OpenSans-Regular',
                  fontSize: 25 * factorRatio,
                  fontWeight: '700',
                  textAlign: 'center'
                }}
              >
                Assignment{'\n'}Complete
              </Text>
            </View>
            <View style={{ height: 5 * factorRatio }} />
            <View key={'lessonTitle'}>
              <Text
                style={{
                  fontFamily: 'OpenSans-Regular',
                  fontSize: 16 * factorRatio,
                  fontWeight: '300',
                  textAlign: 'center'
                }}
              >
                Congratulations! You completed
              </Text>
              <View style={{ height: 5 * factorRatio }} />
              <Text
                style={{
                  fontFamily: 'OpenSans-Regular',
                  fontSize: 16 * factorRatio,
                  fontWeight: '700',
                  textAlign: 'center'
                }}
              >
                {this.props.title}
              </Text>
              <View style={{ height: 5 * factorRatio }} />
              <Text
                style={{
                  fontFamily: 'OpenSans-Regular',
                  fontSize: 16 * factorRatio,
                  fontWeight: '800',
                  textAlign: 'center',
                  color: '#fb1b2f'
                }}
              >
                YOU EARNED {this.props.xp} XP!
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </BlurView>
    );
  };
}

export default withNavigation(AssignmentComplete);
