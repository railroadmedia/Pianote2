/**
 * Filters
 */
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { ContentModel } from '@musora/models';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { getAllContent } from 'Pianote2/src/services/GetContent';

/*
 * const instructorDict = {
    'Colin Swatzsky': ['COLIN', 197106],
    'Dave Attkinson': [266932],
    'DR Sean Kiligaon': [247373],
    'Gabriel Patelchi': [218895],
*/

var filterDict = {
  LESSONS: [
    ['Chord', false, 'topic,Chord'],
    ['Chording', false, 'topic,Chording'],
    ['Chirstmas', false, 'topic,Christmas'],
    ['Classical', false, 'topic,Classical'],
    ['Composing', false, 'topic,Composing'],
    ['Edutainment', false, 'topic,Edutainment'],
    ['Fills', false, 'topic,Fills'],
    ['Fills and Riffs', false, 'topic,Fills+and+Riffs'],
    ['Gospel', false, 'topic,Gospel'],
    ['Guest Artist', false, 'topic,Guest+Artist'],
    ['Hand Independence', false, 'topic,Hand+Independence'],
    ['Improvisation', false, 'topic,Improvisation'],
    ['Jazz', false, 'topic,Jazz'],
    ['Jazz & Blues', false, 'topic,Jazz+%26+Blues'],
    ['Musicality', false, 'topic,Musicality'],
    ['Pop', false, 'topic,Pop'],
    ['Practice Mindset', false, 'topic,Practice+Mindset'],
    ['Quick Tips', false, 'topic,Quick+Tips'],
    ['Riffs', false, 'topic,Riffs'],
    ['Sight Reading', false, 'topic,Sight+Reading'],
    ['Technique', false, 'topic,Technique'],
    ['Theory', false, 'topic,Theory'],
    ['Tricks', false, 'topic,Tricks'],
    ['edutainment', false, 'topic,edutainment']
  ],
  COURSES: [
    ['Boogie Woogie', false, 'topic,Boogie+Woogie'],
    ['Gospel', false, 'topic,Gospel'],
    ['Improvisation', false, 'topic,Improvisation'],
    ['Jazz', false, 'topic,Jazz'],
    ['Latin Jazz', false, 'topic,Latin+Jazz'],
    ['Rhythm', false, 'topic,Rhythm'],
    ['Songwriting', false, 'topic,Songwriting'],
    ['Technique', false, 'topic,Technique']
  ],
  SONGS: [
    ['Adult Contemporary', false, 'style,Adult+Contemporary'],
    ['Ballad', false, 'style,Ballad'],
    ['Blues', false, 'style,Blues'],
    ['Christmas', false, 'style,Christmas'],
    ['Classic', false, 'style,Classic'],
    ['Classic Rock', false, 'style,Classic+Rock'],
    ['Classical', false, 'style,Classical'],
    ['Country', false, 'style,Country'],
    ['Folk', false, 'style,Folk'],
    ['Funk', false, 'style,Funk'],
    ['Gospel', false, 'style,Gospel'],
    ['Hymn', false, 'style,Hymn'],
    ['Indie', false, 'style,Indie'],
    ['Musical', false, 'style,Musical'],
    ['New Age', false, 'style,New+Age'],
    ['Pop', false, 'style,Pop'],
    ['R&B', false, 'style,R%26B'],
    ['Rock', false, 'style,Rock'],
    ['Soft Rock', false, 'style,Soft+Rock'],
    ['Soundtrack', false, 'style,Soundtrack'],
    ['Traditional', false, 'style,Traditional'],
    ['classical', false, 'style,classical'],
    ['edm', false, 'style,edm'],
    ['musical', false, 'style,musical'],
    ['pop', false, 'style,pop']
  ],
  ARTISTS: [
    ['Adele', false, 'artist,Adele'],
    ['Adolphe Adam', false, 'artist,Adolphe+Adam+%26+Placide+Cappeau'],
    ['Aerosmith', false, 'artist,Aerosmith'],
    ['Alan Walker', false, 'artist,Alan+Walker'],
    ['Alicia Keys', false, 'artist,Alicia+Keys'],
    ['Annie Lennox', false, 'artist,Annie+Lennox,+Procol+Harum'],
    ['Bach', false, 'artist,Bach'],
    ['Beethoven', false, 'artist,Beethoven'],
    ['Ben E. King', false, 'artist,Ben+E.+King'],
    ['Bette Middler', false, 'artist,Bette+Middler'],
    ['Bill Withers', false, 'artist,Bill+Withers'],
    ['Billie Eilish', false, 'artist,Billie+Eilish'],
    ['Billy Joel', false, 'artist,Billy+Joel'],
    ['Bob Dylan', false, 'artist,Bob+Dylan'],
    ['Calum Scott', false, 'artist,Calum+Scott'],
    ['Carl Boberg', false, 'artist,Carl+Boberg'],
    ['Christina Perri', false, 'artist,Christina+Perri'],
    ['Colbie Caillat', false, 'artist,Colbie+Caillat'],
    ['Coldplay', false, 'artist,Coldplay'],
    ['Cyndi Lauper', false, 'artist,Cyndi+Lauper'],
    ['Ed Sheeran', false, 'artist,Ed+Sheeran'],
    ['Edith Piaf', false, 'artist,Edith+Piaf'],
    ['Elton John', false, 'artist,Elton+John'],
    ['Elvis Presley', false, 'artist,Elvis+Presley'],
    ['Evanescence', false, 'artist,Evanescence'],
    ['Feist', false, 'artist,Feist'],
    ['Frank Sinatra', false, 'artist,Frank+Sinatra'],
    ['Franz Gruber', false, 'artist,Franz+Xaver+Gruber,+Joseph+Mohr'],
    ['Gary Jules', false, 'artist,Gary+Jules'],
    ['George Gershwin', false, 'artist,George+Gershwin'],
    ['HBO', false, 'artist,HBO'],
    ['Harry Styles', false, 'artist,Harry+Styles'],
    ['Holiday', false, 'artist,Holiday'],
    ['Johann Krieger', false, 'artist,Johann+Krieger'],
    ['John Carpenter', false, 'artist,John+Carpenter'],
    ['John Denver', false, 'artist,John+Denver'],
    ['John Legend', false, 'artist,John+Legend'],
    ['John Newton', false, 'artist,John+Newton'],
    ['Johnny Cash', false, 'artist,Johnny+Cash'],
    ['Journey', false, 'artist,Journey'],
    ['Judy Garland', false, 'artist,Judy+Garland'],
    ['Lady Gaga', false, 'artist,Lady+Gaga,+Bradley+Cooper'],
    ['Leonard Cohen', false, 'artist,Leonard+Cohen'],
    ['Lewis Capaldi', false, 'artist,Lewis+Capaldi'],
    ['Lorde', false, 'artist,Lorde'],
    ['Louis Armstrong', false, 'artist,Louis+Armstrong'],
    ['Maren Morris', false, 'artist,Maren+Morris'],
    ['Maroon 5', false, 'artist,Maroon+5'],
    ['Mozart', false, 'artist,Mozart'],
    ['Nirvana', false, 'artist,Nirvana'],
    ['Queen', false, 'artist,Queen'],
    ['Radiohead', false, 'artist,Radiohead'],
    ['Richard Rodgers', false, 'artist,Richard+Rodgers'],
    ['Rihanna', false, 'artist,Rihanna'],
    ['Sam Smith', false, 'artist,Sam+Smith'],
    ['Sara Bareilles', false, 'artist,Sara+Bareilles'],
    ['Simon & Garfunkel', false, 'artist,Simon+%26+Garfunkel'],
    ['Taylor Swift', false, 'artist,Taylor+Swift'],
    ['The Beatles', false, 'artist,The+Beatles'],
    ['The Eagles', false, 'artist,The+Eagles'],
    ['The Meters', false, 'artist,The+Meters'],
    ['The National', false, 'artist,The+National'],
    ['Thomas A Dorsey', false, 'artist,Thomas+A+Dorsey'],
    ['Thomas Oliphant', false, 'artist,Thomas+Oliphant'],
    ['Tom Petty', false, 'artist,Tom+Petty'],
    ['Vance Joy', false, 'artist,Vance+Joy'],
    ['Yiruma', false, 'artist,Yiruma']
  ],
  STUDENTFOCUSSHOW: [
    ['Chord', false, 'topic,Chord'],
    ['Chording', false, 'topic,Chording'],
    ['Chirstmas', false, 'topic,Christmas'],
    ['Classical', false, 'topic,Classical'],
    ['Composing', false, 'topic,Composing'],
    ['Edutainment', false, 'topic,Edutainment'],
    ['Fills', false, 'topic,Fills'],
    ['Fills and Riffs', false, 'topic,Fills+and+Riffs'],
    ['Gospel', false, 'topic,Gospel'],
    ['Guest Artist', false, 'topic,Guest+Artist'],
    ['Hand Independence', false, 'topic,Hand+Independence'],
    ['Improvisation', false, 'topic,Improvisation'],
    ['Jazz', false, 'topic,Jazz'],
    ['Jazz & Blues', false, 'topic,Jazz+%26+Blues'],
    ['Musicality', false, 'topic,Musicality'],
    ['Pop', false, 'topic,Pop'],
    ['Practice Mindset', false, 'topic,Practice+Mindset'],
    ['Quick Tips', false, 'topic,Quick+Tips'],
    ['Riffs', false, 'topic,Riffs'],
    ['Sight Reading', false, 'topic,Sight+Reading'],
    ['Technique', false, 'topic,Technique'],
    ['Theory', false, 'topic,Theory'],
    ['Tricks', false, 'topic,Tricks'],
    ['edutainment', false, 'topic,edutainment']
  ],
  SEARCH: [
    ['Learning path', false, 'learning-path'],
    ['Unit', false, 'unit'],
    ['Course', false, 'course'],
    ['Unit part', false, 'unit-part'],
    ['Course part', false, 'course-part'],
    ['Song', false, 'song'],
    ['Quick tips', false, 'quick-tips'],
    ['Q&A', false, 'question-and-answer'],
    ['Student review', false, 'student-review'],
    ['Boot camps', false, 'boot-camps'],
    ['Chord and scale', false, 'chord-and-scale'],
    ['Pack Bundle Lesson', false, 'pack-bundle-lesson']
  ],
  MYLIST: [
    ['Learning path', false, 'learning-path'],
    ['Unit', false, 'unit'],
    ['Course', false, 'course'],
    ['Unit part', false, 'unit-part'],
    ['Course part', false, 'course-part'],
    ['Song', false, 'song'],
    ['Quick tips', false, 'quick-tips'],
    ['Q&A', false, 'question-and-answer'],
    ['Student review', false, 'student-review'],
    ['Boot camps', false, 'boot-camps'],
    ['Chord and scale', false, 'chord-and-scale'],
    ['Pack Bundle Lesson', false, 'pack-bundle-lesson']
  ],
  SEEALL: [
    ['Learning path', false, 'learning-path'],
    ['Unit', false, 'unit'],
    ['Course', false, 'course'],
    ['Unit part', false, 'unit-part'],
    ['Course part', false, 'course-part'],
    ['Song', false, 'song'],
    ['Quick tips', false, 'quick-tips'],
    ['Q&A', false, 'question-and-answer'],
    ['Student review', false, 'student-review'],
    ['Boot camps', false, 'boot-camps'],
    ['Chord and scale', false, 'chord-and-scale'],
    ['Pack Bundle Lesson', false, 'pack-bundle-lesson']
  ]
};

