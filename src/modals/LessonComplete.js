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
          alignItems: 'center',
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
            <Text style={[styles.modalHeaderText]}>
              {this.changeType(type)}
              {'\n'}Complete
            </Text>
            <View style={{height: 20*factorVertical}}/>
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
              <Text style={[styles.modalBodyText, {marginHorizontal: 20*factorHorizontal, marginTop: 10}]}>
                Congratulations! You completed
              </Text>
              <Text
                style={[styles.modalBodyText, {
                  fontWeight:'bold',
                  marginHorizontal: 20*factorHorizontal,
                }]}
              >
                {completedLessonTitle}
              </Text>
              <View style={{height: 10 * factorVertical}}/>
              <Text
                style={[styles.modalBodyText, {
                  fontWeight:  'bold',
                  color: '#fb1b2f',
                }]}
              >
                YOU EARNED {completedLessonXp} XP!
              </Text>
            </View>
            <View style={{height: 5 * factorVertical}}/>

            <Text
              key={'upNext'}
              style={[styles.modalBodyText, {
                color: '#a8a8a8',
                paddingHorizontal: 20,
              }]}
            >
              up next:
            </Text>
            <View style={{height: 10 * factorVertical}}/>
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
              style={[styles.modalHeaderText, {
                paddingHorizontal: 20,
                marginTop: 10
              }]}
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
