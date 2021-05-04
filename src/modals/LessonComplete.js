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
import Icon from '../assets/icons';
import ApprovedTeacher from '../assets/img/svgs/approved-teacher.svg';

const windowDim = Dimensions.get('window');
const width =
  windowDim.width < windowDim.height ? windowDim.width : windowDim.height;

export default class LessonComplete extends React.Component {
  changeType = word => {
    word = word.replace(/[- )(]/g, ' ').split(' ');
    let string = '';

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
          <View style={localStyles.container}>
            <View style={styles.centerContent}>
              <Icon.Ionicons
                name={'ios-trophy'}
                size={onTablet ? 45 : 35}
                color={'#fb1b2f'}
              />
            </View>
            <Text
              style={[
                styles.modalHeaderText,
                localStyles.headerText,
                { textTransform: 'capitalize' }
              ]}
            >
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
                  height={onTablet ? 70 : 45}
                  width={onTablet ? 70 : 45}
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
                  )},ar_16:9,fl_lossy,q_auto:eco,c_fill,g_face/${
                    nextLesson.thumbnail_url
                  }`
                }}
              />
            </TouchableOpacity>
            <Text style={[styles.modalHeaderText, localStyles.videoTitle]}>
              {nextLesson.title}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };
}

const localStyles = StyleSheet.create({
  container: {
    borderRadius: 10,
    margin: 20,
    marginTop: 0,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerText: {
    marginVertical: 10
  },
  imageContainer: {
    height: '20%',
    width: '100%',
    alignSelf: 'center',
    borderRadius: 10
  },
  image: {
    height: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  approvedTeacherContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: 10,
    opacity: 0.2,
    backgroundColor: 'red'
  },
  youEarnedText: {
    fontWeight: 'bold',
    marginTop: 10,
    color: '#fb1b2f'
  },
  congratsText: {
    marginHorizontal: 20,
    marginTop: 10
  },
  completeLesson: {
    fontWeight: 'bold',
    marginHorizontal: 20
  },
  upNextText: {
    marginTop: 5,
    marginBottom: 10,
    paddingHorizontal: 20
  },
  image2Container: {
    height: '20%',
    width: '100%',
    alignSelf: 'center',
    borderRadius: 10
  },
  image2: {
    height: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 10
  },
  videoTitle: {
    paddingHorizontal: 20,
    marginTop: 10
  }
});
