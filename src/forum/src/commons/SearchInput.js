import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { search } from '../assets/svgs';

export default class SearchInput extends React.Component {
  constructor(props) {
    super(props);
    let { isDark } = props;
    styles = setStyles(isDark);
  }

  render() {
    let { isDark, onSearch } = this.props;

    return (
      <View style={styles.inputContainer}>
        <View style={styles.searchIcon}>
          {search({
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
          returnKeyType='go'
          onSubmitEditing={({ nativeEvent: { text } }) => onSearch(text)}
        />
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
      marginBottom: 30
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
