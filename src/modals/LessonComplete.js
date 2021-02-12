/**
 * LessonComplete
 */
import React from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { withNavigation } from 'react-navigation';
import IonIcon from 'react-native-vector-icons/Ionicons';
import ApprovedTeacher from 'Pianote2/src/assets/img/svgs/approved-teacher.svg';

const windowDim = Dimensions.get('window');
const width = windowDim.width < windowDim.height ? windowDim.width : windowDim.height;
const height = windowDim.width > windowDim.height ? windowDim.width : windowDim.height;
const factor = (height / 812 + width / 375) / 2;

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
        style={styles.container}
      >
        <View style={[styles.centerContent, styles.container]}>
          <View style={[localStyles.container, {width: width * 0.8 }]}>
            <View style={styles.centerContent}>
              <IonIcon
                name={'ios-trophy'}
                size={32.5 * factor}
                color={'#fb1b2f'}
              />
            </View>
            <Text style={[styles.modalHeaderText, localStyles.headerText]}>
              {this.changeType(type)}
              {'\n'}Complete
            </Text>
            <View style={[styles.centerContent, localStyles.imageContainer]}>
              <FastImage
                style={localStyles.image}
                resizeMode={FastImage.resizeMode.cover}
                source={{
                  uri: `https://cdn.musora.com/image/fetch/w_${Math.round(
                    width * 0.55 * 2
                  )},ar_16:9,fl_lossy,q_auto:eco,c_fill,g_face/${completedLessonImg}`
                }}
              >
                <View
                  style={[
                    styles.centerContent,
                    localStyles.approvedTeacherContainer
                  ]}
                />
                <ApprovedTeacher
                  height={47 * factor}
                  width={47 * factor}
                  fill={'white'}
                />
              </FastImage>
            </View>
            <Text style={[styles.modalBodyText, localStyles.congratsText]}>
              Congratulations! You completed
            </Text>
            <Text style={[styles.modalBodyText, localStyles.completeLesson]}>
              {completedLessonTitle}
            </Text>
            <Text style={[styles.modalBodyText, localStyles.youEarnedText]}>
              YOU EARNED {completedLessonXp} XP!
            </Text>
            <Text style={[styles.modalBodyText, localStyles.upNextText]}>
              up next:
            </Text>
            <TouchableOpacity
              style={[styles.centerContent, localStyles.image2Container]}
              onPress={onGoToNext}
            >
              <FastImage
                style={localStyles.image2}
                resizeMode={FastImage.resizeMode.cover}
                source={{
                  uri: `https://cdn.musora.com/image/fetch/w_${Math.round(
                    width * 0.55 * 2
                  )},ar_16:9,fl_lossy,q_auto:eco,c_fill,g_face/${nextLesson.getData(
                    'thumbnail_url'
                  )}`
                }}
              />
            </TouchableOpacity>
            <Text style={[styles.modalHeaderText, localStyles.videoTitle]}>
              {nextLesson.getField('title')}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };
}

const localStyles = StyleSheet.create({
  container: {
    borderRadius: 10 * factor,
    margin: 20 * factor,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerText: {
    marginVertical: 10 * factor
  },
  imageContainer: {
    height: '20%',
    width: '100%',
    alignSelf: 'center',
    borderRadius: 10 * factor
  },
  image: {
    height: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 10 * factor,
    alignItems: 'center',
    justifyContent: 'center'
  },
  approvedTeacherContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: 10 * factor,
    opacity: 0.2,
    backgroundColor: 'red'
  },
  youEarnedText: {
    fontWeight: 'bold',
    marginTop: 10 * factor,
    color: '#fb1b2f'
  },
  congratsText: {
    marginHorizontal: 20 * factor,
    marginTop: 10
  },
  completeLesson: {
    fontWeight: 'bold',
    marginHorizontal: 20 * factor
  },
  upNextText: {
    marginTop: 5 * factor,
    marginBottom: 10 * factor,
    color: '#a8a8a8',
    paddingHorizontal: 20
  },
  image2Container: {
    height: '20%',
    width: '100%',
    alignSelf: 'center',
    borderRadius: 10 * factor
  },
  image2: {
    height: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 10 * factor
  },
  videoTitle: {
    paddingHorizontal: 20,
    marginTop: 10
  }
});

export default withNavigation(LessonComplete);
