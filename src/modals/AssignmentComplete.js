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

const windowDim = Dimensions.get('window');
const width =
  windowDim.width < windowDim.height ? windowDim.width : windowDim.height;
const height =
  windowDim.width > windowDim.height ? windowDim.width : windowDim.height;
const factor = (height / 812 + width / 375) / 2;

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
                size={(onTablet ? 28 : 36) * factor}
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
    borderRadius: 10 * factor,
    padding: 30
  },
  assignmentCompleteContainer: {
    padding: 5 * factor,
    marginBottom: 7.5 * factor
  },
  xpText: {
    color: '#fb1b2f',
    marginTop: 15 * factor,
    marginBottom: 10 * factor
  },
  assignmentTitle: {
    marginHorizontal: 20 * factor,
    fontWeight: 'bold'
  },
  congratsText: {
    marginHorizontal: 20 * factor
  }
});

export default withNavigation(AssignmentComplete);
