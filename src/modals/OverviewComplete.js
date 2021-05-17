import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import Icon from '../assets/icons';

export default class OverviewComplete extends React.Component {
  changeType = word => {
    word = word.replace(/[- )(]/g, ' ').split(' ');
    let string = '';

    for (i in word) {
      string = string + word[i] + ' ';
    }

    return string;
  };

  render = () => {
    return (
      <Modal
        visible={this.props.isVisible}
        transparent={true}
        style={styles.modalContainer}
        animation={'slideInUp'}
        animationInTiming={250}
        animationOutTiming={250}
        coverScreen={true}
        hasBackdrop={true}
        onBackButtonPress={() => this.props.hideOverviewComplete()}
      >
        <BlurView
          style={[styles.container, styles.centerContent]}
          blurAmount={5}
        >
          <TouchableOpacity
            style={[styles.centerContent, styles.container]}
            onPress={() => this.props.hideOverviewComplete()}
          >
            <View style={localStyles.container}>
              <View style={[styles.centerContent]}>
                <Icon.Ionicons
                  name={'ios-trophy'}
                  size={onTablet ? 45 : 35}
                  color={'#fb1b2f'}
                />
              </View>
              <View style={[styles.centerContent, { padding: 5 }]}>
                <Text
                  style={[
                    styles.modalHeaderText,
                    { textTransform: 'capitalize' }
                  ]}
                >
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
  title: {
    marginHorizontal: 20,
    marginBottom: 15,
    fontFamily: 'OpenSans-Bold'
  },
  xp: {
    color: '#fb1b2f'
  }
});
