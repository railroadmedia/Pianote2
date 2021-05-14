import React from 'react';
import {
  Animated,
  ActivityIndicator,
  Modal,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { SafeAreaView } from 'react-navigation';
import ExpandableView from './ExpandableView';
import { NetworkContext } from '../context/NetworkProvider';
import ArrowLeft from '../assets/img/svgs/arrowLeft';
import Filters from '../assets/img/svgs/filters';

let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
  instructorNames = [],
  isTablet = onTablet,
  progressTypes = ['ALL', 'IN PROGRESS', 'COMPLETED'],
  statusKeys = ['ALL', 'UPCOMING LIVE EVENTS', 'RECORDED EVENTS'],
  styleKeys = [],
  topicKeys = [],
  difficulties;

export default class Filters_V2 extends React.Component {
  static contextType = NetworkContext;
  appliedFilters = {};
  originalFilters = {};
  stylesRenders = 0;
  topicsRenders = 0;
  tallestTopic = 0;
  tallestStyle = 0;
  state = {
    loading: true,
    showModal: false,
    styleHeight: 0,
    topicHeight: 0
  };

  constructor(props) {
    super(props);
    this.deepLinking(props.deepLinking);
  }

  componentDidMount = () => this.props.reference?.(this);

  componentWillUnmount = () => (difficulties = undefined);

  deepLinking = url => {
    if (url) {
      url = decodeURIComponent(url);
      if (url.includes('required_user_states[]=completed')) {
        this.appliedFilters.progress = ['COMPLETED'];
        url = url.replace('required_user_states[]=completed', '');
      }
      if (url.includes('required_user_states[]=started')) {
        this.appliedFilters.progress = ['IN PROGRESS'];
        url = url.replace('required_user_states[]=started', '');
      }
      if (url.includes('statuses[]=scheduled')) {
        this.appliedFilters.progress = ['UPCOMING LIVE EVENTS'];
        url = url.replace('statuses[]=scheduled', '').replace('future', '');
      }
      if (url.includes('statuses[]=published')) {
        this.appliedFilters.progress = ['RECORDED EVENTS'];
        url = url.replace('statuses[]=published', '');
      }
      let reqFields = url
        .replace(/ & /g, 'tmpFilterContainingAnd')
        .replace(/&/g, '')
        .replace(/tmpFilterContainingAnd/g, ' & ')
        .split('required_fields[]=')
        .slice(1);
      reqFields.map(rf => {
        let deepFilters = rf.split(',');
        if (deepFilters[0] === 'topic')
          this.appliedFilters.topics = deepFilters.slice(1);
        if (deepFilters[0] === 'style')
          this.appliedFilters.styles = deepFilters.slice(1);
        if (deepFilters[0] === 'difficulty' && parseInt(deepFilters.slice(1)))
          this.appliedFilters.level = parseInt(deepFilters.slice(1));
        if (deepFilters[0] === 'instructor')
          this.appliedFilters.instructors = this.props.meta?.instructor
            ?.filter(i =>
              deepFilters.slice(1).some(si => parseInt(si) === i.id)
            )
            .map(i => ({
              id: i.id,
              name: i.fields?.find(f => f.key === 'name')?.value,
              headShotPic: i.data?.find(d => d.key === 'head_shot_picture_url')
                ?.value
            }));
      });
    }
  };

  initFilters = () => {
    topicKeys = [];
    styleKeys = [];
    instructorNames = [];
    if (this.state.showModal) {
      setTimeout(() => {
        let {
          meta: { topic, style, instructor, difficulty } = {}
        } = this.props;
        if (topic) topicKeys = this.props.meta.topic?.map(t => t.toUpperCase());
        if (style) styleKeys = this.props.meta.style?.map(s => s.toUpperCase());
        if (!difficulties) difficulties = difficulty;
        if (instructor)
          instructorNames = instructor.map(i => ({
            id: i.id,
            name: i.name,
            headShotPic: i.head_shot_picture_url
          }));
        this.setState({ loading: false });
      }, 0);
    } else this.props.onApply();
  };

  get filterQuery() {
    let filterQuery = '';
    if (this.appliedFilters.level)
      filterQuery += `&required_fields[]=difficulty,${this.appliedFilters.level}`;
    this.appliedFilters.topics?.map(
      t => (filterQuery += `&included_fields[]=topic,${encodeURIComponent(t)}`)
    );
    this.appliedFilters.styles?.map(
      s => (filterQuery += `&included_fields[]=style,${encodeURIComponent(s)}`)
    );
    if (this.appliedFilters.progress)
      filterQuery += `&required_user_states[]=${
        this.appliedFilters.progress[0] === 'ALL'
          ? ''
          : this.appliedFilters.progress[0] === 'IN PROGRESS'
          ? 'started'
          : this.appliedFilters.progress[0]
      }`;
    if (this.appliedFilters.status)
      filterQuery += `&statuses[]=${
        this.appliedFilters.status[0] === 'ALL'
          ? ''
          : this.appliedFilters.status[0] === 'RECORDED EVENTS'
          ? 'published'
          : 'scheduled&future'
      }`;
    this.appliedFilters.instructors?.map(
      i => (filterQuery += `&included_fields[]=instructor,${i.id}`)
    );
    return filterQuery;
  }

  get filterAppliedText() {
    let appliedFilters = Object.values(this.appliedFilters);
    return appliedFilters.length ? (
      <Text style={fStyles.textAppliedFilters}>
        <Text
          style={[
            fStyles.textAppliedFilters,
            {
              fontFamily: 'RobotoCondensed-Bold'
            }
          ]}
        >
          FILTERS APPLIED
        </Text>{' '}
        /{' '}
        {appliedFilters
          .map(af =>
            typeof af === 'object'
              ? af.map(nameOrDefault => nameOrDefault.name || nameOrDefault)
              : af
          )
          .map(af => (typeof af === 'object' ? af.join(', ') : af))
          .join(' / ')}
      </Text>
    ) : undefined;
  }

  connection = () => {
    if (!this.context.isConnected) this.context.showNoConnectionAlert();
    return this.context.isConnected;
  };

  toggleModal = force => {
    if (!this.connection()) return;
    this.setState(
      ({ showModal }) => ({
        loading: true,
        showModal: typeof force === 'boolean' ? force : !showModal
      }),
      () => {
        this.initFilters();
        if (this.state.showModal)
          this.originalFilters = JSON.parse(
            JSON.stringify(this.appliedFilters)
          );
      }
    );
  };

  toggleItem = (filterType, item) => {
    difficulties = undefined;
    if (!this.appliedFilters[filterType]) {
      this.appliedFilters[filterType] = [item];
      if (item === 'ALL') delete this.appliedFilters[filterType];
      this.apply();
      return;
    }
    let regex =
      filterType === 'instructors'
        ? new RegExp(
            this.appliedFilters[filterType].map(i => i.name).join('|'),
            'i'
          )
        : new RegExp(this.appliedFilters[filterType].join('|'), 'i');
    this.appliedFilters[filterType] = regex.test(item.name || item)
      ? this.appliedFilters[filterType].filter(
          f =>
            (f.name?.toLowerCase() || f.toLowerCase()) !=
            (item.name?.toLowerCase() || item.toLowerCase())
        )
      : this.appliedFilters[filterType].concat(item);
    if (!this.appliedFilters[filterType].length)
      delete this.appliedFilters[filterType];
    if (item === 'ALL') delete this.appliedFilters[filterType];
    this.apply();
  };

  apply = () => {
    if (!this.connection()) return;
    this.setState({ loading: true }, async () => {
      await this.props.onApply();
      this.initFilters();
    });
  };

  render() {
    let { disabled } = this.props;
    let { content_type } = this.props.meta || {};
    let {
      state: { showModal, topicHeight, styleHeight, loading }
    } = this;
    return (
      <>
        <View style={disabled ? { opacity: 0.3 } : { opacity: 1 }}>
          <TouchableOpacity
            disabled={disabled}
            onPress={this.toggleModal}
            style={fStyles.touchableToggler}
          >
            <Filters width={18} height={18} fill={'#fb1b2f'} />
          </TouchableOpacity>
        </View>
        <Modal
          visible={showModal}
          animationType={'fade'}
          onRequestClose={this.toggleModal}
          onBackButtonPress={() => this.setState({ showModal: false })}
        >
          <SafeAreaView style={fStyles.safeAreaTitleContainer}>
            <TouchableOpacity
              activeOpacity={1}
              style={fStyles.touchableTitleContainer}
              onPress={() => {
                topicKeys = [];
                styleKeys = [];
                instructorNames = [];
                let af = JSON.stringify(this.appliedFilters);
                let of = JSON.stringify(this.originalFilters);
                if (af !== of) {
                  this.appliedFilters = JSON.parse(of);
                  this.apply();
                }
                this.setState({ showModal: false });
              }}
            >
              <Text style={fStyles.textTitle}>Filter</Text>
              <ArrowLeft width={18} height={18} fill={'white'} />
            </TouchableOpacity>
          </SafeAreaView>
          {loading ? (
            <ActivityIndicator
              size='large'
              animating={true}
              color={'#fb1b2f'}
              style={fStyles.container}
            />
          ) : (
            <ScrollView style={fStyles.container}>
              <SkillSection
                onApply={this.apply}
                testID={'SkillSection'}
                appliedFilters={this.appliedFilters}
              />
              {!!topicKeys.length && (
                <View style={fStyles.filterSection}>
                  <Text style={fStyles.sectionTitleText}>
                    WHAT DO YOU WANT TO WORK ON?
                  </Text>
                  <View
                    style={{
                      marginTop: 10,
                      flexWrap: 'wrap',
                      flexDirection: 'row'
                    }}
                  >
                    {topicKeys.map((topic, i) => (
                      <View key={i} style={fStyles.touchableBorderedContainer}>
                        <TouchableFiller
                          item={topic}
                          filterType={'topics'}
                          toggleItem={this.toggleItem}
                          testID={`TouchableFiller${i}`}
                          appliedFilters={this.appliedFilters}
                          selected={
                            topic === 'ALL' &&
                            !this.appliedFilters.topics?.length
                              ? true
                              : undefined
                          }
                          touchableTextStyle={fStyles.touchableTextBordered}
                          touchableSelectedStyle={
                            topicHeight
                              ? {
                                  ...fStyles.touchableBorderedSelected,
                                  height: topicHeight
                                }
                              : fStyles.touchableBorderedSelected
                          }
                          touchableStyle={
                            topicHeight
                              ? {
                                  ...fStyles.touchableBordered,
                                  height: topicHeight
                                }
                              : fStyles.touchableBordered
                          }
                          touchableTextSelectedStyle={
                            fStyles.touchableTextBorderedSelected
                          }
                          onLayout={({
                            nativeEvent: {
                              layout: { height }
                            }
                          }) => {
                            this.topicsRenders++;
                            this.tallestTopic =
                              this.tallestTopic < height
                                ? height
                                : this.tallestTopic;
                            if (this.topicsRenders === topicKeys.length)
                              this.setState({ topicHeight: this.tallestTopic });
                          }}
                        />
                      </View>
                    ))}
                  </View>
                </View>
              )}
              {!!styleKeys.length && (
                <View style={fStyles.filterSection}>
                  <Text style={fStyles.sectionTitleText}>
                    WHAT STYLE YOU WANT TO PLAY?
                  </Text>
                  <View
                    style={{
                      marginTop: 10,
                      flexWrap: 'wrap',
                      flexDirection: 'row'
                    }}
                  >
                    {styleKeys.map((style, i) => (
                      <View key={i} style={fStyles.touchableBorderedContainer}>
                        <TouchableFiller
                          item={style}
                          filterType={'styles'}
                          toggleItem={this.toggleItem}
                          testID={`TouchableFiller${i}`}
                          appliedFilters={this.appliedFilters}
                          selected={
                            style === 'ALL' &&
                            !this.appliedFilters.styles?.length
                              ? true
                              : undefined
                          }
                          touchableTextStyle={fStyles.touchableTextBordered}
                          touchableSelectedStyle={
                            styleHeight
                              ? {
                                  ...fStyles.touchableBorderedSelected,
                                  height: styleHeight
                                }
                              : fStyles.touchableBorderedSelected
                          }
                          touchableStyle={
                            styleHeight
                              ? {
                                  ...fStyles.touchableBordered,
                                  height: styleHeight
                                }
                              : fStyles.touchableBordered
                          }
                          touchableTextSelectedStyle={
                            fStyles.touchableTextBorderedSelected
                          }
                          onLayout={({
                            nativeEvent: {
                              layout: { height }
                            }
                          }) => {
                            this.stylesRenders++;
                            this.tallestStyle =
                              this.tallestStyle < height
                                ? height
                                : this.tallestStyle;
                            if (this.stylesRenders === styleKeys.length)
                              this.setState({ styleHeight: this.tallestStyle });
                          }}
                        />
                      </View>
                    ))}
                  </View>
                </View>
              )}
              {content_type?.join() === 'coach-stream' && (
                <StatusSection appliedFilters={this.appliedFilters} />
              )}
              {!!instructorNames.length && (
                <InstructorsSection
                  toggleItem={this.toggleItem}
                  testID={'InstructorsSection'}
                  appliedFilters={this.appliedFilters}
                />
              )}
              <ProgressSection
                testID={'ProgressSection'}
                appliedFilters={this.appliedFilters}
              />
            </ScrollView>
          )}
          <SafeAreaView
            forceInset={{ bottom: 'always' }}
            style={fStyles.safeAreaBottomContainer}
          >
            <TouchableOpacity
              onPress={this.toggleModal}
              testID={'TouchableDoneApply'}
              style={fStyles.touchableDoneAndApply}
            >
              <Text style={fStyles.touchableTextDoneAndApply}>
                DONE & APPLY
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                difficulties = undefined;
                this.appliedFilters = {};
                this.apply();
              }}
              style={fStyles.touchableReset}
            >
              <Text style={fStyles.touchableTextReset}>RESET</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </Modal>
      </>
    );
  }
}

