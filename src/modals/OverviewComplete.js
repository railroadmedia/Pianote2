/**
 * OverviewComplete
 */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation';
import { BlurView } from '@react-native-community/blur';
import IonIcon from 'react-native-vector-icons/Ionicons';

class OverviewComplete extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {};
  }

  changeType = word => {
    word = word.replace(/[- )(]/g, ' ').split(' ');
    let string = '';

    for (let i = 0; i < word.length; i++) {
      if (word[i] !== 'and') {
        word[i] = word[i][0].toUpperCase() + word[i].substr(1);
      }
    }

    for (i in word) {
      string = string + word[i] + ' ';
    }

    return string;
  };

  render = () => {
    return (
      <BlurView style={{ flex: 1 }} blurAmount={5}>
        <TouchableOpacity
          key={'content'}
          onPress={() => this.props.hideOverviewComplete()}
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
              marginHorizontal: 30,
              paddingVertical: 30
            }}
          >
            <View style={[styles.centerContent]}>
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
              <Text style={[styles.modalHeaderText]}>
                {this.changeType(this.props.type).toUpperCase()}
                {'\n'}Complete
              </Text>
            </View>
            <View style={{ height: 5 * factorRatio }} />
            <View key={'lessonTitle'}>
              <Text
                style={[styles.modalBodyText, {
                  textAlign: 'center',
                  marginHorizontal: 20*factorHorizontal,
                }]}
              >
                Congratulations! You completed
              </Text>
              <View style={{ height: 5 * factorRatio }} />
              <Text style={[styles.modalBodyText, {marginHorizontal: 20*factorHorizontal, fontWeight: 'bold'}]}>
                {this.props.title}
              </Text>
              <View style={{ height: 15 * factorRatio }} />
              <Text
                style={[styles.modalButtonText, {
                  color: '#fb1b2f'
                }]}
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

export default withNavigation(OverviewComplete);
