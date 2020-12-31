/**
 * LessonComplete
 */
import React from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Platform
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { withNavigation } from 'react-navigation';
import IonIcon from 'react-native-vector-icons/Ionicons';
import ApprovedTeacher from 'Pianote2/src/assets/img/svgs/approved-teacher.svg';

class LessonComplete extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {};
  }

  changeType = word => {
    word = word.replace(/[- )(]/g, ' ').split(' ');
    let string = '';

    for (let i = 0; i < word.length; i++) {
      if (word[i] !== 'and') {
        word[i] = word[i][0].toUpperCase() + word[i].substr(1);
      }
    }

    for (i in word) {
      string = string + word[i] + ' ';
    }

    return string;
  };

  render = () => {
    const {
      completedLessonImg,
      completedLessonTitle,
      completedLessonXp,
      nextLesson,
      onGoToNext,
      type
    } = this.props;
    return (
      <TouchableWithoutFeedback
        onPress={() => this.props.hideLessonComplete()}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <View
            style={{
              borderRadius: 10 * factorRatio,
              margin: 20 * factorRatio,
              backgroundColor: 'white',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <View key={'trophy'} style={styles.centerContent}>
              <IonIcon
                name={'ios-trophy'}
                size={32.5 * factorRatio}
                color={'#fb1b2f'}
              />
            </View>
            <View style={{height: 10*factorVertical}}/>
            <Text
              key={'lessonComplete!'}
              style={{
                fontFamily: 'OpenSans-ExtraBold',
                fontSize: 18 * factorRatio,
                textAlign: 'center',
                paddingHorizontal: 20,
              }}
            >
              {this.changeType(type)}
              {'\n'}Complete
            </Text>
            <View style={{height: 10*factorVertical}}/>
            <View
              key={'image1'}
              style={[
                styles.centerContent,
                {
                  height: '20%',
                  width: '100%',
                  alignSelf: 'center',
                  borderRadius: 10 * factorRatio
                }
              ]}
            >
              <FastImage
                style={{
                  height: '100%',
                  aspectRatio: 16 / 9,
                  borderRadius: 10 * factorRatio,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                source={{
                  uri: `https://cdn.musora.com/image/fetch/w_${Math.round(
                    fullWidth * 0.55 * 2
                  )},ar_16:9,fl_lossy,q_auto:eco,c_fill,g_face/${completedLessonImg}`
                }}
                resizeMode={FastImage.resizeMode.cover}
              >
                <View
                  style={[
                    styles.centerContent,
                    {
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      borderRadius: 10 * factorRatio,
                      opacity: 0.2,
                      backgroundColor: 'red'
                    }
                  ]}
                />
                <ApprovedTeacher
                  height={47 * factorRatio}
                  width={47 * factorRatio}
                  fill={'white'}
                />
              </FastImage>
            </View>

            <View key={'lessonTitle'}>
              <Text
                key={'congrats'}
                style={{
                  fontFamily: 'OpenSans-Regular',
                  fontSize: 15 * factorRatio,
                  fontWeight: '300',
                  textAlign: 'center',
                  paddingHorizontal: 20,
                  marginTop: 10
                }}
              >
                Congratulations! You completed
              </Text>
              <Text
                style={{
                  fontFamily: 'OpenSans-Regular',
                  fontSize: 15 * factorRatio,
                  fontWeight: Platform.OS == 'ios' ? '700' : 'bold',
                  textAlign: 'center',
                  paddingHorizontal: 20
                }}
              >
                {completedLessonTitle}
              </Text>

              <Text
                style={{
                  fontFamily: 'OpenSans-Regular',
                  fontSize: 15 * factorRatio,
                  fontWeight: Platform.OS == 'ios' ? '800' : 'bold',
                  textAlign: 'center',
                  color: '#fb1b2f',
                  marginTop: 5
                }}
              >
                YOU EARNED {completedLessonXp} XP!
              </Text>
            </View>
            <View
              key={'line'}
              style={{
                height: 20 * factorVertical,
                borderBottomWidth: 1,
                borderBottomColor: '#ececec'
              }}
            />

            <Text
              key={'upNext'}
              style={{
                fontFamily: 'OpenSans-Regular',
                fontSize: 16 * factorRatio,
                color: '#a8a8a8',
                textAlign: 'center',
                paddingHorizontal: 20,
                marginTop: 10
              }}
            >
              Up next:
            </Text>

            <TouchableOpacity
              key={'image2'}
              onPress={onGoToNext}
              style={[
                styles.centerContent,
                {
                  height: '20%',
                  width: '100%',
                  alignSelf: 'center',
                  borderRadius: 10 * factorRatio
                }
              ]}
            >
              <FastImage
                style={{
                  height: '100%',
                  aspectRatio: 16 / 9,
                  borderRadius: 10 * factorRatio
                }}
                source={{
                  uri: `https://cdn.musora.com/image/fetch/w_${Math.round(
                    fullWidth * 0.55 * 2
                  )},ar_16:9,fl_lossy,q_auto:eco,c_fill,g_face/${nextLesson.getData(
                    'thumbnail_url'
                  )}`
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
            </TouchableOpacity>

            <Text
              style={{
                fontFamily: 'OpenSans-Regular',
                fontSize: 15 * factorRatio,
                fontWeight: Platform.OS == 'ios' ? '700' : 'bold',
                textAlign: 'center',
                paddingHorizontal: 20,
                marginTop: 10
              }}
            >
              {nextLesson.getField('title')}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };
}

export default withNavigation(LessonComplete);
