/**
 * Taskbar for navigation
 */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation';
import FastImage from 'react-native-fast-image';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { ContentModel } from '@musora/models';

class NextVideo extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {};
  }

  render = () => {
    return (
      <TouchableOpacity
        onPress={this.props.onNextLesson}
        style={{
          backgroundColor: this.props.isMethod
            ? 'black'
            : colors.mainBackground,
          borderBottomColor: this.props.isMethod
            ? colors.pianoteGrey
            : colors.secondBackground,
          borderBottomWidth: 0.25 * factorRatio
        }}
      >
        <View style={{ width: '100%' }}>
          <View
            key={'progress'}
            style={{ flexDirection: 'row', height: 3 * factorVertical }}
          >
            <View
              style={{
                flex: this.props.progress / 100,
                backgroundColor: colors.pianoteRed
              }}
            />
            <View
              style={{
                flex: 1 - this.props.progress / 100,
                backgroundColor: this.props.isMethod
                  ? colors.pianoteGrey
                  : colors.secondBackground
              }}
            />
          </View>
          <View style={{ height: 10 * factorVertical }} />
          <View
            key={'nextLesson'}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 15
            }}
          >
            <Text
              style={{
                fontSize: 16 * factorRatio,
                textAlign: 'left',
                fontFamily: 'RobotoCondensed-Bold',
                color: this.props.isMethod
                  ? colors.pianoteGrey
                  : colors.secondBackground
              }}
            >
              YOUR NEXT LESSON
            </Text>

            <Text
              style={{
                fontSize: 12 * factorRatio,
                fontFamily: 'OpenSans-Regular',
                color: this.props.isMethod
                  ? colors.pianoteGrey
                  : colors.secondBackground,
                textAlign: 'right'
              }}
            >
              {this.props.type} - {this.props.progress}% COMPLETE
            </Text>
          </View>
          <View
            key={'video'}
            style={{
              flexDirection: 'row',
              paddingHorizontal: 15
            }}
          >
            <View
              key={'thumbnail'}
              style={{ justifyContent: 'center' }}
              underlayColor={'transparent'}
            >
              <FastImage
                style={{
                  width: fullWidth * 0.24,
                  aspectRatio: 16 / 9,
                  borderRadius: 7 * factorRatio
                }}
                source={{
                  uri: `https://cdn.musora.com/image/fetch/w_${Math.round(
                    fullWidth * 0.24 * 2
                  )},ar_16:9,fl_lossy,q_auto:eco,c_fill,g_face/${this.props.item.getData(
                    'thumbnail_url'
                  )}`
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
            </View>
            <View
              key={'titles'}
              style={{
                paddingLeft: 15,
                alignSelf: 'center'
              }}
            >
              <Text
                style={{
                  fontSize: 15 * factorRatio,
                  textAlign: 'left',
                  fontWeight: 'bold',
                  fontFamily: 'OpenSans-Regular',
                  color: 'white'
                }}
              >
                {this.props.item.getField('title')}
              </Text>
              <View style={{ height: 2 }} />
              <Text
                numberOfLines={2}
                style={{
                  fontSize: 12 * factorRatio,
                  fontFamily: 'OpenSans-Regular',
                  textAlign: 'left',
                  color: this.props.isMethod
                    ? colors.pianoteGrey
                    : colors.secondBackground
                }}
              >
                {this.props.item.post.fields?.find(f => f.key === 'video')
                  ? Math.round(
                      new ContentModel(
                        this.props.item.getFieldMulti('video')[0]
                      )?.getField('length_in_seconds') / 60
                    )
                  : 0}{' '}
                MINS
              </Text>
            </View>
            <View
              key={'play'}
              onPress={() => {}}
              style={[
                styles.centerContent,
                {
                  flex: 1,
                  flexDirection: 'row'
                }
              ]}
            >
              <View style={{ flex: 1 }} />
              <EntypoIcon
                name={'controller-play'}
                size={30 * factorRatio}
                color={colors.pianoteRed}
              />
            </View>
          </View>
        </View>
        <View style={{ height: 15 * factorVertical }} />
      </TouchableOpacity>
    );
  };
}

export default withNavigation(NextVideo);
