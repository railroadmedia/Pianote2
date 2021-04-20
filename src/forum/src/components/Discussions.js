import React from 'react';
import { TouchableOpacity, View } from 'react-native';

export default class Discussion extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'red' }}>
        <TouchableOpacity
          style={{ padding: 50, backgroundColor: 'blue' }}
          onPress={() => this.props.navigation.navigate('CreateDiscussion')}
        />
        <TouchableOpacity
          style={{ padding: 50, backgroundColor: 'black' }}
          onPress={this.props.navigation.goBack}
        />
        {!!this.props.route.params.BottomNavigator && (
          <this.props.route.params.BottomNavigator currentPage={'Forum'} />
        )}
      </View>
    );
  }
}
