import React from 'react';
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { updateMessage } from '../services/forum.service';

let styles;
export default class Edit extends React.Component {
  constructor(props) {
    super(props);
    let { NetworkContext, isDark, text } = props.route.params;
    Edit.contextType = NetworkContext;
    styles = setStyles(isDark);
    this.state = { text };
  }

  save = () => {
    let { text } = this.state;
    updateMessage(text);
    this.props.onSave?.(text);
    this.props.navigation.goBack();
  };

  render() {
    let { isDark, appColor } = this.props.route.params;
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.container}
        onPress={Keyboard.dismiss}
      >
        <TextInput
          multiline={true}
          blurOnSubmit={true}
          style={styles.textInput}
          onChangeText={text => this.setState({ text })}
          onSubmitEditing={this.save}
          keyboardAppearance={isDark ? 'dark' : 'light'}
          value={this.state.text}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity
            style={{ padding: 15, paddingLeft: 0 }}
            onPress={this.props.navigation.goBack}
          >
            <Text style={styles.cancel}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ padding: 15, paddingRight: 0 }}
            onPress={this.save}
          >
            <Text style={{ color: appColor }}>Save</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }
}
let setStyles = isDark =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#00101d' : 'white',
      padding: 15
    },
    textInput: {
      flex: 0.5,
      marginTop: 30,
      backgroundColor: isDark ? '#00203A' : 'white',
      padding: 15,
      borderRadius: 15,
      color: isDark ? 'white' : 'black'
    },
    cancel: {
      color: isDark ? '#1A2E3E' : 'black'
    }
  });
