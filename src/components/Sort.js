import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome5';
import { SafeAreaView } from 'react-navigation';

const sorts = [
  {
    menuText: 'Newest First',
    togglerText: 'NEWEST',
    urlParam: 'newest'
  },
  {
    menuText: 'Oldest First',
    togglerText: 'OLDEST',
    urlParam: 'oldest'
  }
];
export default class Sort extends React.PureComponent {
  state = {
    modalVisible: false,
    sortIndex: 0
  };

  get sortQuery() {
    return sorts[this.state.sortIndex].urlParam;
  }

  toggleModal = () =>
    this.setState(({ modalVisible }) => ({ modalVisible: !modalVisible }));

  sort = index =>
    this.setState({ modalVisible: false, sortIndex: index }, this.props.onSort);

  render() {
    let {
      props: { disabled },
      state: { modalVisible, sortIndex }
    } = this;
    return (
      <>
        <TouchableOpacity
          disabled={disabled}
          style={{
            ...lStyle.togglerTOpacity,
            opacity: this.props.disabled ? 0.3 : 1
          }}
          onPress={this.toggleModal}
        >
          <Text style={lStyle.togglerText}>{sorts[sortIndex].togglerText}</Text>
          <Icon size={18} name={'sort-amount-down'} color={colors.pianoteRed} />
        </TouchableOpacity>
        <Modal
          transparent={true}
          visible={modalVisible}
          onRequestClose={this.toggleModal}
          supportedOrientations={['portrait', 'landscape']}
          animationType='slide'
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={this.toggleModal}
            style={{ flex: 1, justifyContent: 'flex-end' }}
          >
            <SafeAreaView style={{ backgroundColor: 'black' }}>
              {sorts.map((s, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => this.sort(i)}
                  style={lStyle.menuTOpacity}
                >
                  <Icon
                    size={18}
                    name={'check'}
                    color={i === sortIndex ? 'white' : 'black'}
                    style={lStyle.icon}
                  />
                  <Text
                    style={{
                      color: i === sortIndex ? 'white' : colors.pianoteGrey,
                      paddingLeft: 20
                    }}
                  >
                    {s.menuText}
                  </Text>
                </TouchableOpacity>
              ))}
            </SafeAreaView>
            <SafeAreaView
              forceInset={{ bottom: 'always' }}
              style={{ backgroundColor: 'black' }}
            >
              <TouchableOpacity
                onPress={this.toggleModal}
                style={{ padding: 20, flexDirection: 'row' }}
              >
                <Icon
                  size={18}
                  name={'times'}
                  color={'white'}
                  style={lStyle.icon}
                />
                <Text style={{ color: 'white', paddingLeft: 20 }}>Cancel</Text>
              </TouchableOpacity>
            </SafeAreaView>
          </TouchableOpacity>
        </Modal>
      </>
    );
  }
}

let lStyle = StyleSheet.create({
  togglerTOpacity: {
    flexDirection: 'row',
    marginRight: 10,
    alignItems: 'center'
  },
  togglerText: {
    padding: 5,
    color: '#fb1b2f',
    fontSize: 16,
    fontFamily: 'RobotoCondensed-Bold'
  },
  menuTOpacity: {
    flexDirection: 'row',
    padding: 20,
    borderWidth: 1,
    borderBottomColor: '#6e777a',
    alignItems: 'center'
  },
  icon: { width: 18, height: 18, textAlign: 'center' }
});
