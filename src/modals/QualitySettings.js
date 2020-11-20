/**
 * QualitySettings
 */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation';
import X from 'Pianote2/src/assets/img/svgs/X.svg';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

class QualitySettings extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {
      quality: 'Auto'
    };
  }

  render = () => {
    return (
      <View style={styles.container}>
        <View style={{ flex: 1, alignSelf: 'stretch' }}>
          <TouchableWithoutFeedback
            onPress={() => this.props.hideQualitySettings()}
            style={{
              height: '100%',
              width: '100%',
              alignSelf: 'stretch'
            }}
          ></TouchableWithoutFeedback>
        </View>
        <View
          style={{
            height:
              fullHeight * 0.45 + (global.isTablet ? fullHeight * 0.1 : 0),
            flexDirection: 'row'
          }}
        >
          <View
            style={{
              width: '100%',
              backgroundColor: 'white'
            }}
          >
            <TouchableOpacity
              key={'Auto360p'}
              style={{
                flex: 0.4,
                paddingLeft: fullWidth * 0.05,
                flexDirection: 'row'
              }}
            >
              <View>
                <View style={{ flex: 1 }} />
                {this.state.quality == 'Auto' && (
                  <FontIcon size={20 * factorRatio} name={'check'} />
                )}
                {this.state.quality !== 'Auto' && (
                  <View style={{ width: 20 * factorRatio }} />
                )}
                <View style={{ flex: 1 }} />
              </View>
              <View style={{ width: 10 * factorHorizontal }} />
              <View>
                <View style={{ flex: 1 }} />
                <Text
                  style={{
                    fontSize: 18 * factorRatio,
                    fontFamily: 'OpenSans-Regular'
                  }}
                >
                  Auto (360p)
                </Text>
                <View style={{ flex: 1 }} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              key={'1080p'}
              style={{
                flex: 0.4,
                paddingLeft: fullWidth * 0.05,
                flexDirection: 'row'
              }}
            >
              <View>
                <View style={{ flex: 1 }} />
                {this.state.quality == '1080p' && (
                  <FontIcon size={20 * factorRatio} name={'check'} />
                )}
                {this.state.quality !== '1080p' && (
                  <View style={{ width: 20 * factorRatio }} />
                )}
                <View style={{ flex: 1 }} />
              </View>
              <View style={{ width: 10 * factorHorizontal }} />
              <View>
                <View style={{ flex: 1 }} />
                <Text
                  style={{
                    fontSize: 18 * factorRatio,
                    fontFamily: 'OpenSans-Regular'
                  }}
                >
                  1080p
                </Text>
                <View style={{ flex: 1 }} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              key={'360p'}
              style={{
                flex: 0.4,
                paddingLeft: fullWidth * 0.05,
                flexDirection: 'row'
              }}
            >
              <View>
                <View style={{ flex: 1 }} />
                {this.state.quality == '720p' && (
                  <FontIcon size={20 * factorRatio} name={'check'} />
                )}
                {this.state.quality !== '720p' && (
                  <View style={{ width: 20 * factorRatio }} />
                )}
                <View style={{ flex: 1 }} />
              </View>
              <View style={{ width: 10 * factorHorizontal }} />
              <View>
                <View style={{ flex: 1 }} />
                <Text
                  style={{
                    fontSize: 18 * factorRatio,
                    fontFamily: 'OpenSans-Regular'
                  }}
                >
                  720p
                </Text>
                <View style={{ flex: 1 }} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              key={'480p'}
              style={{
                flex: 0.4,
                paddingLeft: fullWidth * 0.05,
                flexDirection: 'row'
              }}
            >
              <View>
                <View style={{ flex: 1 }} />
                {this.state.quality == '480p' && (
                  <FontIcon size={20 * factorRatio} name={'check'} />
                )}
                {this.state.quality !== '480p' && (
                  <View style={{ width: 20 * factorRatio }} />
                )}
                <View style={{ flex: 1 }} />
              </View>
              <View style={{ width: 10 * factorHorizontal }} />
              <View>
                <View style={{ flex: 1 }} />
                <Text
                  style={{
                    fontSize: 18 * factorRatio,
                    fontFamily: 'OpenSans-Regular'
                  }}
                >
                  480p
                </Text>
                <View style={{ flex: 1 }} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              key={'360p'}
              style={{
                flex: 0.4,
                paddingLeft: fullWidth * 0.05,
                flexDirection: 'row'
              }}
            >
              <View>
                <View style={{ flex: 1 }} />
                {this.state.quality == '360p' && (
                  <FontIcon size={20 * factorRatio} name={'check'} />
                )}
                {this.state.quality !== '360p' && (
                  <View style={{ width: 20 * factorRatio }} />
                )}
                <View style={{ flex: 1 }} />
              </View>
              <View style={{ width: 10 * factorHorizontal }} />
              <View>
                <View style={{ flex: 1 }} />
                <Text
                  style={{
                    fontSize: 18 * factorRatio,
                    fontFamily: 'OpenSans-Regular'
                  }}
                >
                  360p
                </Text>
                <View style={{ flex: 1 }} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              key={'cancel'}
              onPress={() => {
                this.props.hideQualitySettings();
              }}
              style={{
                flex: 0.4,
                paddingLeft: fullWidth * 0.05,
                flexDirection: 'row'
              }}
            >
              <View>
                <View style={{ flex: 1 }} />
                <X
                  height={20 * factorRatio}
                  width={20 * factorRatio}
                  fill={'black'}
                />
                <View style={{ flex: 1 }} />
              </View>
              <View style={{ width: 10 * factorHorizontal }} />
              <View>
                <View style={{ flex: 1 }} />
                <Text
                  style={{
                    fontSize: 18 * factorRatio,
                    fontFamily: 'OpenSans-Regular'
                  }}
                >
                  Cancel
                </Text>
                <View style={{ flex: 1 }} />
              </View>
            </TouchableOpacity>
            <View style={{ flex: 0.25 }} />
          </View>
        </View>
      </View>
    );
  };
}

export default withNavigation(QualitySettings);
