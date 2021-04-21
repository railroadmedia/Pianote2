import React from 'react';
import { StyleSheet, View } from 'react-native';

let styles;
export default class Discussion extends React.Component {
  constructor(props) {
    super(props);
    let { isDark, NetworkContext } = props.route.params;
    Discussion.contextType = NetworkContext;
    styles = setStyles(isDark);
  }

  render() {
    return <></>;
  }
}
let setStyles = isDark => StyleSheet.create({});
