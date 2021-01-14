/**
 * AssignmentComplete
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

class AssignmentComplete extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {};
  }

  render = () => {
    return (
      <BlurView style={styles.container} blurAmount={5}>
        <TouchableOpacity
          style={[styles.container, styles.centerContent]}
          onPress={() => this.props.hideAssignmentComplete()}
        >
          <View style={localStyles.container}>
            <View style={[styles.centerContent]}>
              <IonIcon
                name={'ios-trophy'}
                size={36 * factorRatio}
                color={'#fb1b2f'}
              />
            </View>
            <View
              style={[
                styles.centerContent,
                localStyles.assignmentCompleteContainer
              ]}
            >
              <Text style={[styles.modalHeaderText]}>Assignment Complete</Text>
            </View>
            <View>
              <Text style={[styles.modalBodyText, localStyles.congratsText]}>
                Congratulations! You completed
              </Text>
              <Text style={[styles.modalBodyText, localStyles.assignmentTitle]}>
                {this.props.title}
              </Text>
              <Text style={[styles.modalButtonText, localStyles.xpText]}>
                YOU EARNED {this.props.xp} XP!
              </Text>
            </View>
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
    padding: 30
  },
  assignmentCompleteContainer: {
    padding:
      (5 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
    marginBottom: 7.5 * (Dimensions.get('window').height / 812)
  },
  xpText: {
    color: '#fb1b2f',
    marginTop: 15 * (Dimensions.get('window').height / 812),
    marginBottom: 10 * (Dimensions.get('window').height / 812)
  },
  assignmentTitle: {
    marginHorizontal: 20 * (Dimensions.get('window').width / 375),
    fontWeight: 'bold'
  },
  congratsText: {
    marginHorizontal: 20 * (Dimensions.get('window').width / 375)
  }
});

export default withNavigation(AssignmentComplete);
