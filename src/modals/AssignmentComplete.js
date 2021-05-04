import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import Icon from '../assets/icons';

export default class AssignmentComplete extends React.Component {
  render = () => {
    return (
      <BlurView style={styles.container} blurAmount={5}>
        <TouchableOpacity
          style={[styles.container, styles.centerContent]}
          onPress={() => this.props.hideAssignmentComplete()}
        >
          <View style={localStyles.container}>
            <View style={styles.centerContent}>
              <Icon.Ionicons
                name={'ios-trophy'}
                size={onTablet ? 45 : 35}
                color={'#fb1b2f'}
              />
            </View>
            <View
              style={[
                styles.centerContent,
                localStyles.assignmentCompleteContainer
              ]}
            >
              <Text style={styles.modalHeaderText}>Assignment Complete</Text>
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
    borderRadius: 10,
    padding: 30
  },
  assignmentCompleteContainer: {
    padding: 5,
    marginBottom: 0
  },
  xpText: {
    color: '#fb1b2f',
    marginTop: 15,
    marginBottom: 10
  },
  assignmentTitle: {
    marginHorizontal: 20,
    fontWeight: 'bold'
  },
  congratsText: {
    marginHorizontal: 20
  }
});
