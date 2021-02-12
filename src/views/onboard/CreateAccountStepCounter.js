import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const windowDim = Dimensions.get('window');
const width = windowDim.width < windowDim.height ? windowDim.width : windowDim.height;
const height = windowDim.width > windowDim.height ? windowDim.width : windowDim.height;
const factor = (height / 812 + width / 375) / 2;

export default class CreateAccountStepCounter extends React.Component {
  render() {
    return (
      <View style={styles.stepsContainer}>
        <View
          key={'step1'}
          style={{
            borderTopLeftRadius: 40 * factor,
            borderBottomLeftRadius: 40 * factor,
            borderTopRightRadius: this.props.step == 1 ? 40 * factor : 0,
            borderBottomRightRadius:
              this.props.step == 1 ? 40 * factor : 0,
            backgroundColor: 'black',
            flex: 1,
            paddingVertical: 7 * factor
          }}
        >
          <Text
            style={[
              styles.text,
              { fontSize: (onTablet ? 10 : 10) * factor }
            ]}
          >
            Step 1:
          </Text>
          <Text
            style={[
              styles.boldText,
              { fontSize: (onTablet ? 10 : 12) * factor }
            ]}
          >
            EMAIL ADDRESS
          </Text>
        </View>

        <View
          style={[
            styles.centerContent,
            {
              flex: 1,
              paddingVertical: 7 * factor,
              borderTopRightRadius: this.props.step == 2 ? 40 * factor : 0,
              borderBottomRightRadius:
                this.props.step == 2 ? 40 * factor : 0,
              backgroundColor: this.props.step > 1 ? 'black' : null
            }
          ]}
        >
          <Text
            style={[
              styles.text,
              { fontSize: (onTablet ? 10 : 10) * factor }
            ]}
          >
            Step 2:
          </Text>
          <Text
            style={[
              styles.boldText,
              { fontSize: (onTablet ? 10 : 12) * factor }
            ]}
          >
            SET A PASSWORD
          </Text>
        </View>

        <View
          style={[
            styles.centerContent,
            {
              flex: 1,
              paddingVertical: 7 * factor,
              borderTopRightRadius: this.props.step == 3 ? 40 * factor : 0,
              borderBottomRightRadius:
                this.props.step == 3 ? 40 * factor : 0,
              backgroundColor: this.props.step > 2 ? 'black' : null
            }
          ]}
        >
          <Text
            style={[
              styles.text,
              { fontSize: (onTablet ? 10 : 10) * factor }
            ]}
          >
            Step 3:
          </Text>
          <Text
            style={[
              styles.boldText,
              { fontSize: (onTablet ? 10 : 12) * factor }
            ]}
          >
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
