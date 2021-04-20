import React from 'react';
import { TouchableOpacity, View } from 'react-native';

export default class Discussions extends React.Component {
  static contextType;
  constructor(props) {
    super(props);
    Discussions.contextType = props.route.params.NetworkContext;
  }
  render() {
    let {
      route: {
        params: { isDark, BottomNavigator }
      },
      navigation: { navigate, goBack }
    } = this.props;
    return (
      <>
        <View
          style={{
            flex: 1,
            backgroundColor: isDark ? '#00101d' : 'white',
            padding: 15
          }}
        >
          <TouchableOpacity
            style={{ padding: 50, backgroundColor: 'blue' }}
            onPress={() => navigate('CreateDiscussion')}
          />
          <TouchableOpacity
            style={{ padding: 50, backgroundColor: 'black' }}
            onPress={goBack}
          />
        </View>
        {!!BottomNavigator && <BottomNavigator currentPage={'Forum'} />}
      </>
    );
  }
}
