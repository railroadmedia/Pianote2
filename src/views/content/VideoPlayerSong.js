/**
 * VideoPlayerSong
 */
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Modal from 'react-native-modal';
import SoundSlice from '../../components/SoundSlice.js';
import AntIcon from 'react-native-vector-icons/AntDesign';
import AssignmentResource from './AssignmentResource.js';
import downloadService from '../../services/download.service.js';
import { NetworkContext } from '../../context/NetworkProvider';

const windowDim = Dimensions.get('window');
const width =
  windowDim.width < windowDim.height ? windowDim.width : windowDim.height;
const height =
  windowDim.width > windowDim.height ? windowDim.width : windowDim.height;
const factor = (height / 812 + width / 375) / 2;

export default class VideoPlayerSong extends React.Component {
  static contextType = NetworkContext;
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
    if (this.context.isConnected)
      downloadService.getAssignWHRatio([this.state.assignment]).then(sheets =>
        this.setState({
          assignment: { ...this.state.assignment, sheets },
          showSheets: true
        })
      );
    else this.setState({ showSheets: true });
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
          {!this.state.hideTitles && (
            <>
              <TouchableOpacity
                onPress={this.props.onX}
                style={{
                  position: 'absolute',
                  right: paddingInset,
                  top: paddingInset,
                  zIndex: 1
                }}
              >
                <AntIcon
                  name={'close'}
                  size={sizing.myListButtonSize}
                  color={'#ffffff'}
                />
              </TouchableOpacity>
              <Text
                style={{
                  padding: paddingInset,
                  fontFamily: 'OpenSans-Bold',
                  fontSize: sizing.verticalListTitleSmall,
                  textAlign: 'center',
                  color: colors.secondBackground
                }}
              >
                ASSIGNMENT #{index}
              </Text>
              <Text
                style={{
                  fontSize: sizing.titleVideoPlayer,
                  fontFamily: 'OpenSans-Bold',
                  textAlign: 'center',
                  color: 'white',
                  paddingHorizontal: paddingInset
                }}
              >
                {title}
              </Text>
              <View style={{ height: 10 }} />
              {timeCodes?.map(tc => (
                <View
                  style={[
                    styles.centerContent,
                    {
                      height: height * 0.025,
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
                        borderRadius: 30,
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
                          fontSize: sizing.descriptionText,
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
                  height: 1,
                  borderBottomColor: colors.secondBackground,
                  borderBottomWidth: 1
                }}
              />
              {description !== 'TBD' && (
                <View key={'blurb'} style={{ width: '100%' }}>
                  <Text
                    style={{
                      paddingVertical: '2%',
                      paddingHorizontal: '5%',
                      textAlign: 'center',
                      fontSize: sizing.descriptionText,
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
        {!this.state.hideTitles && this.context.isConnected && (
          <View
            style={{
              backgroundColor: colors.mainBackground,
              paddingVertical: 10
            }}
          >
            {slug && (
              <TouchableOpacity
                onPress={() => this.setState({ showSoundSlice: true })}
                style={[
                  styles.centerContent,
                  styles.heightButtons,
                  {
                    borderWidth: 2,
                    borderColor: '#fb1b2f',
                    width: '90%',
                    alignSelf: 'center',
                    borderRadius: 300,
                    paddingHorizontal: 10,
                    marginBottom: 7.5,
                  }
                ]}
              >
                <Text
                  style={{
                    color: '#fb1b2f',
                    fontFamily: 'RobotoCondensed-Bold',
                    fontSize: sizing.verticalListTitleSmall,
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
                  marginBottom: DeviceInfo.hasNotch() ? 20 : 0,
                  backgroundColor: '#fb1b2f',
                  width: '90%',
                  alignSelf: 'center',
                  borderRadius: 300
                }
              ]}
            >
              <Text
                style={{
                  color: 'white',
                  fontFamily: 'RobotoCondensed-Bold',
                  fontSize: sizing.verticalListTitleSmall,
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
          isVisible={this.state.showSoundSlice}
          style={styles.modalContainer}
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
