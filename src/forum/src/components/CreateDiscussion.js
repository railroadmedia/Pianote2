import React from 'react';
import { TouchableOpacity, View } from 'react-native';

export default class CreateDiscussion extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'blue' }}>
        <TouchableOpacity
          style={{ padding: 50, backgroundColor: 'red' }}
          onPress={this.props.navigation.goBack}
        />
        <TouchableOpacity
          style={{ padding: 50, backgroundColor: 'black' }}
          onPress={() => this.props.navigation.navigate('LESSONS')}
        />
        <TouchableOpacity
          style={{ padding: 50, backgroundColor: 'green' }}
          onPress={() => this.props.navigation.navigate('Forum')}
        />
      </View>
    );
  }
}
