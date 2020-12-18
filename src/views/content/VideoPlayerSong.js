/**
 * VideoPlayerSong
 */
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import Modal from 'react-native-modal';
import SoundSlice from '../../components/SoundSlice.js';
import AntIcon from 'react-native-vector-icons/AntDesign';
import AssignmentResource from './AssignmentResource.js';
import downloadService from '../../services/download.service.js';

export default class VideoPlayerSong extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {
      hideTitles: false,
      showSheets: false,
      showSoundSlice: false,
      assignment: props.assignment
    };
  }

  componentDidMount() {
    downloadService.getAssignWHRatio([this.state.assignment]).then(sheets =>
      this.setState({
        assignment: { ...this.state.assignment, sheets },
        showSheets: true
      })
    );
  }

  render() {
    let {
      showSheets,
      assignment: { slug, index, title, sheets, timeCodes, description }
    } = this.state;
    return (
      <>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior={'never'}
          style={{
            flex: 1,
            backgroundColor: colors.mainBackground
          }}
        >
          <View style={{ height: 25 * factorVertical }} />
          {!this.state.hideTitles && (
            <>
              <TouchableOpacity
                onPress={this.props.onX}
                style={{
                  position: 'absolute',
                  left: 20,
                  top: 20,
                  zIndex: 1
                }}
              >
                <AntIcon
                  name={'close'}
                  size={30 * factorRatio}
                  color={'#ffffff'}
                />
              </TouchableOpacity>
              <Text
                key={'assignmentNumber'}
                style={{
                  fontFamily: 'OpenSans-Regular',
                  fontSize: 16 * factorRatio,
                  fontWeight: '700',
                  textAlign: 'center',
                  color: colors.secondBackground
                }}
              >
                ASSIGNMENT #{index}
              </Text>
              <View style={{ height: 10 * factorVertical }} />
              <Text
                key={'assignmentName'}
                style={{
                  fontFamily: 'OpenSans-Regular',
                  fontSize: 28 * factorRatio,
                  fontWeight: '700',
                  textAlign: 'center',
                  color: '#ffffff'
                }}
              >
                {title}
              </Text>
              <View style={{ height: 10 * factorVertical }} />
              {timeCodes?.map(tc => (
                <View
                  key={'skipTo'}
                  style={[
                    styles.centerContent,
                    {
                      height: fullHeight * 0.025,
                      width: '100%'
                    }
                  ]}
                >
                  <View
                    style={[
                      styles.centerContent,
                      {
                        width: '40%',
                        height: '100%',
                        borderRadius: 30 * factorRatio,
                        backgroundColor: '#ececec',
                        alignSelf: 'center'
                      }
                    ]}
                  >
                    <TouchableOpacity
                      onPress={() => this.props.onSeek?.(tc.value)}
                      style={[
                        styles.centerContent,
                        {
                          height: '100%',
                          width: '100%',
                          alignItems: 'center'
                        }
                      ]}
                    >
                      <Text
                        style={{
                          fontFamily: 'OpenSans-Regular',
                          fontWeight: '700',
                          color: 'grey',
                          fontSize: 12 * factorRatio,
                          alignSelf: 'center'
                        }}
                      >
                        SKIP VIDEO TO {formatTimeHHMMSS(tc.value)}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

              <View
                style={{
                  height: 25 * factorVertical,
                  borderBottomColor: colors.secondBackground,
                  borderBottomWidth: 1 * factorRatio
                }}
              />
              {description !== 'TBD' && (
                <View key={'blurb'} style={{ width: '100%' }}>
                  <Text
                    style={{
                      paddingTop: '5%',
                      paddingBottom: '5%',
                      paddingLeft: '5%',
                      paddingRight: '5%',
                      fontSize: 16 * factorRatio,
                      fontFamily: 'OpenSans-Regular',
                      color: '#ffffff'
                    }}
                  >
                    {description}
                  </Text>
                </View>
              )}
            </>
          )}
          {showSheets ? (
            <AssignmentResource
              ref={r => (this.ptzhsvRef = r)}
              data={sheets}
              onDoubleTap={() => {
                this.setState({
                  hideTitles: !this.state.hideTitles
                });
                this.props.onAssignmentFullscreen();
              }}
            />
          ) : (
            <ActivityIndicator size='large' color={colors.secondBackground} />
          )}
        </ScrollView>
        {!this.state.hideTitles && (
          <View style={{ backgroundColor: colors.mainBackground }}>
            {slug && (
              <TouchableOpacity
                onPress={() => this.setState({ showSoundSlice: true })}
                style={[
                  styles.centerContent,
                  {
                    borderWidth: 2.5 * factorRatio,
                    borderColor: '#fb1b2f',
                    width: '90%',
                    alignSelf: 'center',
                    borderRadius: 100 * factorRatio,
                    marginTop: 10 * factorRatio,
                    marginBottom: 5 * factorRatio
                  }
                ]}
              >
                <Text
                  style={{
                    fontSize: 16 * factorRatio,
                    fontFamily: 'OpenSans-Regular',
                    fontWeight: '800',
                    color: '#fb1b2f',
                    paddingVertical: 10
                  }}
                >
                  PRACTICE
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => this.props.onCompleteAssignment()}
              style={[
                styles.centerContent,
                {
                  borderWidth: 2.5 * factorRatio,
                  borderColor: '#fb1b2f',
                  backgroundColor: '#fb1b2f',
                  width: '90%',
                  alignSelf: 'center',
                  borderRadius: 100 * factorRatio,
                  marginTop: 5 * factorRatio,
                  marginBottom: 10 * factorRatio
                }
              ]}
            >
              <Text
                style={{
                  fontSize: 16 * factorRatio,
                  fontFamily: 'OpenSans-Regular',
                  fontWeight: '800',
                  color: 'white',
                  paddingVertical: 10
                }}
              >
                {this.props.assignmentProgress === 100
                  ? 'COMPLETED'
                  : 'COMPLETE ASSIGNMENT'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <Modal
          key={'soundSlice'}
          isVisible={this.state.showSoundSlice}
          style={[
            styles.centerContent,
            {
              margin: 0,
              height: '100%',
              width: '100%'
            }
          ]}
          animation={'slideInUp'}
          animationInTiming={350}
          animationOutTiming={350}
          coverScreen={true}
          hasBackdrop={true}
        >
          <SoundSlice
            hideSoundSlice={() => {
              this.setState({
                showSoundSlice: false
              });
            }}
            slug={slug}
          />
        </Modal>
      </>
    );
  }
}
function formatTimeHHMMSS(seconds) {
  let h = parseInt(seconds / 3600),
    m = parseInt((seconds - h * 3600) / 60),
    s = parseInt(seconds - h * 3600 - m * 60);
  h = h ? `${h}:` : '';
  m = m < 10 && h ? `0${m}:` : `${m}:`;
  s = s < 10 ? `0${s}` : s;
  return h + m + s;
}
