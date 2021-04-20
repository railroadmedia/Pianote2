import React from 'react';
import { TouchableOpacity, View } from 'react-native';

export default class Discussions extends React.Component {
  render() {
    let { isDark } = this.props.route.params;
    return (
      <>
        <View
          style={{
            flex: 1,
            backgroundColor: isDark ? '#00101d' : 'white',
            padding: 10
          }}
        >
          <TouchableOpacity
            style={{ padding: 50, backgroundColor: 'blue' }}
            onPress={() => this.props.navigation.navigate('CreateDiscussion')}
          />
          <TouchableOpacity
            style={{ padding: 50, backgroundColor: 'black' }}
            onPress={this.props.navigation.goBack}
          />
        </View>
        {!!this.props.route.params.BottomNavigator && (
          <this.props.route.params.BottomNavigator currentPage={'Forum'} />
        )}
      </>
    );
  }
}
