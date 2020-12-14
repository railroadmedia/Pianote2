import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Animated,
  Platform,
  ScrollView,
  StyleSheet
} from 'react-native';

export default class CreateAccountStepCounter extends React.Component {
  render() {
    return (
      <View style={styles.stepsContainer}>
        <View
          key={'step1'}
          style={{
            borderTopLeftRadius: 40 * factorRatio,
            borderBottomLeftRadius: 40 * factorRatio,
            borderTopRightRadius: this.props.step == 1 ? 40 * factorRatio : 0,
            borderBottomRightRadius:
              this.props.step == 1 ? 40 * factorRatio : 0,
            backgroundColor: 'black',
            flex: 1,
            paddingVertical: 5
          }}
        >
          <Text style={[styles.text, { fontSize: 15 * factorRatio }]}>
            Step 1:
          </Text>
          <Text style={[styles.boldText, { fontSize: 15 * factorRatio }]}>
            EMAIL ADDRESS
          </Text>
        </View>

        <View
          style={[
            styles.centerContent,
            {
              flex: 1,
              paddingVertical: 5,
              borderTopRightRadius: this.props.step == 2 ? 40 * factorRatio : 0,
              borderBottomRightRadius:
                this.props.step == 2 ? 40 * factorRatio : 0,
              backgroundColor: this.props.step > 1 ? 'black' : null
            }
          ]}
        >
          <Text style={[styles.text, { fontSize: 15 * factorRatio }]}>
            Step 2:
          </Text>
          <Text style={[styles.boldText, { fontSize: 15 * factorRatio }]}>
            SET A PASSWORD
          </Text>
        </View>

        <View
          style={[
            styles.centerContent,
            {
              flex: 1,
              paddingVertical: 5,
              borderTopRightRadius: this.props.step == 3 ? 40 * factorRatio : 0,
              borderBottomRightRadius:
                this.props.step == 3 ? 40 * factorRatio : 0,
              backgroundColor: this.props.step > 2 ? 'black' : null
            }
          ]}
        >
          <Text style={[styles.text, { fontSize: 15 * factorRatio }]}>
            Step 3:
          </Text>
          <Text style={[styles.boldText, { fontSize: 15 * factorRatio }]}>
            CHOOSE A PLAN
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  stepsContainer: {
    marginHorizontal: 10,
    borderRadius: 50,
    borderWidth: 2,
    backgroundColor: 'rgba(23, 24, 25, 0.6)',
    flexDirection: 'row'
  },
  text: {
    fontFamily: 'OpenSans-Regular',
    fontWeight: '400',
    textAlign: 'center',
    color: 'white'
  },
  boldText: {
    fontFamily: 'OpenSans-Regular',
    fontWeight: '600',
    textAlign: 'center',
    color: 'white'
  }
});
