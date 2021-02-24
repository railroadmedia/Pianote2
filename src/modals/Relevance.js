/**
 * Relevance
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { withNavigation } from 'react-navigation';
import EntypoIcon from 'react-native-vector-icons/Entypo';

const windowDim = Dimensions.get('window');
const width =
  windowDim.width < windowDim.height ? windowDim.width : windowDim.height;
const height =
  windowDim.width > windowDim.height ? windowDim.width : windowDim.height;
const factor = (height / 812 + width / 375) / 2;

class Relevance extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {
      currentSort: this.props.currentSort, // 'newest', ‘oldest’, NOT YET: ‘popularity’, ‘trending’ and ‘relevance’
      background: this.props.isMethod ? '#4C5253' : '#445f73'
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
                : colors.mainBackground
            }}
          >
            <TouchableOpacity
              style={[
                localStyles.button,
                {
                  borderBottomColor: this.props.isMethod
                    ? colors.pianoteGrey
                    : '#445f73',
                  borderBottomWidth: 0.25
                }
              ]}
              onPress={() => {
                this.props.hideRelevance(), this.props.changeSort('newest');
              }}
            >
              <View style={styles.centerContent}>
                <EntypoIcon
                  name={'check'}
                  size={(onTablet ? 15 : 20) * factor}
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
                          : this.state.background
                    }
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
                  borderBottomWidth: 0.25
                }
              ]}
              onPress={() => {
                this.props.hideRelevance(), this.props.changeSort('oldest');
              }}
            >
              <View style={styles.centerContent}>
                <EntypoIcon
                  name={'check'}
                  size={(onTablet ? 15 : 20) * factor}
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
                          : this.state.background
                    }
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
                  size={(onTablet ? 17.5 : 25) * factor}
                  color={'white'}
                />
              </View>
              <View style={styles.centerContent}>
                <Text style={localStyles.cancel}>Cancel</Text>
              </View>
            </TouchableOpacity>
            <View style={{ flex: isNotch ? 0.25 : 0.025 }} />
          </View>
        </View>
      </View>
    );
  };
}

const localStyles = StyleSheet.create({
  container: {
    minHeight: height * 0.25,
    flexDirection: 'row'
  },
  word: {
    marginLeft: 15 * factor,
    fontSize: (DeviceInfo.isTablet() ? 10 : 16) * factor,
    fontFamily: 'OpenSans-Regular'
  },
  button: {
    flex: 0.4,
    paddingLeft: width * 0.05,
    flexDirection: 'row'
  },
  cancel: {
    marginLeft: 10 * factor,
    fontSize: (DeviceInfo.isTablet() ? 10 : 16) * factor,
    fontFamily: 'OpenSans-Regular',
    color: 'white'
  }
});

export default withNavigation(Relevance);
