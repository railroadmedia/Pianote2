import React from 'react';
import { StyleSheet, View } from 'react-native';

import { NetworkContext } from '../services/forum.service';

let styles;
export default class MediaPicker extends React.Component {
  constructor(props) {
    super(props);
    let { isDark } = props.route.params;
    MediaPicker.contextType = NetworkContext();
    styles = setStyles(isDark);
  }

  render() {
    return <></>;
  }
}
let setStyles = isDark => StyleSheet.create({});
