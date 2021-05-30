import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet
} from 'react-native';
import SoundSlice from '../../components/SoundSlice.js';
import Icon from '../../assets/icons.js';
import AssignmentResource from './AssignmentResource.js';
import downloadService from '../../services/download.service.js';
import { NetworkContext } from '../../context/NetworkProvider';

let localStyles;
const onTablet = global.onTablet;

export default class Assignment extends React.Component {
  static contextType = NetworkContext;
  constructor(props) {
    super(props);
    localStyles = setStyles(colors, sizing);
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
    else this.setState({ showSheets: false });
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
          style={localStyles.container}
        >
          {!this.state.hideTitles && (
            <>
              <View style={localStyles.titleContainer}>
                <TouchableOpacity
                  onPress={this.props.onX}
                  style={localStyles.xBtn}
                >
                  <Icon.AntDesign
                    name={'close'}
                    size={sizing.myListButtonSize}
                    color={'#ffffff'}
                  />
                </TouchableOpacity>
                <Text style={localStyles.assignmentText}>
                  ASSIGNMENT #{index}
                </Text>
                <Text style={localStyles.title}>{title}</Text>
                {Array.isArray(timeCodes) ? (
                  timeCodes?.map(tc => (
                    <TouchableOpacity
                      onPress={() => this.props.onSeek?.(tc.value)}
                      style={[
                        localStyles.centerContent,
                        localStyles.timeCodeBtn
                      ]}
                    >
                      <Text style={localStyles.timeCodeBtnText}>
                        SKIP VIDEO TO {formatTimeHHMMSS(tc.value)}
                      </Text>
                    </TouchableOpacity>
                  ))
                ) : !!timeCodes ? (
                  <TouchableOpacity
                    onPress={() => this.props.onSeek?.(timeCodes)}
                    style={[localStyles.centerContent, localStyles.timeCodeBtn]}
                  >
                    <Text style={localStyles.timeCodeBtnText}>
                      SKIP VIDEO TO {formatTimeHHMMSS(timeCodes)}
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>

              {description && (
                <View key={'blurb'} style={{ width: '100%' }}>
                  <Text style={localStyles.description}>{description}</Text>
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
          <SafeAreaView
            style={{
              backgroundColor: colors.mainBackground,
              paddingVertical: 10
            }}
          >
            {slug && (
              <TouchableOpacity
                onPress={() => this.setState({ showSoundSlice: true })}
                style={[localStyles.centerContent, localStyles.practiceBtn]}
              >
                <Text style={localStyles.practiceBtnText}>PRACTICE</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => this.props.onCompleteAssignment()}
              style={[localStyles.centerContent, localStyles.completeBtn]}
            >
              <Text style={localStyles.completeBtnText}>
                {this.props.assignmentProgress === 100
                  ? 'COMPLETED'
                  : 'COMPLETE ASSIGNMENT'}
              </Text>
            </TouchableOpacity>
          </SafeAreaView>
        )}

        <SoundSlice
          isVisible={this.state.showSoundSlice}
          hideSoundSlice={() => this.setState({ showSoundSlice: false })}
          slug={slug}
        />
      </>
    );
  }
}

const setStyles = (appColor, size) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: appColor.mainBackground
    },
    xBtn: {
      position: 'absolute',
      right: 10,
      top: 10,
      zIndex: 1
    },
    assignmentText: {
      padding: 10,
      fontFamily: 'OpenSans-Bold',
      fontSize: size.verticalListTitleSmall,
      textAlign: 'center',
      color: appColor.secondBackground
    },
    title: {
      fontSize: size.titleViewLesson,
      fontFamily: 'OpenSans-Bold',
      textAlign: 'center',
      color: 'white',
      paddingHorizontal: 10,
      marginBottom: 10
    },
    titleContainer: {
      borderBottomColor: appColor.secondBackground,
      borderBottomWidth: 1,
      paddingBottom: 10
    },
    timeCodeBtn: {
      borderRadius: 30,
      backgroundColor: '#ececec',
      alignSelf: 'center'
    },
    timeCodeBtnText: {
      fontFamily: 'OpenSans-Bold',
      color: 'grey',
      fontSize: size.descriptionText,
      alignSelf: 'center',
      paddingHorizontal: 10
    },
    description: {
      paddingVertical: '2%',
      paddingHorizontal: '5%',
      textAlign: 'center',
      fontSize: size.descriptionText,
      fontFamily: 'OpenSans-Regular',
      color: '#ffffff'
    },
    practiceBtn: {
      borderWidth: 2,
      borderColor: appColor.pianoteRed,
      width: '90%',
      alignSelf: 'center',
      borderRadius: 300,
      paddingHorizontal: 10,
      marginBottom: 7.5
    },
    practiceBtnText: {
      color: appColor.pianoteRed,
      fontFamily: 'RobotoCondensed-Bold',
      fontSize: size.verticalListTitleSmall,
      height: onTablet ? 45 : 35
    },
    completeBtn: {
      backgroundColor: appColor.pianoteRed,
      width: '90%',
      alignSelf: 'center',
      borderRadius: 300
    },
    completeBtnText: {
      color: 'white',
      fontFamily: 'RobotoCondensed-Bold',
      fontSize: size.verticalListTitleSmall,
      paddingVertical: 10
    },
    centerContent: {
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'center',
      alignSelf: 'stretch'
    }
  });

function formatTimeHHMMSS(seconds) {
  let h = parseInt(seconds / 3600),
    m = parseInt((seconds - h * 3600) / 60),
    s = parseInt(seconds - h * 3600 - m * 60);
  h = h ? `${h}:` : '';
  m = m < 10 && h ? `0${m}:` : `${m}:`;
  s = s < 10 ? `0${s}` : s;
  return h + m + s;
}
