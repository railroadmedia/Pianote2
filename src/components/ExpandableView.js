import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from '../assets/icons';

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
      <View testID='expandableCont' style={this.props.expandableContStyle}>
        <TouchableOpacity
          testID='dropBtn'
          onPress={() => this.toggleView()}
          style={[
            {
              flexDirection: 'row',
              alignItems: 'center'
            },
            this.props.dropStyle
          ]}
        >
          <Text testID='title' style={[this.props.titleStyle, { flex: 1 }]}>
            {this.props.title}
          </Text>
          {(contentVisible || !!this.state.maxHeight) && (
            <Icon.Entypo
              name={'chevron-thin-up'}
              size={onTablet ? 25 : 17.5}
              color={colors.secondBackground}
            />
          )}
          {!contentVisible && !this.state.maxHeight && (
            <Icon.Entypo
              name={'chevron-thin-down'}
              size={onTablet ? 25 : 17.5}
              color={colors.secondBackground}
            />
          )}
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