class SkillSection extends React.PureComponent {
  state = { level: 'ALL' };

  onPanResponderMove = (_, { moveX }) => {
    if (moveX > this.levelBarWidth || moveX < 0) return;
    let skillBarSection = this.levelBarWidth / 9;
    let level = Math.round(moveX / skillBarSection);
    if (!difficulties?.includes(`${level + 1}`)) return;
    Animated.timing(this.skillLevelDotTranslateX, {
      duration: 0,
      useNativeDriver: true,
      toValue: level * skillBarSection - (level ? 8 : 0)
    }).start();
    Animated.timing(this.skillLevelBarTranslateX, {
      duration: 0,
      useNativeDriver: true,
      toValue: level * skillBarSection - this.levelBarWidth
    }).start();
    this.props.appliedFilters.level = level + 1;
    this.setState({ level: level + 1 });
  };

  pResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onShouldBlockNativeResponder: () => true,
    onPanResponderRelease: () => {
      if (difficulties?.includes(`${this.state.level}`)) this.props.onApply();
    },
    onPanResponderTerminationRequest: () => false,
    onStartShouldSetPanResponderCapture: () => false,
    onPanResponderGrant: (_, { dx, dy }) =>
      Math.abs(dx) > 2 || Math.abs(dy) > 2,
    onPanResponderMove: this.onPanResponderMove
  }).panHandlers;

  levelBarWidth = 0;
  skillLevelDotTranslateX = new Animated.Value(0);
  skillLevelBarTranslateX = new Animated.Value(-10000);

  constructor(props) {
    super(props);

    if (props.appliedFilters.level) {
      if (props.appliedFilters.level < 1) props.appliedFilters.level = 1;
      if (props.appliedFilters.level > 10) props.appliedFilters.level = 10;
      this.state.level = props.appliedFilters.level;
    }
  }

  setDifficultyDescription = level => {
    switch (level) {
      case 'ALL':
        return 'This will display all piano lessons regardless of their difficulty.';
      case 1:
        return 'A level 1 pianist is just beginning and might not yet have any skills yet. A level 1 pianist will learn how to navigate the keyboard, play a C scale, chords and begin to build dexterity and control in their hands.';
      case 2:
        return 'A level 2 pianist can play a C scale hands together, a chord progression in the key of C and understands basic rhythm.';
      case 3:
        return 'A level 3 pianist can read basic notation and is gaining confidence in playing hands together and reading simple notation on the grand staff.';
      case 4:
        return 'A level 4 pianist understands how to build and play both major and minor scales and the 1-5-6-4 chord progression. At level 4 you are beginning to play with dynamics and are becoming comfortable in moving your hands outside of “C position” as you play.';
      case 5:
        return 'A level 5 pianist can play chord inversions and the G major scale as well as apply their knowledge of chord progressions to this new key. They can read notations that include accidentals and eighth notes.';
      case 6:
        return 'A level 6 a pianist can play in the keys of F major and D minor and is using chord inversions while playing chord progressions.';
      case 7:
        return 'A level 7 pianist can play with dynamics and the sustain pedal ,in 4/4 and ¾ time and is able to read and play most of the notation found within Pianote.';
      case 8:
        return 'At level 8 a pianist understands the circle of 5th and is able to use it to help them play scales and songs in any key signature.';
      case 9:
        return 'A level 9 pianist should be comfortable with the basics of improvisation and use a variety of left hand patterns and right hand fills as they create their own music. They also understand how to build and play 7th chords.';
      case 10:
        return 'A level 10 pianist understands the 12 bar blues, the blues scale, and the 2-5-1 Jazz progression. By level 10 you can learn to play any song in our library and improvise in pop, blues or jazz styles.';
    }
  };

  onAllLevel = () => {
    difficulties = undefined;
    this.setState(
      ({ level }) => ({
        level: level === 'ALL' ? 1 : 'ALL'
      }),
      () => {
        this.state.level === 'ALL'
          ? delete this.props.appliedFilters.level
          : (this.props.appliedFilters.level = 1);
        this.props.onApply();
      }
    );
    Animated.timing(this.skillLevelDotTranslateX, {
      duration: 0,
      useNativeDriver: true,
      toValue: 0
    }).start();
    Animated.timing(this.skillLevelBarTranslateX, {
      duration: 0,
      useNativeDriver: true,
      toValue: -this.levelBarWidth
    }).start();
  };

  render() {
    let { level } = this.state;
    return (
      <View style={fStyles.filterSection}>
        <Text style={fStyles.sectionTitleText}>SET YOUR SKILL LEVEL</Text>
        <Text style={fStyles.levelText}>LEVEL {level}</Text>
        <View {...this.pResponder} style={{ justifyContent: 'center' }}>
          <View
            style={fStyles.skillSectionsContainer}
            testID={'SkillSectionSliderContainer'}
            onLayout={({
              nativeEvent: {
                layout: { width }
              }
            }) => {
              this.levelBarWidth = width;
              if (this.props.appliedFilters.level) {
                this.skillLevelDotTranslateX.setValue(
                  (width / 9) * (this.props.appliedFilters.level - 1) - 8
                );
                this.skillLevelBarTranslateX.setValue(
                  -width + (width / 9) * (this.props.appliedFilters.level - 1)
                );
              } else this.skillLevelBarTranslateX.setValue(width);
            }}
          >
            {Array.from(new Array(9)).map((_, i) => (
              <View
                key={i}
                style={{
                  ...fStyles.skillSection,
                  borderTopLeftRadius: i === 0 ? 2.5 : 0,
                  borderTopRightRadius: i === 8 ? 2.5 : 0,
                  borderBottomLeftRadius: i === 0 ? 2.5 : 0,
                  borderBottomRightRadius: i === 8 ? 2.5 : 0,
                  opacity: difficulties?.includes(`${i + 1}`) ? 1 : 0.3
                }}
              />
            ))}
            <Animated.View
              style={{
                ...fStyles.skillSectionBar,
                transform: [{ translateX: this.skillLevelBarTranslateX }]
              }}
            />
          </View>
          <Animated.View
            style={{
              ...fStyles.skillSectionDot,
              transform: [{ translateX: this.skillLevelDotTranslateX }]
            }}
          />
        </View>
        <Text style={fStyles.levelDescriptionText}>
          {this.setDifficultyDescription(this.state.level)}
        </Text>
        <TouchableOpacity
          onPress={this.onAllLevel}
          style={
            level === 'ALL'
              ? {
                  ...fStyles.touchableAll,
                  backgroundColor: '#fb1b2f',
                  borderColor: 'transparent'
                }
              : fStyles.touchableAll
          }
        >
          <Text
            style={
              level === 'ALL'
                ? {
                    ...fStyles.touchableTextBordered,
                    color: 'white'
                  }
                : fStyles.touchableTextBordered
            }
          >
            ALL
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

class TouchableFiller extends React.Component {
  state = { selected: false };

  constructor(props) {
    super(props);
    if (props.appliedFilters[props.filterType])
      this.state.selected = props.appliedFilters[props.filterType].some(
        af =>
          (af.name?.toLowerCase() || af.toLowerCase()) ===
          (props.item.name?.toLowerCase() || props.item.toLowerCase())
      );
  }

  toggleItem = () =>
    this.setState(
      ({ selected }) => ({ selected: !selected }),
      () => this.props.toggleItem(this.props.filterType, this.props.item)
    );

  render() {
    let { item } = this.props;
    let { selected } = this.props;
    if (selected === undefined) ({ selected } = this.state);
    return (
      <TouchableOpacity
        onPress={this.toggleItem}
        onLayout={this.props.onLayout}
        style={
          selected
            ? this.props.touchableSelectedStyle
            : this.props.touchableStyle
        }
      >
        {this.props.children}
        <Text
          adjustsFontSizeToFit
          numberOfLines={2}
          style={
            selected
              ? this.props.touchableTextSelectedStyle
              : this.props.touchableTextStyle
          }
        >
          {item?.name || item}
        </Text>
      </TouchableOpacity>
    );
  }
}

class InstructorsSection extends React.Component {
  state = { instructorLetters: [] };

  toggleItem = (filterType, item) => {
    if (filterType === 'instructorLetters') {
      this.setState(({ instructorLetters }) => ({
        instructorLetters: instructorLetters.includes(item)
          ? instructorLetters.filter(il => il != item)
          : instructorLetters.concat(item)
      }));
    } else this.props.toggleItem(filterType, item);
  };

  render() {
    let { instructorLetters } = this.state;
    return (
      <View style={fStyles.filterSectionNoPadding}>
        <ExpandableView
          processType={'RAM'}
          titleStyle={fStyles.sectionTitleText}
          dropStyle={{ height: undefined }}
          title={'CHOOSE YOUR PIANO TEACHER'}
          iconColor={fStyles.sectionTitleText.color}
          expandableContStyle={{ paddingVertical: 25 }}
        >
          <Text style={fStyles.expandableDetails}>
            Instructors will only appear here if they have Drumeo lessons that
            fit your skill and topic filters.
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {alphabet.map((a, i) => (
              <View style={fStyles.touchableContainerInstructorLetter} key={i}>
                <TouchableFiller
                  item={a}
                  toggleItem={this.toggleItem}
                  filterType={'instructorLetters'}
                  testID={`TouchableFillerLetter${i}`}
                  appliedFilters={this.props.appliedFilters}
                  touchableStyle={fStyles.touchableInstructorLetter}
                  touchableTextStyle={fStyles.touchableTextInstructorLetter}
                  touchableSelectedStyle={
                    fStyles.touchableInstructorLetterSelected
                  }
                  touchableTextSelectedStyle={
                    fStyles.touchableTextInstructorLetterSelected
                  }
                />
              </View>
            ))}
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {instructorNames.map(({ id, name, headShotPic }) => (
              <View
                key={id}
                testID={`TouchableFillerInstructorNameContainer${id}`}
                style={
                  !instructorLetters.length ||
                  instructorLetters.some(il => il === name[0])
                    ? fStyles.touchableContainerInstructor
                    : { width: 0, height: 0 }
                }
              >
                <TouchableFiller
                  item={{ id, name }}
                  filterType={'instructors'}
                  toggleItem={this.toggleItem}
                  appliedFilters={this.props.appliedFilters}
                  touchableStyle={fStyles.touchableInstructor}
                  touchableTextStyle={fStyles.touchableTextInstructor}
                  touchableSelectedStyle={fStyles.touchableInstructorSelected}
                  touchableTextSelectedStyle={
                    fStyles.touchableTextInstructorSelected
                  }
                >
                  <FastImage
                    style={fStyles.touchableInstructorPic}
                    source={{
                      uri: `https://cdn.musora.com/image/fetch/fl_lossy,q_auto:eco,ar_1,c_fill,g_face/${headShotPic}`
                    }}
                  />
                </TouchableFiller>
              </View>
            ))}
          </View>
        </ExpandableView>
      </View>
    );
  }
}

class ProgressSection extends React.Component {
  state = { selected: 'ALL' };

  constructor(props) {
    super(props);

    if (props.appliedFilters.progress)
      this.state.selected = props.appliedFilters.progress[0];
  }

  toggleItem = (_, item) =>
    this.setState(
      ({ selected }) => ({
        selected: selected && selected === item ? 'ALL' : item
      }),
      () =>
        this.state.selected && this.state.selected != 'ALL'
          ? (this.props.appliedFilters.progress = [this.state.selected])
          : delete this.props.appliedFilters.progress
    );

  render() {
    return (
      <View style={fStyles.filterSectionNoPadding}>
        <ExpandableView
          processType={'RAM'}
          title={'CHOOSE YOUR PROGRESS'}
          dropStyle={{ height: undefined }}
          titleStyle={fStyles.sectionTitleText}
          iconColor={fStyles.sectionTitleText.color}
          expandableContStyle={{ paddingVertical: 25 }}
        >
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {progressTypes.map((p, i) => (
              <View key={i} style={fStyles.touchableBorderedContainerProgress}>
                <TouchableFiller
                  item={p}
                  filterType={'progress'}
                  toggleItem={this.toggleItem}
                  selected={p === this.state.selected}
                  testID={`TouchableFillerProgress${i}`}
                  touchableStyle={fStyles.touchableBordered}
                  appliedFilters={this.props.appliedFilters}
                  touchableTextStyle={fStyles.touchableTextBordered}
                  touchableSelectedStyle={fStyles.touchableBorderedSelected}
                  touchableTextSelectedStyle={
                    fStyles.touchableTextBorderedSelected
                  }
                />
              </View>
            ))}
          </View>
        </ExpandableView>
      </View>
    );
  }
}

class StatusSection extends React.Component {
  statusRenders = 0;

  tallestStatus = 0;

  state = { selected: 'ALL', statusHeight: 0 };

  constructor(props) {
    super(props);
    if (props.appliedFilters.status)
      this.state.selected = props.appliedFilters.status[0];
  }

  toggleItem = (_, item) =>
    this.setState(
      ({ selected }) => ({
        selected: selected && selected === item ? 'ALL' : item
      }),
      () =>
        this.state.selected && this.state.selected != 'ALL'
          ? (this.props.appliedFilters.status = [this.state.selected])
          : delete this.props.appliedFilters.status
    );

  render() {
    let { statusHeight } = this.state;
    return (
      <View style={fStyles.filterSection}>
        <Text style={fStyles.sectionTitleText}>CHOOSE YOUR EVENT STATUS</Text>
        <View
          style={{
            marginTop: 10,
            flexWrap: 'wrap',
            flexDirection: 'row'
          }}
        >
          {statusKeys.map((status, i) => (
            <View key={i} style={fStyles.touchableBorderedContainer}>
              <TouchableFiller
                item={status}
                filterType={'status'}
                toggleItem={this.toggleItem}
                testID={`TouchableFillerStatus${i}`}
                appliedFilters={this.props.appliedFilters}
                selected={status === this.state.selected}
                touchableTextStyle={fStyles.touchableTextBordered}
                touchableSelectedStyle={
                  statusHeight
                    ? {
                        ...fStyles.touchableBorderedSelected,
                        height: statusHeight
                      }
                    : fStyles.touchableBorderedSelected
                }
                touchableStyle={
                  statusHeight
                    ? {
                        ...fStyles.touchableBordered,
                        height: statusHeight
                      }
                    : fStyles.touchableBordered
                }
                touchableTextSelectedStyle={
                  fStyles.touchableTextBorderedSelected
                }
                onLayout={({
                  nativeEvent: {
                    layout: { height }
                  }
                }) => {
                  this.statusRenders++;
                  this.tallestStatus =
                    this.tallestStatus < height ? height : this.tallestStatus;
                  if (this.statusRenders === statusKeys.length)
                    this.setState({
                      statusHeight: this.tallestStatus
                    });
                }}
              />
            </View>
          ))}
        </View>
      </View>
    );
  }
}

const fStyles = StyleSheet.create({
  touchableToggler: {
    alignSelf: 'center',
    borderColor: '#fb1b2f',
    borderRadius: 15,
    borderWidth: 1,
    padding: 5
  },
  textAppliedFilters: {
    color: '#445f73',
    flex: 1,
    fontFamily: 'RobotoCondensed-Regular',
    paddingBottom: 5,
    textTransform: 'uppercase'
  },
  safeAreaTitleContainer: {
    backgroundColor: '#081826'
  },
  touchableTitleContainer: {
    justifyContent: 'center',
    padding: 15
  },
  textTitle: {
    color: 'white',
    fontFamily: 'OpenSans-Bold',
    fontSize: isTablet ? 20 : 18,
    left: 0,
    position: 'absolute',
    right: 0,
    textAlign: 'center',
    textTransform: 'capitalize'
  },
  container: {
    backgroundColor: '#00101d',
    flex: 1
  },
  filterSection: {
    borderBottomColor: '#081826',
    borderBottomWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 25
  },
  filterSectionNoPadding: {
    borderBottomColor: '#081826',
    borderBottomWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 0
  },
  sectionTitleText: {
    color: '#445f73',
    fontFamily: 'RobotoCondensed-Bold',
    fontSize: isTablet ? 22 : 20
  },
  skillSectionsContainer: {
    borderRadius: 2.5,
    flexDirection: 'row',
    marginVertical: 15,
    overflow: 'hidden'
  },
  skillSection: {
    backgroundColor: '#445f73',
    flex: 0.2,
    height: 5,
    marginHorizontal: 1
  },
  skillSectionBar: {
    backgroundColor: '#fb1b2f',
    borderRadius: 2.5,
    height: 5,
    position: 'absolute',
    width: '100%'
  },
  skillSectionDot: {
    backgroundColor: '#fb1b2f',
    borderRadius: 8,
    height: 16,
    position: 'absolute',
    width: 16
  },
  levelText: {
    color: 'white',
    fontFamily: 'OpenSans-Semibold',
    fontSize: isTablet ? 32 : 30,
    textAlign: 'center'
  },
  levelDescriptionText: {
    color: 'white',
    padding: 10,
    textAlign: 'center'
  },
  touchableAll: {
    alignSelf: 'center',
    borderColor: '#445f73',
    borderRadius: 50,
    borderWidth: 1,
    justifyContent: 'center',
    padding: 10,
    paddingHorizontal: 50
  },
  touchableBorderedContainer: {
    padding: 3,
    width: `${100 / (isTablet ? 5 : 3)}%`
  },
  touchableBorderedContainerProgress: {
    flex: 1,
    padding: 3
  },
  touchableBordered: {
    borderColor: '#445f73',
    borderRadius: 50,
    borderWidth: 1,
    justifyContent: 'center',
    padding: 10
  },
  touchableBorderedSelected: {
    backgroundColor: '#fb1b2f',
    borderColor: 'transparent',
    borderRadius: 50,
    borderWidth: 1,
    justifyContent: 'center',
    padding: 10
  },
  touchableTextBordered: {
    color: '#445f73',
    fontFamily: 'OpenSans-Semibold',
    fontSize: isTablet ? 12 : 10,
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  touchableTextBorderedSelected: {
    color: 'white',
    fontFamily: 'OpenSans-Semibold',
    fontSize: isTablet ? 12 : 10,
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  expandableDetails: {
    color: '#445f73',
    fontFamily: 'OpenSans',
    fontSize: isTablet ? 14 : 12,
    paddingVertical: 10
  },
  touchableContainerInstructorLetter: {
    padding: 3,
    width: `${Math.round(10000 / (isTablet ? 13 : 9)) / 100}%`
  },
  touchableInstructorLetter: {
    aspectRatio: 1,
    borderColor: '#445f73',
    borderRadius: 100,
    borderWidth: 1,
    justifyContent: 'center'
  },
  touchableInstructorLetterSelected: {
    aspectRatio: 1,
    backgroundColor: '#fb1b2f',
    borderColor: '#fb1b2f',
    borderRadius: 100,
    borderWidth: 1,
    justifyContent: 'center'
  },
  touchableTextInstructorLetter: {
    color: '#445f73',
    textAlign: 'center',
    fontFamily: 'OpenSans-Semibold'
  },
  touchableTextInstructorLetterSelected: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'OpenSans-Semibold'
  },
  touchableContainerInstructor: {
    padding: 5,
    width: `${100 / (isTablet ? 8 : 4)}%`
  },
  touchableInstructorPic: {
    aspectRatio: 1,
    borderRadius: 100,
    width: '50%'
  },
  touchableInstructor: { alignItems: 'center' },
  touchableInstructorSelected: {
    alignItems: 'center',
    backgroundColor: '#fb1b2f'
  },
  touchableTextInstructor: {
    color: '#445f73',
    textAlign: 'center',
    fontFamily: 'OpenSans-Semibold'
  },
  touchableTextInstructorSelected: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'OpenSans-Semibold'
  },
  safeAreaBottomContainer: {
    backgroundColor: '#00101d',
    flexDirection: 'row'
  },
  touchableDoneAndApply: {
    backgroundColor: '#fb1b2f',
    borderRadius: 50,
    flex: 1,
    margin: 20,
    marginVertical: 10,
    paddingVertical: 15,
    justifyContent: 'center'
  },
  touchableTextDoneAndApply: {
    color: 'white',
    fontFamily: 'RobotoCondensed-Bold',
    textAlign: 'center',
    fontSize: isTablet ? 15 : 12.5,
    fontFamily: 'RobotoCondensed-Bold'
  },
  touchableReset: {
    borderColor: 'white',
    borderRadius: 50,
    borderWidth: 2,
    flex: 1,
    justifyContent: 'center',
    margin: 20,
    marginVertical: 10,
    marginLeft: 0,
    padding: 0,
    paddingVertical: 15
  },
  touchableTextReset: {
    color: 'white',
    fontFamily: 'RobotoCondensed-Bold',
    textAlign: 'center',
    fontSize: isTablet ? 15 : 12.5,
    fontFamily: 'RobotoCondensed-Bold'
  }
});
