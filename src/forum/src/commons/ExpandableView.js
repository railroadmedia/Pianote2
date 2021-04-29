/*

* props: title, expandableContStyle, titleStyle, iconColor
* title: the text next to the expandable/collapsable icon
* expandableContStyle: style for container
* titleStyle: style for title
* iconColor: color for arrow icon
*/

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { arrowUp, arrowDown } from '../assets/svgs';

export default class ExpandableView extends React.Component {
  state = {};
  constructor(props) {
    super(props);
    switch (props.processType) {
      case 'RAM': {
        this.state.maxHeight = 0;
        break;
      }
      case 'CPU': {
        this.state.contentVisible = false;
        break;
      }
      default: {
        this.state.contentVisible = false;
        break;
      }
    }
  }

  toggleView = () => {
    switch (this.props.processType) {
      case 'RAM': {
        this.setState(({ maxHeight }) => ({
          maxHeight: maxHeight ? 0 : 100000
        }));
        break;
      }
      case 'CPU': {
        this.setState(({ contentVisible }) => ({
          contentVisible: !contentVisible
        }));
        break;
      }
      default: {
        this.setState(({ contentVisible }) => ({
          contentVisible: !contentVisible
        }));
        break;
      }
    }
  };

  render() {
    let { maxHeight, contentVisible } = this.state;
    return (
      <View style={this.props.expandableContStyle}>
        <TouchableOpacity
          onPress={() => this.toggleView()}
          style={[
            {
              flexDirection: 'row',
              alignItems: 'center',
              padding: 10,
              height: 50
            },
            this.props.dropStyle
          ]}
        >
          <Text style={[this.props.titleStyle, { flex: 1 }]}>
            {this.props.title}
          </Text>
          {(contentVisible || !!this.state.maxHeight) &&
            arrowUp({
              height: 15,
              width: 15,
              fill: this.props.iconColor || '#ffffff'
            })}
          {!contentVisible &&
            !this.state.maxHeight &&
            arrowDown({
              height: 15,
              width: 15,
              fill: this.props.iconColor || '#ffffff'
            })}
        </TouchableOpacity>
        {contentVisible === undefined ? (
          <View style={{ overflow: 'hidden', maxHeight }}>
            {this.props.children}
          </View>
        ) : (
          contentVisible && this.props.children
        )}
      </View>
    );
  }
}
