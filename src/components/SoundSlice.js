/**
 * SoundSlice
 */
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { withNavigation } from 'react-navigation';
import FeatherIcon from 'react-native-vector-icons/Feather';
import IdleTimerManager from 'react-native-idle-timer';

class SoundSlice extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    IdleTimerManager.setIdleTimerDisabled(true);
  }

  componentWillUnmount() {
    IdleTimerManager.setIdleTimerDisabled(false);
  }

  render = () => {
    return (
      <View style={styles.container}>
        <View
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: 'white'
          }}
        >
          <View style={{ height: '20%' }}>
            <View
              style={{
                position: 'absolute',
                top: 50,
                left: 20,
                zIndex: 10
              }}
            >
              <View style={{ flex: 1 }} />
              <TouchableOpacity
                onPress={() => {
                  this.props.hideSoundSlice();
                }}
                style={{
                  height: '100%',
                  width: '100%',
                  zIndex: 10
                }}
              >
                <FeatherIcon 
                  size={onTablet ? 50 : 35}
                  name={'x'} 
                  color={'black'} 
                />
              </TouchableOpacity>
            </View>
          </View>
          <WebView
            style={{ flex: 1 }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            allowsInlineMediaPlayback={true}
            automaticallyAdjustContentInsets={true}
            mediaPlaybackRequiresUserAction={false}
            ignoreSilentHardwareSwitch={true}
            source={{
              uri: `https://www.soundslice.com/${
                /^\d+$/.test(this.props.slug) ? 'scores' : 'slices'
              }/${
                this.props.slug
              }/embed/?api=1&scroll_type=2&branding=0&enable_mixer=0`,
              headers: { referer: 'https://www.drumeo.com/' }
            }}
            injectedJavaScript={`
                            setTimeout(() => {
                                var video = document.createElement('video');

                                video.src = 'data:audio/mp3;base64,//tAxAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAFAAAESAAzMzMzMzMzMzMzMzMzMzMzMzMzZmZmZmZmZmZmZmZmZmZmZmZmZmaZmZmZmZmZmZmZmZmZmZmZmZmZmczMzMzMzMzMzMzMzMzMzMzMzMzM//////////////////////////8AAAA5TEFNRTMuMTAwAZYAAAAAAAAAABQ4JAMGQgAAOAAABEhNIZS0AAAAAAD/+0DEAAPH3Yz0AAR8CPqyIEABp6AxjG/4x/XiInE4lfQDFwIIRE+uBgZoW4RL0OLMDFn6E5v+/u5ehf76bu7/6bu5+gAiIQGAABQIUJ0QolFghEn/9PhZQpcUTpXMjo0OGzRCZXyKxoIQzB2KhCtGobpT9TRVj/3Pmfp+f8X7Pu1B04sTnc3s0XhOlXoGVCMNo9X//9/r6a10TZEY5DsxqvO7mO5qFvpFCmKIjhpSItGsUYcRO//7QsQRgEiljQIAgLFJAbIhNBCa+JmorCbOi5q9nVd2dKnusTMQg4MFUlD6DQ4OFijwGAijRMfLbHG4nLVTjydyPlJTj8pfPflf9/5GD950A5e+jsrmNZSjSirjs1R7hnkia8vr//l/7Nb+crvr9Ok5ZJOylUKRxf/P9Zn0j2P4pJYXyKkeuy5wUYtdmOu6uobEtFqhIJViLEKIjGxchGev/L3Y0O3bwrIOszTBAZ7Ih28EUaSOZf/7QsQfg8fpjQIADN0JHbGgQBAZ8T//y//t/7d/2+f5m7MdCeo/9tdkMtGLbt1tqnabRroO1Qfvh20yEbei8nfDXP7btW7f9/uO9tbe5IvHQbLlxpf3DkAk0ojYcv///5/u3/7PTfGjPEPUvt5D6f+/3Lea4lz4tc4TnM/mFPrmalWbboeNiNyeyr+vufttZuvrVrt/WYv3T74JFo8qEDiJqJrmDTs///v99xDku2xG02jjunrICP/7QsQtA8kpkQAAgNMA/7FgQAGnobgfghgqA+uXwWQ3XFmGimSbe2X3ksY//KzK1a2k6cnNWOPJnPWUsYbKqkh8RJzrVf///P///////4vyhLKHLrCb5nIrYIUss4cthigL1lQ1wwNAc6C1pf1TIKRSkt+a//z+yLVcwlXKSqeSuCVQFLng2h4AFAFgTkH+Z/8jTX/zr//zsJV/5f//5UX/0ZNCNCCaf5lTCTRkaEdhNP//n/KUjf/7QsQ5AEhdiwAAjN7I6jGddBCO+WGTQ1mXrYatSAgaykxBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqg==';

                                video.loop = true;
                                video.autoplay = true;
                                video.setAttribute('playsinline', true);
                                video.setAttribute('webkit-playsinline', true);

                            }, 500)
                        `}
          />
        </View>
      </View>
    );
  };
}

export default withNavigation(SoundSlice);
