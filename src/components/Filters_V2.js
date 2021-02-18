import React from 'react';
import {
  Animated,
  ActivityIndicator,
  Modal,
  PanResponder,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import DeviceInfo from 'react-native-device-info';
import FastImage from 'react-native-fast-image';

import ExpandableView from './ExpandableView';

import { NetworkContext } from '../context/NetworkProvider';

import ArrowLeft from '../assets/img/svgs/arrowLeft';
import Filters from '../assets/img/svgs/filters';

let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
  instructorNames = [],
  isTablet = DeviceInfo.isTablet(),
  progressTypes = ['ALL', 'IN PROGRESS', 'COMPLETED'],
  statusKeys = ['ALL', 'UPCOMING LIVE EVENTS', 'RECORDED EVENTS'],
  styleKeys = [],
  styles,
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
    styles = createStyles({ colors });
    this.deepLinking(props.deepLinking);
  }

  componentDidMount() {
    this.props.reference?.(this);
  }

  componentWillUnmount() {
    difficulties = undefined;
  }

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
            name: i.fields?.find(f => f.key === 'name')?.value,
            headShotPic: i.data?.find(d => d.key === 'head_shot_picture_url')
              ?.value
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
      t => (filterQuery += `&included_fields[]=topic,${t}`)
    );
    this.appliedFilters.styles?.map(
      s => (filterQuery += `&included_fields[]=style,${s}`)
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
      <Text style={styles.textAppliedFilters}>
        <Text
          style={[
            styles.textAppliedFilters,
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
    if (!this.appliedFilters[filterType]) {
      this.appliedFilters[filterType] = [item];
      difficulties = undefined;
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
            style={styles.touchableToggler}
          >
            <Filters width={18} height={18} fill={colors.pianoteRed} />
          </TouchableOpacity>
        </View>
        <Modal
          visible={showModal}
          animationType={'fade'}
          onRequestClose={this.toggleModal}
        >
          <SafeAreaView style={styles.safeAreaTitleContainer}>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.touchableTitleContainer}
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
              <Text style={styles.textTitle}>Filter</Text>
              <ArrowLeft width={18} height={18} fill={'white'} />
            </TouchableOpacity>
          </SafeAreaView>
          {loading ? (
            <ActivityIndicator
              size='large'
              animating={true}
              color={colors.pianoteRed}
              style={styles.container}
            />
          ) : (
            <ScrollView style={styles.container}>
              <SkillSection
                onApply={this.apply}
                testID={'SkillSection'}
                appliedFilters={this.appliedFilters}
              />
              {!!topicKeys.length && (
                <View style={styles.filterSection}>
                  <Text style={styles.sectionTitleText}>
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
                      <View key={i} style={styles.touchableBorderedContainer}>
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
                          touchableTextStyle={styles.touchableTextBordered}
                          touchableSelectedStyle={
                            topicHeight
                              ? {
                                  ...styles.touchableBorderedSelected,
                                  height: topicHeight
                                }
                              : styles.touchableBorderedSelected
                          }
                          touchableStyle={
                            topicHeight
                              ? {
                                  ...styles.touchableBordered,
                                  height: topicHeight
                                }
                              : styles.touchableBordered
                          }
                          touchableTextSelectedStyle={
                            styles.touchableTextBorderedSelected
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
                <View style={styles.filterSection}>
                  <Text style={styles.sectionTitleText}>
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
                      <View key={i} style={styles.touchableBorderedContainer}>
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
                          touchableTextStyle={styles.touchableTextBordered}
                          touchableSelectedStyle={
                            styleHeight
                              ? {
                                  ...styles.touchableBorderedSelected,
                                  height: styleHeight
                                }
                              : styles.touchableBorderedSelected
                          }
                          touchableStyle={
                            styleHeight
                              ? {
                                  ...styles.touchableBordered,
                                  height: styleHeight
                                }
                              : styles.touchableBordered
                          }
                          touchableTextSelectedStyle={
                            styles.touchableTextBorderedSelected
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
          <SafeAreaView style={styles.safeAreaBottomContainer}>
            <TouchableOpacity
              onPress={this.toggleModal}
              testID={'TouchableDoneApply'}
              style={styles.touchableDoneAndApply}
            >
              <Text style={styles.touchableTextDoneAndApply}>DONE & APPLY</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                difficulties = undefined;
                this.appliedFilters = {};
                this.apply();
              }}
              style={styles.touchableReset}
            >
              <Text style={styles.touchableTextReset}>RESET</Text>
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
        return '';
      case 1:
        return 'A Level 1 drummer should be able to hold the drumsticks and play a basic drum beat in time with music.';
      case 2:
        return 'A Level 2 drummer should be able to read basic note values, understand the drum notation key, play basic rock, punk, and metal beats, and play basic rudiments like the single stroke roll, double stroke roll, and single paradiddle.';
      case 3:
        return 'A Level 3 drummer should understand the motions of drumming, be able to play triplets, flams, and drags, create a basic roadmap for a song, and play styles like country and disco.';
      case 4:
        return 'A Level 4 drummer should be able to use Moeller technique at a basic level, understand dotted notation, play in 3/4, 6/8, and 12/8, play basic jazz and blues patterns, and demonstrate 4-limb independence.';
      case 5:
        return 'A Level 5 drummer should be able to apply basic groupings to the drum-set, play styles like funk, jazz, soul, reggae, and bossa nova, understand ties, dynamic markings, and other basic elements of chart reading, and be able to demonstrate basic 4-limb independence in a jazz and rock setting.';
      case 6:
        return 'A Level 6 drummer should understand odd time signatures like 5/4, 5/8, 7/4, and 7/8, be able to apply odd note groupings to the drum-set, play styles like hip-hop, R&B, cha-cha-cha, soca, and second line, and understand the basics of comping and trading solos.';
      case 7:
        return 'A Level 7 drummer should be able to demonstrate 4-limb independence in styles like jazz, rock, and metal at an intermediate level, demonstrate hand-to-foot combinations, understand and demonstrate bass drum techniques like double bass playing, heel-toe, and slide technique.';
      case 8:
        return 'A Level 8 drummer should be able to navigate charts and lead sheets, play brushes at a basic level, play styles like samba and mozambique, and understand independence concepts like interpreting rhythms and interpreting stickings.';
      case 9:
        return 'A Level 9 drummer should be able to play all 40 drum rudiments, play Afro-Cuban styles like mambo, nanigo, and songo, solo over a musical vamp, and demonstrate 4-limb independence in Afro-Cuban, Afro-Brazilian, and swing styles.';
      case 10:
        return 'A Level 10 drummer should understand advanced rhythmic concepts including polyrhythms, polymeters, metric modulation, and odd note subdivisions, play advanced Afro-Cuban and jazz styles, play drum solos in a variety of different settings and styles, and demonstrate 4-limb independence at an advanced level.';
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
      <View style={styles.filterSection}>
        <Text style={styles.sectionTitleText}>SET YOUR SKILL LEVEL</Text>
        <Text style={styles.levelText}>LEVEL {level}</Text>
        <View {...this.pResponder} style={{ justifyContent: 'center' }}>
          <View
            style={styles.skillSectionsContainer}
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
                  ...styles.skillSection,
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
                ...styles.skillSectionBar,
                transform: [{ translateX: this.skillLevelBarTranslateX }]
              }}
            />
          </View>
          <Animated.View
            style={{
              ...styles.skillSectionDot,
              transform: [{ translateX: this.skillLevelDotTranslateX }]
            }}
          />
        </View>
        <Text style={styles.levelDescriptionText}>
          {this.setDifficultyDescription(this.state.level)}
        </Text>
        <TouchableOpacity
          onPress={this.onAllLevel}
          style={
            level === 'ALL'
              ? {
                  ...styles.touchableAll,
                  backgroundColor: colors.pianoteRed,
                  borderColor: 'transparent'
                }
              : styles.touchableAll
          }
        >
          <Text
            style={
              level === 'ALL'
                ? {
                    ...styles.touchableTextBordered,
                    color: 'white'
                  }
                : styles.touchableTextBordered
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
      <View style={styles.filterSectionNoPadding}>
        <ExpandableView
          processType={'RAM'}
          titleStyle={styles.sectionTitleText}
          dropStyle={{ height: undefined }}
          title={'CHOOSE YOUR PIANO TEACHER'}
          iconColor={styles.sectionTitleText.color}
          expandableContStyle={{ paddingVertical: 25 }}
        >
          <Text style={styles.expandableDetails}>
            Instructors will only appear here if they have Drumeo lessons that
            fit your skill and topic filters.
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {alphabet.map((a, i) => (
              <View style={styles.touchableContainerInstructorLetter} key={i}>
                <TouchableFiller
                  item={a}
                  toggleItem={this.toggleItem}
                  filterType={'instructorLetters'}
                  testID={`TouchableFillerLetter${i}`}
                  appliedFilters={this.props.appliedFilters}
                  touchableStyle={styles.touchableInstructorLetter}
                  touchableTextStyle={styles.touchableTextInstructorLetter}
                  touchableSelectedStyle={
                    styles.touchableInstructorLetterSelected
                  }
                  touchableTextSelectedStyle={
                    styles.touchableTextInstructorLetterSelected
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
                    ? styles.touchableContainerInstructor
                    : { width: 0, height: 0 }
                }
              >
                <TouchableFiller
                  item={{ id, name }}
                  filterType={'instructors'}
                  toggleItem={this.toggleItem}
                  appliedFilters={this.props.appliedFilters}
                  touchableStyle={styles.touchableInstructor}
                  touchableTextStyle={styles.touchableTextInstructor}
                  touchableSelectedStyle={styles.touchableInstructorSelected}
                  touchableTextSelectedStyle={
                    styles.touchableTextInstructorSelected
                  }
                >
                  <FastImage
                    style={styles.touchableInstructorPic}
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
      <View style={styles.filterSectionNoPadding}>
        <ExpandableView
          processType={'RAM'}
          title={'CHOOSE YOUR PROGRESS'}
          dropStyle={{ height: undefined }}
          titleStyle={styles.sectionTitleText}
          iconColor={styles.sectionTitleText.color}
          expandableContStyle={{ paddingVertical: 25 }}
        >
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {progressTypes.map((p, i) => (
              <View key={i} style={styles.touchableBorderedContainerProgress}>
                <TouchableFiller
                  item={p}
                  filterType={'progress'}
                  toggleItem={this.toggleItem}
                  selected={p === this.state.selected}
                  testID={`TouchableFillerProgress${i}`}
                  touchableStyle={styles.touchableBordered}
                  appliedFilters={this.props.appliedFilters}
                  touchableTextStyle={styles.touchableTextBordered}
                  touchableSelectedStyle={styles.touchableBorderedSelected}
                  touchableTextSelectedStyle={
                    styles.touchableTextBorderedSelected
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
      <View style={styles.filterSection}>
        <Text style={styles.sectionTitleText}>CHOOSE YOUR EVENT STATUS</Text>
        <View
          style={{
            marginTop: 10,
            flexWrap: 'wrap',
            flexDirection: 'row'
          }}
        >
          {statusKeys.map((status, i) => (
            <View key={i} style={styles.touchableBorderedContainer}>
              <TouchableFiller
                item={status}
                filterType={'status'}
                toggleItem={this.toggleItem}
                testID={`TouchableFillerStatus${i}`}
                appliedFilters={this.props.appliedFilters}
                selected={status === this.state.selected}
                touchableTextStyle={styles.touchableTextBordered}
                touchableSelectedStyle={
                  statusHeight
                    ? {
                        ...styles.touchableBorderedSelected,
                        height: statusHeight
                      }
                    : styles.touchableBorderedSelected
                }
                touchableStyle={
                  statusHeight
                    ? {
                        ...styles.touchableBordered,
                        height: statusHeight
                      }
                    : styles.touchableBordered
                }
                touchableTextSelectedStyle={
                  styles.touchableTextBorderedSelected
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

const createStyles = ({ colors }) =>
  StyleSheet.create({
    touchableToggler: {
      alignSelf: 'center',
      borderColor: colors.pianoteRed,
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
      backgroundColor: colors.thirdBackground
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
      backgroundColor: colors.mainBackground,
      flex: 1
    },
    filterSection: {
      borderBottomColor: colors.thirdBackground,
      borderBottomWidth: 1,
      paddingHorizontal: 15,
      paddingVertical: 25
    },
    filterSectionNoPadding: {
      borderBottomColor: colors.thirdBackground,
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
      backgroundColor: colors.secondBackground,
      flex: 0.2,
      height: 5,
      marginHorizontal: 1
    },
    skillSectionBar: {
      backgroundColor: colors.pianoteRed,
      borderRadius: 2.5,
      height: 5,
      position: 'absolute',
      width: '100%'
    },
    skillSectionDot: {
      backgroundColor: colors.pianoteRed,
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
      width: `${100 / (isTablet ? 6 : 3)}%`
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
      backgroundColor: colors.pianoteRed,
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
      backgroundColor: colors.pianoteRed,
      borderColor: colors.pianoteRed,
      borderRadius: 100,
      borderWidth: 1,
      justifyContent: 'center'
    },
    touchableTextInstructorLetter: {
      color: '#445f73',
      textAlign: 'center'
    },
    touchableTextInstructorLetterSelected: {
      color: 'white',
      textAlign: 'center'
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
      backgroundColor: colors.pianoteRed,
      flex: 1
    },
    touchableTextInstructor: {
      color: '#445f73',
      textAlign: 'center'
    },
    touchableTextInstructorSelected: {
      color: 'white',
      textAlign: 'center'
    },
    safeAreaBottomContainer: {
      backgroundColor: colors.mainBackground,
      flexDirection: 'row'
    },
    touchableDoneAndApply: {
      backgroundColor: colors.pianoteRed,
      borderRadius: 50,
      flex: 1,
      margin: 20,
      paddingVertical: 15
    },
    touchableTextDoneAndApply: {
      color: 'white',
      fontFamily: 'RobotoCondensed-Bold',
      textAlign: 'center'
    },
    touchableReset: {
      borderColor: 'white',
      borderRadius: 50,
      borderWidth: 2,
      flex: 1,
      justifyContent: 'center',
      margin: 20,
      marginLeft: 0,
      padding: 0,
      paddingVertical: 15
    },
    touchableTextReset: {
      color: 'white',
      fontFamily: 'RobotoCondensed-Bold',
      textAlign: 'center'
    }
  });
