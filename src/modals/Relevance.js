import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import EntypoIcon from 'react-native-vector-icons/Entypo';

export default class Relevance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSort: this.props.currentSort, // 'newest', ‘oldest’, NOT YET: ‘popularity’, ‘trending’ and ‘relevance’
      background: this.props.isMethod ? '#4C5253' : '#445f73',
    };
  }

  render = () => {
    return (
      <View style={styles.container}>
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.container}
            onPress={() => this.props.hideRelevance()}
          />
        </View>
        <View style={localStyles.container}>
          <View
            style={{
              width: '100%',
              backgroundColor: this.props.isMethod
                ? 'black'
                : colors.mainBackground,
            }}
          >
            <TouchableOpacity
              style={[
                localStyles.button,
                {
                  borderBottomColor: this.props.isMethod
                    ? colors.pianoteGrey
                    : '#445f73',
                  borderBottomWidth: 0.25,
                },
              ]}
              onPress={() => {
                this.props.hideRelevance(), this.props.changeSort('newest');
              }}
            >
              <View style={styles.centerContent}>
                <EntypoIcon
                  name={'check'}
                  size={onTablet ? 24 : 18}
                  color={
                    this.state.currentSort == 'newest'
                      ? 'white'
                      : this.props.isMethod
                      ? 'black'
                      : colors.mainBackground
                  }
                />
              </View>
              <View style={styles.centerContent}>
                <Text
                  style={[
                    localStyles.word,
                    {
                      color:
                        this.state.currentSort == 'newest'
                          ? 'white'
                          : this.state.background,
                    },
                  ]}
                >
                  Newest First
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                localStyles.button,
                {
                  borderBottomColor: this.props.isMethod
                    ? colors.pianoteGrey
                    : '#445f73',
                  borderBottomWidth: 0.25,
                },
              ]}
              onPress={() => {
                this.props.hideRelevance(), this.props.changeSort('oldest');
              }}
            >
              <View style={styles.centerContent}>
                <EntypoIcon
                  name={'check'}
                  size={onTablet ? 24 : 18}
                  color={
                    this.state.currentSort == 'oldest'
                      ? 'white'
                      : this.props.isMethod
                      ? 'black'
                      : colors.mainBackground
                  }
                />
              </View>
              <View style={styles.centerContent}>
                <Text
                  style={[
                    localStyles.word,
                    {
                      color:
                        this.state.currentSort == 'oldest'
                          ? 'white'
                          : this.state.background,
                    },
                  ]}
                >
                  Oldest First
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={localStyles.button}
              onPress={() => this.props.hideRelevance()}
            >
              <View style={styles.centerContent}>
                <EntypoIcon
                  name={'cross'}
                  size={onTablet ? 30 : 25}
                  color={'white'}
                />
              </View>
              <View style={styles.centerContent}>
                <Text style={localStyles.cancel}>Cancel</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };
}

const localStyles = StyleSheet.create({
  container: {
    minHeight: DeviceInfo.isTablet() ? '20%' : '25%',
    flexDirection: 'row',
  },
  word: {
    marginLeft: 10,
    fontSize: DeviceInfo.isTablet() ? 18 : 14,
    fontFamily: 'OpenSans-Regular',
  },
  button: {
    flex: 0.4,
    paddingLeft: '5%',
    flexDirection: 'row',
  },
  cancel: {
    marginLeft: 10,
    marginBottom: '5%',
    fontSize: DeviceInfo.isTablet() ? 18 : 14,
    fontFamily: 'OpenSans-Regular',
    color: 'white',
  },
});
