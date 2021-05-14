import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class CreateAccountStepCounter extends React.Component {
  render() {
    return (
      <View style={styles.stepsContainer}>
        <View
          style={{
            borderTopLeftRadius: 40,
            borderBottomLeftRadius: 40,
            borderTopRightRadius: this.props.step === 1 ? 40 : 0,
            borderBottomRightRadius: this.props.step === 1 ? 40 : 0,
            backgroundColor: 'black',
            flex: 1,
            justifyContent: 'center'
          }}
        >
          <Text style={[styles.text, { fontSize: onTablet ? 16 : 10 }]}>
            Step 1:
          </Text>
          <Text style={[styles.boldText, { fontSize: onTablet ? 18 : 12 }]}>
            EMAIL ADDRESS
          </Text>
        </View>

        <View
          style={[
            styles.centerContent,
            {
              flex: 1,
              paddingVertical: 5,
              borderTopRightRadius: this.props.step === 2 ? 40 : 0,
              borderBottomRightRadius: this.props.step === 2 ? 40 : 0,
              backgroundColor: this.props.step > 1 ? 'black' : null,
              justifyContent: 'center'
            }
          ]}
        >
          <Text style={[styles.text, { fontSize: onTablet ? 16 : 10 }]}>
            Step 2:
          </Text>
          <Text style={[styles.boldText, { fontSize: onTablet ? 18 : 12 }]}>
            SET A PASSWORD
          </Text>
        </View>

        <View
          style={[
            styles.centerContent,
            {
              flex: 1,
              paddingVertical: 5,
              borderTopRightRadius: this.props.step === 3 ? 40 : 0,
              borderBottomRightRadius: this.props.step === 3 ? 40 : 0,
              backgroundColor: this.props.step > 2 ? 'black' : null
            }
          ]}
        >
          <Text style={[styles.text, { fontSize: onTablet ? 16 : 10 }]}>
            Step 3:
          </Text>
          <Text style={[styles.boldText, { fontSize: onTablet ? 18 : 12 }]}>
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
