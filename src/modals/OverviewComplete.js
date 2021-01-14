/**
 * OverviewComplete
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from 'react-native';
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
      <BlurView style={[styles.container, styles.centerContent]} blurAmount={5}>
        <TouchableOpacity
          style={[styles.centerContent, styles.container]}
          onPress={() => this.props.hideOverviewComplete()}
        >
          <View style={localStyles.container}>
            <View style={[styles.centerContent]}>
              <IonIcon
                name={'ios-trophy'}
                size={36 * factorRatio}
                color={'#fb1b2f'}
              />
            </View>
            <View style={[styles.centerContent, { padding: 5 * factorRatio }]}>
              <Text style={[styles.modalHeaderText]}>
                {this.changeType(this.props.type).toUpperCase()}
                {'\n'}Complete
              </Text>
            </View>
            <Text style={[styles.modalBodyText, localStyles.congrats]}>
              Congratulations! You completed
            </Text>
            <Text style={[styles.modalBodyText, localStyles.title]}>
              {this.props.title}
            </Text>
            <Text style={[styles.modalButtonText, localStyles.xp]}>
              YOU EARNED {this.props.xp} XP!
            </Text>
          </View>
        </TouchableOpacity>
      </BlurView>
    );
  };
}

const localStyles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius:
      (10 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
    marginHorizontal: 30,
    paddingVertical: 30
  },
  congrats: {
    textAlign: 'center',
    marginVertical:
      (5 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
    marginHorizontal: (20 * Dimensions.get('window').width) / 375
  },
  title: {
    marginHorizontal: (20 * Dimensions.get('window').width) / 375,
    marginBottom:
      (15 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
    fontWeight: 'bold'
  },
  xp: {
    color: '#fb1b2f'
  }
});

export default withNavigation(OverviewComplete);