const messageDict = {
  1: 'A level 1 pianist is just beginning and might not yet have any skills yet. A level 1 pianist will learn how to navigate the keyboard, play a C scale, chords and begin to build dexterity and control in their hands.',
  2: 'A level 2 pianist can play a C scale hands together, a chord progression in the key of C and understands basic rhythm.',
  3: 'A level 3 pianist can read basic notation and is gaining confidence in playing hands together and reading simple notation on the grand staff.',
  4: 'A level 4 pianist understands how to build and play both major and minor scales and the 1-5-6-4 chord progression. At level 4 you are beginning to play with dynamics and are becoming comfortable in moving your hands outside of “C position” as you play.',
  5: 'A level 5 pianist can play chord inversions and the G major scale as well as apply their knowledge of chord progressions to this new key. They can read notations that include accidentals and eighth notes.',
  6: 'A level 6 a pianist can play in the keys of F major and D minor and is using chord inversions while playing chord progressions.',
  7: 'A level 7 pianist can play with dynamics and the sustain pedal ,in 4/4 and ¾ time and is able to read and play most of the notation found within Pianote.',
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
        filtersAvailable: this.props.filtersAvailable,
        filters: this.props.filters,
        
        type: this.props.type,
        maxLevel: Number(this.props.filtersAvailable.difficulty[this.props.filtersAvailable.difficulty.length - 1]),
        level: 10,
        allLevels: false,
        
        displayTopics: [],
        topics: [],
        progressProgress: false,
        progressComplete: false,
        progressAll: false,
        loading: false,
        kenny: false,
        lisa: false,
        cassi: false,
        jay: false,
        jordan: false,
        jonny: false,
        brett: false,
        nate: false,
        onlyType: true
    };
  }

  UNSAFE_componentWillReceiveProps = props => {
    console.log(props.filtersAvailable, props.filters)
    this.setState({
      filtersAvailable: props.filtersAvailable
    })
  };

  componentDidMount = async () => {
      console.log('PROPS: ' , this.state.filtersAvailable)


      // if no filters selected then use filters available

      /**
         let response = await getAllContent(
            '',
            'new',
            this.state.page,
            {
            displayTopics: [],
            topics: [],
            level: [],
            progress: [],
            instructors: []
            }
        )
       */
  }

  updateFilters = async () => {
    var filters = this.props.navigation.state.params.filters;
    var topics = filters.topics;
    var displayTopics = filters.displayTopics;
    var level = null; // current level
    var allLevels = true; // if all level selected
    var progressAll = false;
    var progressProgress = false;
    var progressComplete = false;
    var openProgress = false;
    var openInstructors = false;
    var kenny = false;
    var lisa = false;
    var cassi = false;
    var jay = false;
    var jordan = false;
    var jonny = false;
    var brett = false;
    var nate = false;

    for (i in filterDict[this.props.navigation.state.params.type]) {
      if (
        topics.indexOf(
          filterDict[this.props.navigation.state.params.type][i][0]
        ) !== -1
      ) {
        filterDict[this.props.navigation.state.params.type][i][1] = true;
      }
    }

    // currently selected level
    if (filters.level.length > 1) {
      level = filters.level[0];
      allLevels = false;
    }

    // currently selected progress
    if (filters.progress.length > 0) {
      if (filters.progress.indexOf('all') !== -1) {
        progressAll = true;
        openProgress = true;
      }

      if (filters.progress.indexOf('started') !== -1) {
        progressProgress = true;
        openProgress = true;
      }

      if (filters.progress.indexOf('completed') !== -1) {
        progressComplete = true;
        openProgress = true;
      }
    }

    // currently selected instructors
    if (filters.instructors.length > 0) {
      if (filters.instructors.indexOf('NATE') !== -1) {
        nate = true;
        openInstructors = true;
      }
      if (filters.instructors.indexOf('JONNY') !== -1) {
        jonny = true;
        openInstructors = true;
      }
      if (filters.instructors.indexOf(197077) !== -1) {
        brett = true;
        openInstructors = true;
      }
      if (filters.instructors.indexOf(196994) !== -1) {
        jordan = true;
        openInstructors = true;
      }
      if (filters.instructors.indexOf(202588) !== -1) {
        jay = true;
        openInstructors = true;
      }
      if (filters.instructors.indexOf(197087) !== -1) {
        cassi = true;
        openInstructors = true;
      }
      if (filters.instructors.indexOf(196999) !== -1) {
        lisa = true;
        openInstructors = true;
      }
      if (filters.instructors.indexOf(203416) !== -1) {
        kenny = true;
        openInstructors = true;
      }
    }

    this.setState({
      topics,
      displayTopics,
      level,
      allLevels,
      progressAll,
      progressProgress,
      progressComplete,
      openProgress,
      openInstructors,
      kenny,
      lisa,
      cassi,
      jay,
      jordan,
      jonny,
      brett,
      nate
    });
  };

  componentWillUnmount = async () => {
    this.setState({ loading: true });
  };

  clickFilter = async num => {
    filterDict = {
      LESSONS: [
        ['Chord', false, 'topic,Chord'],
        ['Chording', false, 'topic,Chording'],
        ['Chirstmas', false, 'topic,Christmas'],
        ['Classical', false, 'topic,Classical'],
        ['Composing', false, 'topic,Composing'],
        ['Edutainment', false, 'topic,Edutainment'],
        ['Fills', false, 'topic,Fills'],
        ['Fills and Riffs', false, 'topic,Fills+and+Riffs'],
        ['Gospel', false, 'topic,Gospel'],
        ['Guest Artist', false, 'topic,Guest+Artist'],
        ['Hand Independence', false, 'topic,Hand+Independence'],
        ['Improvisation', false, 'topic,Improvisation'],
        ['Jazz', false, 'topic,Jazz'],
        ['Jazz & Blues', false, 'topic,Jazz+%26+Blues'],
        ['Musicality', false, 'topic,Musicality'],
        ['Pop', false, 'topic,Pop'],
        ['Practice Mindset', false, 'topic,Practice+Mindset'],
        ['Quick Tips', false, 'topic,Quick+Tips'],
        ['Riffs', false, 'topic,Riffs'],
        ['Sight Reading', false, 'topic,Sight+Reading'],
        ['Technique', false, 'topic,Technique'],
        ['Theory', false, 'topic,Theory'],
        ['Tricks', false, 'topic,Tricks'],
        ['edutainment', false, 'topic,edutainment']
      ],
      COURSES: [
        ['Boogie Woogie', false, 'topic,Boogie+Woogie'],
        ['Gospel', false, 'topic,Gospel'],
        ['Improvisation', false, 'topic,Improvisation'],
        ['Jazz', false, 'topic,Jazz'],
        ['Latin Jazz', false, 'topic,Latin+Jazz'],
        ['Rhythm', false, 'topic,Rhythm'],
        ['Songwriting', false, 'topic,Songwriting'],
        ['Technique', false, 'topic,Technique']
      ],
      SONGS: [
        ['Adult Contemporary', false, 'style,Adult+Contemporary'],
        ['Ballad', false, 'style,Ballad'],
        ['Blues', false, 'style,Blues'],
        ['Christmas', false, 'style,Christmas'],
        ['Classic', false, 'style,Classic'],
        ['Classic Rock', false, 'style,Classic+Rock'],
        ['Classical', false, 'style,Classical'],
        ['Country', false, 'style,Country'],
        ['Folk', false, 'style,Folk'],
        ['Funk', false, 'style,Funk'],
        ['Gospel', false, 'style,Gospel'],
        ['Hymn', false, 'style,Hymn'],
        ['Indie', false, 'style,Indie'],
        ['Musical', false, 'style,Musical'],
        ['New Age', false, 'style,New+Age'],
        ['Pop', false, 'style,Pop'],
        ['R&B', false, 'style,R%26B'],
        ['Rock', false, 'style,Rock'],
        ['Soft Rock', false, 'style,Soft+Rock'],
        ['Soundtrack', false, 'style,Soundtrack'],
        ['Traditional', false, 'style,Traditional'],
        ['classical', false, 'style,classical'],
        ['edm', false, 'style,edm'],
        ['musical', false, 'style,musical'],
        ['pop', false, 'style,pop']
      ],
      ARTISTS: [
        ['Adele', false, 'artist,Adele'],
        ['Adolphe Adam', false, 'artist,Adolphe+Adam+%26+Placide+Cappeau'],
        ['Aerosmith', false, 'artist,Aerosmith'],
        ['Alan Walker', false, 'artist,Alan+Walker'],
        ['Alicia Keys', false, 'artist,Alicia+Keys'],
        ['Annie Lennox', false, 'artist,Annie+Lennox,+Procol+Harum'],
        ['Bach', false, 'artist,Bach'],
        ['Beethoven', false, 'artist,Beethoven'],
        ['Ben E. King', false, 'artist,Ben+E.+King'],
        ['Bette Middler', false, 'artist,Bette+Middler'],
        ['Bill Withers', false, 'artist,Bill+Withers'],
        ['Billie Eilish', false, 'artist,Billie+Eilish'],
        ['Billy Joel', false, 'artist,Billy+Joel'],
        ['Bob Dylan', false, 'artist,Bob+Dylan'],
        ['Calum Scott', false, 'artist,Calum+Scott'],
        ['Carl Boberg', false, 'artist,Carl+Boberg'],
        ['Christina Perri', false, 'artist,Christina+Perri'],
        ['Colbie Caillat', false, 'artist,Colbie+Caillat'],
        ['Coldplay', false, 'artist,Coldplay'],
        ['Cyndi Lauper', false, 'artist,Cyndi+Lauper'],
        ['Ed Sheeran', false, 'artist,Ed+Sheeran'],
        ['Edith Piaf', false, 'artist,Edith+Piaf'],
        ['Elton John', false, 'artist,Elton+John'],
        ['Elvis Presley', false, 'artist,Elvis+Presley'],
        ['Evanescence', false, 'artist,Evanescence'],
        ['Feist', false, 'artist,Feist'],
        ['Frank Sinatra', false, 'artist,Frank+Sinatra'],
        ['Franz Gruber', false, 'artist,Franz+Xaver+Gruber,+Joseph+Mohr'],
        ['Gary Jules', false, 'artist,Gary+Jules'],
        ['George Gershwin', false, 'artist,George+Gershwin'],
        ['HBO', false, 'artist,HBO'],
        ['Harry Styles', false, 'artist,Harry+Styles'],
        ['Holiday', false, 'artist,Holiday'],
        ['Johann Krieger', false, 'artist,Johann+Krieger'],
        ['John Carpenter', false, 'artist,John+Carpenter'],
        ['John Denver', false, 'artist,John+Denver'],
        ['John Legend', false, 'artist,John+Legend'],
        ['John Newton', false, 'artist,John+Newton'],
        ['Johnny Cash', false, 'artist,Johnny+Cash'],
        ['Journey', false, 'artist,Journey'],
        ['Judy Garland', false, 'artist,Judy+Garland'],
        ['Lady Gaga', false, 'artist,Lady+Gaga,+Bradley+Cooper'],
        ['Leonard Cohen', false, 'artist,Leonard+Cohen'],
        ['Lewis Capaldi', false, 'artist,Lewis+Capaldi'],
        ['Lorde', false, 'artist,Lorde'],
        ['Louis Armstrong', false, 'artist,Louis+Armstrong'],
        ['Maren Morris', false, 'artist,Maren+Morris'],
        ['Maroon 5', false, 'artist,Maroon+5'],
        ['Mozart', false, 'artist,Mozart'],
        ['Nirvana', false, 'artist,Nirvana'],
        ['Queen', false, 'artist,Queen'],
        ['Radiohead', false, 'artist,Radiohead'],
        ['Richard Rodgers', false, 'artist,Richard+Rodgers'],
        ['Rihanna', false, 'artist,Rihanna'],
        ['Sam Smith', false, 'artist,Sam+Smith'],
        ['Sara Bareilles', false, 'artist,Sara+Bareilles'],
        ['Simon & Garfunkel', false, 'artist,Simon+%26+Garfunkel'],
        ['Taylor Swift', false, 'artist,Taylor+Swift'],
        ['The Beatles', false, 'artist,The+Beatles'],
        ['The Eagles', false, 'artist,The+Eagles'],
        ['The Meters', false, 'artist,The+Meters'],
        ['The National', false, 'artist,The+National'],
        ['Thomas A Dorsey', false, 'artist,Thomas+A+Dorsey'],
        ['Thomas Oliphant', false, 'artist,Thomas+Oliphant'],
        ['Tom Petty', false, 'artist,Tom+Petty'],
        ['Vance Joy', false, 'artist,Vance+Joy'],
        ['Yiruma', false, 'artist,Yiruma']
      ],
      STUDENTFOCUSSHOW: [
        ['Chord', false, 'topic,Chord'],
        ['Chording', false, 'topic,Chording'],
        ['Chirstmas', false, 'topic,Christmas'],
        ['Classical', false, 'topic,Classical'],
        ['Composing', false, 'topic,Composing'],
        ['Edutainment', false, 'topic,Edutainment'],
        ['Fills', false, 'topic,Fills'],
        ['Fills and Riffs', false, 'topic,Fills+and+Riffs'],
        ['Gospel', false, 'topic,Gospel'],
        ['Guest Artist', false, 'topic,Guest+Artist'],
        ['Hand Independence', false, 'topic,Hand+Independence'],
        ['Improvisation', false, 'topic,Improvisation'],
        ['Jazz', false, 'topic,Jazz'],
        ['Jazz & Blues', false, 'topic,Jazz+%26+Blues'],
        ['Musicality', false, 'topic,Musicality'],
        ['Pop', false, 'topic,Pop'],
        ['Practice Mindset', false, 'topic,Practice+Mindset'],
        ['Quick Tips', false, 'topic,Quick+Tips'],
        ['Riffs', false, 'topic,Riffs'],
        ['Sight Reading', false, 'topic,Sight+Reading'],
        ['Technique', false, 'topic,Technique'],
        ['Theory', false, 'topic,Theory'],
        ['Tricks', false, 'topic,Tricks'],
        ['edutainment', false, 'topic,edutainment']
      ],
      SEARCH: [
        ['Learning path', false, 'learning-path'],
        ['Unit', false, 'unit'],
        ['Course', false, 'course'],
        ['Unit part', false, 'unit-part'],
        ['Course part', false, 'course-part'],
        ['Song', false, 'song'],
        ['Quick tips', false, 'quick-tips'],
        ['Q&A', false, 'question-and-answer'],
        ['Student review', false, 'student-review'],
        ['Boot camps', false, 'boot-camps'],
        ['Chord and scale', false, 'chord-and-scale'],
        ['Pack Bundle Lesson', false, 'pack-bundle-lesson']
      ],
      MYLIST: [
        ['Learning path', false, 'learning-path'],
        ['Unit', false, 'unit'],
        ['Course', false, 'course'],
        ['Unit part', false, 'unit-part'],
        ['Course part', false, 'course-part'],
        ['Song', false, 'song'],
        ['Quick tips', false, 'quick-tips'],
        ['Q&A', false, 'question-and-answer'],
        ['Student review', false, 'student-review'],
        ['Boot camps', false, 'boot-camps'],
        ['Chord and scale', false, 'chord-and-scale'],
        ['Pack Bundle Lesson', false, 'pack-bundle-lesson']
      ],
      SEEALL: [
        ['Learning path', false, 'learning-path'],
        ['Unit', false, 'unit'],
        ['Course', false, 'course'],
        ['Unit part', false, 'unit-part'],
        ['Course part', false, 'course-part'],
        ['Song', false, 'song'],
        ['Quick tips', false, 'quick-tips'],
        ['Q&A', false, 'question-and-answer'],
        ['Student review', false, 'student-review'],
        ['Boot camps', false, 'boot-camps'],
        ['Chord and scale', false, 'chord-and-scale'],
        ['Pack Bundle Lesson', false, 'pack-bundle-lesson']
      ]
    };
    //  this.setState({ displayTopics: [], topics: [] });
    if (filterDict[this.props.navigation.state.params.type][num][1] == false) {
      filterDict[this.props.navigation.state.params.type][num][1] = true;
      let topics = this.state.topics;
      let displayTopics = this.state.displayTopics;
      topics.push(filterDict[this.props.navigation.state.params.type][num][2]);
      displayTopics.push(
        filterDict[this.props.navigation.state.params.type][num][0]
      );
      this.setState({ topics, displayTopics });
    } else {
      filterDict[this.props.navigation.state.params.type][num][1] = false;
      let topics = this.state.topics;
      let displayTopics = this.state.displayTopics;
      topics.splice(
        topics.indexOf(
          filterDict[this.props.navigation.state.params.type][num][2]
        ),
        1
      );
      displayTopics.splice(
        topics.indexOf(
          filterDict[this.props.navigation.state.params.type][num][0]
        ),
        1
      );
      this.setState({ topics, displayTopics });
    }
  };

  clickFilterArtist = async num => {
    filterDict = {
      LESSONS: [
        ['Chord', false, 'topic,Chord'],
        ['Chording', false, 'topic,Chording'],
        ['Chirstmas', false, 'topic,Christmas'],
        ['Classical', false, 'topic,Classical'],
        ['Composing', false, 'topic,Composing'],
        ['Edutainment', false, 'topic,Edutainment'],
        ['Fills', false, 'topic,Fills'],
        ['Fills and Riffs', false, 'topic,Fills+and+Riffs'],
        ['Gospel', false, 'topic,Gospel'],
        ['Guest Artist', false, 'topic,Guest+Artist'],
        ['Hand Independence', false, 'topic,Hand+Independence'],
        ['Improvisation', false, 'topic,Improvisation'],
        ['Jazz', false, 'topic,Jazz'],
        ['Jazz & Blues', false, 'topic,Jazz+%26+Blues'],
        ['Musicality', false, 'topic,Musicality'],
        ['Pop', false, 'topic,Pop'],
        ['Practice Mindset', false, 'topic,Practice+Mindset'],
        ['Quick Tips', false, 'topic,Quick+Tips'],
        ['Riffs', false, 'topic,Riffs'],
        ['Sight Reading', false, 'topic,Sight+Reading'],
        ['Technique', false, 'topic,Technique'],
        ['Theory', false, 'topic,Theory'],
        ['Tricks', false, 'topic,Tricks'],
        ['edutainment', false, 'topic,edutainment']
      ],
      COURSES: [
        ['Boogie Woogie', false, 'topic,Boogie+Woogie'],
        ['Gospel', false, 'topic,Gospel'],
        ['Improvisation', false, 'topic,Improvisation'],
        ['Jazz', false, 'topic,Jazz'],
        ['Latin Jazz', false, 'topic,Latin+Jazz'],
        ['Rhythm', false, 'topic,Rhythm'],
        ['Songwriting', false, 'topic,Songwriting'],
        ['Technique', false, 'topic,Technique']
      ],
      SONGS: [
        ['Adult Contemporary', false, 'style,Adult+Contemporary'],
        ['Ballad', false, 'style,Ballad'],
        ['Blues', false, 'style,Blues'],
        ['Christmas', false, 'style,Christmas'],
        ['Classic', false, 'style,Classic'],
        ['Classic Rock', false, 'style,Classic+Rock'],
        ['Classical', false, 'style,Classical'],
        ['Country', false, 'style,Country'],
        ['Folk', false, 'style,Folk'],
        ['Funk', false, 'style,Funk'],
        ['Gospel', false, 'style,Gospel'],
        ['Hymn', false, 'style,Hymn'],
        ['Indie', false, 'style,Indie'],
        ['Musical', false, 'style,Musical'],
        ['New Age', false, 'style,New+Age'],
        ['Pop', false, 'style,Pop'],
        ['R&B', false, 'style,R%26B'],
        ['Rock', false, 'style,Rock'],
        ['Soft Rock', false, 'style,Soft+Rock'],
        ['Soundtrack', false, 'style,Soundtrack'],
        ['Traditional', false, 'style,Traditional'],
        ['classical', false, 'style,classical'],
        ['edm', false, 'style,edm'],
        ['musical', false, 'style,musical'],
        ['pop', false, 'style,pop']
      ],
      ARTISTS: [
        ['Adele', false, 'artist,Adele'],
        ['Adolphe Adam', false, 'artist,Adolphe+Adam+%26+Placide+Cappeau'],
        ['Aerosmith', false, 'artist,Aerosmith'],
        ['Alan Walker', false, 'artist,Alan+Walker'],
        ['Alicia Keys', false, 'artist,Alicia+Keys'],
        ['Annie Lennox', false, 'artist,Annie+Lennox,+Procol+Harum'],
        ['Bach', false, 'artist,Bach'],
        ['Beethoven', false, 'artist,Beethoven'],
        ['Ben E. King', false, 'artist,Ben+E.+King'],
        ['Bette Middler', false, 'artist,Bette+Middler'],
        ['Bill Withers', false, 'artist,Bill+Withers'],
        ['Billie Eilish', false, 'artist,Billie+Eilish'],
        ['Billy Joel', false, 'artist,Billy+Joel'],
        ['Bob Dylan', false, 'artist,Bob+Dylan'],
        ['Calum Scott', false, 'artist,Calum+Scott'],
        ['Carl Boberg', false, 'artist,Carl+Boberg'],
        ['Christina Perri', false, 'artist,Christina+Perri'],
        ['Colbie Caillat', false, 'artist,Colbie+Caillat'],
        ['Coldplay', false, 'artist,Coldplay'],
        ['Cyndi Lauper', false, 'artist,Cyndi+Lauper'],
        ['Ed Sheeran', false, 'artist,Ed+Sheeran'],
        ['Edith Piaf', false, 'artist,Edith+Piaf'],
        ['Elton John', false, 'artist,Elton+John'],
        ['Elvis Presley', false, 'artist,Elvis+Presley'],
        ['Evanescence', false, 'artist,Evanescence'],
        ['Feist', false, 'artist,Feist'],
        ['Frank Sinatra', false, 'artist,Frank+Sinatra'],
        ['Franz Gruber', false, 'artist,Franz+Xaver+Gruber,+Joseph+Mohr'],
        ['Gary Jules', false, 'artist,Gary+Jules'],
        ['George Gershwin', false, 'artist,George+Gershwin'],
        ['HBO', false, 'artist,HBO'],
        ['Harry Styles', false, 'artist,Harry+Styles'],
        ['Holiday', false, 'artist,Holiday'],
        ['Johann Krieger', false, 'artist,Johann+Krieger'],
        ['John Carpenter', false, 'artist,John+Carpenter'],
        ['John Denver', false, 'artist,John+Denver'],
        ['John Legend', false, 'artist,John+Legend'],
        ['John Newton', false, 'artist,John+Newton'],
        ['Johnny Cash', false, 'artist,Johnny+Cash'],
        ['Journey', false, 'artist,Journey'],
        ['Judy Garland', false, 'artist,Judy+Garland'],
        ['Lady Gaga', false, 'artist,Lady+Gaga,+Bradley+Cooper'],
        ['Leonard Cohen', false, 'artist,Leonard+Cohen'],
        ['Lewis Capaldi', false, 'artist,Lewis+Capaldi'],
        ['Lorde', false, 'artist,Lorde'],
        ['Louis Armstrong', false, 'artist,Louis+Armstrong'],
        ['Maren Morris', false, 'artist,Maren+Morris'],
        ['Maroon 5', false, 'artist,Maroon+5'],
        ['Mozart', false, 'artist,Mozart'],
        ['Nirvana', false, 'artist,Nirvana'],
        ['Queen', false, 'artist,Queen'],
        ['Radiohead', false, 'artist,Radiohead'],
        ['Richard Rodgers', false, 'artist,Richard+Rodgers'],
        ['Rihanna', false, 'artist,Rihanna'],
        ['Sam Smith', false, 'artist,Sam+Smith'],
        ['Sara Bareilles', false, 'artist,Sara+Bareilles'],
        ['Simon & Garfunkel', false, 'artist,Simon+%26+Garfunkel'],
        ['Taylor Swift', false, 'artist,Taylor+Swift'],
        ['The Beatles', false, 'artist,The+Beatles'],
        ['The Eagles', false, 'artist,The+Eagles'],
        ['The Meters', false, 'artist,The+Meters'],
        ['The National', false, 'artist,The+National'],
        ['Thomas A Dorsey', false, 'artist,Thomas+A+Dorsey'],
        ['Thomas Oliphant', false, 'artist,Thomas+Oliphant'],
        ['Tom Petty', false, 'artist,Tom+Petty'],
        ['Vance Joy', false, 'artist,Vance+Joy'],
        ['Yiruma', false, 'artist,Yiruma']
      ],
      STUDENTFOCUSSHOW: [
        ['Chord', false, 'topic,Chord'],
        ['Chording', false, 'topic,Chording'],
        ['Chirstmas', false, 'topic,Christmas'],
        ['Classical', false, 'topic,Classical'],
        ['Composing', false, 'topic,Composing'],
        ['Edutainment', false, 'topic,Edutainment'],
        ['Fills', false, 'topic,Fills'],
        ['Fills and Riffs', false, 'topic,Fills+and+Riffs'],
        ['Gospel', false, 'topic,Gospel'],
        ['Guest Artist', false, 'topic,Guest+Artist'],
        ['Hand Independence', false, 'topic,Hand+Independence'],
        ['Improvisation', false, 'topic,Improvisation'],
        ['Jazz', false, 'topic,Jazz'],
        ['Jazz & Blues', false, 'topic,Jazz+%26+Blues'],
        ['Musicality', false, 'topic,Musicality'],
        ['Pop', false, 'topic,Pop'],
        ['Practice Mindset', false, 'topic,Practice+Mindset'],
        ['Quick Tips', false, 'topic,Quick+Tips'],
        ['Riffs', false, 'topic,Riffs'],
        ['Sight Reading', false, 'topic,Sight+Reading'],
        ['Technique', false, 'topic,Technique'],
        ['Theory', false, 'topic,Theory'],
        ['Tricks', false, 'topic,Tricks'],
        ['edutainment', false, 'topic,edutainment']
      ],
      SEARCH: [
        ['Learning path', false, 'learning-path'],
        ['Unit', false, 'unit'],
        ['Course', false, 'course'],
        ['Unit part', false, 'unit-part'],
        ['Course part', false, 'course-part'],
        ['Song', false, 'song'],
        ['Quick tips', false, 'quick-tips'],
        ['Q&A', false, 'question-and-answer'],
        ['Student review', false, 'student-review'],
        ['Boot camps', false, 'boot-camps'],
        ['Chord and scale', false, 'chord-and-scale'],
        ['Pack Bundle Lesson', false, 'pack-bundle-lesson']
      ],
      MYLIST: [
        ['Learning path', false, 'learning-path'],
        ['Unit', false, 'unit'],
        ['Course', false, 'course'],
        ['Unit part', false, 'unit-part'],
        ['Course part', false, 'course-part'],
        ['Song', false, 'song'],
        ['Quick tips', false, 'quick-tips'],
        ['Q&A', false, 'question-and-answer'],
        ['Student review', false, 'student-review'],
        ['Boot camps', false, 'boot-camps'],
        ['Chord and scale', false, 'chord-and-scale'],
        ['Pack Bundle Lesson', false, 'pack-bundle-lesson']
      ],
      SEEALL: [
        ['Learning path', false, 'learning-path'],
        ['Unit', false, 'unit'],
        ['Course', false, 'course'],
        ['Unit part', false, 'unit-part'],
        ['Course part', false, 'course-part'],
        ['Song', false, 'song'],
        ['Quick tips', false, 'quick-tips'],
        ['Q&A', false, 'question-and-answer'],
        ['Student review', false, 'student-review'],
        ['Boot camps', false, 'boot-camps'],
        ['Chord and scale', false, 'chord-and-scale'],
        ['Pack Bundle Lesson', false, 'pack-bundle-lesson']
      ]
    };
    // this.setState({ displayTopics: [], topics: [] });

    if (filterDict['ARTISTS'][num][1] == false) {
      filterDict['ARTISTS'][num][1] = true;
      let topics = this.state.topics;
      let displayTopics = this.state.displayTopics;
      topics.push(filterDict['ARTISTS'][num][2]);
      displayTopics.push(filterDict['ARTISTS'][num][0]);
      this.setState({ topics, displayTopics });
    } else {
      filterDict['ARTISTS'][num][1] = false;
      let topics = this.state.topics;
      let displayTopics = this.state.displayTopics;
      topics.splice(topics.indexOf(filterDict['ARTISTS'][num][2]), 1);
      displayTopics.splice(topics.indexOf(filterDict['ARTISTS'][num][0]), 1);
      this.setState({ topics, displayTopics });
    }
  };

  reset = async () => {
    this.props.reset({
        displayTopics: [],
        topics: [],
        level: [],
        progress: [],
        instructors: []
      })
    this.setState({
      displayTopics: [],
      topics: [],
      level: null,
      openProgress: false,
      openInstructors: false,
      all: false,
      kenny: false,
      lisa: false,
      cassi: false,
      jay: false,
      jordan: false,
      jonny: false,
      brett: false,
      nate: false,
      progressAll: false,
      progressProgress: false,
      progressComplete: false,
      allLevels: true
    });
    this.props.hideFilters()
  };

  select = async () => {
    var progress = [];
    if (this.state.progressAll) {
      progress.push('all');
    }
    if (this.state.progressProgress) {
      progress.push('started');
    }
    if (this.state.progressComplete) {
      progress.push('completed');
    }

    var instructors = [];
    if (this.state.kenny) {
      instructors.push(203416);
    }
    if (this.state.lisa) {
      instructors.push(196999);
    }
    if (this.state.cassi) {
      instructors.push(197087);
    }
    if (this.state.jay) {
      instructors.push(202588);
    }
    if (this.state.jordan) {
      instructors.push(196994);
    }
    if (this.state.brett) {
      instructors.push(197077);
    }
    if (this.state.nate) {
      instructors.push('NATE');
    }
    if (this.state.jonny) {
      instructors.push('JONNY');
    }

    var level = [];
    if (!this.state.allLevels) {
      level.push(this.state.level);
      if (this.state.level < 4) {
        level.push('BEGINNER');
      } else if (this.state.level < 6) {
        level.push('INTERMEDIATE');
      } else {
        level.push('ADVANCED');
      }
    } 

    console.log(level)

    await this.props.onGoBack({
      displayTopics: this.state.displayTopics,
      topics: this.state.topics,
      instructors: instructors,
      progress: progress,
      level: level
    });
  };

  getData = data => {

  }

  render() {
    return (
        <View style={styles.container}>
        <View
            style={{
            flex: 1,
            backgroundColor: colors.mainBackground
            }}
        >
            <View key={'contentContainer'} style={{ flex: 1 }}>
            <View
                style={[
                styles.centerContent,
                {
                    height:
                    Platform.OS == 'android' ? fullHeight * 0.1 : isNotch ? fullHeight * 0.12 : fullHeight * 0.1 + 15 * factorVertical,
                    backgroundColor: colors.thirdBackground
                }
                ]}
            >
                <View style={{ flex: 1 }} />
                <View
                style={[
                    styles.centerContent,
                    {
                    flexDirection: 'row',
                    backgroundColor: colors.thirdBackground
                    }
                ]}
                >
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={{ flex: 0.1 }} />
                    <View>
                    <View style={{ flex: 1 }} />
                    <TouchableOpacity
                        onPress={() => this.props.hideFilters()}
                        style={{
                        paddingLeft: 10 * factorRatio,
                        paddingRight: 10 * factorRatio,
                        }}
                    >
                        <EntypoIcon
                            name={'chevron-thin-left'}
                            size={25 * factorRatio}
                            color={'white'}
                        />
                    </TouchableOpacity>
                    <View style={{ flex: 1 }} />
                    </View>
                </View>
                <Text
                    style={{
                    fontSize: 22 * factorRatio,
                    color: 'white',
                    fontFamily: 'OpenSans-Bold'
                    }}
                >
                    Filter {this.state.type}
                </Text>
                <View style={{ flex: 1 }} />
                </View>
                <View style={{ height: 20 * factorVertical }} />
            </View>
            {!this.state.loading && (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentInsetAdjustmentBehavior={'never'}
                    style={{
                        flex: 0.9,
                        backgroundColor: colors.mainBackground
                    }}
                >
                <View style={{ height: 30 * factorVertical }} />
                {this.state.onlyType && (
                    <View>
                    <Text
                        key={'setYourSkill'}
                        style={{
                        fontSize: 18 * factorRatio,
                        marginBottom: 5 * factorVertical,
                        textAlign: 'left',
                        fontFamily: 'RobotoCondensed-Bold',
                        color: colors.secondBackground,
                        paddingLeft: fullWidth * 0.035
                        }}
                    >
                        SET YOUR SKILL LEVEL
                    </Text>
                    <View
                        key={'slider'}
                        style={[
                        styles.centerContent,
                        {
                            paddingLeft: fullWidth * 0.035,
                            paddingRight: fullWidth * 0.035,
                        }
                        ]}
                    >
                        <View 
                        style={[
                            styles.centerContent, {
                            height: 50*factorVertical, 
                            width: `${10*this.state.maxLevel.toString()}%`,
                            paddingTop: 20*factorVertical,
                            paddingBottom: 20*factorVertical,
                        }]}
                        >
                            <View 
                            style={{
                                height: '100%',
                                width: '100%',
                                flexDirection: 'row',
                            }}
                            >
                            {(this.state.maxLevel > 0) && (
                            <TouchableOpacity 
                                onPress={() => {
                                this.setState({
                                    level: 1, 
                                    allLevels: false
                                }, () => this.select())
                                }}
                                style={{
                                flex: 1,
                                backgroundColor: (this.state.level > 0 || this.state.allLevels) ? colors.pianoteRed : null,
                                borderColor: colors.pianoteRed,
                                borderWidth: 1.25,
                                borderRadius: 5*factorRatio,
                                }}
                            />  
                            )}
                            {(this.state.maxLevel > 0) && (
                            <View style={{width: 2.5*factorHorizontal}}/>
                            )}
                            {(this.state.maxLevel > 1) && (
                            <TouchableOpacity 
                                onPress={() => {
                                this.setState({
                                    level: this.state.level == 2 ? 1 : 2,
                                    allLevels: false,
                                }, () => this.select())
                                }}
                                style={{
                                flex: 1,
                                backgroundColor: (this.state.level > 1 || this.state.allLevels) ? colors.pianoteRed : null,
                                borderColor: colors.pianoteRed,
                                borderWidth: 1.25,
                                borderRadius: 5*factorRatio,
                                }}
                            />
                            )}
                            {(this.state.maxLevel > 1) && (
                            <View style={{width: 2.5*factorHorizontal}}/>
                            )}
                            {(this.state.maxLevel > 2) && (
                            <TouchableOpacity 
                                onPress={() => {
                                this.setState({
                                    level: this.state.level == 3 ? 2 : 3,
                                    allLevels: false,
                                }),
                                this.select()
                                }}
                                style={{
                                flex: 1,
                                backgroundColor: (this.state.level > 2 || this.state.allLevels) ? colors.pianoteRed : null,
                                borderColor: colors.pianoteRed,
                                borderWidth: 1.25,
                                borderRadius: 5*factorRatio,
                                }}
                            />
                            )}
                            {(this.state.maxLevel > 2) && (
                            <View style={{width: 2.5*factorHorizontal}}/>
                            )}
                            {(this.state.maxLevel > 3) && (
                            <TouchableOpacity 
                                onPress={() => {
                                this.setState({
                                    level: this.state.level == 4 ? 3 : 4,
                                    allLevels: false,
                                }, () => this.select())
                                }}
                                style={{
                                flex: 1,
                                backgroundColor: (this.state.level > 3 || this.state.allLevels) ? colors.pianoteRed : null,
                                borderColor: colors.pianoteRed,
                                borderWidth: 1.25,
                                borderRadius: 5*factorRatio,
                                }}
                            />
                            )}
                            {(this.state.maxLevel > 3) && (
                            <View style={{width: 2.5*factorHorizontal}}/>
                            )}
                            {(this.state.maxLevel > 4) && (
                            <TouchableOpacity 
                                onPress={() => {
                                this.setState({
                                    level: this.state.level == 5 ? 4 : 5,
                                    allLevels: false,
                                }, () => this.select())
                                }}
                                style={{
                                flex: 1,
                                backgroundColor: (this.state.level > 4 || this.state.allLevels) ? colors.pianoteRed : null,
                                borderColor: colors.pianoteRed,
                                borderWidth: 1.25,
                                borderRadius: 5*factorRatio,
                                }}
                            />
                            )}
                            {(this.state.maxLevel > 4) && (
                            <View style={{width: 2.5*factorHorizontal}}/>
                            )}
                            {(this.state.maxLevel > 5) && (
                            <TouchableOpacity 
                                onPress={() => {
                                this.setState({
                                    level: this.state.level == 6 ? 5 : 6,
                                    allLevels: false,
                                }, () => this.select())
                                }}
                                style={{
                                flex: 1,
                                backgroundColor: (this.state.level > 5 || this.state.allLevels) ? colors.pianoteRed : null,
                                borderColor: colors.pianoteRed,
                                borderWidth: 1.25,
                                borderRadius: 5*factorRatio,
                                }}
                            />
                            )}
                            {(this.state.maxLevel > 5) && (
                            <View style={{width: 2.5*factorHorizontal}}/>
                            )}
                            {(this.state.maxLevel > 6) && (
                            <TouchableOpacity 
                                onPress={() => {
                                this.setState({
                                    level: this.state.level == 7 ? 6 : 7,
                                    allLevels: false,
                                }, () => this.select())
                                }}
                                style={{
                                flex: 1,
                                backgroundColor: (this.state.level > 6 || this.state.allLevels) ? colors.pianoteRed : null,
                                borderColor: colors.pianoteRed,
                                borderWidth: 1.25,
                                borderRadius: 5*factorRatio,
                                }}
                            />
                            )}
                            {(this.state.maxLevel > 6) && (
                            <View style={{width: 2.5*factorHorizontal}}/>
                            )}
                            {(this.state.maxLevel > 7) && (
                            <TouchableOpacity 
                                onPress={() => {
                                this.setState({
                                    level: this.state.level == 8 ? 7 : 8,
                                    allLevels: false,
                                }, () => this.select())
                                }}
                                style={{
                                flex: 1,
                                backgroundColor: (this.state.level > 7 || this.state.allLevels) ? colors.pianoteRed : null,
                                borderColor: colors.pianoteRed,
                                borderWidth: 1.25,
                                borderRadius: 5*factorRatio,
                                }}
                            />
                            )}
                            {(this.state.maxLevel > 7) && (
                            <View style={{width: 2.5*factorHorizontal}}/>
                            )}
                            {(this.state.maxLevel > 8) && (
                            <TouchableOpacity 
                                onPress={() => {
                                this.setState({
                                    level: this.state.level == 9 ? 8 : 9,
                                    allLevels: false,
                                }, () => this.select())
                                }}
                                style={{
                                flex: 1,
                                backgroundColor: (this.state.level > 8 || this.state.allLevels) ? colors.pianoteRed : null,
                                borderColor: colors.pianoteRed,
                                borderWidth: 1.25,
                                borderRadius: 5*factorRatio,
                                }}
                            />
                            )}
                            {(this.state.maxLevel > 8) && (
                            <View style={{width: 2.5*factorHorizontal}}/>
                            )}
                            {(this.state.maxLevel > 9) && (
                            <TouchableOpacity 
                                onPress={() => {
                                this.setState({
                                    level: this.state.level == 10 ? 9 : 10,
                                    allLevels: false,
                                }, () => this.select())
                                }}
                                style={{
                                flex: 1,
                                backgroundColor: (this.state.level > 9 || this.state.allLevels) ? colors.pianoteRed : null,
                                borderColor: colors.pianoteRed,
                                borderWidth: 1.25,
                                borderRadius: 5*factorRatio,
                                }}
                            />
                            )}
                            {(this.state.maxLevel > 9) && (
                            <View style={{width: 2.5*factorHorizontal}}/>
                            )}
                            </View>
                        </View>
                    </View>
                    <View style={{ height: 10 * factorRatio }} />
                    <Text
                        style={{
                        textAlign: 'center',
                        fontSize: 24 * factorRatio,
                        fontFamily: 'OpenSans-Bold',
                        color: 'white'
                        }}
                    >
                        {this.state.allLevels
                        ? 'ALL LEVELS'
                        : 'LEVEL ' + this.state.level}
                    </Text>
                    <View style={{ height: 10 * factorRatio }} />
                    <Text
                        style={{
                        textAlign: 'center',
                        fontSize: 14 * factorRatio,
                        fontFamily: 'OpenSans-Regular',
                        color: 'white',
                        paddingLeft: fullWidth * 0.1,
                        paddingRight: fullWidth * 0.1
                        }}
                    >
                        {this.state.level == null || this.state.allLevels
                        ? messageDict['All']
                        : messageDict[this.state.level]}
                    </Text>
                    <View style={{ height: 10 * factorRatio }} />
                    <View
                        key={'allLevels'}
                        style={{
                        minHeight: 70 * factorVertical,
                        borderBottomWidth: 0.5 * factorRatio,
                        borderBottomColor: colors.secondBackground
                        }}
                    >
                        <View style={{ height: 10 * factorRatio }} />
                        <View
                        style={{
                            height: 30 * factorVertical,
                            justifyContent: 'space-around',
                            alignContent: 'space-around',
                            flexDirection: 'row'
                        }}
                        >
                        <View style={{ flex: 1 }} />
                        <TouchableOpacity
                            onPress={() => {
                            this.setState({
                                allLevels: !this.state.allLevels,
                                level: this.state.maxLevel,
                            });
                            }}
                            style={[
                            styles.centerContent,
                            {
                                height: 30 * factorVertical,
                                width: fullWidth * 0.3,
                                marginRight: fullWidth * 0.01,
                                marginLeft: fullWidth * 0.01,
                                borderWidth: 0.5 * factorRatio,
                                borderColor: this.state.allLevels
                                ? 'transparent'
                                : colors.secondBackground,
                                backgroundColor: this.state.allLevels
                                ? 'red'
                                : 'transparent',
                                borderRadius: 200
                            }
                            ]}
                        >
                            <Text
                            style={{
                                textAlign: 'center',
                                fontSize: 12 * factorRatio,
                                fontFamily: 'OpenSans-ExtraBold',
                                color: this.state.allLevels
                                ? 'white'
                                : colors.secondBackground
                            }}
                            >
                            ALL
                            </Text>
                        </TouchableOpacity>
                        <View style={{ flex: 1 }} />
                        </View>
                        <View style={{ height: 40 * factorRatio }} />
                    </View>
                    <View style={{ height: 30 * factorVertical }} />
                    </View>
                )}
                <View key={'topics'}>
                    <Text
                    style={{
                        fontSize: 18 * factorRatio,
                        marginBottom: 5 * factorVertical,
                        textAlign: 'left',
                        fontFamily: 'RobotoCondensed-Bold',
                        color: colors.secondBackground,
                        paddingLeft: fullWidth * 0.035
                    }}
                    >
                    {this.state.onlyType
                        ? 'WHAT DO YOU WANT TO WORK ON?'
                        : 'CHOOSE A CONTENT TYPE'}
                    </Text>
                    <View style={{height: 5*factorVertical}}/>
                    <View
                    style={{
                        minHeight: 70 * factorVertical,
                        width: '100%',
                    }}
                    >
                    <ScrollView
                        style={{
                        height: this.state.onlyType ? 40 * factorRatio + 90 * factorVertical : 350 * factorVertical,
                            width: '100%',
                        }}
                    >
                        {this.state.filtersAvailable.topic.map((data, index) => {
                            console.log(index, data)
                            if(index % 3 == 0) {
                                return (
                                    <View
                                        style={{
                                            height: 40*factorRatio, 
                                            width: '100%',
                                            flexDirection: 'row',
                                            padding: 5,
                                        }}
                                        horizontal={true}
                                    >
                                        {(typeof this.state.filtersAvailable.topic[index] == 'string') && (
                                        <TouchableOpacity
                                            onPress={() => {
                                                
                                            }}
                                            style={{
                                                flex: 1,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                marginLeft: 5*factorRatio, 
                                                marginRight: 5*factorRatio, 
                                                backgroundColor: colors.pianoteRed,
                                                borderRadius: 100,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    textAlign: 'center',
                                                    color: 'white',
                                                    fontSize:  0.035*fullWidth,
                                                    marginLeft: 5*factorHorizontal, 
                                                    marginRight: 5*factorHorizontal,
                                                    fontFamily: 'RobotoCondensed-Bold'
                                                }}
                                            >
                                                {this.state.filtersAvailable.topic[index]}
                                            </Text>
                                        </TouchableOpacity>
                                        )}
                                        {(typeof this.state.filtersAvailable.topic[index] !== 'string') && (
                                        <View style={{flex: 1}}/>
                                        )}
                                        {(typeof this.state.filtersAvailable.topic[index+1] == 'string') && (
                                        <TouchableOpacity
                                            onPress={() => {
                                                
                                            }}
                                            style={{
                                                flex: 1,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                marginLeft: 5*factorRatio, 
                                                marginRight: 5*factorRatio,
                                                backgroundColor: colors.pianoteRed,
                                                borderRadius: 100,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    textAlign: 'center',
                                                    color: 'white',
                                                    fontSize:  0.035*fullWidth,
                                                    marginLeft: 5*factorHorizontal, 
                                                    marginRight: 5*factorHorizontal,
                                                    fontFamily: 'RobotoCondensed-Bold'
                                                }}
                                            >
                                                {this.state.filtersAvailable.topic[index+1]}
                                            </Text>
                                        </TouchableOpacity>
                                        )}
                                        {(typeof this.state.filtersAvailable.topic[index+1] !== 'string') && (
                                        <View style={{flex: 1}}/>
                                        )}
                                        {(typeof this.state.filtersAvailable.topic[index+2] == 'string') && (
                                        <TouchableOpacity
                                            onPress={() => {
                                                
                                            }}
                                            style={{
                                                flex: 1,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                marginLeft: 5*factorRatio, 
                                                marginRight: 5*factorRatio,
                                                backgroundColor: colors.pianoteRed,
                                                borderRadius: 100,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    textAlign: 'center',
                                                    color: 'white',
                                                    fontSize:  0.035*fullWidth,
                                                    marginLeft: 5*factorHorizontal, 
                                                    marginRight: 5*factorHorizontal,
                                                    fontFamily: 'RobotoCondensed-Bold'
                                                }}
                                            >
                                                {this.state.filtersAvailable.topic[index+2]}
                                            </Text>
                                        </TouchableOpacity>
                                        )}
                                        {(typeof this.state.filtersAvailable.topic[index+2] !== 'string') && (
                                        <View style={{flex: 1}}/>
                                        )}
                                    </View>
                                )
                            }
                        })}

                    </ScrollView>
                    </View>
                </View>
                {this.state.type == 'SONGS' && (
                    <View>
                    <View style={{ height: 30 * factorVertical }} />
                    <View key={'artists'}>
                        <Text
                        style={{
                            fontSize: 18 * factorRatio,
                            marginBottom: 5 * factorVertical,
                            textAlign: 'left',
                            fontFamily: 'RobotoCondensed-Bold',
                            color: colors.secondBackground,
                            paddingLeft: fullWidth * 0.035
                        }}
                        >
                        CHOOSE YOUR ARTISTS
                        </Text>
                        <View style={{height: 5*factorVertical}}/>
                        <View
                            style={{
                                minHeight: 70 * factorVertical,
                                width: '100%'
                            }}
                        >
                    <ScrollView
                        style={{
                        height: this.state.onlyType ? 40 * factorRatio + 90 * factorVertical : 350 * factorVertical,
                            width: '100%',
                        }}
                    >
                        {this.state.filtersAvailable.artist.map((data, index) => {
                            console.log(index, data)
                            if(index % 3 == 0) {
                                return (
                                    <View
                                        style={{
                                            height: 40*factorRatio, 
                                            width: '100%',
                                            flexDirection: 'row',
                                            padding: 5,
                                        }}
                                        horizontal={true}
                                    >
                                        {(typeof this.state.filtersAvailable.artist[index] == 'string') && (
                                        <TouchableOpacity
                                            onPress={() => {
                                                
                                            }}
                                            style={{
                                                flex: 1,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                marginLeft: 5*factorRatio, 
                                                marginRight: 5*factorRatio, 
                                                backgroundColor: colors.pianoteRed,
                                                borderRadius: 100,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    textAlign: 'center',
                                                    color: 'white',
                                                    fontSize:  0.035*fullWidth,
                                                    fontFamily: 'RobotoCondensed-Bold',
                                                    marginLeft: 5*factorHorizontal, 
                                                    marginRight: 5*factorHorizontal,
                                                }}
                                            >
                                                {this.state.filtersAvailable.artist[index]}
                                            </Text>
                                        </TouchableOpacity>
                                        )}
                                        {(typeof this.state.filtersAvailable.artist[index] !== 'string') && (
                                        <View style={{flex: 1}}/>
                                        )}
                                        {(typeof this.state.filtersAvailable.artist[index+1] == 'string') && (
                                        <TouchableOpacity
                                            onPress={() => {
                                                
                                            }}
                                            style={{
                                                flex: 1,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                marginLeft: 5*factorRatio, 
                                                marginRight: 5*factorRatio,
                                                backgroundColor: colors.pianoteRed,
                                                borderRadius: 100,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    textAlign: 'center',
                                                    color: 'white',
                                                    fontSize:  0.035*fullWidth,
                                                    marginLeft: 5*factorHorizontal, 
                                                    marginRight: 5*factorHorizontal,
                                                    fontFamily: 'RobotoCondensed-Bold'
                                                }}
                                            >
                                                {this.state.filtersAvailable.artist[index+1]}
                                            </Text>
                                        </TouchableOpacity>
                                        )}
                                        {(typeof this.state.filtersAvailable.artist[index+1] !== 'string') && (
                                        <View style={{flex: 1}}/>
                                        )}
                                        {(typeof this.state.filtersAvailable.artist[index+2] == 'string') && (
                                        <TouchableOpacity
                                            onPress={() => {
                                                
                                            }}
                                            style={{
                                                flex: 1,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                marginLeft: 5*factorRatio, 
                                                marginRight: 5*factorRatio,
                                                backgroundColor: colors.pianoteRed,
                                                borderRadius: 100,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    textAlign: 'center',
                                                    color: 'white',
                                                    fontSize:  0.035*fullWidth,
                                                    marginLeft: 5*factorHorizontal, 
                                                    marginRight: 5*factorHorizontal,
                                                    fontFamily: 'RobotoCondensed-Bold'
                                                }}
                                            >
                                                {this.state.filtersAvailable.artist[index+2]}
                                            </Text>
                                        </TouchableOpacity>
                                        )}
                                        {(typeof this.state.filtersAvailable.artist[index+2] !== 'string') && (
                                        <View style={{flex: 1}}/>
                                        )}
                                    </View>
                                )
                            }
                        })}

                    </ScrollView>                        
                        </View>
                    </View>
                    </View>
                )}
                {this.state.type !== 'SONGS' && (
                    <View>
                    <View style={{ height: 30 * factorVertical }} />
                    <View key={'styles'}>
                        <Text
                        style={{
                            fontSize: 18 * factorRatio,
                            marginBottom: 5 * factorVertical,
                            textAlign: 'left',
                            fontFamily: 'RobotoCondensed-Bold',
                            color: colors.secondBackground,
                            paddingLeft: fullWidth * 0.035
                        }}
                        >
                        WHAT STYLE DO YOU WANT TO WORK ON
                        </Text>
                        <View style={{height: 5*factorVertical}}/>
                        <View
                            style={{
                                minHeight: 70 * factorVertical,
                                width: '100%'
                            }}
                        >
                    <ScrollView
                        style={{
                        height: this.state.onlyType ? 40 * factorRatio + 90 * factorVertical : 350 * factorVertical,
                            width: '100%',
                        }}
                    >
                        {this.state.filtersAvailable.style.map((data, index) => {
                            console.log(index, data)
                            if(index % 3 == 0) {
                                return (
                                    <View
                                        style={{
                                            height: 40*factorRatio, 
                                            width: '100%',
                                            flexDirection: 'row',
                                            padding: 5,
                                        }}
                                        horizontal={true}
                                    >
                                        {(typeof this.state.filtersAvailable.style[index] == 'string') && (
                                        <TouchableOpacity
                                            onPress={() => {
                                                
                                            }}
                                            style={{
                                                flex: 1,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                marginLeft: 5*factorRatio, 
                                                marginRight: 5*factorRatio, 
                                                backgroundColor: colors.pianoteRed,
                                                borderRadius: 100,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    textAlign: 'center',
                                                    color: 'white',
                                                    fontSize:  0.035*fullWidth,
                                                    fontFamily: 'RobotoCondensed-Bold',
                                                    marginLeft: 5*factorHorizontal, 
                                                    marginRight: 5*factorHorizontal,
                                                }}
                                            >
                                                {this.state.filtersAvailable.style[index]}
                                            </Text>
                                        </TouchableOpacity>
                                        )}
                                        {(typeof this.state.filtersAvailable.style[index] !== 'string') && (
                                        <View style={{flex: 1}}/>
                                        )}
                                        {(typeof this.state.filtersAvailable.style[index+1] == 'string') && (
                                        <TouchableOpacity
                                            onPress={() => {
                                                
                                            }}
                                            style={{
                                                flex: 1,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                marginLeft: 5*factorRatio, 
                                                marginRight: 5*factorRatio,
                                                backgroundColor: colors.pianoteRed,
                                                borderRadius: 100,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    textAlign: 'center',
                                                    color: 'white',
                                                    fontSize:  0.035*fullWidth,
                                                    marginLeft: 5*factorHorizontal, 
                                                    marginRight: 5*factorHorizontal,
                                                    fontFamily: 'RobotoCondensed-Bold'
                                                }}
                                            >
                                                {this.state.filtersAvailable.style[index+1]}
                                            </Text>
                                        </TouchableOpacity>
                                        )}
                                        {(typeof this.state.filtersAvailable.style[index+1] !== 'string') && (
                                        <View style={{flex: 1}}/>
                                        )}
                                        {(typeof this.state.filtersAvailable.style[index+2] == 'string') && (
                                        <TouchableOpacity
                                            onPress={() => {
                                                
                                            }}
                                            style={{
                                                flex: 1,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                marginLeft: 5*factorRatio, 
                                                marginRight: 5*factorRatio,
                                                backgroundColor: colors.pianoteRed,
                                                borderRadius: 100,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    textAlign: 'center',
                                                    color: 'white',
                                                    fontSize:  0.035*fullWidth,
                                                    marginLeft: 5*factorHorizontal, 
                                                    marginRight: 5*factorHorizontal,
                                                    fontFamily: 'RobotoCondensed-Bold'
                                                }}
                                            >
                                                {this.state.filtersAvailable.style[index+2]}
                                            </Text>
                                        </TouchableOpacity>
                                        )}
                                        {(typeof this.state.filtersAvailable.style[index+2] !== 'string') && (
                                        <View style={{flex: 1}}/>
                                        )}
                                    </View>
                                )
                            }
                        })}

                    </ScrollView>                        
                        </View>
                    </View>
                    </View>
                )}                
                <View style={{ height: 30 * factorVertical }} />
                {this.state.onlyType && (
                    <TouchableOpacity
                    key={'chooseProgress'}
                    onPress={() => {
                        this.setState({
                        openProgress: !this.state.openProgress
                        });
                    }}
                    style={{
                        height: fullHeight * 0.1,
                        flexDirection: 'row',
                        paddingLeft: fullWidth * 0.035,
                        paddingRight: fullWidth * 0.035,
                        borderTopColor: colors.secondBackground,
                        borderTopWidth: 0.5 * factorRatio,
                        borderBottomColor: colors.secondBackground,
                        borderBottomWidth: this.state.openProgress
                        ? 0
                        : 0.25 * factorRatio
                    }}
                    >
                    <View>
                        <View style={{ flex: 1 }} />
                        <Text
                        style={{
                            fontSize: 18 * factorRatio,
                            marginBottom: 5 * factorVertical,
                            textAlign: 'left',
                            fontFamily: 'RobotoCondensed-Bold',
                            color: colors.secondBackground
                        }}
                        >
                        CHOOSE YOUR PROGRESS
                        </Text>
                        <View style={{ flex: 1 }} />
                    </View>
                    <View style={{ flex: 1 }} />
                    <View>
                        <View style={{ flex: 1 }} />
                        <View
                        style={{
                            paddingLeft: 10 * factorRatio,
                            paddingRight: 10 * factorRatio
                        }}
                        >
                        <EntypoIcon
                            name={
                            this.state.openProgress
                                ? 'chevron-thin-up'
                                : 'chevron-thin-down'
                            }
                            size={25 * factorRatio}
                            color={colors.secondBackground}
                        />
                        </View>
                        <View style={{ flex: 1 }} />
                    </View>
                    </TouchableOpacity>
                )}
                {this.state.openProgress && this.state.onlyType && (
                    <View
                    key={'progressLevels'}
                    style={{
                        borderBottomColor: colors.secondBackground,
                        borderBottomWidth: 0.5 * factorRatio
                    }}
                    >
                    <View
                        style={{
                        height: 30 * factorVertical,
                        justifyContent: 'space-around',
                        alignContent: 'space-around',
                        flexDirection: 'row'
                        }}
                    >
                        <View style={{ flex: 1 }} />
                        <TouchableOpacity
                        onPress={() => {
                            this.setState({
                            progressAll: !this.state.progressAll,
                            progressProgress: false,
                            progressComplete: false
                            });
                        }}
                        style={[
                            styles.centerContent,
                            {
                            height: 30 * factorVertical,
                            width: fullWidth * 0.3,
                            marginRight: fullWidth * 0.01,
                            marginLeft: fullWidth * 0.01,
                            borderWidth: 0.5 * factorRatio,
                            borderColor: this.state.progressAll
                                ? null
                                : colors.secondBackground,
                            backgroundColor: this.state.progressAll
                                ? colors.pianoteRed
                                : colors.mainBackground,
                            borderRadius: 200
                            }
                        ]}
                        >
                        <Text
                            style={{
                            textAlign: 'center',
                            fontWeight: 'bold',
                            fontSize: 12 * factorRatio,
                            fontFamily: 'OpenSans-Regular',
                            color: this.state.progressAll
                                ? 'white'
                                : colors.secondBackground
                            }}
                        >
                            ALL
                        </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                        onPress={() => {
                            this.setState({
                            progressProgress: !this.state.progressProgress,
                            progressAll: false,
                            progressComplete: false
                            });
                        }}
                        style={[
                            styles.centerContent,
                            {
                            height: 30 * factorVertical,
                            width: fullWidth * 0.3,
                            marginRight: fullWidth * 0.01,
                            marginLeft: fullWidth * 0.01,
                            borderWidth: 0.5 * factorRatio,
                            borderColor: this.state.progressProgress
                                ? null
                                : colors.secondBackground,
                            backgroundColor: this.state.progressProgress
                                ? colors.pianoteRed
                                : colors.mainBackground,
                            borderRadius: 200
                            }
                        ]}
                        >
                        <Text
                            style={{
                            textAlign: 'center',
                            fontWeight: 'bold',
                            fontSize: 12 * factorRatio,
                            fontFamily: 'OpenSans-Regular',
                            color: this.state.progressProgress
                                ? 'white'
                                : colors.secondBackground
                            }}
                        >
                            IN PROGRESS
                        </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                        onPress={() => {
                            this.setState({
                            progressComplete: !this.state.progressComplete,
                            progressAll: false,
                            progressProgress: false
                            });
                        }}
                        style={[
                            styles.centerContent,
                            {
                            height: 30 * factorVertical,
                            width: fullWidth * 0.3,
                            marginRight: fullWidth * 0.01,
                            marginLeft: fullWidth * 0.01,
                            borderWidth: 0.5 * factorRatio,
                            borderColor: this.state.progressComplete
                                ? null
                                : colors.secondBackground,
                            backgroundColor: this.state.progressComplete
                                ? colors.pianoteRed
                                : colors.mainBackground,
                            borderRadius: 200
                            }
                        ]}
                        >
                        <Text
                            style={{
                            textAlign: 'center',
                            fontWeight: 'bold',
                            fontSize: 12 * factorRatio,
                            fontFamily: 'OpenSans-Regular',
                            color: this.state.progressComplete
                                ? 'white'
                                : colors.secondBackground
                            }}
                        >
                            COMPLETED
                        </Text>
                        </TouchableOpacity>
                        <View style={{ flex: 1 }} />
                    </View>
                    <View style={{ height: 40 * factorVertical }} />
                    </View>
                )}
                {this.state.onlyType && this.state.type !== 'SONGS' && (
                    <TouchableOpacity
                    key={'pianoInstructor'}
                    onPress={() => {
                        this.setState({
                        openInstructors: !this.state.openInstructors
                        });
                    }}
                    style={{
                        height: fullHeight * 0.1,
                        flexDirection: 'row',
                        paddingLeft: fullWidth * 0.035,
                        paddingRight: fullWidth * 0.035,
                        borderTopColor: colors.secondBackground,
                        borderBottomColor: colors.secondBackground,
                        borderBottomWidth: this.state.openInstructors
                        ? 0
                        : 0.5 * factorRatio
                    }}
                    >
                    <View>
                        <View style={{ flex: 1 }} />
                        <Text
                        style={{
                            fontSize: 18 * factorRatio,
                            marginBottom: 5 * factorVertical,
                            textAlign: 'left',
                            fontFamily: 'RobotoCondensed-Bold',
                            color: colors.secondBackground
                        }}
                        >
                        CHOOSE YOUR INSTRUCTOR
                        </Text>
                        <View style={{ flex: 1 }} />
                    </View>
                    <View style={{ flex: 1 }} />
                    <View>
                        <View style={{ flex: 1 }} />
                        <View
                        style={{
                            paddingLeft: 10 * factorRatio,
                            paddingRight: 10 * factorRatio
                        }}
                        >
                        <EntypoIcon
                            name={
                            this.state.openInstructors
                                ? 'chevron-thin-up'
                                : 'chevron-thin-down'
                            }
                            size={25 * factorRatio}
                            color={colors.secondBackground}
                        />
                        </View>
                        <View style={{ flex: 1 }} />
                    </View>
                    </TouchableOpacity>
                )}
                {this.state.openInstructors &&
                    this.state.onlyType &&
                    this.state.type !== 'SONGS' && (
                    <View
                        key={'instructors'}
                        style={{
                        borderBottomColor: colors.secondBackground,
                        borderBottomWidth: 0.5 * factorRatio
                        }}
                    >
                        <ScrollView>
                            {this.state.filtersAvailable.instructor.map((data, index) => {
                            console.log(typeof this.state.filtersAvailable.instructor[index]?.id)
                            if(index % 4 == 0) {
                                return (
                                    <View
                                        key={'topRow'}
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-around',
                                            alignContent: 'space-around',
                                            alignSelf: 'stretch',
                                            marginBottom: 20*factorVertical,
                                        }}
                                    >
                                        
                                        {(typeof this.state.filtersAvailable.instructor[index]?.id == 'number') && (
                                        <View
                                            key={'circle7'}
                                            style={{
                                            width: 70 * factorRatio
                                            }}
                                        >
                                            <TouchableOpacity
                                            onPress={() =>
                                                this.setState({
                                                kenny: !this.state.kenny,
                                                lisa: false,
                                                cassi: false,
                                                jay: false,
                                                jordan: false,
                                                jonny: false,
                                                brett: false,
                                                nate: false
                                                })
                                            }
                                            style={{
                                                borderWidth: this.state.kenny
                                                ? 2 * factorRatio
                                                : 0 * factorRatio,
                                                borderColor: this.state.kenny ? '#fb1b2f' : 'black',
                                                height: 70 * factorRatio,
                                                width: 70 * factorRatio,
                                                borderRadius: 300,
                                                backgroundColor: 'white'
                                            }}
                                            >
                                            <FastImage
                                                style={{
                                                flex: 1,
                                                borderRadius: 100
                                                }}
                                                //source={{uri: }}
                                                resizeMode={FastImage.resizeMode.stretch}
                                            />
                                            </TouchableOpacity>
                                            <Text
                                            style={{
                                                fontFamily: 'OpenSans-Regular',
                                                marginTop: 5 * factorRatio,
                                                fontSize: 11 * factorRatio,
                                                textAlign: 'center',
                                                fontWeight: 'bold',
                                                color: this.state.kenny
                                                ? 'white'
                                                : colors.secondBackground
                                            }}
                                            >
                                            {this.state.filtersAvailable.instructor[index].fields.find(f => f.key === 'name').value}
                                            </Text>
                                        </View>
                                        )}
                                        {(typeof this.state.filtersAvailable.instructor[index]?.id !== 'number') && (
                                        <View style={{width: 70 * factorRatio}}/>
                                        )}
                                        {(typeof this.state.filtersAvailable.instructor[index+1]?.id == 'number') && (
                                        <View
                                            key={'circle1'}
                                            style={{
                                            width: 70 * factorRatio
                                            }}
                                        >
                                            <TouchableOpacity
                                            onPress={() =>
                                                this.setState({
                                                lisa: !this.state.lisa,
                                                kenny: false,
                                                cassi: false,
                                                jay: false,
                                                jordan: false,
                                                jonny: false,
                                                brett: false,
                                                nate: false
                                                })
                                            }
                                            style={{
                                                borderWidth: this.state.lisa
                                                ? 2 * factorRatio
                                                : 0 * factorRatio,
                                                borderColor: this.state.lisa ? '#fb1b2f' : 'black',
                                                height: 70 * factorRatio,
                                                width: 70 * factorRatio,
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
                                                source={require('Pianote2/src/assets/img/imgs/lisa-witt.jpg')}
                                                resizeMode={FastImage.resizeMode.stretch}
                                            />
                                            </TouchableOpacity>
                                            <Text
                                            style={{
                                                fontFamily: 'OpenSans-Regular',
                                                marginTop: 5 * factorRatio,
                                                fontSize: 10 * factorRatio,
                                                textAlign: 'center',
                                                fontWeight: 'bold',
                                                color: this.state.lisa
                                                ? 'white'
                                                : colors.secondBackground
                                            }}
                                            >
                                            {this.state.filtersAvailable.instructor[index+1].fields.find(f => f.key === 'name').value}
                                            </Text>
                                        </View>
                                        )}
                                        {(typeof this.state.filtersAvailable.instructor[index+1]?.id !== 'number') && (
                                        <View style={{width: 70 * factorRatio}}/>
                                        )}
                                        {(typeof this.state.filtersAvailable.instructor[index+2]?.id == 'number') && (
                                        <View
                                            key={'circle2'}
                                            style={{
                                            width: 70 * factorRatio
                                            }}
                                        >
                                            <TouchableOpacity
                                            onPress={() =>
                                                this.setState({
                                                cassi: !this.state.cassi,
                                                kenny: false,
                                                lisa: false,
                                                jay: false,
                                                jordan: false,
                                                jonny: false,
                                                brett: false,
                                                nate: false
                                                })
                                            }
                                            style={{
                                                borderWidth: this.state.cassi
                                                ? 2 * factorRatio
                                                : 0 * factorRatio,
                                                borderColor: this.state.cassi ? '#fb1b2f' : 'black',
                                                height: 70 * factorRatio,
                                                width: 70 * factorRatio,
                                                borderRadius: 300,
                                                backgroundColor: 'white'
                                            }}
                                            >
                                            <FastImage
                                                style={{
                                                flex: 1,
                                                borderRadius: 100
                                                }}
                                                source={require('Pianote2/src/assets/img/imgs/cassi-falk.jpg')}
                                                resizeMode={FastImage.resizeMode.stretch}
                                            />
                                            </TouchableOpacity>
                                            <Text
                                            style={{
                                                fontFamily: 'OpenSans-Regular',
                                                marginTop: 5 * factorRatio,
                                                fontSize: 10 * factorRatio,
                                                textAlign: 'center',
                                                fontWeight: 'bold',
                                                color: this.state.cassi
                                                ? 'white'
                                                : colors.secondBackground
                                            }}
                                            >
                                            {this.state.filtersAvailable.instructor[index+2].fields.find(f => f.key === 'name').value}
                                            </Text>
                                        </View>
                                        )}
                                        {(typeof this.state.filtersAvailable.instructor[index+2]?.id !== 'number') && (
                                        <View style={{width: 70 * factorRatio}}/>
                                        )}
                                        {(typeof this.state.filtersAvailable.instructor[index+3]?.id == 'number') && (
                                        <View
                                            key={'circle3'}
                                            style={{
                                            width: 70 * factorRatio
                                            }}
                                        >
                                            <TouchableOpacity
                                            onPress={() =>
                                                this.setState({
                                                jordan: !this.state.jordan,
                                                kenny: false,
                                                lisa: false,
                                                cassi: false,
                                                jay: false,
                                                jonny: false,
                                                brett: false,
                                                nate: false
                                                })
                                            }
                                            style={{
                                                borderWidth: this.state.jordan
                                                ? 2 * factorRatio
                                                : 0 * factorRatio,
                                                borderColor: this.state.jordan
                                                ? '#fb1b2f'
                                                : 'black',
                                                height: 70 * factorRatio,
                                                width: 70 * factorRatio,
                                                borderRadius: 300,
                                                backgroundColor: 'white'
                                            }}
                                            >
                                            <FastImage
                                                style={{
                                                flex: 1,
                                                borderRadius: 100
                                                }}
                                                source={require('Pianote2/src/assets/img/imgs/jordan-leibel.jpg')}
                                                resizeMode={FastImage.resizeMode.stretch}
                                            />
                                            </TouchableOpacity>
                                            <Text
                                            style={{
                                                fontFamily: 'OpenSans-Regular',
                                                marginTop: 5 * factorRatio,
                                                fontSize: 10 * factorRatio,
                                                textAlign: 'center',
                                                fontWeight: 'bold',
                                                color: this.state.jordan
                                                ? 'white'
                                                : colors.secondBackground
                                            }}
                                            >
                                            {this.state.filtersAvailable.instructor[index+3].fields.find(f => f.key === 'name').value}
                                            </Text>
                                        </View>
                                        )}
                                        {(typeof this.state.filtersAvailable.instructor[index+3]?.id !== 'number') && (
                                        <View style={{width: 70 * factorRatio}}/>
                                        )}
                                    </View>
                                )
                            }
                        })}
                        </ScrollView>
                   
                    </View>
                    )}
                <View style={{ height: 50 * factorVertical }} />
                </ScrollView>
            )}
            </View>
            <View
            key={'doneApply'}
            style={{
                posistion: 'absolute',
                bottom: 0,
                height: isNotch
                ? fullHeight * 0.035 + 75 * factorVertical
                : 75 * factorVertical,
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
                <View style={styles.centerContent}>
                <TouchableOpacity
                    onPress={() => this.props.hideFilters()}
                    style={[
                    styles.centerContent,
                    {
                        height: fullHeight * 0.05,
                        width: fullWidth * 0.46,
                        backgroundColor: colors.pianoteRed,
                        borderRadius: 200
                    }
                    ]}
                >
                    <Text
                    style={{
                        color: 'white',
                        fontFamily: 'RobotoCondensed-Bold',
                        fontSize: 14 * factorRatio
                    }}
                    >
                    DONE & APPLY
                    </Text>
                </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }} />
                <View style={styles.centerContent}>
                <TouchableOpacity
                    onPress={() => this.reset()}
                    style={[
                    styles.centerContent,
                    {
                        height: fullHeight * 0.05,
                        width: fullWidth * 0.46,
                        borderColor: 'white',
                        borderWidth: 1 * factorRatio,
                        borderRadius: 200
                    }
                    ]}
                >
                    <Text
                    style={{
                        color: 'white',
                        fontFamily: 'RobotoCondensed-Bold',
                        fontSize: 14 * factorRatio
                    }}
                    >
                    RESET
                    </Text>
                </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }} />
            </View>
            <View style={{ height: isNotch ? fullHeight * 0.035 : 0 }} />
            </View>
        </View>
        </View>
    );
  }
}
