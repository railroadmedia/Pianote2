import React from 'react';
import {
  View,
  TextInput,
  Text,
  SafeAreaView,
  StyleSheet,
  Modal
} from 'react-native';
import { search as searchSvg } from '../assets/svgs';
import { search } from '../services/forum.service';
import Icon from '../../../assets/icons.js';
// import { Header } from 'react-native-elements';
import Back from '../../../assets/img/svgs/back.svg';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class Search extends React.Component {
  state = { showSearchResults: false };
  constructor(props) {
    super(props);
    let { isDark } = props;
    styles = setStyles(isDark);
  }

  toggleSearchResults = text => {
    /* code for results fetching and modal toggle goes here */
    this.setState({ showSearchResults: true });
  };

  navigate = (route, params) =>
    connection(true) && this.props.navigation.navigate(route, params);

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
          <SafeAreaView style={styles.modalContainer} activeOpacity={1}>
            {/* <Header
              backgroundColor={'#00101d'}
              placement='center'
              leftComponent={
                <TouchableOpacity
                  style={{ paddingHorizontal: 5, paddingVertical: 2 }}
                  onPress={() => this.setState({ showSearchResults: false })}
                >
                  <Back width={20} height={20} fill={'white'} />
                </TouchableOpacity>
              }
              centerComponent={{ text: 'All Forums', style: styles.headerText }}
              containerStyle={{
                borderBottomWidth: 0
              }}
              rightComponent={
                <TouchableOpacity
                  style={{ paddingVertical: 5 }}
                  onPress={() => {}}
                >
                  <Icon.Entypo
                    size={14}
                    name={'dots-three-horizontal'}
                    color={'white'}
                  />
                </TouchableOpacity>
              }
            /> */}
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
            </View>
          </SafeAreaView>
        </Modal>
      </View>
    );
  }
}

let setStyles = isDark =>
  StyleSheet.create({
    modalContainer: {
      backgroundColor: '#00101d',
      flex: 1
    },
    headerText: {
      fontFamily: 'OpenSans-ExtraBold',
      fontSize: 20,
      color: isDark ? 'white' : 'black'
    },
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
