import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import Icon from '../assets/icons';

const onTablet = global.onTablet;

export default class AssignmentComplete extends React.Component {
  render = () => {
    return (
      <Modal
        visible={this.props.isVisible}
        transparent={true}
        style={{ margin: 0, flex: 1 }}
        animation={'slideInUp'}
        animationInTiming={250}
        animationOutTiming={250}
        coverScreen={false}
        hasBackdrop={false}
      >
        <BlurView style={{ flex: 1, alignSelf: 'stretch' }} blurAmount={5}>
          <TouchableOpacity
            style={[localStyles.centerContent, { margin: 0, flex: 1 }]}
            onPress={() => this.props.hideAssignmentComplete()}
          >
            <View style={localStyles.container}>
              <Icon.Ionicons
                name={'ios-trophy'}
                size={onTablet ? 45 : 35}
                color={colors.pianoteRed}
              />
              <View
                style={[
                  localStyles.centerContent,
                  localStyles.assignmentCompleteContainer
                ]}
              >
                <Text style={localStyles.modalHeaderText}>
                  Assignment Complete
                </Text>
              </View>
              <View>
                <Text
                  style={[localStyles.modalBodyText, localStyles.congratsText]}
                >
                  Congratulations! You completed
                </Text>
                <Text
                  style={[
                    localStyles.modalBodyText,
                    localStyles.assignmentTitle
                  ]}
                >
                  {this.props.title}
                </Text>
                <Text style={[localStyles.modalButtonText, localStyles.xpText]}>
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
  modalButtonText: {
    textAlign: 'center',
    fontFamily: 'RobotoCondensed-Bold',
    fontSize: onTablet ? 16 : 12
  },
  modalBodyText: {
    textAlign: 'center',
    fontFamily: 'OpenSans-Regular',
    fontSize: onTablet ? 16 : 12
  },
  modalHeaderText: {
    fontFamily: 'OpenSans-Bold',
    textAlign: 'center',
    fontSize: onTablet ? 24 : 18
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
    fontFamily: 'OpenSans-Bold'
  },
  congratsText: {
    marginHorizontal: 20
  },
  centerContent: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch'
  }
});
