import React from 'react';
import { StyleSheet, Modal, TouchableOpacity, Text, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { file, image, video } from '../assets/svgs';
import { NetworkContext } from '../services/forum.service';

let styles;
export default class MediaPicker extends React.Component {
  constructor(props) {
    super(props);
    let { isDark, appColor } = props;

    styles = setStyles(isDark, appColor);
  }

  render() {
    return (
      <Modal
        animationType={'slide'}
        onRequestClose={() => this.props.onClose()}
        supportedOrientations={['portrait', 'landscape']}
        transparent={true}
        visible={true}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.optionsContainer}
          onPress={() => this.props.onClose()}
        >
          <SafeAreaView
            style={styles.container}
            forceInset={{ top: 'never', bottom: 'always' }}
          >
            <View style={styles.btnContainer}>
              <TouchableOpacity
                style={styles.center}
                onPress={() => this.props.selectMediaType('text')}
              >
                <View style={styles.btn}>
                  {file({ width: 20, height: 30, fill: '#FFFFFF' })}
                </View>
                <Text style={styles.btnText}>Text</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.center}
                onPress={() => this.props.selectMediaType('image')}
              >
                <View style={styles.btn}>
                  {image({ width: 25, height: 30, fill: '#FFFFFF' })}
                </View>
                <Text style={styles.btnText}>Image</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.center}
                onPress={() => this.props.selectMediaType('video')}
              >
                <View style={styles.btn}>
                  {video({ width: 30, height: 30, fill: '#FFFFFF' })}
                </View>
                <Text style={styles.btnText}>Video</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </TouchableOpacity>
      </Modal>
    );
  }
}
let setStyles = (isDark, appColor) =>
  StyleSheet.create({
    optionsContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0,0,0,.5)'
    },
    container: {
      padding: 20,
      backgroundColor: '#081825'
    },
    center: {
      justifyContent: 'center',
      alignItems: 'center'
    },
    btnContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 50
    },
    btn: {
      backgroundColor: '#1c5499',
      height: 50,
      aspectRatio: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 25
    },
    btnText: {
      color: '#FFFFFF',
      paddingTop: 3,
      fontFamily: 'OpenSans',
      fontSize: 14
    }
  });
