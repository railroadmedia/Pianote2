/**
 * FullScreenVideoList
 */
import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  TouchableHighlight
} from 'react-native';
import Modal from 'react-native-modal';
import FastImage from 'react-native-fast-image';
import { withNavigation } from 'react-navigation';
import ContentModal from '../modals/ContentModal';
import Icon from 'react-native-vector-icons/AntDesign';

class FullScreenVideoList extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {
      showCourse: false
    };
  }

  mapResults() {
    if (this.props.items.length == 0) {
      return (
        <View
          style={[
            styles.centerContent,
            {
              height: this.props.itemHeight
            }
          ]}
        >
          <View style={{ flex: 1 }} />
          <ActivityIndicator size={'small'} color={colors.pianoteGrey} />
          <View style={{ flex: 1 }} />
        </View>
      );
    } else {
      return this.props.items.map(item => {
        return (
          <View>
            <TouchableHighlight
              underlayColor={'black'}
              onPress={() => this.props.navigation.goBack()}
            >
              <View
                style={{
                  width: this.props.itemWidth,
                  height: this.props.itemHeight,
                  borderRadius: 10 * factorRatio,
                  backgroundColor: '#ececec'
                }}
              >
                <TouchableOpacity
                  delayLongPress={250}
                  onLongPress={() => this.setState({ showCourse: true })}
                  onPress={() => {
                    this.props.navigation.navigate('VIDEOPLAYER', {
                      id: item.id
                    });
                  }}
                  style={{
                    flex: 1,
                    alignSelf: 'stretch'
                  }}
                >
                  <FastImage
                    style={{
                      flex: 1,
                      backgroundColor: '#ececec',
                      borderRadius: 7.5 * factorRatio
                    }}
                    source={{ uri: item.thumbnail }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                </TouchableOpacity>
              </View>
            </TouchableHighlight>
            <View style={{ height: 10 * factorVertical }} />
            <View
              style={{
                width: this.props.itemWidth,
                height: 60 * factorVertical,
                flexDirection: 'row'
              }}
            >
              <View style={{ flex: 0.8 }}>
                <Text
                  numberOfLines={2}
                  style={{
                    fontFamily: 'OpenSans-Regular',
                    textAlign: 'left',
                    fontWeight: Platform.OS == 'android' ? 'bold' : '600',
                    fontSize: 16 * factorRatio
                  }}
                >
                  {item.title}
                </Text>
                <View style={{ height: 3 * factorRatio }} />
                {this.props.showArtist && (
                  <Text
                    numberOfLines={2}
                    style={{
                      fontFamily: 'OpenSans-Regular',
                      textAlign: 'left',
                      color: 'grey',
                      fontSize: 13 * factorRatio
                    }}
                  >
                    Song / Ed Sheeran
                  </Text>
                )}
              </View>
              <View
                style={{
                  flex: 0.2,
                  flexDirection: 'row'
                }}
              >
                <View style={{ flex: 1 }} />
                {this.props.showArtist && (
                  <TouchableOpacity
                    style={{ paddingTop: 5 * factorVertical }}
                    onPress={() => {}}
                  >
                    <Icon
                      name={'plus'}
                      size={32.5 * factorRatio}
                      color={'#b8b8b8'}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <View
              style={{
                height: onTablet ? 10 * factorRatio : 5 * factorVertical
              }}
            />
          </View>
        );
      });
    }
  }

  render = () => {
    return (
      <View style={styles.container}>
        <View style={[styles.centerContent, { flex: 1 }]}>
          <View
            key={'container'}
            style={{
              width: fullWidth - 20 * factorHorizontal,
              alignSelf: 'stretch',
              justifyContent: 'center',
              alignContent: 'center'
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignContent: 'center'
              }}
            >
              <Text
                key={'titleText'}
                style={{
                  fontSize: 19 * factorRatio,
                  marginTop: 7.5 * factorRatio,
                  textAlign: 'left',
                  fontWeight: Platform.OS == 'android' ? 'bold' : '700',
                  fontFamily: 'OpenSans-Regular'
                }}
              >
                {this.props.Title}
              </Text>
              <View style={{ flex: 1 }} />
              <TouchableOpacity
                onPress={() => this.props.seeAll()}
                style={{ flex: 1 }}
              >
                <Text
                  style={{
                    fontFamily: 'OpenSans-Regular',
                    textAlign: 'right',
                    fontSize: 14.5 * factorRatio,
                    marginRight: 7.5 * factorRatio,
                    fontWeight: '300',
                    marginTop: 10 * factorRatio,
                    color: colors.pianoteRed
                  }}
                >
                  See All
                </Text>
              </TouchableOpacity>
              <View style={{ flex: 0.1 }} />
            </View>
            <View style={{ height: 10 * factorVertical }} />
          </View>
          {this.mapResults()}
        </View>
        <Modal
          key={'modal'}
          isVisible={this.state.showCourse}
          style={[
            styles.centerContent,
            {
              margin: 0,
              height: '100%',
              width: '100%'
            }
          ]}
          animation={'slideInUp'}
          animationInTiming={250}
          animationOutTiming={250}
          coverScreen={true}
          hasBackdrop={false}
          backdropColor={'white'}
          backdropOpacity={0.79}
        >
          <ContentModal
            hideContentModal={() => {
              this.setState({
                showCourse: false
              });
            }}
          />
        </Modal>
      </View>
    );
  };
}

export default withNavigation(FullScreenVideoList);
