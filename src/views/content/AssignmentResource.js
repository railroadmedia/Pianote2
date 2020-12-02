import React from 'react';
import { PanResponder, View, Dimensions, ScrollView } from 'react-native';

import ImageSvg from 'react-native-remote-svg';
import PDFView from 'react-native-view-pdf';
import Orientation from 'react-native-orientation-locker';

import dldService from '../../services/download.service';
import { NetworkContext } from '../../context/NetworkProvider';

export default class AssignmentResource extends React.Component {
  static contextType = NetworkContext;
  state = {
    scroll: true,
    width: Dimensions.get('window').width
  };

  constructor(props) {
    super(props);

    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onStartShouldSetPanResponder: () => true,
      onShouldBlockNativeResponder: () => false,
      onPanResponderTerminationRequest: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onPanResponderRelease: () => {
        delete this.xDiff;
        delete this.yDiff;
        if (!this.state.scroll) this.setState({ scroll: true });
      },
      onPanResponderTerminate: () => {
        delete this.xDiff;
        delete this.yDiff;
        if (!this.state.scroll) this.setState({ scroll: true });
      },
      onPanResponderMove: (evt, gesture) => {
        let { touches } = evt.nativeEvent;
        if (touches.length === 2) {
          if (this.state.scroll) this.setState({ scroll: false });
          delete this.t1;
          delete this.t2;
          if (!this.xDiff)
            this.xDiff = Math.abs(touches[1].locationX - touches[0].locationX);
          if (!this.yDiff)
            this.yDiff = Math.abs(touches[1].locationY - touches[0].locationY);
          if (
            Math.abs(touches[1].locationX - touches[0].locationX) - this.xDiff >
              10 ||
            Math.abs(touches[1].locationY - touches[0].locationY) - this.yDiff >
              10
          ) {
            if (!this.fs) this.props.onDoubleTap(true);
            this.fs = true;
          } else if (
            Math.abs(touches[1].locationX - touches[0].locationX) - this.xDiff <
              10 ||
            Math.abs(touches[1].locationY - touches[0].locationY) - this.yDiff <
              10
          ) {
            if (this.fs) this.props.onDoubleTap(false);
            delete this.fs;
          }
        }
      },
      onPanResponderStart: (event, gesture) => {
        if (gesture.numberActiveTouches === 1) {
          clearTimeout(this.onPressTimeout);
          if (!this.t1) this.t1 = new Date();
          else if (!this.t2) this.t2 = new Date();
          let { t1, t2 } = this;
          if (t1 & t2) {
            if (t2 - t1 < 500) {
              this.fs = !this.fs;
              if (this.props.onDoubleTap) this.props.onDoubleTap(this.fs);
            }
            delete this.t1;
            delete this.t2;
          }
          this.onPressTimeout = setTimeout(() => {
            delete this.t1;
            delete this.t2;
          }, 500);
        }
      }
    });
  }

  componentDidMount() {
    Orientation.addOrientationListener(this._onOrientationDidChange);
  }

  componentWillUnmount() {
    Orientation.removeOrientationListener(this._onOrientationDidChange);
  }

  _onOrientationDidChange = orientation => this.setState({ width: fullWidth });

  renderDots(i) {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 10,
          marginBottom: 10
        }}
      >
        {this.props.data?.map((dot, index) => (
          <View
            key={index}
            style={[
              {
                height: 10,
                width: 10,
                marginRight: 10,
                borderRadius: 50
              },
              index === i
                ? { backgroundColor: colors.pianoteRed }
                : { backgroundColor: colors.secondBackground }
            ]}
          />
        ))}
      </View>
    );
  }

  resetFS = () => {
    delete this.fs;
  };

  render() {
    let { width } = this.state;
    return (
      <ScrollView
        horizontal={true}
        style={{ flex: 1 }}
        pagingEnabled={true}
        removeClippedSubviews={false}
        scrollEnabled={this.state.scroll}
        showsHorizontalScrollIndicator={false}
        onScroll={() => {
          delete this.t1;
          delete this.t2;
        }}
      >
        <View
          activeOpacity={1}
          {...this.panResponder.panHandlers}
          style={{
            width: width * this.props.data?.length || 0,
            flexDirection: 'row'
          }}
        >
          {this.props.data?.map((sheet, i) => {
            let sourceUri = dldService.manageOfflinePath(sheet.value);
            if (sheet.value.indexOf('.pdf') < 0) {
              return (
                <View
                  key={sheet.id}
                  style={{
                    width,
                    flex: 1,
                    justifyContent: 'space-between'
                  }}
                >
                  <View
                    style={{
                      aspectRatio: sheet.whRatio,
                      backgroundColor: 'transparent',
                      marginHorizontal: 10,
                      width: width - 20
                    }}
                  >
                    <ImageSvg
                      resizeMode='contain'
                      source={{ uri: sourceUri }}
                      style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'white'
                      }}
                    />
                  </View>
                  {this.props.data?.length !== 1 && this.renderDots(i)}
                </View>
              );
            } else {
              if (this.context.isConnected)
                return (
                  <View
                    key={sheet.id}
                    style={{
                      flex: 1,
                      width: this.state.width,
                      justifyContent: 'space-between'
                    }}
                  >
                    <View
                      style={{
                        aspectRatio: 1 / Math.sqrt(2),
                        backgroundColor: 'transparent',
                        marginHorizontal: 10,
                        width
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: 'transparent',
                          position: 'absolute',
                          width: '100%',
                          height: '100%',
                          zIndex: 10
                        }}
                      />
                      <PDFView
                        onLoad={e => {}}
                        onError={e => {}}
                        resourceType={'file'}
                        resource={sourceUri}
                        fadeInDuration={250.0}
                        style={{
                          width: '100%',
                          height: '100%',
                          backgroundColor: 'white'
                        }}
                      />
                    </View>
                    {this.props.data?.length !== 1 && this.renderDots(i)}
                  </View>
                );
              else
                return (
                  <View
                    key={sheet.id}
                    style={{
                      flex: 1,
                      width: width,
                      justifyContent: 'space-between'
                    }}
                  >
                    <View
                      key={sheet.id}
                      style={{
                        aspectRatio: 1 / Math.sqrt(2),
                        backgroundColor: 'transparent',
                        marginHorizontal: 10,
                        width: width - 20
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: 'transparent',
                          position: 'absolute',
                          width: '100%',
                          height: '100%',
                          zIndex: 10
                        }}
                      />
                      <PDFView
                        onLoad={e => {}}
                        onError={e => {}}
                        resourceType={'url'}
                        resource={sourceUri}
                        fadeInDuration={250.0}
                        style={{
                          width: '100%',
                          height: '100%',
                          backgroundColor: 'white'
                        }}
                      />
                    </View>
                    {this.props.data?.length !== 1 && this.renderDots(i)}
                  </View>
                );
            }
          })}
        </View>
      </ScrollView>
    );
  }
}
