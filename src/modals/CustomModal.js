import React from 'react';
import {
  Modal,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated
} from 'react-native';

export default class CustomModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      opacity: new Animated.Value(0)
    };
  }

  toggle = (title, message) => {
    this.title = title || '';
    this.message = message || '';
    if (this.state.visible && this.props.onClose) this.props.onClose();
    this.setState(state => ({ visible: !state.visible }));
  };

  animate = () => {
    Animated.timing(this.state.opacity, {
      duration: 250,
      useNativeDriver: true,
      toValue: this.state.visible ? 1 : 0
    }).start();
  };

  render() {
    return (
      <Modal
        transparent={true}
        onShow={this.animate}
        visible={this.state.visible}
        onRequestClose={this.toggle}
        supportedOrientations={['portrait', 'landscape']}
        onBackButtonPress={this.toggle}
      >
        <TouchableOpacity
          style={localStyles.modalBackground}
          onPress={() => this.toggle()}
        >
          <Animated.View
            style={[localStyles.animatedView, { opacity: this.state.opacity }]}
          >
            <Text style={[styles.modalHeaderText]}>{this.title}</Text>
            <Text style={[styles.modalBodyText]}>{this.message}</Text>
            {this.props.additionalBtn}
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    );
  }
}

const localStyles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,.5)'
  },
  title: {
    fontFamily: 'OpenSans-Bold',
    textAlign: 'center',
    paddingVertical: 10,
    color: '#000000'
  },
  text: {
    fontFamily: 'OpenSans-Regular',
    textAlign: 'center',
    paddingVertical: 10,
    color: '#000000'
  },
  animatedView: {
    padding: 10,
    paddingHorizontal: 50,
    borderRadius: 10,
    margin: 5,
    backgroundColor: '#ffffff'
  }
});
