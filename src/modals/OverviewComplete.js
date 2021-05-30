import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import Icon from '../assets/icons';

const onTablet = global.onTablet;

export default class OverviewComplete extends React.Component {
  changeType = word => {
    word = word.replace(/[- )(]/g, ' ').split(' ');
    let string = '';
    for (i in word) string = string + word[i] + ' ';
    return string;
  };

  render = () => {
    return (
      <Modal
        visible={this.props.isVisible}
        transparent={true}
        style={{ margin: 0, flex: 1 }}
        animation={'slideInUp'}
        animationInTiming={250}
        animationOutTiming={250}
        coverScreen={true}
        hasBackdrop={true}
        onBackButtonPress={() => this.props.hideOverviewComplete()}
      >
        <BlurView
          style={[localStyles.gContainer, localStyles.centerContent]}
          blurAmount={5}
        >
          <TouchableOpacity
            style={[localStyles.centerContent, localStyles.gContainer]}
            onPress={() => this.props.hideOverviewComplete()}
          >
            <View style={localStyles.container}>
              <View style={[localStyles.centerContent]}>
                <Icon.Ionicons
                  name={'ios-trophy'}
                  size={onTablet ? 45 : 35}
                  color={colors.pianoteRed}
                />
              </View>
              <View style={[localStyles.centerContent, { padding: 5 }]}>
                <Text
                  style={[
                    localStyles.modalHeaderText,
                    { textTransform: 'capitalize' }
                  ]}
                >
                  {this.changeType(this.props.type).toUpperCase()}
                  {'\n'}Complete
                </Text>
              </View>
              <Text style={[localStyles.modalBodyText, localStyles.congrats]}>
                Congratulations! You completed
              </Text>
              <Text style={[localStyles.modalBodyText, localStyles.title]}>
                {this.props.title}
              </Text>
              <Text style={[localStyles.modalButtonText, localStyles.xp]}>
                YOU EARNED {this.props.xp} XP!
              </Text>
            </View>
          </TouchableOpacity>
        </BlurView>
      </Modal>
    );
  };
}

const localStyles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginHorizontal: 30,
    paddingVertical: 30
  },
  congrats: {
    textAlign: 'center',
    marginVertical: 5,
    marginHorizontal: 20
  },
  modalHeaderText: {
    fontFamily: 'OpenSans-Bold',
    textAlign: 'center',
    fontSize: onTablet ? 24 : 18
  },
  title: {
    marginHorizontal: 20,
    marginBottom: 15,
    fontFamily: 'OpenSans-Bold'
  },
  xp: {
    color: '#fb1b2f'
  },
  gContainer: {
    flex: 1,
    alignSelf: 'stretch'
  },
  centerContent: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch'
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
  }
});
