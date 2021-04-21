import React from 'react';
import { StyleSheet, View } from 'react-native';

import forumService from '../services/forum.service';

let styles;
export default class DiscussionCard extends React.Component {
  constructor(props) {
    super(props);
    let { isDark } = props.route.params;
    DiscussionCard.contextType = forumService.NetworkContext;
    styles = setStyles(isDark);
  }

  render() {
    return <></>;
  }
}
let setStyles = isDark => StyleSheet.create({});
