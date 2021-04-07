/**
 * Loading
 */
import React from 'react';
import {
  View,
  TouchableWithoutFeedback,
  ActivityIndicator,
  StyleSheet,
  Dimensions
} from 'react-native';

export default class Loading extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render = () => {
    return (
      <TouchableWithoutFeedback style={styles.container}>
        <View style={[styles.centerContent, styles.container]}>
          <View style={localStyles.container}>
            <View style={{ flex: 1 }} />
            <ActivityIndicator
              size={onTablet ? 'large' : 'small'}
              color={colors.pianoteRed}
              animating={true}
            />
            <View style={{ flex: 1 }} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };
}

const localStyles = StyleSheet.create({
  container: {
    borderRadius:
      (15 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
    margin:
      (20 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
    height: 200,
    width: '100%'
  }
});
