import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import Icon from '../assets/icons';

export default class AssignmentComplete extends React.Component {
  render = () => {
    return (
      <Modal
        visible={this.props.isVisible}
        transparent={true}
        style={styles.modalContainer}
        animation={'slideInUp'}
        animationInTiming={250}
        animationOutTiming={250}
        coverScreen={false}
        hasBackdrop={false}
      >
        <BlurView style={styles.container} blurAmount={5}>
          <TouchableOpacity
            style={[styles.centerContent, localStyles.modalContainer]}
            onPress={() => this.props.hideAssignmentComplete()}
          >
            <View style={localStyles.container}>
              <Icon.Ionicons
                name={'ios-trophy'}
                size={onTablet ? 45 : 35}
                color={'#fb1b2f'}
              />
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
                <Text
                  style={[styles.modalBodyText, localStyles.assignmentTitle]}
                >
                  {this.props.title}
                </Text>
                <Text style={[styles.modalButtonText, localStyles.xpText]}>
                  YOU EARNED {this.props.xp} XP!
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </BlurView>
      </Modal>
    );
  };
}

const localStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.5)'
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    padding: 15
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
