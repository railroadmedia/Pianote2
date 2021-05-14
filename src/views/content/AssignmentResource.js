import React from 'react';
import { PanResponder, View, ScrollView, Dimensions } from 'react-native';
import ImageSvg from 'react-native-remote-svg';
import PDFView from 'react-native-view-pdf';
import { SafeAreaView } from 'react-navigation';
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

  renderDots(i) {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginVertical: 10
        }}
      >
        {this.props.data.length > 1 &&
          this.props.data?.map((dot, index) => (
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
    console.log(this.props.data);
    let { width } = this.state;
    return (
      <SafeAreaView style={{ flex: 1 }} forceInset={{ top: 'always' }}>
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
          onLayout={({
            nativeEvent: {
              layout: { width }
            }
          }) =>
            this.setState({ width }, () =>
              this.scrollView.scrollTo({ x: 0, animated: true })
            )
          }
          ref={r => (this.scrollView = r)}
        >
          <View
            activeOpacity={1}
            {...this.panResponder.panHandlers}
            style={{ flexDirection: 'row' }}
          >
            {this.props.data?.map((sheet, i) => (
              <View key={i}>
                {sheet.value.includes('.pdf') ? (
                  <>
                    <PDFView
                      resourceType={this.context.isConnected ? 'url' : 'file'}
                      resource={sheet.value}
                      fadeInDuration={250.0}
                      style={{
                        width: width - 10,
                        marginHorizontal: 5,
                        aspectRatio:
                          1 / Math.sqrt(2) / (sheet.numberOfPages || 1)
                      }}
                    />
                    <View
                      style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%'
                      }}
                    />
                  </>
                ) : (
                  <ImageSvg
                    resizeMode='contain'
                    source={{ uri: sheet.value }}
                    style={{
                      margin: 5,
                      width: width - 10,
                      aspectRatio: sheet.whRatio,
                      backgroundColor: 'white'
                    }}
                  />
                )}
                {this.renderDots(i)}
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
