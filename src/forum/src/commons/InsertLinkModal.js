import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal
} from 'react-native';

export class InsertLinkModal extends React.PureComponent {
  constructor(props) {
    super(props);
    let { isDark, appColor } = props;

    styles = setStyles(isDark, appColor);
    this.state = {
      visible: false,
      type: ''
    };
  }

  toggle = type => {
    if (this.state.visible)
      this.props.onClose?.(this.title, this.url, this.state.type);
    this.setState(state => ({ visible: !state.visible, type }));
  };

  render() {
    const { visible, type } = this.state;
    const { isDark } = this.props;

    return (
      <Modal
        transparent={true}
        visible={visible}
        supportedOrientations={['portrait', 'landscape']}
        onBackdropPress={this.toggle}
      >
        <TouchableOpacity style={styles.modalBackground} onPress={this.toggle}>
          <View style={styles.modalContainer}>
            <Text style={styles.text}>Insert {type} Url</Text>
            {type === 'Link' && (
              <View style={styles.item}>
                <TextInput
                  style={styles.input}
                  placeholderTextColor={isDark ? '#EDEEEF' : '#00101D'}
                  placeholder={'title'}
                  onChangeText={text => {
                    this.title = text;
                  }}
                />
              </View>
            )}
            <View style={styles.item}>
              <TextInput
                style={styles.input}
                placeholderTextColor={isDark ? '#EDEEEF' : '#00101D'}
                placeholder='http(s)://'
                onChangeText={text => {
                  this.url = text;
                }}
              />
            </View>

            <TouchableOpacity style={styles.btn} onPress={() => this.toggle()}>
              <Text style={styles.text}>OK</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }
}

let setStyles = (isDark, appColor) =>
  StyleSheet.create({
    modalBackground: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,.8)'
    },
    modalContainer: {
      backgroundColor: isDark ? '#00101D' : '#F7F9FC',
      padding: 10,
      paddingHorizontal: 50,
      borderRadius: 10,
      margin: 5,
      width: '80%'
    },
    item: {
      borderBottomWidth: 1,
      borderColor: '#e8e8e8',
      flexDirection: 'row',
      height: 40,
      alignItems: 'center',
      paddingHorizontal: 15
    },
    input: {
      flex: 1,
      height: 40,
      color: isDark ? '#EDEEEF' : '#00101D'
    },
    btn: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: appColor,
      borderRadius: 20,
      marginVertical: 15
    },
    text: {
      color: isDark ? '#EDEEEF' : '#00101D',
      paddingVertical: 10
    }
  });
