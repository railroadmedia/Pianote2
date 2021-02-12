/**
 * Filters
 */
import React from 'react';
import {
  View,
  Text,
  StatusBar,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import Back from 'Pianote2/src/assets/img/svgs/back.svg';
import Modal from 'react-native-modal';
import FastImage from 'react-native-fast-image';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Loading from 'Pianote2/src/modals/Loading.js';

const windowDim = Dimensions.get('window');
const width = windowDim.width < windowDim.height ? windowDim.width : windowDim.height;
const height = windowDim.width > windowDim.height ? windowDim.width : windowDim.height;
const factor = (height / 812 + width / 375) / 2;
const messageDict = {
  1: 'A level 1 pianist is just beginning and might not yet have any skills yet. A level 1 pianist will learn how to navigate the keyboard, play a C scale, chords and begin to build dexterity and control in their hands.',
  2: 'A level 2 pianist can play a C scale hands together, a chord progression in the key of C and understands basic rhythm.',
  3: 'A level 3 pianist can read basic notation and is gaining confidence in playing hands together and reading simple notation on the grand staff.',
  4: 'A level 4 pianist understands how to build and play both major and minor scales and the 1-5-6-4 chord progression. At level 4 you are beginning to play with dynamics and are becoming comfortable in moving your hands outside of “C position” as you play.',
  5: 'A level 5 pianist can play chord inversions and the G major scale as well as apply their knowledge of chord progressions to this new key. They can read notations that include accidentals and eighth notes.',
  6: 'A level 6 a pianist can play in the keys of F major and D minor and is using chord inversions while playing chord progressions.',
  7: 'A level 7 pianist can play with dynamics and the sustain pedal, in 4/4 and ¾ time and is able to read and play most of the notation found within Pianote.',
  8: 'At level 8 a pianist understands the circle of 5th and is able to use it to help them play scales and songs in any key signature.',
  9: 'A level 9 pianist should be comfortable with the basics of improvisation and use a variety of left hand patterns and right hand fills as they create their own music. They also understand how to build and play 7th chords.',
  10: 'A level 10 pianist understands the 12 bar blues, the blues scale, and the 2-5-1 Jazz progression. By level 10 you can learn to play any song in our library and improvise in pop, blues or jazz styles.',
  All: 'This will display all piano lessons regardless of their difficulty.'
};

export default class Filters extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {
      filtersAvailable:
        this.props.filtersAvailable.length == 0
          ? {
              artist: [],
              content_type: [],
              difficulty: [],
              instructor: [],
              style: [],
              topic: []
            }
          : this.props.filtersAvailable,
      filters: this.props.filters,
      type: this.props.type,
      selected: false,
      level: null,
      allLevels: true,

      displayTopics: [],
      content_type: [],
      topics: [],
      level: [],
      progress: [],
      instructors: [],

      showLoading: false,
      filterType:
        this.props.type == 'My List' ||
        this.props.type == 'Search' ||
        this.props.type == 'See All'
          ? true
          : false
    };
  }

  UNSAFE_componentWillReceiveProps = props => {
    this.setState({
      filtersAvailable: props.filtersAvailable,
      showLoading: props.filtering
    });
  };

  componentDidMount = () => {
    this.setState({
      selected: this.state.filters.length == 0 ? false : true,
      displayTopics: this.state.filters.displayTopics,
      instructors: this.state.filters.instructors,
      content_type: this.state.filters.content_type,
      level: this.state.filters.level,
      allLevels: this.state.filters.level.length > 0 ? false : true,
      topics: this.state.filters.topics,
      progress: this.state.filters.progress
    });
  };

  reset = async () => {
    this.setState({
      level: null,
      allLevels: true,
      selected: false,
      displayTopics: [],
      topics: [],
      level: [],
      content_type: [],
      progress: [],
      instructors: [],
      showLoading: false
    });

    this.props.reset({
      displayTopics: [],
      topics: [],
      level: [],
      content_type: [],
      progress: [],
      instructors: []
    });
  };

  select = async () => {
    this.setState({ showLoading: true, selected: true });
    this.props.filterVideos({
      displayTopics: this.state.displayTopics,
      topics: this.state.topics,
      content_type: this.state.content_type,
      instructors: this.state.instructors,
      progress: this.state.progress,
      level: this.state.allLevels ? [] : this.state.level
    });
  };

  chooseTopic = (type, word) => {
    if (
      this.state.topics.includes(
        type + word.split(' ').join('+').replace(/&/g, '%2b')
      )
    ) {
      const ind = this.state.displayTopics.indexOf(word);
      if (ind > -1) {
        this.state.displayTopics.splice(ind, 1);
      }

      const index = this.state.topics.indexOf(
        type + word.split(' ').join('+').replace(/&/g, '%2b')
      );
      if (index > -1) {
        this.state.topics.splice(index, 1);
      }
    } else {
      this.state.topics.push(
        type + word.split(' ').join('+').replace(/&/g, '%2b')
      );
      this.state.displayTopics.push(word);
    }
    this.setState({
      topics: this.state.topics,
      displayTopics: this.state.displayTopics
    });
    this.select();
  };

  chooseProgress = progress => {
    if (this.state.progress.includes(progress)) {
      this.state.progress = [];
      this.setState({ progress: this.state.progress });
    } else {
      this.state.progress = [];
      this.state.progress.push(progress);
      this.setState({ progress });
    }
    this.select();
  };

  chooseInstructor = data => {
    console.log(data);
    //var arr = [data.id, data.fields.find(f => f.key === 'name')?.value]
    if (
      this.state.instructors.length > 0 &&
      this.state.instructors.includes(data.id)
    ) {
      this.state.instructors = [];
      this.setState({ instructors: this.state.instructors });
    } else {
      //this.state.instructors = []
      this.state.instructors.push(data.id);
      this.setState({ instructors: this.state.instructors });
    }
    this.select();
  };

  chooseDifficulty = num => {
    if (num == 'all') {
      if (this.state.allLevels) {
        this.state.allLevels = false;
        this.state.level = [10, 'ADVANCED'];
      } else {
        this.state.allLevels = true;
        this.state.level = [];
      }
    } else if (num < 4) {
      this.state.level = [num, 'BEGINNER'];
      this.state.allLevels = false;
    } else if (num < 6) {
      this.state.level = [num, 'INTERMEDIATE'];
      this.state.allLevels = false;
    } else {
      this.state.level = [num, 'ADVANCED'];
      this.state.allLevels = false;
    }

    this.setState({ level: this.state.level, allLevels: this.state.allLevels });
    this.select();
  };

  chooseContentType = word => {
    console.log(word);
    if (this.state.content_type.includes(word)) {
      const ind = this.state.displayTopics.indexOf(word);
      if (ind > -1) {
        this.state.displayTopics.splice(ind, 1);
      }

      const index = this.state.content_type.indexOf(word);
      if (index > -1) {
        this.state.content_type.splice(index, 1);
      }
    } else {
      this.state.content_type.push(word);
      this.state.displayTopics.push(word);
    }
    this.setState({
      content_type: this.state.content_type,
      displayTopics: this.state.displayTopics
    });
    console.log(word);
    this.select();
  };

  convertUppercase = word => {
    let words = word.replace(/-/g, ' ').split(' ');

    for (let i = 0; i < words.length; i++) {
      words[i] = words[i][0].toUpperCase() + words[i].substr(1) + ' ';
    }

    return words;
  };

  render() {
    return (
      <View style={styles.mainContainer}>
        <SafeAreaView
          style={{ flex: 0, backgroundColor: colors.thirdBackground }}
        />
        <SafeAreaView
          forceInset={{
            bottom: 'never'
          }}
          style={[
            styles.mainContainer,
            { backgroundColor: colors.mainBackground }
          ]}
        >
          <StatusBar
            backgroundColor={colors.secondBackground}
            barStyle={'light-content'}
          />
          <View style={styles.childHeader}>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => this.props.hideFilters()}
            >
              <Back
                width={(onTablet ? 17.5 : 25) * factor}
                height={(onTablet ? 17.5 : 25) * factor}
                fill={'white'}
              />
            </TouchableOpacity>
            <Text style={styles.childHeaderText}>
              Filter {this.state.filterType ? null : this.state.type}
            </Text>
            <View style={{ flex: 1 }} />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentInsetAdjustmentBehavior={'never'}
            style={styles.mainContainer}
          >
            {!this.state.filterType && (
              <View>
                <Text style={styles.filterHeader}>SET YOUR SKILL LEVEL</Text>
                <View
                  style={[
                    styles.centerContent,
                    {
                      paddingHorizontal: width * 0.035,
                      marginBottom: 10 * factor
                    }
                  ]}
                >
                  <View
                    style={[
                      styles.centerContent,
                      {
                        marginVertical: 10 * factor,
                        height: 10 * factor,
                        width: `100%`
                      }
                    ]}
                  >
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row'
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          this.state.filtersAvailable.difficulty.includes('1')
                            ? this.chooseDifficulty(1)
                            : null;
                        }}
                        style={{
                          flex: 1,
                          backgroundColor: this.state.filtersAvailable.difficulty.includes(
                            '1'
                          )
                            ? this.state.level[0] > 0 || this.state.allLevels
                              ? colors.pianoteRed
                              : null
                            : colors.secondBackground,
                          borderColor: this.state.filtersAvailable.difficulty.includes(
                            '1'
                          )
                            ? colors.pianoteRed
                            : colors.secondBackground,
                          borderWidth: 1.25,
                          borderRadius: 5 * factor,
                          marginRight: 2.5 * factor
                        }}
                      />
                      <TouchableOpacity
                        onPress={() => {
                          this.state.filtersAvailable.difficulty.includes('2')
                            ? this.chooseDifficulty(2)
                            : null;
                        }}
                        style={{
                          flex: 1,
                          backgroundColor: this.state.filtersAvailable.difficulty.includes(
                            '2'
                          )
                            ? this.state.level[0] > 1 || this.state.allLevels
                              ? colors.pianoteRed
                              : null
                            : colors.secondBackground,
                          borderColor: this.state.filtersAvailable.difficulty.includes(
                            '2'
                          )
                            ? colors.pianoteRed
                            : colors.secondBackground,
                          borderWidth: 1.25,
                          borderRadius: 5 * factor,
                          marginRight: 2.5 * factor
                        }}
                      />
                      <TouchableOpacity
                        onPress={() => {
                          this.state.filtersAvailable.difficulty.includes('3')
                            ? this.chooseDifficulty(3)
                            : null;
                        }}
                        style={{
                          flex: 1,
                          backgroundColor: this.state.filtersAvailable.difficulty.includes(
                            '3'
                          )
                            ? this.state.level[0] > 2 || this.state.allLevels
                              ? colors.pianoteRed
                              : null
                            : colors.secondBackground,
                          borderColor: this.state.filtersAvailable.difficulty.includes(
                            '3'
                          )
                            ? colors.pianoteRed
                            : colors.secondBackground,
                          borderWidth: 1.25,
                          borderRadius: 5 * factor,
                          marginRight: 2.5 * factor
                        }}
                      />
                      <TouchableOpacity
                        onPress={() => {
                          this.state.filtersAvailable.difficulty.includes('4')
                            ? this.chooseDifficulty(4)
                            : null;
                        }}
                        style={{
                          flex: 1,
                          backgroundColor: this.state.filtersAvailable.difficulty.includes(
                            '4'
                          )
                            ? this.state.level[0] > 3 || this.state.allLevels
                              ? colors.pianoteRed
                              : null
                            : colors.secondBackground,
                          borderColor: this.state.filtersAvailable.difficulty.includes(
                            '4'
                          )
                            ? colors.pianoteRed
                            : colors.secondBackground,
                          borderWidth: 1.25,
                          borderRadius: 5 * factor,
                          marginRight: 2.5 * factor
                        }}
                      />
                      <TouchableOpacity
                        onPress={() => {
                          this.state.filtersAvailable.difficulty.includes('5')
                            ? this.chooseDifficulty(5)
                            : null;
                        }}
                        style={{
                          flex: 1,
                          backgroundColor: this.state.filtersAvailable.difficulty.includes(
                            '5'
                          )
                            ? this.state.level[0] > 4 || this.state.allLevels
                              ? colors.pianoteRed
                              : null
                            : colors.secondBackground,
                          borderColor: this.state.filtersAvailable.difficulty.includes(
                            '5'
                          )
                            ? colors.pianoteRed
                            : colors.secondBackground,
                          borderWidth: 1.25,
                          borderRadius: 5 * factor,
                          marginRight: 2.5 * factor
                        }}
                      />
                      <TouchableOpacity
                        onPress={() => {
                          this.state.filtersAvailable.difficulty.includes('6')
                            ? this.chooseDifficulty(6)
                            : null;
                        }}
                        style={{
                          flex: 1,
                          backgroundColor: this.state.filtersAvailable.difficulty.includes(
                            '6'
                          )
                            ? this.state.level[0] > 5 || this.state.allLevels
                              ? colors.pianoteRed
                              : null
                            : colors.secondBackground,
                          borderColor: this.state.filtersAvailable.difficulty.includes(
                            '6'
                          )
                            ? colors.pianoteRed
                            : colors.secondBackground,
                          borderWidth: 1.25,
                          borderRadius: 5 * factor,
                          marginRight: 2.5 * factor
                        }}
                      />
                      <TouchableOpacity
                        onPress={() => {
                          this.state.filtersAvailable.difficulty.includes('7')
                            ? this.chooseDifficulty(7)
                            : null;
                        }}
                        style={{
                          flex: 1,
                          backgroundColor: this.state.filtersAvailable.difficulty.includes(
                            '7'
                          )
                            ? this.state.level[0] > 6 || this.state.allLevels
                              ? colors.pianoteRed
                              : null
                            : colors.secondBackground,
                          borderColor: this.state.filtersAvailable.difficulty.includes(
                            '7'
                          )
                            ? colors.pianoteRed
                            : colors.secondBackground,
                          borderWidth: 1.25,
                          borderRadius: 5 * factor,
                          marginRight: 2.5 * factor
                        }}
                      />
                      <TouchableOpacity
                        onPress={() => {
                          this.state.filtersAvailable.difficulty.includes('8')
                            ? this.chooseDifficulty(8)
                            : null;
                        }}
                        style={{
                          flex: 1,
                          backgroundColor: this.state.filtersAvailable.difficulty.includes(
                            '8'
                          )
                            ? this.state.level[0] > 7 || this.state.allLevels
                              ? colors.pianoteRed
                              : null
                            : colors.secondBackground,
                          borderColor: this.state.filtersAvailable.difficulty.includes(
                            '8'
                          )
                            ? colors.pianoteRed
                            : colors.secondBackground,
                          borderWidth: 1.25,
                          borderRadius: 5 * factor,
                          marginRight: 2.5 * factor
                        }}
                      />
                      <TouchableOpacity
                        onPress={() => {
                          this.state.filtersAvailable.difficulty.includes('9')
                            ? this.chooseDifficulty(9)
                            : null;
                        }}
                        style={{
                          flex: 1,
                          backgroundColor: this.state.filtersAvailable.difficulty.includes(
                            '9'
                          )
                            ? this.state.level[0] > 8 || this.state.allLevels
                              ? colors.pianoteRed
                              : null
                            : colors.secondBackground,
                          borderColor: this.state.filtersAvailable.difficulty.includes(
                            '9'
                          )
                            ? colors.pianoteRed
                            : colors.secondBackground,
                          borderWidth: 1.25,
                          borderRadius: 5 * factor,
                          marginRight: 2.5 * factor
                        }}
                      />
                      <TouchableOpacity
                        onPress={() => {
                          this.state.filtersAvailable.difficulty.includes('10')
                            ? this.chooseDifficulty(10)
                            : null;
                        }}
                        style={{
                          flex: 1,
                          backgroundColor: this.state.filtersAvailable.difficulty.includes(
                            '10'
                          )
                            ? this.state.level[0] > 9 || this.state.allLevels
                              ? colors.pianoteRed
                              : null
                            : colors.secondBackground,
                          borderColor: this.state.filtersAvailable.difficulty.includes(
                            '10'
                          )
                            ? colors.pianoteRed
                            : colors.secondBackground,
                          borderWidth: 1.25,
                          borderRadius: 5 * factor,
                          marginRight: 2.5 * factor
                        }}
                      />
                    </View>
                  </View>
                </View>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 24 * factor,
                    fontFamily: 'OpenSans-Bold',
                    color: 'white',
                    marginBottom: 10 * factor
                  }}
                >
                  {this.state.allLevels
                    ? 'ALL LEVELS'
                    : 'LEVEL ' + this.state.level[0]}
                </Text>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 14 * factor,
                    fontFamily: 'OpenSans-Regular',
                    color: 'white',
                    paddingHorizontal: width * 0.1,
                    marginBottom: 15 * factor
                  }}
                >
                  {this.state.level == null || this.state.allLevels
                    ? messageDict['All']
                    : messageDict[this.state.level[0]]}
                </Text>
                <View
                  key={'allLevels'}
                  style={{
                    height: 60 * factor,
                    borderBottomWidth: 0.5 * factor,
                    borderBottomColor: colors.secondBackground
                  }}
                >
                  <View
                    style={{
                      height: 30 * factor,
                      justifyContent: 'space-around',
                      alignContent: 'space-around',
                      flexDirection: 'row'
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        !this.state.selected
                          ? this.chooseDifficulty('all')
                          : null;
                      }}
                      style={[
                        styles.centerContent,
                        {
                          height: 30 * factor,
                          width: width * 0.3,
                          marginRight: width * 0.01,
                          marginLeft: width * 0.01,
                          borderWidth: 0.5 * factor,
                          borderColor:
                            !this.state.selected && this.state.allLevels
                              ? 'transparent'
                              : colors.secondBackground,
                          backgroundColor:
                            !this.state.selected && this.state.allLevels
                              ? 'red'
                              : 'transparent',
                          borderRadius: 200
                        }
                      ]}
                    >
                      <Text
                        style={{
                          textAlign: 'center',
                          fontSize: 12 * factor,
                          fontFamily: 'OpenSans-ExtraBold',
                          color:
                            !this.state.selected && this.state.allLevels
                              ? 'white'
                              : colors.secondBackground
                        }}
                      >
                        ALL
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
            {this.state.type !== 'Songs' && (
              <View key={'topics & content type'}>
                {!this.state.filterType && (
                  <View key={'topics-'}>
                    <Text style={styles.filterHeader}>
                      WHAT DO YOU WANT TO WORK ON?
                    </Text>

                    <View
                      style={{
                        minHeight: 160 * factor,
                        width: '100%'
                      }}
                    >
                      <ScrollView
                        style={{
                          height: this.state.filterType
                            ? 350 * factor
                            : 40 * factor + 90 * factor,
                          width: '100%'
                        }}
                      >
                        {this.state.filtersAvailable.topic.map(
                          (data, index) => {
                            if (index % 3 == 0) {
                              return (
                                <View
                                  style={{
                                    height: 40 * factor,
                                    width: '100%',
                                    flexDirection: 'row',
                                    padding: 5
                                  }}
                                  horizontal={true}
                                >
                                  {typeof this.state.filtersAvailable.topic[
                                    index
                                  ] == 'string' && (
                                    <TouchableOpacity
                                      onPress={() => {
                                        this.chooseTopic(
                                          'topic,',
                                          this.state.filtersAvailable.topic[
                                            index
                                          ]
                                        );
                                      }}
                                      style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginLeft: 5 * factor,
                                        marginRight: 5 * factor,
                                        borderWidth: 1 * factor,
                                        borderColor: this.state.displayTopics.includes(
                                          this.state.filtersAvailable.topic[
                                            index
                                          ]
                                        )
                                          ? colors.pianoteRed
                                          : colors.secondBackground,
                                        backgroundColor: this.state.displayTopics.includes(
                                          this.state.filtersAvailable.topic[
                                            index
                                          ]
                                        )
                                          ? colors.pianoteRed
                                          : null,
                                        borderRadius: 100
                                      }}
                                    >
                                      <Text
                                        numberOfLines={1}
                                        style={{
                                          textAlign: 'center',
                                          color: this.state.displayTopics.includes(
                                            this.state.filtersAvailable.topic[
                                              index
                                            ]
                                          )
                                            ? 'white'
                                            : colors.secondBackground,
                                          fontSize: 0.035 * width,
                                          marginLeft: 5 * factor,
                                          marginRight: 5 * factor,
                                          fontFamily: 'RobotoCondensed-Bold'
                                        }}
                                      >
                                        {
                                          this.state.filtersAvailable.topic[
                                            index
                                          ]
                                        }
                                      </Text>
                                    </TouchableOpacity>
                                  )}
                                  {typeof this.state.filtersAvailable.topic[
                                    index
                                  ] !== 'string' && (
                                    <View style={{ flex: 1 }} />
                                  )}
                                  {typeof this.state.filtersAvailable.topic[
                                    index + 1
                                  ] == 'string' && (
                                    <TouchableOpacity
                                      onPress={() => {
                                        this.chooseTopic(
                                          'topic,',
                                          this.state.filtersAvailable.topic[
                                            index + 1
                                          ]
                                        ),
                                          this.forceUpdate();
                                      }}
                                      style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginLeft: 5 * factor,
                                        marginRight: 5 * factor,
                                        borderWidth: 1 * factor,
                                        borderColor: this.state.displayTopics.includes(
                                          this.state.filtersAvailable.topic[
                                            index + 1
                                          ]
                                        )
                                          ? colors.pianoteRed
                                          : colors.secondBackground,
                                        backgroundColor: this.state.displayTopics.includes(
                                          this.state.filtersAvailable.topic[
                                            index + 1
                                          ]
                                        )
                                          ? colors.pianoteRed
                                          : null,
                                        borderRadius: 100
                                      }}
                                    >
                                      <Text
                                        numberOfLines={1}
                                        style={{
                                          textAlign: 'center',
                                          color: this.state.displayTopics.includes(
                                            this.state.filtersAvailable.topic[
                                              index + 1
                                            ]
                                          )
                                            ? 'white'
                                            : colors.secondBackground,
                                          fontSize: 0.035 * width,
                                          marginLeft: 5 * factor,
                                          marginRight: 5 * factor,
                                          fontFamily: 'RobotoCondensed-Bold'
                                        }}
                                      >
                                        {
                                          this.state.filtersAvailable.topic[
                                            index + 1
                                          ]
                                        }
                                      </Text>
                                    </TouchableOpacity>
                                  )}
                                  {typeof this.state.filtersAvailable.topic[
                                    index + 1
                                  ] !== 'string' && (
                                    <View style={{ flex: 1 }} />
                                  )}
                                  {typeof this.state.filtersAvailable.topic[
                                    index + 2
                                  ] == 'string' && (
                                    <TouchableOpacity
                                      onPress={() => {
                                        this.chooseTopic(
                                          'topic,',
                                          this.state.filtersAvailable.topic[
                                            index + 2
                                          ]
                                        ),
                                          this.forceUpdate();
                                      }}
                                      style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginLeft: 5 * factor,
                                        marginRight: 5 * factor,
                                        borderWidth: 1 * factor,
                                        borderColor: this.state.displayTopics.includes(
                                          this.state.filtersAvailable.topic[
                                            index + 2
                                          ]
                                        )
                                          ? colors.pianoteRed
                                          : colors.secondBackground,
                                        backgroundColor: this.state.displayTopics.includes(
                                          this.state.filtersAvailable.topic[
                                            index + 2
                                          ]
                                        )
                                          ? colors.pianoteRed
                                          : null,
                                        borderRadius: 100
                                      }}
                                    >
                                      <Text
                                        numberOfLines={1}
                                        style={{
                                          textAlign: 'center',
                                          color: this.state.displayTopics.includes(
                                            this.state.filtersAvailable.topic[
                                              index + 2
                                            ]
                                          )
                                            ? 'white'
                                            : colors.secondBackground,
                                          fontSize: 0.035 * width,
                                          marginLeft: 5 * factor,
                                          marginRight: 5 * factor,
                                          fontFamily: 'RobotoCondensed-Bold'
                                        }}
                                      >
                                        {
                                          this.state.filtersAvailable.topic[
                                            index + 2
                                          ]
                                        }
                                      </Text>
                                    </TouchableOpacity>
                                  )}
                                  {typeof this.state.filtersAvailable.topic[
                                    index + 2
                                  ] !== 'string' && (
                                    <View style={{ flex: 1 }} />
                                  )}
                                </View>
                              );
                            }
                          }
                        )}
                      </ScrollView>
                    </View>
                  </View>
                )}
                {this.state.filterType && (
                  <View>
                    <Text style={styles.filterHeader}>
                      CHOOSE A CONTENT TYPE
                    </Text>
                    <View
                      style={{
                        minHeight: 160 * factor,
                        width: '100%'
                      }}
                    >
                      <ScrollView
                        style={{
                          height: !this.state.filterType
                            ? 40 * factor + 90 * factor
                            : 350 * factor,
                          width: '100%'
                        }}
                      >
                        {this.state.filtersAvailable.content_type.map(
                          (data, index) => {
                            if (index % 3 == 0) {
                              return (
                                <View
                                  style={{
                                    height: 40 * factor,
                                    width: '100%',
                                    flexDirection: 'row',
                                    padding: 5
                                  }}
                                  horizontal={true}
                                >
                                  {typeof this.state.filtersAvailable
                                    .content_type[index] == 'string' && (
                                    <TouchableOpacity
                                      onPress={() => {
                                        this.chooseContentType(
                                          this.state.filtersAvailable
                                            .content_type[index]
                                        );
                                      }}
                                      style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginLeft: 5 * factor,
                                        marginRight: 5 * factor,
                                        borderWidth: 1 * factor,
                                        borderColor: this.state.displayTopics.includes(
                                          this.state.filtersAvailable
                                            .content_type[index]
                                        )
                                          ? colors.pianoteRed
                                          : colors.secondBackground,
                                        backgroundColor: this.state.displayTopics.includes(
                                          this.state.filtersAvailable
                                            .content_type[index]
                                        )
                                          ? colors.pianoteRed
                                          : null,
                                        borderRadius: 100
                                      }}
                                    >
                                      <Text
                                        numberOfLines={1}
                                        style={{
                                          textAlign: 'center',
                                          color: this.state.displayTopics.includes(
                                            this.state.filtersAvailable
                                              .content_type[index]
                                          )
                                            ? 'white'
                                            : colors.secondBackground,
                                          fontSize: 0.035 * width,
                                          marginLeft: 5 * factor,
                                          marginRight: 5 * factor,
                                          fontFamily: 'RobotoCondensed-Bold'
                                        }}
                                      >
                                        {this.convertUppercase(
                                          this.state.filtersAvailable
                                            .content_type[index]
                                        )}
                                      </Text>
                                    </TouchableOpacity>
                                  )}
                                  {typeof this.state.filtersAvailable
                                    .content_type[index] !== 'string' && (
                                    <View style={{ flex: 1 }} />
                                  )}
                                  {typeof this.state.filtersAvailable
                                    .content_type[index + 1] == 'string' && (
                                    <TouchableOpacity
                                      onPress={() => {
                                        this.chooseContentType(
                                          this.state.filtersAvailable
                                            .content_type[index + 1]
                                        ),
                                          this.forceUpdate();
                                      }}
                                      style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginLeft: 5 * factor,
                                        marginRight: 5 * factor,
                                        borderWidth: 1 * factor,
                                        borderColor: this.state.displayTopics.includes(
                                          this.state.filtersAvailable
                                            .content_type[index + 1]
                                        )
                                          ? colors.pianoteRed
                                          : colors.secondBackground,
                                        backgroundColor: this.state.displayTopics.includes(
                                          this.state.filtersAvailable
                                            .content_type[index + 1]
                                        )
                                          ? colors.pianoteRed
                                          : null,
                                        borderRadius: 100
                                      }}
                                    >
                                      <Text
                                        numberOfLines={1}
                                        style={{
                                          textAlign: 'center',
                                          color: this.state.displayTopics.includes(
                                            this.state.filtersAvailable
                                              .content_type[index + 1]
                                          )
                                            ? 'white'
                                            : colors.secondBackground,
                                          fontSize: 0.035 * width,
                                          marginLeft: 5 * factor,
                                          marginRight: 5 * factor,
                                          fontFamily: 'RobotoCondensed-Bold'
                                        }}
                                      >
                                        {this.convertUppercase(
                                          this.state.filtersAvailable
                                            .content_type[index + 1]
                                        )}
                                      </Text>
                                    </TouchableOpacity>
                                  )}
                                  {typeof this.state.filtersAvailable
                                    .content_type[index + 1] !== 'string' && (
                                    <View style={{ flex: 1 }} />
                                  )}
                                  {typeof this.state.filtersAvailable
                                    .content_type[index + 2] == 'string' && (
                                    <TouchableOpacity
                                      onPress={() => {
                                        this.chooseContentType(
                                          this.state.filtersAvailable
                                            .content_type[index + 2]
                                        ),
                                          this.forceUpdate();
                                      }}
                                      style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginLeft: 5 * factor,
                                        marginRight: 5 * factor,
                                        borderWidth: 1 * factor,
                                        borderColor: this.state.displayTopics.includes(
                                          this.state.filtersAvailable
                                            .content_type[index + 2]
                                        )
                                          ? colors.pianoteRed
                                          : colors.secondBackground,
                                        backgroundColor: this.state.displayTopics.includes(
                                          this.state.filtersAvailable
                                            .content_type[index + 2]
                                        )
                                          ? colors.pianoteRed
                                          : null,
                                        borderRadius: 100
                                      }}
                                    >
                                      <Text
                                        numberOfLines={1}
                                        style={{
                                          textAlign: 'center',
                                          color: this.state.displayTopics.includes(
                                            this.state.filtersAvailable
                                              .content_type[index + 2]
                                          )
                                            ? 'white'
                                            : colors.secondBackground,
                                          fontSize: 0.035 * width,
                                          marginLeft: 5 * factor,
                                          marginRight: 5 * factor,
                                          fontFamily: 'RobotoCondensed-Bold'
                                        }}
                                      >
                                        {this.convertUppercase(
                                          this.state.filtersAvailable
                                            .content_type[index + 2]
                                        )}
                                      </Text>
                                    </TouchableOpacity>
                                  )}
                                  {typeof this.state.filtersAvailable
                                    .content_type[index + 2] !== 'string' && (
                                    <View style={{ flex: 1 }} />
                                  )}
                                </View>
                              );
                            }
                          }
                        )}
                      </ScrollView>
                    </View>
                  </View>
                )}
              </View>
            )}
            {this.state.type == 'Songs' && (
              <View>
                <View>
                  <Text style={styles.filterHeader}>
                    WHAT DO YOU WANT TO WORK ON?
                  </Text>
                  <View
                    style={{
                      minHeight: 160 * factor,
                      width: '100%'
                    }}
                  >
                    <ScrollView
                      style={{
                        height: !this.state.filterType
                          ? 40 * factor + 90 * factor
                          : 350 * factor,
                        width: '100%'
                      }}
                    >
                      {this.state.filtersAvailable.style.map((data, index) => {
                        if (index % 3 == 0) {
                          return (
                            <View
                              style={{
                                height: 40 * factor,
                                width: '100%',
                                flexDirection: 'row',
                                padding: 5
                              }}
                              horizontal={true}
                            >
                              {typeof this.state.filtersAvailable.style[
                                index
                              ] == 'string' && (
                                <TouchableOpacity
                                  onPress={() => {
                                    this.chooseTopic(
                                      'style,',
                                      this.state.filtersAvailable.style[index]
                                    ),
                                      this.forceUpdate();
                                  }}
                                  style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginLeft: 5 * factor,
                                    marginRight: 5 * factor,
                                    borderWidth: 1 * factor,
                                    borderColor: this.state.displayTopics.includes(
                                      this.state.filtersAvailable.style[index]
                                    )
                                      ? colors.pianoteRed
                                      : colors.secondBackground,
                                    backgroundColor: this.state.displayTopics.includes(
                                      this.state.filtersAvailable.style[index]
                                    )
                                      ? colors.pianoteRed
                                      : null,
                                    borderRadius: 100
                                  }}
                                >
                                  <Text
                                    numberOfLines={1}
                                    style={{
                                      textAlign: 'center',
                                      color: this.state.displayTopics.includes(
                                        this.state.filtersAvailable.style[index]
                                      )
                                        ? 'white'
                                        : colors.secondBackground,
                                      fontSize: 0.035 * width,
                                      fontFamily: 'RobotoCondensed-Bold',
                                      marginLeft: 5 * factor,
                                      marginRight: 5 * factor
                                    }}
                                  >
                                    {this.state.filtersAvailable.style[index]}
                                  </Text>
                                </TouchableOpacity>
                              )}
                              {typeof this.state.filtersAvailable.style[
                                index
                              ] !== 'string' && <View style={{ flex: 1 }} />}
                              {typeof this.state.filtersAvailable.style[
                                index + 1
                              ] == 'string' && (
                                <TouchableOpacity
                                  onPress={() => {
                                    this.chooseTopic(
                                      'style,',
                                      this.state.filtersAvailable.style[
                                        index + 1
                                      ]
                                    ),
                                      this.forceUpdate();
                                  }}
                                  style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginLeft: 5 * factor,
                                    marginRight: 5 * factor,
                                    borderWidth: 1 * factor,
                                    borderColor: this.state.displayTopics.includes(
                                      this.state.filtersAvailable.style[
                                        index + 1
                                      ]
                                    )
                                      ? colors.pianoteRed
                                      : colors.secondBackground,
                                    backgroundColor: this.state.displayTopics.includes(
                                      this.state.filtersAvailable.style[
                                        index + 1
                                      ]
                                    )
                                      ? colors.pianoteRed
                                      : null,
                                    borderRadius: 100
                                  }}
                                >
                                  <Text
                                    numberOfLines={1}
                                    style={{
                                      textAlign: 'center',
                                      color: this.state.displayTopics.includes(
                                        this.state.filtersAvailable.style[
                                          index + 1
                                        ]
                                      )
                                        ? 'white'
                                        : colors.secondBackground,
                                      fontSize: 0.035 * width,
                                      marginLeft: 5 * factor,
                                      marginRight: 5 * factor,
                                      fontFamily: 'RobotoCondensed-Bold'
                                    }}
                                  >
                                    {
                                      this.state.filtersAvailable.style[
                                        index + 1
                                      ]
                                    }
                                  </Text>
                                </TouchableOpacity>
                              )}
                              {typeof this.state.filtersAvailable.style[
                                index + 1
                              ] !== 'string' && <View style={{ flex: 1 }} />}
                              {typeof this.state.filtersAvailable.style[
                                index + 2
                              ] == 'string' && (
                                <TouchableOpacity
                                  onPress={() => {
                                    this.chooseTopic(
                                      'style,',
                                      this.state.filtersAvailable.style[
                                        index + 2
                                      ]
                                    ),
                                      this.forceUpdate();
                                  }}
                                  style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginLeft: 5 * factor,
                                    marginRight: 5 * factor,
                                    borderWidth: 1 * factor,
                                    borderColor: this.state.displayTopics.includes(
                                      this.state.filtersAvailable.style[
                                        index + 2
                                      ]
                                    )
                                      ? colors.pianoteRed
                                      : colors.secondBackground,
                                    backgroundColor: this.state.displayTopics.includes(
                                      this.state.filtersAvailable.style[
                                        index + 2
                                      ]
                                    )
                                      ? colors.pianoteRed
                                      : null,
                                    borderRadius: 100
                                  }}
                                >
                                  <Text
                                    numberOfLines={1}
                                    style={{
                                      textAlign: 'center',
                                      color: this.state.displayTopics.includes(
                                        this.state.filtersAvailable.style[
                                          index + 2
                                        ]
                                      )
                                        ? 'white'
                                        : colors.secondBackground,
                                      fontSize: 0.035 * width,
                                      marginLeft: 5 * factor,
                                      marginRight: 5 * factor,
                                      fontFamily: 'RobotoCondensed-Bold'
                                    }}
                                  >
                                    {
                                      this.state.filtersAvailable.style[
                                        index + 2
                                      ]
                                    }
                                  </Text>
                                </TouchableOpacity>
                              )}
                              {typeof this.state.filtersAvailable.style[
                                index + 2
                              ] !== 'string' && <View style={{ flex: 1 }} />}
                            </View>
                          );
                        }
                      })}
                    </ScrollView>
                  </View>
                </View>
              </View>
            )}
            {this.state.type == 'Songs' && (
              <View key={'artists'}>
                <View key={'artists'}>
                  <Text style={styles.filterHeader}>CHOOSE YOUR ARTISTS</Text>
                  <View style={{ height: 5 * factor }} />
                  <View
                    style={{
                      minHeight: 160 * factor,
                      width: '100%'
                    }}
                  >
                    <ScrollView
                      style={{
                        height: !this.state.filterType
                          ? 40 * factor + 90 * factor
                          : 350 * factor,
                        width: '100%'
                      }}
                    >
                      {this.state.filtersAvailable.artist.map((data, index) => {
                        if (index % 3 == 0) {
                          return (
                            <View
                              style={{
                                height: 40 * factor,
                                width: '100%',
                                flexDirection: 'row',
                                padding: 5
                              }}
                              horizontal={true}
                            >
                              {typeof this.state.filtersAvailable.artist[
                                index
                              ] == 'string' && (
                                <TouchableOpacity
                                  onPress={() => {
                                    this.chooseTopic(
                                      'artist,',
                                      this.state.filtersAvailable.artist[index]
                                    ),
                                      this.forceUpdate();
                                  }}
                                  style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginLeft: 5 * factor,
                                    marginRight: 5 * factor,
                                    borderWidth: 1 * factor,
                                    borderColor: this.state.displayTopics.includes(
                                      this.state.filtersAvailable.artist[index]
                                    )
                                      ? colors.pianoteRed
                                      : colors.secondBackground,
                                    backgroundColor: this.state.displayTopics.includes(
                                      this.state.filtersAvailable.artist[index]
                                    )
                                      ? colors.pianoteRed
                                      : null,
                                    borderRadius: 100
                                  }}
                                >
                                  <Text
                                    numberOfLines={1}
                                    style={{
                                      textAlign: 'center',
                                      color: this.state.displayTopics.includes(
                                        this.state.filtersAvailable.artist[
                                          index
                                        ]
                                      )
                                        ? 'white'
                                        : colors.secondBackground,
                                      fontSize: 0.035 * width,
                                      fontFamily: 'RobotoCondensed-Bold',
                                      marginLeft: 5 * factor,
                                      marginRight: 5 * factor
                                    }}
                                  >
                                    {this.state.filtersAvailable.artist[index]}
                                  </Text>
                                </TouchableOpacity>
                              )}
                              {typeof this.state.filtersAvailable.artist[
                                index
                              ] !== 'string' && <View style={{ flex: 1 }} />}
                              {typeof this.state.filtersAvailable.artist[
                                index + 1
                              ] == 'string' && (
                                <TouchableOpacity
                                  onPress={() => {
                                    this.chooseTopic(
                                      'artist,',
                                      this.state.filtersAvailable.artist[
                                        index + 1
                                      ]
                                    ),
                                      this.forceUpdate();
                                  }}
                                  style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginLeft: 5 * factor,
                                    marginRight: 5 * factor,
                                    borderWidth: 1 * factor,
                                    borderColor: this.state.displayTopics.includes(
                                      this.state.filtersAvailable.artist[
                                        index + 1
                                      ]
                                    )
                                      ? colors.pianoteRed
                                      : colors.secondBackground,
                                    backgroundColor: this.state.displayTopics.includes(
                                      this.state.filtersAvailable.artist[
                                        index + 1
                                      ]
                                    )
                                      ? colors.pianoteRed
                                      : null,
                                    borderRadius: 100
                                  }}
                                >
                                  <Text
                                    numberOfLines={1}
                                    style={{
                                      textAlign: 'center',
                                      color: this.state.displayTopics.includes(
                                        this.state.filtersAvailable.artist[
                                          index + 1
                                        ]
                                      )
                                        ? 'white'
                                        : colors.secondBackground,
                                      fontSize: 0.035 * width,
                                      marginLeft: 5 * factor,
                                      marginRight: 5 * factor,
                                      fontFamily: 'RobotoCondensed-Bold'
                                    }}
                                  >
                                    {
                                      this.state.filtersAvailable.artist[
                                        index + 1
                                      ]
                                    }
                                  </Text>
                                </TouchableOpacity>
                              )}
                              {typeof this.state.filtersAvailable.artist[
                                index + 1
                              ] !== 'string' && <View style={{ flex: 1 }} />}
                              {typeof this.state.filtersAvailable.artist[
                                index + 2
                              ] == 'string' && (
                                <TouchableOpacity
                                  onPress={() => {
                                    this.chooseTopic(
                                      'artist,',
                                      this.state.filtersAvailable.artist[
                                        index + 2
                                      ]
                                    ),
                                      this.forceUpdate();
                                  }}
                                  style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginLeft: 5 * factor,
                                    marginRight: 5 * factor,
                                    borderWidth: 1 * factor,
                                    borderColor: this.state.displayTopics.includes(
                                      this.state.filtersAvailable.artist[
                                        index + 2
                                      ]
                                    )
                                      ? colors.pianoteRed
                                      : colors.secondBackground,
                                    backgroundColor: this.state.displayTopics.includes(
                                      this.state.filtersAvailable.artist[
                                        index + 2
                                      ]
                                    )
                                      ? colors.pianoteRed
                                      : null,
                                    borderRadius: 100
                                  }}
                                >
                                  <Text
                                    numberOfLines={1}
                                    style={{
                                      textAlign: 'center',
                                      color: this.state.displayTopics.includes(
                                        this.state.filtersAvailable.artist[
                                          index + 2
                                        ]
                                      )
                                        ? 'white'
                                        : colors.secondBackground,
                                      fontSize: 0.035 * width,
                                      marginLeft: 5 * factor,
                                      marginRight: 5 * factor,
                                      fontFamily: 'RobotoCondensed-Bold'
                                    }}
                                  >
                                    {
                                      this.state.filtersAvailable.artist[
                                        index + 2
                                      ]
                                    }
                                  </Text>
                                </TouchableOpacity>
                              )}
                              {typeof this.state.filtersAvailable.artist[
                                index + 2
                              ] !== 'string' && <View style={{ flex: 1 }} />}
                            </View>
                          );
                        }
                      })}
                    </ScrollView>
                  </View>
                </View>
              </View>
            )}
            {!this.state.filterType && (
              <TouchableOpacity
                key={'chooseProgress'}
                onPress={() => {
                  this.setState({
                    openProgress: !this.state.openProgress
                  });
                }}
                style={{
                  height: height * 0.1,
                  flexDirection: 'row',
                  borderTopColor: colors.secondBackground,
                  borderTopWidth: 0.5 * factor,
                  borderBottomColor: colors.secondBackground,
                  borderBottomWidth: !this.state.openProgress ? 0.25 : 0
                }}
              >
                <View style={styles.centerContent}>
                  <Text style={styles.filterHeader}>CHOOSE YOUR PROGRESS</Text>
                </View>
                <View style={{ flex: 1 }} />
                <View
                  style={[
                    styles.centerContent,
                    { paddingHorizontal: 10 * factor }
                  ]}
                >
                  <EntypoIcon
                    name={
                      this.state.openProgress
                        ? 'chevron-thin-up'
                        : 'chevron-thin-down'
                    }
                    size={25 * factor}
                    color={colors.secondBackground}
                  />
                </View>
              </TouchableOpacity>
            )}
            {this.state.openProgress && !this.state.filterType && (
              <View
                key={'progressLevels'}
                style={{
                  borderBottomColor: colors.secondBackground,
                  borderBottomWidth: 0.5 * factor
                }}
              >
                <View
                  style={{
                    height: 30 * factor,
                    justifyContent: 'space-around',
                    alignContent: 'space-around',
                    flexDirection: 'row'
                  }}
                >
                  <View style={{ flex: 1 }} />
                  <TouchableOpacity
                    onPress={() => {
                      this.chooseProgress('all');
                    }}
                    style={[
                      styles.centerContent,
                      {
                        height: 30 * factor,
                        width: '30%',
                        marginRight: width * 0.01,
                        marginLeft: width * 0.01,
                        borderWidth: 1 * factor,
                        borderColor: this.state.progress.includes('all')
                          ? colors.pianoteRed
                          : colors.secondBackground,
                        backgroundColor: this.state.progress.includes('all')
                          ? colors.pianoteRed
                          : null,
                        borderRadius: 200
                      }
                    ]}
                  >
                    <Text
                      style={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: 12 * factor,
                        fontFamily: 'OpenSans-Regular',
                        color: this.state.progress.includes('all')
                          ? 'white'
                          : colors.secondBackground
                      }}
                    >
                      ALL
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      this.chooseProgress('started');
                    }}
                    style={[
                      styles.centerContent,
                      {
                        height: 30 * factor,
                        width: '30%',
                        marginRight: width * 0.01,
                        marginLeft: width * 0.01,
                        borderWidth: 1 * factor,
                        borderColor: this.state.progress.includes('started')
                          ? colors.pianoteRed
                          : colors.secondBackground,
                        backgroundColor: this.state.progress.includes('started')
                          ? colors.pianoteRed
                          : null,
                        borderRadius: 200
                      }
                    ]}
                  >
                    <Text
                      numberOfLines={1}
                      style={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: 12 * factor,
                        fontFamily: 'OpenSans-Regular',
                        color: this.state.progress.includes('started')
                          ? 'white'
                          : colors.secondBackground
                      }}
                    >
                      IN PROGRESS
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      this.chooseProgress('completed');
                    }}
                    style={[
                      styles.centerContent,
                      {
                        height: 30 * factor,
                        width: '30%',
                        marginRight: width * 0.01,
                        marginLeft: width * 0.01,
                        borderWidth: 1 * factor,
                        borderColor: this.state.progress.includes('completed')
                          ? colors.pianoteRed
                          : colors.secondBackground,
                        backgroundColor: this.state.progress.includes(
                          'completed'
                        )
                          ? colors.pianoteRed
                          : null,
                        borderRadius: 200
                      }
                    ]}
                  >
                    <Text
                      numberOfLines={1}
                      style={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: 12 * factor,
                        fontFamily: 'OpenSans-Regular',
                        color: this.state.progress.includes('completed')
                          ? 'white'
                          : colors.secondBackground
                      }}
                    >
                      COMPLETED
                    </Text>
                  </TouchableOpacity>
                  <View style={{ flex: 1 }} />
                </View>
                <View style={{ height: 40 * factor }} />
              </View>
            )}
            {!this.state.filterType && this.state.type !== 'Songs' && (
              <TouchableOpacity
                key={'pianoInstructor'}
                onPress={() => {
                  this.setState({
                    openInstructors: !this.state.openInstructors
                  });
                }}
                style={{
                  height: height * 0.1,
                  flexDirection: 'row',
                  borderTopColor: colors.secondBackground,
                  borderBottomColor: colors.secondBackground,
                  borderBottomWidth: this.state.openInstructors
                    ? 0
                    : 0.5 * factor
                }}
              >
                <View style={styles.centerContent}>
                  <Text style={styles.filterHeader}>
                    CHOOSE YOUR INSTRUCTOR
                  </Text>
                </View>
                <View style={{ flex: 1 }} />
                <View
                  style={[
                    styles.centerContent,
                    { paddingHorizontal: 10 * factor }
                  ]}
                >
                  <EntypoIcon
                    name={
                      this.state.openInstructors
                        ? 'chevron-thin-up'
                        : 'chevron-thin-down'
                    }
                    size={25 * factor}
                    color={colors.secondBackground}
                  />
                </View>
              </TouchableOpacity>
            )}
            {this.state.openInstructors &&
              !this.state.filterTypeonlyType &&
              this.state.type !== 'Songs' && (
                <View
                  key={'instructors'}
                  style={{
                    borderBottomColor: colors.secondBackground,
                    borderBottomWidth: 0.5 * factor
                  }}
                >
                  <ScrollView>
                    {this.state.filtersAvailable.instructor.map(
                      (data, index) => {
                        if (index % 4 == 0) {
                          return (
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-around',
                                alignContent: 'space-around',
                                alignSelf: 'stretch',
                                marginBottom: 20 * factor
                              }}
                            >
                              {typeof this.state.filtersAvailable.instructor[
                                index
                              ]?.id == 'number' && (
                                <View
                                  key={'circle7'}
                                  style={{
                                    width: 70 * factor
                                  }}
                                >
                                  <TouchableOpacity
                                    onPress={() => {
                                      this.chooseInstructor(
                                        this.state.filtersAvailable.instructor[
                                          index
                                        ]
                                      );
                                    }}
                                    style={{
                                      borderWidth: this.state.instructors.includes(
                                        this.state.filtersAvailable.instructor[
                                          index
                                        ].id
                                      )
                                        ? 2 * factor
                                        : 0 * factor,
                                      borderColor: '#fb1b2f',
                                      height: 70 * factor,
                                      width: 70 * factor,
                                      borderRadius: 300,
                                      backgroundColor: 'white'
                                    }}
                                  >
                                    <FastImage
                                      style={{
                                        flex: 1,
                                        borderRadius: 100
                                      }}
                                      source={{
                                        uri:
                                          this.state.filtersAvailable.instructor[
                                            index
                                          ].data.find(
                                            f =>
                                              f.key === 'head_shot_picture_url'
                                          )?.value ||
                                          'https://www.drumeo.com/laravel/public/assets/images/default-avatars/default-male-profile-thumbnail.png'
                                      }}
                                      resizeMode={FastImage.resizeMode.cover}
                                    />
                                  </TouchableOpacity>
                                  <Text
                                    numberOfLines={1}
                                    style={{
                                      fontFamily: 'OpenSans-Regular',
                                      marginTop: 5 * factor,
                                      fontSize: 11 * factor,
                                      textAlign: 'center',
                                      fontWeight: 'bold',
                                      color: this.state.kenny
                                        ? 'white'
                                        : colors.secondBackground
                                    }}
                                  >
                                    {
                                      this.state.filtersAvailable.instructor[
                                        index
                                      ].fields.find(f => f.key === 'name').value
                                    }
                                  </Text>
                                </View>
                              )}
                              {typeof this.state.filtersAvailable.instructor[
                                index
                              ]?.id !== 'number' && (
                                <View style={{ width: 70 * factor }} />
                              )}

                              {typeof this.state.filtersAvailable.instructor[
                                index + 1
                              ]?.id == 'number' && (
                                <View
                                  key={'circle1'}
                                  style={{
                                    width: 70 * factor
                                  }}
                                >
                                  <TouchableOpacity
                                    onPress={() => {
                                      this.chooseInstructor(
                                        this.state.filtersAvailable.instructor[
                                          index + 1
                                        ]
                                      );
                                    }}
                                    style={{
                                      borderWidth: this.state.instructors.includes(
                                        this.state.filtersAvailable.instructor[
                                          index + 1
                                        ].id
                                      )
                                        ? 2 * factor
                                        : 0 * factor,
                                      borderColor: '#fb1b2f',
                                      height: 70 * factor,
                                      width: 70 * factor,
                                      borderRadius: 300,
                                      backgroundColor: 'white',
                                      zIndex: 10
                                    }}
                                  >
                                    <FastImage
                                      style={{
                                        flex: 1,
                                        borderRadius: 100
                                      }}
                                      source={{
                                        uri:
                                          this.state.filtersAvailable.instructor[
                                            index + 1
                                          ].data.find(
                                            f =>
                                              f.key === 'head_shot_picture_url'
                                          )?.value ||
                                          'https://www.drumeo.com/laravel/public/assets/images/default-avatars/default-male-profile-thumbnail.png'
                                      }}
                                      resizeMode={FastImage.resizeMode.cover}
                                    />
                                  </TouchableOpacity>
                                  <Text
                                    numberOfLines={1}
                                    style={{
                                      fontFamily: 'OpenSans-Regular',
                                      marginTop: 5 * factor,
                                      fontSize: 10 * factor,
                                      textAlign: 'center',
                                      fontWeight: 'bold',
                                      color: this.state.lisa
                                        ? 'white'
                                        : colors.secondBackground
                                    }}
                                  >
                                    {
                                      this.state.filtersAvailable.instructor[
                                        index + 1
                                      ].fields.find(f => f.key === 'name').value
                                    }
                                  </Text>
                                </View>
                              )}
                              {typeof this.state.filtersAvailable.instructor[
                                index + 1
                              ]?.id !== 'number' && (
                                <View style={{ width: 70 * factor }} />
                              )}

                              {typeof this.state.filtersAvailable.instructor[
                                index + 2
                              ]?.id == 'number' && (
                                <View
                                  key={'circle2'}
                                  style={{
                                    width: 70 * factor
                                  }}
                                >
                                  <TouchableOpacity
                                    onPress={() => {
                                      this.chooseInstructor(
                                        this.state.filtersAvailable.instructor[
                                          index + 2
                                        ]
                                      );
                                    }}
                                    style={{
                                      borderWidth: this.state.instructors.includes(
                                        this.state.filtersAvailable.instructor[
                                          index + 2
                                        ].id
                                      )
                                        ? 2 * factor
                                        : 0 * factor,
                                      borderColor: '#fb1b2f',
                                      height: 70 * factor,
                                      width: 70 * factor,
                                      borderRadius: 300,
                                      backgroundColor: 'white'
                                    }}
                                  >
                                    <FastImage
                                      style={{
                                        flex: 1,
                                        borderRadius: 100
                                      }}
                                      source={{
                                        uri:
                                          this.state.filtersAvailable.instructor[
                                            index + 2
                                          ].data.find(
                                            f =>
                                              f.key === 'head_shot_picture_url'
                                          )?.value ||
                                          'https://www.drumeo.com/laravel/public/assets/images/default-avatars/default-male-profile-thumbnail.png'
                                      }}
                                      resizeMode={FastImage.resizeMode.cover}
                                    />
                                  </TouchableOpacity>
                                  <Text
                                    numberOfLines={1}
                                    style={{
                                      fontFamily: 'OpenSans-Regular',
                                      marginTop: 5 * factor,
                                      fontSize: 10 * factor,
                                      textAlign: 'center',
                                      fontWeight: 'bold',
                                      color: this.state.cassi
                                        ? 'white'
                                        : colors.secondBackground
                                    }}
                                  >
                                    {
                                      this.state.filtersAvailable.instructor[
                                        index + 2
                                      ].fields.find(f => f.key === 'name').value
                                    }
                                  </Text>
                                </View>
                              )}
                              {typeof this.state.filtersAvailable.instructor[
                                index + 2
                              ]?.id !== 'number' && (
                                <View style={{ width: 70 * factor }} />
                              )}

                              {typeof this.state.filtersAvailable.instructor[
                                index + 3
                              ]?.id == 'number' && (
                                <View
                                  key={'circle3'}
                                  style={{
                                    width: 70 * factor
                                  }}
                                >
                                  <TouchableOpacity
                                    onPress={() => {
                                      this.chooseInstructor(
                                        this.state.filtersAvailable.instructor[
                                          index + 3
                                        ]
                                      );
                                    }}
                                    style={{
                                      borderWidth: this.state.instructors.includes(
                                        this.state.filtersAvailable.instructor[
                                          index + 3
                                        ].id
                                      )
                                        ? 2 * factor
                                        : 0 * factor,
                                      borderColor: '#fb1b2f',
                                      height: 70 * factor,
                                      width: 70 * factor,
                                      borderRadius: 300,
                                      backgroundColor: 'white'
                                    }}
                                  >
                                    <FastImage
                                      style={{
                                        flex: 1,
                                        borderRadius: 100
                                      }}
                                      source={{
                                        uri:
                                          this.state.filtersAvailable.instructor[
                                            index + 3
                                          ].data.find(
                                            f =>
                                              f.key === 'head_shot_picture_url'
                                          )?.value ||
                                          'https://www.drumeo.com/laravel/public/assets/images/default-avatars/default-male-profile-thumbnail.png'
                                      }}
                                      resizeMode={FastImage.resizeMode.cover}
                                    />
                                  </TouchableOpacity>
                                  <Text
                                    numberOfLines={1}
                                    style={{
                                      fontFamily: 'OpenSans-Regular',
                                      marginTop: 5 * factor,
                                      fontSize: 10 * factor,
                                      textAlign: 'center',
                                      fontWeight: 'bold',
                                      color: this.state.jordan
                                        ? 'white'
                                        : colors.secondBackground
                                    }}
                                  >
                                    {
                                      this.state.filtersAvailable.instructor[
                                        index + 3
                                      ].fields.find(f => f.key === 'name').value
                                    }
                                  </Text>
                                </View>
                              )}
                              {typeof this.state.filtersAvailable.instructor[
                                index + 3
                              ]?.id !== 'number' && (
                                <View style={{ width: 70 * factor }} />
                              )}
                            </View>
                          );
                        }
                      }
                    )}
                  </ScrollView>
                </View>
              )}
            <View style={{ height: 50 * factor }} />
          </ScrollView>
          <View
            key={'doneApply'}
            style={{
              posistion: 'absolute',
              bottom: 0,
              backgroundColor: 'orange',
              height: 75 * factor,
              backgroundColor: colors.mainBackground,
              zIndex: 3
            }}
          >
            <View
              style={[
                styles.centerContent,
                {
                  flex: 1,
                  flexDirection: 'row'
                }
              ]}
            >
              <View style={{ flex: 1 }} />
              <View
                style={[
                  { width: '50%', flexDirection: 'row' },
                  styles.centerContent
                ]}
              >
                <View style={{ flex: 1 }} />
                <View style={{ width: '90%' }}>
                  <View style={{ flex: 1 }} />
                  <TouchableOpacity
                    onPress={() => this.props.hideFilters()}
                    style={[
                      styles.centerContent,
                      {
                        height: onTablet
                          ? height * 0.07
                          : height * 0.05,
                        width: '100%',
                        backgroundColor: colors.pianoteRed,
                        borderRadius: 200
                      }
                    ]}
                  >
                    <Text
                      style={{
                        color: 'white',
                        fontFamily: 'RobotoCondensed-Bold',
                        fontSize: 14 * factor
                      }}
                    >
                      DONE & APPLY
                    </Text>
                  </TouchableOpacity>
                  <View style={{ flex: 1 }} />
                </View>
                <View style={{ flex: 1 }} />
              </View>
              <View
                style={[
                  { width: '50%', flexDirection: 'row' },
                  styles.centerContent
                ]}
              >
                <View style={{ flex: 1 }} />
                <View style={{ width: '90%' }}>
                  <TouchableOpacity
                    onPress={() => this.reset()}
                    style={[
                      styles.centerContent,
                      {
                        height: onTablet
                          ? height * 0.07
                          : height * 0.05,
                        width: '100%',
                        borderColor: 'white',
                        borderWidth: 1 * factor,
                        borderRadius: 200
                      }
                    ]}
                  >
                    <Text
                      style={{
                        color: 'white',
                        fontFamily: 'RobotoCondensed-Bold',
                        fontSize: 14 * factor
                      }}
                    >
                      RESET
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }} />
              </View>
              <View style={{ flex: 1 }} />
            </View>
            <View style={{ height: isNotch ? height * 0.035 : 0 }} />
          </View>
          <Modal
            isVisible={this.state.showLoading}
            style={{
              margin: 0,
              height: '100%',
              width: '100%'
            }}
            animation={'slideInUp'}
            animationInTiming={25}
            animationOutTiming={25}
            coverScreen={true}
            hasBackdrop={true}
          >
            <Loading />
          </Modal>
        </SafeAreaView>
      </View>
    );
  }
}

const localStyles = StyleSheet.create({
  header: {},
  text: {}
});
