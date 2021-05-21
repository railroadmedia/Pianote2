import React from 'react';
import { View, TextInput, StyleSheet, Modal } from 'react-native';
import { search as searchSvg } from '../assets/svgs';

import { search } from '../services/forum.service';

export default class SearchInput extends React.Component {
  state = { showSearchResults: false };

  constructor(props) {
    super(props);
    let { isDark } = props;
    styles = setStyles(isDark);
  }

  toggleSearchResults = text => {
    /* code for results fetching and modal toggle goes here */
  };

  render() {
    let { isDark } = this.props;
    let { showSearchResults } = this.state;
    return (
      <View style={styles.inputContainer}>
        <View style={styles.searchIcon}>
          {searchSvg({
            height: 15,
            width: 15,
            fill: isDark ? '#445F74' : '#97AABE'
          })}
        </View>
        <TextInput
          style={styles.searchInput}
          autoCapitalize={'none'}
          autoCorrect={false}
          spellCheck={false}
          placeholder={'Search...'}
          placeholderTextColor={isDark ? '#445F74' : '#97AABE'}
          returnKeyType='search'
          onSubmitEditing={({ nativeEvent: { text } }) =>
            this.toggleSearchResults(text)
          }
        />
        <Modal
          animationType={'fade'}
          onRequestClose={this.toggleSearchResults}
          supportedOrientations={['portrait', 'landscape']}
          visible={showSearchResults}
        >
          {/*
          Code for the entire search page goes here
          */}
        </Modal>
      </View>
    );
  }
}

let setStyles = isDark =>
  StyleSheet.create({
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 15,
      marginTop: 30,
      marginBottom: 30,
      flex: 1
    },
    searchIcon: {
      position: 'absolute',
      left: 15,
      zIndex: 2
    },
    searchInput: {
      color: '#000000',
      fontSize: 12,
      fontFamily: 'OpenSans',
      flex: 1,
      height: 35,
      borderRadius: 25,
      paddingLeft: 40,
      color: isDark ? '#445F74' : '#97AABE',
      backgroundColor: isDark ? '#F7F9FC' : '#E1E6EB'
    }
  });
