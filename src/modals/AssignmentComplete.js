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
              style={[styles.centerContent,]}
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
              <Text style={[styles.modalHeaderText]}>
                Assignment{'\n'}Complete
              </Text>
            </View>
            <View style={{height: 10*factorVertical}}/>
            <View key={'lessonTitle'}>
              <Text style={[styles.modalBodyText, {marginHorizontal: 20*factorHorizontal,}]}>
                Congratulations! You completed
              </Text>
              <Text style={[styles.modalBodyText, {marginHorizontal: 20*factorHorizontal, fontWeight: 'bold'}]}>
                {this.props.title}
              </Text>
              <View style={{height: 15*factorVertical}}/>
              <Text
                style={[styles.modalButtonText, {color: '#fb1b2f'}]}
              >
                YOU EARNED {this.props.xp} XP!
              </Text>
              <View style={{height: 10*factorVertical}}/>
            </View>
          </View>
        </TouchableOpacity>
      </BlurView>
    );
  };
}

export default withNavigation(AssignmentComplete);
