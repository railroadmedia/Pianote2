/**
 * Filters
 */
import React from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

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
        ['edutainment', false, 'topic,edutainment'],
    ],
    COURSES: [
        ['Boogie Woogie', false, 'topic,Boogie+Woogie'],
        ['Gospel', false, 'topic,Gospel'],
        ['Improvisation', false, 'topic,Improvisation'],
        ['Jazz', false, 'topic,Jazz'],
        ['Latin Jazz', false, 'topic,Latin+Jazz'],
        ['Rhythm', false, 'topic,Rhythm'],
        ['Songwriting', false, 'topic,Songwriting'],
        ['Technique', false, 'topic,Technique'],
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
        ['pop', false, 'style,pop'],
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
        ['Yiruma', false, 'artist,Yiruma'],
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
        ['edutainment', false, 'topic,edutainment'],
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
        ['Pack Bundle Lesson', false, 'pack-bundle-lesson'],
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
        ['Pack Bundle Lesson', false, 'pack-bundle-lesson'],
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
        ['Pack Bundle Lesson', false, 'pack-bundle-lesson'],
    ],
};

const levelDict = {
    LESSONS: 5,
    COURSES: 6,
    SONGS: 7,
    STUDENTFOCUSSHOW: 5,
};

const titleDict = {
    LESSONS: 'Lessons',
    COURSES: 'Courses',
    SONGS: 'Songs',
    STUDENTFOCUSSHOW: 'Quick Tips',
    SEARCH: 'Search',
    MYLIST: 'My List',
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
    'All': 'This will display all piano lessons regardless of their difficulty.',

}

export default class Filters extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.focusListner = this.props.navigation.addListener(
            'didFocus',
            () => {
                this.setState({loading: true});
                this.updateFilters();
                this.setState({loading: false});
            },
        );
        this.state = {
            type: this.props.navigation.state.params.type,
            level:
                this.props.navigation.state.params.filters.level.length > 1
                    ? this.props.navigation.state.params.filters.level[0]
                    : null,
            allLevels:
                this.props.navigation.state.params.filters.level.length > 1
                    ? false
                    : true,
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
            onlyType:
                this.props.navigation.state.params.type == 'MYLIST' ||
                this.props.navigation.state.params.type == 'SEARCH' ||
                this.props.navigation.state.params.type == 'SEEALL'
                    ? false
                    : true,
        };
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
                (await topics.indexOf(
                    filterDict[this.props.navigation.state.params.type][i][0],
                )) !== -1
            ) {
                filterDict[this.props.navigation.state.params.type][
                    i
                ][1] = true;
            }
        }

        // currently selected level
        if (filters.level.length > 1) {
            level = filters.level[0];
            allLevels = false;
        }

        // currently selected progress
        if (filters.progress.length > 0) {
            if ((await filters.progress.indexOf('all')) !== -1) {
                progressAll = true;
                openProgress = true;
            }

            if ((await filters.progress.indexOf('started')) !== -1) {
                progressProgress = true;
                openProgress = true;
            }

            if ((await filters.progress.indexOf('completed')) !== -1) {
                progressComplete = true;
                openProgress = true;
            }
        }

        // currently selected instructors
        if (filters.instructors.length > 0) {
            if ((await filters.instructors.indexOf('NATE')) !== -1) {
                nate = true;
                openInstructors = true;
            }
            if ((await filters.instructors.indexOf('JONNY')) !== -1) {
                jonny = true;
                openInstructors = true;
            }
            if ((await filters.instructors.indexOf(197077)) !== -1) {
                brett = true;
                openInstructors = true;
            }
            if ((await filters.instructors.indexOf(196994)) !== -1) {
                jordan = true;
                openInstructors = true;
            }
            if ((await filters.instructors.indexOf(202588)) !== -1) {
                jay = true;
                openInstructors = true;
            }
            if ((await filters.instructors.indexOf(197087)) !== -1) {
                cassi = true;
                openInstructors = true;
            }
            if ((await filters.instructors.indexOf(196999)) !== -1) {
                lisa = true;
                openInstructors = true;
            }
            if ((await filters.instructors.indexOf(203416)) !== -1) {
                kenny = true;
                openInstructors = true;
            }
        }

        await this.setState({
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
            nate,
        });
    };

    componentWillUnmount = async () => {
        this.focusListner.remove();
        this.setState({loading: true});
    };

    clickFilter = async num => {
        if (
            filterDict[this.props.navigation.state.params.type][num][1] == false
        ) {
            filterDict[this.props.navigation.state.params.type][num][1] = true;
            let topics = this.state.topics;
            let displayTopics = this.state.displayTopics;
            await topics.push(
                filterDict[this.props.navigation.state.params.type][num][2],
            );
            await displayTopics.push(
                filterDict[this.props.navigation.state.params.type][num][0],
            );
            await this.setState({topics, displayTopics});
        } else {
            filterDict[this.props.navigation.state.params.type][num][1] = false;
            let topics = this.state.topics;
            let displayTopics = this.state.displayTopics;
            await topics.splice(
                topics.indexOf(
                    filterDict[this.props.navigation.state.params.type][num][2],
                ),
                1,
            );
            await displayTopics.splice(
                topics.indexOf(
                    filterDict[this.props.navigation.state.params.type][num][0],
                ),
                1,
            );
            await this.setState({topics, displayTopics});
        }
    };

    clickFilterArtist = async num => {
        if (filterDict['ARTISTS'][num][1] == false) {
            filterDict['ARTISTS'][num][1] = true;
            let topics = this.state.topics;
            let displayTopics = this.state.displayTopics;
            await topics.push(filterDict['ARTISTS'][num][2]);
            await displayTopics.push(filterDict['ARTISTS'][num][0]);
            await this.setState({topics, displayTopics});
        } else {
            filterDict['ARTISTS'][num][1] = false;
            let topics = this.state.topics;
            let displayTopics = this.state.displayTopics;
            await topics.splice(
                topics.indexOf(filterDict['ARTISTS'][num][2]),
                1,
            );
            await displayTopics.splice(
                topics.indexOf(filterDict['ARTISTS'][num][0]),
                1,
            );
            await this.setState({topics, displayTopics});
        }
    };

    reset = async () => {
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
                ['edutainment', false, 'topic,edutainment'],
            ],
            COURSES: [
                ['Boogie Woogie', false, 'topic,Boogie+Woogie'],
                ['Gospel', false, 'topic,Gospel'],
                ['Improvisation', false, 'topic,Improvisation'],
                ['Jazz', false, 'topic,Jazz'],
                ['Latin Jazz', false, 'topic,Latin+Jazz'],
                ['Rhythm', false, 'topic,Rhythm'],
                ['Songwriting', false, 'topic,Songwriting'],
                ['Technique', false, 'topic,Technique'],
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
                ['pop', false, 'style,pop'],
            ],
            ARTISTS: [
                ['Adele', false, 'artist,Adele'],
                [
                    'Adolphe Adam',
                    false,
                    'artist,Adolphe+Adam+%26+Placide+Cappeau',
                ],
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
                [
                    'Franz Gruber',
                    false,
                    'artist,Franz+Xaver+Gruber,+Joseph+Mohr',
                ],
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
                ['Yiruma', false, 'artist,Yiruma'],
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
                ['edutainment', false, 'topic,edutainment'],
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
                ['Pack Bundle Lesson', false, 'pack-bundle-lesson'],
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
                ['Pack Bundle Lesson', false, 'pack-bundle-lesson'],
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
                ['Pack Bundle Lesson', false, 'pack-bundle-lesson'],
            ],
        };
        await this.setState({
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
            allLevels: true,
        });
    };

    goBack = async () => {
        var progress = [];
        if (this.state.progressAll) {
            await progress.push('all');
        }
        if (this.state.progressProgress) {
            await progress.push('started');
        }
        if (this.state.progressComplete) {
            await progress.push('completed');
        }

        var instructors = [];
        if (this.state.kenny) {
            await instructors.push(203416);
        }
        if (this.state.lisa) {
            await instructors.push(196999);
        }
        if (this.state.cassi) {
            await instructors.push(197087);
        }
        if (this.state.jay) {
            await instructors.push(202588);
        }
        if (this.state.jordan) {
            await instructors.push(196994);
        }
        if (this.state.brett) {
            await instructors.push(197077);
        }
        if (this.state.nate) {
            await instructors.push('NATE');
        }
        if (this.state.jonny) {
            await instructors.push('JONNY');
        }

        var level = [];
        if (!this.state.allLevels) {
            await level.push(this.state.level);
            if (this.state.level < 4) {
                await level.push('BEGINNER');
            } else if (this.state.level < 6) {
                await level.push('INTERMEDIATE');
            } else {
                await level.push('ADVANCED');
            }
        }

        await this.props.navigation.state.params.onGoBack({
            displayTopics: this.state.displayTopics,
            topics: this.state.topics,
            instructors: instructors,
            progress: progress,
            level: level,
        });
        await this.props.navigation.goBack();
    };

    render() {
        return (
            <View
                style={{
                    height: fullHeight - navHeight,
                    alignSelf: 'stretch',
                    backgroundColor: colors.mainBackground,
                }}
            >
                <View key={'contentContainer'} style={{flex: 1}}>
                    <View
                        style={[
                            styles.centerContent,
                            {
                                height:
                                    Platform.OS == 'android'
                                        ? fullHeight * 0.1
                                        : isNotch
                                        ? fullHeight * 0.12
                                        : fullHeight * 0.1,
                                backgroundColor: colors.thirdBackground,
                            },
                        ]}
                    >
                        <View style={{flex: 1}} />
                        <View
                            style={[
                                styles.centerContent,
                                {
                                    flexDirection: 'row',
                                    backgroundColor: colors.thirdBackground,
                                },
                            ]}
                        >
                            <View style={{flex: 1, flexDirection: 'row'}}>
                                <View style={{flex: 0.1}} />
                                <View>
                                    <View style={{flex: 1}} />
                                    <TouchableOpacity
                                        onPress={() =>
                                            this.props.navigation.goBack()
                                        }
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
                                    <View style={{flex: 1}} />
                                </View>
                            </View>
                            <Text
                                style={{
                                    fontSize: 22 * factorRatio,
                                    color: 'white',
                                    fontFamily: 'OpenSans-Bold',
                                }}
                            >
                                Filter{' '}
                                {
                                    titleDict[
                                        this.props.navigation.state.params.type
                                    ]
                                }
                            </Text>
                            <View style={{flex: 1}} />
                        </View>
                        <View style={{height: 20 * factorVertical}} />
                    </View>
                    {!this.state.loading && (
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentInsetAdjustmentBehavior={'never'}
                            style={{
                                flex: 0.9,
                                backgroundColor: colors.mainBackground,
                            }}
                        >
                            <View style={{height: 30 * factorVertical}} />
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
                                            paddingLeft: fullWidth * 0.035,
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
                                            },
                                        ]}
                                    >
                                        <MultiSlider
                                            min={1}
                                            max={
                                                levelDict[
                                                    this.props.navigation.state
                                                        .params.type
                                                ]
                                            }
                                            step={1}
                                            snapped={true}
                                            values={[
                                                this.state.allLevels
                                                    ? levelDict[
                                                          this.props.navigation
                                                              .state.params.type
                                                      ]
                                                    : this.state.level,
                                            ]}
                                            onValuesChangeFinish={e => {
                                                this.setState({
                                                    level: e[0],
                                                    allLevels: false,
                                                });
                                            }}
                                            sliderLength={fullWidth * 0.9}
                                            trackStyle={{
                                                height: 5 * factorHorizontal,
                                                backgroundColor:
                                                    colors.secondBackground,
                                            }}
                                            selectedStyle={{
                                                backgroundColor:
                                                    colors.pianoteRed,
                                                height: 5 * factorHorizontal,
                                            }}
                                            markerStyle={{
                                                height: 17.5 * factorRatio,
                                                width: 17.5 * factorRatio,
                                                borderRadius: 40,
                                                backgroundColor:
                                                    colors.pianoteRed,
                                                borderColor: colors.pianoteRed,
                                            }}
                                        />
                                    </View>
                                    <View style={{height: 10 * factorRatio}} />
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            fontSize: 24 * factorRatio,
                                            fontFamily: 'OpenSans-Bold',
                                            color: 'white',
                                        }}
                                    >
                                        {this.state.allLevels
                                            ? 'ALL LEVELS'
                                            : 'LEVEL ' + this.state.level}
                                    </Text>
                                    <View style={{height: 10 * factorRatio}} />
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            fontSize: 14 * factorRatio,
                                            fontFamily: 'OpenSans-Regular',
                                            color: 'white',
                                            paddingLeft: fullWidth * 0.1,
                                            paddingRight: fullWidth * 0.1,
                                        }}
                                    >
                                        {(this.state.level ==  null || this.state.allLevels) ? messageDict['All'] : messageDict[this.state.level]}
                                    </Text>
                                    <View style={{height: 10 * factorRatio}} />
                                    <View
                                        key={'allLevels'}
                                        style={{
                                            minHeight: 70 * factorVertical,
                                            borderBottomWidth:
                                                0.5 * factorRatio,
                                            borderBottomColor:
                                                colors.secondBackground,
                                        }}
                                    >
                                        <View
                                            style={{height: 10 * factorRatio}}
                                        />
                                        <View
                                            style={{
                                                height: 30 * factorVertical,
                                                justifyContent: 'space-around',
                                                alignContent: 'space-around',
                                                flexDirection: 'row',
                                            }}
                                        >
                                            <View style={{flex: 1}} />
                                            <TouchableOpacity
                                                onPress={() => {
                                                    this.setState({
                                                        allLevels: !this.state
                                                            .allLevels,
                                                        level:
                                                            levelDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ],
                                                    });
                                                }}
                                                style={[
                                                    styles.centerContent,
                                                    {
                                                        height:
                                                            30 * factorVertical,
                                                        width: fullWidth * 0.3,
                                                        marginRight:
                                                            fullWidth * 0.01,
                                                        marginLeft:
                                                            fullWidth * 0.01,
                                                        borderWidth:
                                                            0.5 * factorRatio,
                                                        borderColor: this.state
                                                            .allLevels
                                                            ? 'transparent'
                                                            : colors.secondBackground,
                                                        backgroundColor: this
                                                            .state.allLevels
                                                            ? 'red'
                                                            : 'transparent',
                                                        borderRadius: 200,
                                                    },
                                                ]}
                                            >
                                                <Text
                                                    style={{
                                                        textAlign: 'center',
                                                        fontSize:
                                                            12 * factorRatio,
                                                        fontFamily: 'OpenSans-ExtraBold',
                                                        color: this.state
                                                            .allLevels
                                                            ? 'white'
                                                            : colors.secondBackground,
                                                    }}
                                                >
                                                    ALL
                                                </Text>
                                            </TouchableOpacity>
                                            <View style={{flex: 1}} />
                                        </View>
                                        <View
                                            style={{height: 40 * factorRatio}}
                                        />
                                    </View>
                                    <View
                                        style={{height: 30 * factorVertical}}
                                    />
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
                                        paddingLeft: fullWidth * 0.035,
                                    }}
                                >
                                    {this.state.onlyType
                                        ? 'WHAT DO YOU WANT TO WORK ON?'
                                        : 'CHOOSE A CONTENT TYPE'}
                                </Text>
                                <View
                                    style={{
                                        minHeight: 70 * factorVertical,
                                    }}
                                >
                                    <ScrollView
                                        style={{
                                            height: this.state.onlyType
                                                ? 40 * factorRatio +
                                                  90 * factorVertical
                                                : 350 * factorVertical,
                                        }}
                                    >
                                        <View
                                            style={{height: 20 * factorRatio}}
                                        />
                                        <View
                                            style={{
                                                height: 30 * factorVertical,
                                                justifyContent: 'space-around',
                                                alignContent: 'space-around',
                                                flexDirection: 'row',
                                            }}
                                        >
                                            <View style={{flex: 1}} />
                                            {typeof filterDict[
                                                this.props.navigation.state
                                                    .params.type
                                            ][0] !== 'undefined' && (
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        this.clickFilter(0)
                                                    }
                                                    style={[
                                                        styles.centerContent,
                                                        {
                                                            height:
                                                                30 *
                                                                factorVertical,
                                                            width:
                                                                fullWidth * 0.3,
                                                            marginRight:
                                                                fullWidth *
                                                                0.01,
                                                            marginLeft:
                                                                fullWidth *
                                                                0.01,
                                                            borderWidth:
                                                                0.5 *
                                                                factorRatio,
                                                            borderColor: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][0][1]
                                                                ? 'transparent'
                                                                : colors.secondBackground,
                                                            backgroundColor: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][0][1]
                                                                ? 'red'
                                                                : 'transparent',
                                                            borderRadius: 200,
                                                        },
                                                    ]}
                                                >
                                                    <Text
                                                        style={{
                                                            textAlign: 'center',
                                                            fontWeight: 'bold',
                                                            fontSize:
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params
                                                                    .type ==
                                                                'SONGS'
                                                                    ? 9.5 *
                                                                      factorRatio
                                                                    : 12 *
                                                                      factorRatio,
                                                            fontFamily:
                                                                'OpenSans-Regular',
                                                            color: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][0][1]
                                                                ? 'white'
                                                                : colors.secondBackground,
                                                        }}
                                                    >
                                                        {
                                                            filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][0][0]
                                                        }
                                                    </Text>
                                                </TouchableOpacity>
                                            )}
                                            {typeof filterDict[
                                                this.props.navigation.state
                                                    .params.type
                                            ][1] !== 'undefined' && (
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        this.clickFilter(1)
                                                    }
                                                    style={[
                                                        styles.centerContent,
                                                        {
                                                            height:
                                                                30 *
                                                                factorVertical,
                                                            width:
                                                                fullWidth * 0.3,
                                                            marginRight:
                                                                fullWidth *
                                                                0.01,
                                                            marginLeft:
                                                                fullWidth *
                                                                0.01,
                                                            borderWidth:
                                                                0.5 *
                                                                factorRatio,
                                                            borderColor: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][1][1]
                                                                ? 'transparent'
                                                                : colors.secondBackground,
                                                            backgroundColor: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][1][1]
                                                                ? 'red'
                                                                : 'transparent',
                                                            borderRadius: 200,
                                                        },
                                                    ]}
                                                >
                                                    <Text
                                                        style={{
                                                            textAlign: 'center',
                                                            fontWeight: 'bold',
                                                            fontSize:
                                                                12 *
                                                                factorRatio,
                                                            fontFamily:
                                                                'OpenSans-Regular',
                                                            color: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][1][1]
                                                                ? 'white'
                                                                : colors.secondBackground,
                                                        }}
                                                    >
                                                        {
                                                            filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][1][0]
                                                        }
                                                    </Text>
                                                </TouchableOpacity>
                                            )}
                                            {typeof filterDict[
                                                this.props.navigation.state
                                                    .params.type
                                            ][2] !== 'undefined' && (
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        this.clickFilter(2)
                                                    }
                                                    style={[
                                                        styles.centerContent,
                                                        {
                                                            height:
                                                                30 *
                                                                factorVertical,
                                                            width:
                                                                fullWidth * 0.3,
                                                            marginRight:
                                                                fullWidth *
                                                                0.01,
                                                            marginLeft:
                                                                fullWidth *
                                                                0.01,
                                                            borderWidth:
                                                                0.5 *
                                                                factorRatio,
                                                            borderColor: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][2][1]
                                                                ? 'transparent'
                                                                : colors.secondBackground,
                                                            backgroundColor: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][2][1]
                                                                ? 'red'
                                                                : 'transparent',
                                                            borderRadius: 200,
                                                        },
                                                    ]}
                                                >
                                                    <Text
                                                        style={{
                                                            textAlign: 'center',
                                                            fontWeight: 'bold',
                                                            fontSize:
                                                                12 *
                                                                factorRatio,
                                                            fontFamily:
                                                                'OpenSans-Regular',
                                                            color: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][2][1]
                                                                ? 'white'
                                                                : colors.secondBackground,
                                                        }}
                                                    >
                                                        {
                                                            filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][2][0]
                                                        }
                                                    </Text>
                                                </TouchableOpacity>
                                            )}
                                            <View style={{flex: 1}} />
                                        </View>
                                        <View
                                            style={{height: 10 * factorRatio}}
                                        />
                                        <View
                                            style={{
                                                height: 30 * factorVertical,
                                                justifyContent: 'space-around',
                                                alignContent: 'space-around',
                                                flexDirection: 'row',
                                            }}
                                        >
                                            <View style={{flex: 1}} />
                                            {typeof filterDict[
                                                this.props.navigation.state
                                                    .params.type
                                            ][3] !== 'undefined' && (
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        this.clickFilter(3)
                                                    }
                                                    style={[
                                                        styles.centerContent,
                                                        {
                                                            height:
                                                                30 *
                                                                factorVertical,
                                                            width:
                                                                fullWidth * 0.3,
                                                            marginRight:
                                                                fullWidth *
                                                                0.01,
                                                            marginLeft:
                                                                fullWidth *
                                                                0.01,
                                                            borderWidth:
                                                                0.5 *
                                                                factorRatio,
                                                            borderColor: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][3][1]
                                                                ? 'transparent'
                                                                : colors.secondBackground,
                                                            backgroundColor: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][3][1]
                                                                ? 'red'
                                                                : 'transparent',
                                                            borderRadius: 200,
                                                        },
                                                    ]}
                                                >
                                                    <Text
                                                        style={{
                                                            textAlign: 'center',
                                                            fontWeight: 'bold',
                                                            fontSize:
                                                                12 *
                                                                factorRatio,
                                                            fontFamily:
                                                                'OpenSans-Regular',
                                                            color: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][3][1]
                                                                ? 'white'
                                                                : colors.secondBackground,
                                                        }}
                                                    >
                                                        {
                                                            filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][3][0]
                                                        }
                                                    </Text>
                                                </TouchableOpacity>
                                            )}
                                            {typeof filterDict[
                                                this.props.navigation.state
                                                    .params.type
                                            ][4] !== 'undefined' && (
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        this.clickFilter(4)
                                                    }
                                                    style={[
                                                        styles.centerContent,
                                                        {
                                                            height:
                                                                30 *
                                                                factorVertical,
                                                            width:
                                                                fullWidth * 0.3,
                                                            marginRight:
                                                                fullWidth *
                                                                0.01,
                                                            marginLeft:
                                                                fullWidth *
                                                                0.01,
                                                            borderWidth:
                                                                0.5 *
                                                                factorRatio,
                                                            borderColor: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][4][1]
                                                                ? 'transparent'
                                                                : colors.secondBackground,
                                                            backgroundColor: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][4][1]
                                                                ? 'red'
                                                                : 'transparent',
                                                            borderRadius: 200,
                                                        },
                                                    ]}
                                                >
                                                    <Text
                                                        style={{
                                                            textAlign: 'center',
                                                            fontWeight: 'bold',
                                                            fontSize:
                                                                12 *
                                                                factorRatio,
                                                            fontFamily:
                                                                'OpenSans-Regular',
                                                            color: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][4][1]
                                                                ? 'white'
                                                                : colors.secondBackground,
                                                        }}
                                                    >
                                                        {
                                                            filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][4][0]
                                                        }
                                                    </Text>
                                                </TouchableOpacity>
                                            )}
                                            {typeof filterDict[
                                                this.props.navigation.state
                                                    .params.type
                                            ][5] !== 'undefined' && (
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        this.clickFilter(5)
                                                    }
                                                    style={[
                                                        styles.centerContent,
                                                        {
                                                            height:
                                                                30 *
                                                                factorVertical,
                                                            width:
                                                                fullWidth * 0.3,
                                                            marginRight:
                                                                fullWidth *
                                                                0.01,
                                                            marginLeft:
                                                                fullWidth *
                                                                0.01,
                                                            borderWidth:
                                                                0.5 *
                                                                factorRatio,
                                                            borderColor: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][5][1]
                                                                ? 'transparent'
                                                                : colors.secondBackground,
                                                            backgroundColor: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][5][1]
                                                                ? 'red'
                                                                : 'transparent',
                                                            borderRadius: 200,
                                                        },
                                                    ]}
                                                >
                                                    <Text
                                                        style={{
                                                            textAlign: 'center',
                                                            fontWeight: 'bold',
                                                            fontSize:
                                                                12 *
                                                                factorRatio,
                                                            fontFamily:
                                                                'OpenSans-Regular',
                                                            color: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][5][1]
                                                                ? 'white'
                                                                : colors.secondBackground,
                                                        }}
                                                    >
                                                        {
                                                            filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][5][0]
                                                        }
                                                    </Text>
                                                </TouchableOpacity>
                                            )}
                                            <View style={{flex: 1}} />
                                        </View>
                                        <View
                                            style={{height: 10 * factorRatio}}
                                        />
                                        <View
                                            style={{
                                                height: 30 * factorVertical,
                                                justifyContent: 'space-around',
                                                alignContent: 'space-around',
                                                flexDirection: 'row',
                                            }}
                                        >
                                            <View style={{flex: 1}} />
                                            {typeof filterDict[
                                                this.props.navigation.state
                                                    .params.type
                                            ][6] !== 'undefined' && (
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        this.clickFilter(6)
                                                    }
                                                    style={[
                                                        styles.centerContent,
                                                        {
                                                            height:
                                                                30 *
                                                                factorVertical,
                                                            width:
                                                                fullWidth * 0.3,
                                                            marginRight:
                                                                fullWidth *
                                                                0.01,
                                                            marginLeft:
                                                                fullWidth *
                                                                0.01,
                                                            borderWidth:
                                                                0.5 *
                                                                factorRatio,
                                                            borderColor: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][6][1]
                                                                ? 'transparent'
                                                                : colors.secondBackground,
                                                            backgroundColor: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][6][1]
                                                                ? 'red'
                                                                : 'transparent',
                                                            borderRadius: 200,
                                                        },
                                                    ]}
                                                >
                                                    <Text
                                                        style={{
                                                            textAlign: 'center',
                                                            fontWeight: 'bold',
                                                            fontSize:
                                                                12 *
                                                                factorRatio,
                                                            fontFamily:
                                                                'OpenSans-Regular',
                                                            color: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][6][1]
                                                                ? 'white'
                                                                : colors.secondBackground,
                                                        }}
                                                    >
                                                        {
                                                            filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][6][0]
                                                        }
                                                    </Text>
                                                </TouchableOpacity>
                                            )}
                                            {typeof filterDict[
                                                this.props.navigation.state
                                                    .params.type
                                            ][7] !== 'undefined' && (
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        this.clickFilter(7)
                                                    }
                                                    style={[
                                                        styles.centerContent,
                                                        {
                                                            height:
                                                                30 *
                                                                factorVertical,
                                                            width:
                                                                fullWidth * 0.3,
                                                            marginRight:
                                                                fullWidth *
                                                                0.01,
                                                            marginLeft:
                                                                fullWidth *
                                                                0.01,
                                                            borderWidth:
                                                                0.5 *
                                                                factorRatio,
                                                            borderColor: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][7][1]
                                                                ? 'transparent'
                                                                : colors.secondBackground,
                                                            backgroundColor: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][7][1]
                                                                ? 'red'
                                                                : 'transparent',
                                                            borderRadius: 200,
                                                        },
                                                    ]}
                                                >
                                                    <Text
                                                        style={{
                                                            textAlign: 'center',
                                                            fontWeight: 'bold',
                                                            fontSize:
                                                                12 *
                                                                factorRatio,
                                                            fontFamily:
                                                                'OpenSans-Regular',
                                                            color: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][7][1]
                                                                ? 'white'
                                                                : colors.secondBackground,
                                                        }}
                                                    >
                                                        {
                                                            filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][7][0]
                                                        }
                                                    </Text>
                                                </TouchableOpacity>
                                            )}
                                            {typeof filterDict[
                                                this.props.navigation.state
                                                    .params.type
                                            ][8] !== 'undefined' && (
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        this.clickFilter(8)
                                                    }
                                                    style={[
                                                        styles.centerContent,
                                                        {
                                                            height:
                                                                30 *
                                                                factorVertical,
                                                            width:
                                                                fullWidth * 0.3,
                                                            marginRight:
                                                                fullWidth *
                                                                0.01,
                                                            marginLeft:
                                                                fullWidth *
                                                                0.01,
                                                            borderWidth:
                                                                0.5 *
                                                                factorRatio,
                                                            borderColor: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][8][1]
                                                                ? 'transparent'
                                                                : colors.secondBackground,
                                                            backgroundColor: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][8][1]
                                                                ? 'red'
                                                                : 'transparent',
                                                            borderRadius: 200,
                                                        },
                                                    ]}
                                                >
                                                    <Text
                                                        style={{
                                                            textAlign: 'center',
                                                            fontWeight: 'bold',
                                                            fontSize:
                                                                12 *
                                                                factorRatio,
                                                            fontFamily:
                                                                'OpenSans-Regular',
                                                            color: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][8][1]
                                                                ? 'white'
                                                                : colors.secondBackground,
                                                        }}
                                                    >
                                                        {
                                                            filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][8][0]
                                                        }
                                                    </Text>
                                                </TouchableOpacity>
                                            )}
                                            <View style={{flex: 1}} />
                                        </View>
                                        <View
                                            style={{height: 10 * factorRatio}}
                                        />
                                        <View
                                            style={{
                                                height: 30 * factorVertical,
                                                justifyContent: 'space-around',
                                                alignContent: 'space-around',
                                                flexDirection: 'row',
                                            }}
                                        >
                                            <View style={{flex: 1}} />
                                            {typeof filterDict[
                                                this.props.navigation.state
                                                    .params.type
                                            ][9] !== 'undefined' && (
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        this.clickFilter(9)
                                                    }
                                                    style={[
                                                        styles.centerContent,
                                                        {
                                                            height:
                                                                30 *
                                                                factorVertical,
                                                            width:
                                                                fullWidth * 0.3,
                                                            marginRight:
                                                                fullWidth *
                                                                0.01,
                                                            marginLeft:
                                                                fullWidth *
                                                                0.01,
                                                            borderWidth:
                                                                0.5 *
                                                                factorRatio,
                                                            borderColor: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][9][1]
                                                                ? 'transparent'
                                                                : colors.secondBackground,
                                                            backgroundColor: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][9][1]
                                                                ? 'red'
                                                                : 'transparent',
                                                            borderRadius: 200,
                                                        },
                                                    ]}
                                                >
                                                    <Text
                                                        style={{
                                                            textAlign: 'center',
                                                            fontWeight: 'bold',
                                                            fontSize:
                                                                12 *
                                                                factorRatio,
                                                            fontFamily:
                                                                'OpenSans-Regular',
                                                            color: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][9][1]
                                                                ? 'white'
                                                                : colors.secondBackground,
                                                        }}
                                                    >
                                                        {
                                                            filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][9][0]
                                                        }
                                                    </Text>
                                                </TouchableOpacity>
                                            )}
                                            {typeof filterDict[
                                                this.props.navigation.state
                                                    .params.type
                                            ][10] !== 'undefined' && (
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        this.clickFilter(10)
                                                    }
                                                    style={[
                                                        styles.centerContent,
                                                        {
                                                            height:
                                                                30 *
                                                                factorVertical,
                                                            width:
                                                                fullWidth * 0.3,
                                                            marginRight:
                                                                fullWidth *
                                                                0.01,
                                                            marginLeft:
                                                                fullWidth *
                                                                0.01,
                                                            borderWidth:
                                                                0.5 *
                                                                factorRatio,
                                                            borderColor: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][10][1]
                                                                ? 'transparent'
                                                                : colors.secondBackground,
                                                            backgroundColor: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][10][1]
                                                                ? 'red'
                                                                : 'transparent',
                                                            borderRadius: 200,
                                                        },
                                                    ]}
                                                >
                                                    <Text
                                                        style={{
                                                            textAlign: 'center',
                                                            fontWeight: 'bold',
                                                            fontSize: this.state
                                                                .onlyType
                                                                ? 10 *
                                                                  factorRatio
                                                                : 12 *
                                                                  factorRatio,
                                                            fontFamily:
                                                                'OpenSans-Regular',
                                                            color: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][10][1]
                                                                ? 'white'
                                                                : colors.secondBackground,
                                                        }}
                                                    >
                                                        {
                                                            filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][10][0]
                                                        }
                                                    </Text>
                                                </TouchableOpacity>
                                            )}
                                            {typeof filterDict[
                                                this.props.navigation.state
                                                    .params.type
                                            ][11] !== 'undefined' && (
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        this.clickFilter(11)
                                                    }
                                                    style={[
                                                        styles.centerContent,
                                                        {
                                                            height:
                                                                30 *
                                                                factorVertical,
                                                            width:
                                                                fullWidth * 0.3,
                                                            marginRight:
                                                                fullWidth *
                                                                0.01,
                                                            marginLeft:
                                                                fullWidth *
                                                                0.01,
                                                            borderWidth:
                                                                0.5 *
                                                                factorRatio,
                                                            borderColor: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][11][1]
                                                                ? 'transparent'
                                                                : colors.secondBackground,
                                                            backgroundColor: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][11][1]
                                                                ? 'red'
                                                                : 'transparent',
                                                            borderRadius: 200,
                                                        },
                                                    ]}
                                                >
                                                    <Text
                                                        style={{
                                                            textAlign: 'center',
                                                            fontWeight: 'bold',
                                                            fontSize: this.state
                                                                .onlyType
                                                                ? 12 *
                                                                  factorRatio
                                                                : 10 *
                                                                  factorRatio,
                                                            fontFamily:
                                                                'OpenSans-Regular',
                                                            color: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][11][1]
                                                                ? 'white'
                                                                : colors.secondBackground,
                                                        }}
                                                    >
                                                        {
                                                            filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][11][0]
                                                        }
                                                    </Text>
                                                </TouchableOpacity>
                                            )}
                                            <View style={{flex: 1}} />
                                        </View>
                                        <View
                                            style={{height: 20 * factorRatio}}
                                        />
                                        <View
                                            style={{
                                                height: 30 * factorVertical,
                                                justifyContent: 'space-around',
                                                alignContent: 'space-around',
                                                flexDirection: 'row',
                                            }}
                                        >
                                            <View style={{flex: 1}} />
                                            {typeof filterDict[
                                                this.props.navigation.state
                                                    .params.type
                                            ][12] !== 'undefined' && (
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        this.clickFilter(12)
                                                    }
                                                    style={[
                                                        styles.centerContent,
                                                        {
                                                            height:
                                                                30 *
                                                                factorVertical,
                                                            width:
                                                                fullWidth * 0.3,
                                                            marginRight:
                                                                fullWidth *
                                                                0.01,
                                                            marginLeft:
                                                                fullWidth *
                                                                0.01,
                                                            borderWidth:
                                                                0.5 *
                                                                factorRatio,
                                                            borderColor: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][12][1]
                                                                ? 'transparent'
                                                                : colors.secondBackground,
                                                            backgroundColor: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][12][1]
                                                                ? 'red'
                                                                : 'transparent',
                                                            borderRadius: 200,
                                                        },
                                                    ]}
                                                >
                                                    <Text
                                                        style={{
                                                            textAlign: 'center',
                                                            fontWeight: 'bold',
                                                            fontSize:
                                                                12 *
                                                                factorRatio,
                                                            fontFamily:
                                                                'OpenSans-Regular',
                                                            color: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][12][1]
                                                                ? 'white'
                                                                : colors.secondBackground,
                                                        }}
                                                    >
                                                        {
                                                            filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][12][0]
                                                        }
                                                    </Text>
                                                </TouchableOpacity>
                                            )}
                                            {typeof filterDict[
                                                this.props.navigation.state
                                                    .params.type
                                            ][13] !== 'undefined' && (
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        this.clickFilter(13)
                                                    }
                                                    style={[
                                                        styles.centerContent,
                                                        {
                                                            height:
                                                                30 *
                                                                factorVertical,
                                                            width:
                                                                fullWidth * 0.3,
                                                            marginRight:
                                                                fullWidth *
                                                                0.01,
                                                            marginLeft:
                                                                fullWidth *
                                                                0.01,
                                                            borderWidth:
                                                                0.5 *
                                                                factorRatio,
                                                            borderColor: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][13][1]
                                                                ? 'transparent'
                                                                : colors.secondBackground,
                                                            backgroundColor: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][13][1]
                                                                ? 'red'
                                                                : 'transparent',
                                                            borderRadius: 200,
                                                        },
                                                    ]}
                                                >
                                                    <Text
                                                        style={{
                                                            textAlign: 'center',
                                                            fontWeight: 'bold',
                                                            fontSize:
                                                                12 *
                                                                factorRatio,
                                                            fontFamily:
                                                                'OpenSans-Regular',
                                                            color: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][13][1]
                                                                ? 'white'
                                                                : colors.secondBackground,
                                                        }}
                                                    >
                                                        {
                                                            filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][13][0]
                                                        }
                                                    </Text>
                                                </TouchableOpacity>
                                            )}
                                            {typeof filterDict[
                                                this.props.navigation.state
                                                    .params.type
                                            ][14] !== 'undefined' && (
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        this.clickFilter(14)
                                                    }
                                                    style={[
                                                        styles.centerContent,
                                                        {
                                                            height:
                                                                30 *
                                                                factorVertical,
                                                            width:
                                                                fullWidth * 0.3,
                                                            marginRight:
                                                                fullWidth *
                                                                0.01,
                                                            marginLeft:
                                                                fullWidth *
                                                                0.01,
                                                            borderWidth:
                                                                0.5 *
                                                                factorRatio,
                                                            borderColor: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][14][1]
                                                                ? 'transparent'
                                                                : colors.secondBackground,
                                                            backgroundColor: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][14][1]
                                                                ? 'red'
                                                                : 'transparent',
                                                            borderRadius: 200,
                                                        },
                                                    ]}
                                                >
                                                    <Text
                                                        style={{
                                                            textAlign: 'center',
                                                            fontWeight: 'bold',
                                                            fontSize:
                                                                12 *
                                                                factorRatio,
                                                            fontFamily:
                                                                'OpenSans-Regular',
                                                            color: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][14][1]
                                                                ? 'white'
                                                                : colors.secondBackground,
                                                        }}
                                                    >
                                                        {
                                                            filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][14][0]
                                                        }
                                                    </Text>
                                                </TouchableOpacity>
                                            )}
                                            <View style={{flex: 1}} />
                                        </View>
                                        <View
                                            style={{height: 10 * factorRatio}}
                                        />
                                        <View
                                            style={{
                                                height: 30 * factorVertical,
                                                justifyContent: 'space-around',
                                                alignContent: 'space-around',
                                                flexDirection: 'row',
                                            }}
                                        >
                                            <View style={{flex: 1}} />
                                            {typeof filterDict[
                                                this.props.navigation.state
                                                    .params.type
                                            ][15] !== 'undefined' && (
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        this.clickFilter(15)
                                                    }
                                                    style={[
                                                        styles.centerContent,
                                                        {
                                                            height:
                                                                30 *
                                                                factorVertical,
                                                            width:
                                                                fullWidth * 0.3,
                                                            marginRight:
                                                                fullWidth *
                                                                0.01,
                                                            marginLeft:
                                                                fullWidth *
                                                                0.01,
                                                            borderWidth:
                                                                0.5 *
                                                                factorRatio,
                                                            borderColor: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][15][1]
                                                                ? 'transparent'
                                                                : colors.secondBackground,
                                                            backgroundColor: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][15][1]
                                                                ? 'red'
                                                                : 'transparent',
                                                            borderRadius: 200,
                                                        },
                                                    ]}
                                                >
                                                    <Text
                                                        style={{
                                                            textAlign: 'center',
                                                            fontWeight: 'bold',
                                                            fontSize:
                                                                12 *
                                                                factorRatio,
                                                            fontFamily:
                                                                'OpenSans-Regular',
                                                            color: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][15][1]
                                                                ? 'white'
                                                                : colors.secondBackground,
                                                        }}
                                                    >
                                                        {
                                                            filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][15][0]
                                                        }
                                                    </Text>
                                                </TouchableOpacity>
                                            )}
                                            {typeof filterDict[
                                                this.props.navigation.state
                                                    .params.type
                                            ][16] !== 'undefined' && (
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        this.clickFilter(16)
                                                    }
                                                    style={[
                                                        styles.centerContent,
                                                        {
                                                            height:
                                                                30 *
                                                                factorVertical,
                                                            width:
                                                                fullWidth * 0.3,
                                                            marginRight:
                                                                fullWidth *
                                                                0.01,
                                                            marginLeft:
                                                                fullWidth *
                                                                0.01,
                                                            borderWidth:
                                                                0.5 *
                                                                factorRatio,
                                                            borderColor: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][16][1]
                                                                ? 'transparent'
                                                                : colors.secondBackground,
                                                            backgroundColor: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][16][1]
                                                                ? 'red'
                                                                : 'transparent',
                                                            borderRadius: 200,
                                                        },
                                                    ]}
                                                >
                                                    <Text
                                                        style={{
                                                            textAlign: 'center',
                                                            fontWeight: 'bold',
                                                            fontSize:
                                                                12 *
                                                                factorRatio,
                                                            fontFamily:
                                                                'OpenSans-Regular',
                                                            color: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][16][1]
                                                                ? 'white'
                                                                : colors.secondBackground,
                                                        }}
                                                    >
                                                        {
                                                            filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][16][0]
                                                        }
                                                    </Text>
                                                </TouchableOpacity>
                                            )}
                                            {typeof filterDict[
                                                this.props.navigation.state
                                                    .params.type
                                            ][17] !== 'undefined' && (
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        this.clickFilter(17)
                                                    }
                                                    style={[
                                                        styles.centerContent,
                                                        {
                                                            height:
                                                                30 *
                                                                factorVertical,
                                                            width:
                                                                fullWidth * 0.3,
                                                            marginRight:
                                                                fullWidth *
                                                                0.01,
                                                            marginLeft:
                                                                fullWidth *
                                                                0.01,
                                                            borderWidth:
                                                                0.5 *
                                                                factorRatio,
                                                            borderColor: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][17][1]
                                                                ? 'transparent'
                                                                : colors.secondBackground,
                                                            backgroundColor: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][17][1]
                                                                ? 'red'
                                                                : 'transparent',
                                                            borderRadius: 200,
                                                        },
                                                    ]}
                                                >
                                                    <Text
                                                        style={{
                                                            textAlign: 'center',
                                                            fontWeight: 'bold',
                                                            fontSize:
                                                                12 *
                                                                factorRatio,
                                                            fontFamily:
                                                                'OpenSans-Regular',
                                                            color: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][17][1]
                                                                ? 'white'
                                                                : colors.secondBackground,
                                                        }}
                                                    >
                                                        {
                                                            filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][17][0]
                                                        }
                                                    </Text>
                                                </TouchableOpacity>
                                            )}
                                            <View style={{flex: 1}} />
                                        </View>
                                        <View
                                            style={{height: 10 * factorRatio}}
                                        />
                                        <View
                                            style={{
                                                height: 30 * factorVertical,
                                                justifyContent: 'space-around',
                                                alignContent: 'space-around',
                                                flexDirection: 'row',
                                            }}
                                        >
                                            <View style={{flex: 1}} />
                                            {typeof filterDict[
                                                this.props.navigation.state
                                                    .params.type
                                            ][18] !== 'undefined' && (
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        this.clickFilter(18)
                                                    }
                                                    style={[
                                                        styles.centerContent,
                                                        {
                                                            height:
                                                                30 *
                                                                factorVertical,
                                                            width:
                                                                fullWidth * 0.3,
                                                            marginRight:
                                                                fullWidth *
                                                                0.01,
                                                            marginLeft:
                                                                fullWidth *
                                                                0.01,
                                                            borderWidth:
                                                                0.5 *
                                                                factorRatio,
                                                            borderColor: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][18][1]
                                                                ? 'transparent'
                                                                : colors.secondBackground,
                                                            backgroundColor: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][18][1]
                                                                ? 'red'
                                                                : 'transparent',
                                                            borderRadius: 200,
                                                        },
                                                    ]}
                                                >
                                                    <Text
                                                        style={{
                                                            textAlign: 'center',
                                                            fontWeight: 'bold',
                                                            fontSize:
                                                                12 *
                                                                factorRatio,
                                                            fontFamily:
                                                                'OpenSans-Regular',
                                                            color: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][18][1]
                                                                ? 'white'
                                                                : colors.secondBackground,
                                                        }}
                                                    >
                                                        {
                                                            filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][18][0]
                                                        }
                                                    </Text>
                                                </TouchableOpacity>
                                            )}
                                            {typeof filterDict[
                                                this.props.navigation.state
                                                    .params.type
                                            ][19] !== 'undefined' && (
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        this.clickFilter(19)
                                                    }
                                                    style={[
                                                        styles.centerContent,
                                                        {
                                                            height:
                                                                30 *
                                                                factorVertical,
                                                            width:
                                                                fullWidth * 0.3,
                                                            marginRight:
                                                                fullWidth *
                                                                0.01,
                                                            marginLeft:
                                                                fullWidth *
                                                                0.01,
                                                            borderWidth:
                                                                0.5 *
                                                                factorRatio,
                                                            borderColor: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][19][1]
                                                                ? 'transparent'
                                                                : colors.secondBackground,
                                                            backgroundColor: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][19][1]
                                                                ? 'red'
                                                                : 'transparent',
                                                            borderRadius: 200,
                                                        },
                                                    ]}
                                                >
                                                    <Text
                                                        style={{
                                                            textAlign: 'center',
                                                            fontWeight: 'bold',
                                                            fontSize:
                                                                12 *
                                                                factorRatio,
                                                            fontFamily:
                                                                'OpenSans-Regular',
                                                            color: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][19][1]
                                                                ? 'white'
                                                                : colors.secondBackground,
                                                        }}
                                                    >
                                                        {
                                                            filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][19][0]
                                                        }
                                                    </Text>
                                                </TouchableOpacity>
                                            )}
                                            {typeof filterDict[
                                                this.props.navigation.state
                                                    .params.type
                                            ][20] !== 'undefined' && (
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        this.clickFilter(20)
                                                    }
                                                    style={[
                                                        styles.centerContent,
                                                        {
                                                            height:
                                                                30 *
                                                                factorVertical,
                                                            width:
                                                                fullWidth * 0.3,
                                                            marginRight:
                                                                fullWidth *
                                                                0.01,
                                                            marginLeft:
                                                                fullWidth *
                                                                0.01,
                                                            borderWidth:
                                                                0.5 *
                                                                factorRatio,
                                                            borderColor: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][20][1]
                                                                ? 'transparent'
                                                                : colors.secondBackground,
                                                            backgroundColor: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][20][1]
                                                                ? 'red'
                                                                : 'transparent',
                                                            borderRadius: 200,
                                                        },
                                                    ]}
                                                >
                                                    <Text
                                                        style={{
                                                            textAlign: 'center',
                                                            fontWeight: 'bold',
                                                            fontSize:
                                                                12 *
                                                                factorRatio,
                                                            fontFamily:
                                                                'OpenSans-Regular',
                                                            color: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][20][1]
                                                                ? 'white'
                                                                : colors.secondBackground,
                                                        }}
                                                    >
                                                        {
                                                            filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][20][0]
                                                        }
                                                    </Text>
                                                </TouchableOpacity>
                                            )}
                                            <View style={{flex: 1}} />
                                        </View>
                                        <View
                                            style={{height: 10 * factorRatio}}
                                        />
                                        <View
                                            style={{
                                                height: 30 * factorVertical,
                                                justifyContent: 'space-around',
                                                alignContent: 'space-around',
                                                flexDirection: 'row',
                                            }}
                                        >
                                            <View style={{flex: 1}} />
                                            {typeof filterDict[
                                                this.props.navigation.state
                                                    .params.type
                                            ][21] !== 'undefined' && (
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        this.clickFilter(21)
                                                    }
                                                    style={[
                                                        styles.centerContent,
                                                        {
                                                            height:
                                                                30 *
                                                                factorVertical,
                                                            width:
                                                                fullWidth * 0.3,
                                                            marginRight:
                                                                fullWidth *
                                                                0.01,
                                                            marginLeft:
                                                                fullWidth *
                                                                0.01,
                                                            borderWidth:
                                                                0.5 *
                                                                factorRatio,
                                                            borderColor: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][21][1]
                                                                ? 'transparent'
                                                                : colors.secondBackground,
                                                            backgroundColor: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][21][1]
                                                                ? 'red'
                                                                : 'transparent',
                                                            borderRadius: 200,
                                                        },
                                                    ]}
                                                >
                                                    <Text
                                                        style={{
                                                            textAlign: 'center',
                                                            fontWeight: 'bold',
                                                            fontSize:
                                                                12 *
                                                                factorRatio,
                                                            fontFamily:
                                                                'OpenSans-Regular',
                                                            color: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][21][1]
                                                                ? 'white'
                                                                : colors.secondBackground,
                                                        }}
                                                    >
                                                        {
                                                            filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][21][0]
                                                        }
                                                    </Text>
                                                </TouchableOpacity>
                                            )}
                                            {typeof filterDict[
                                                this.props.navigation.state
                                                    .params.type
                                            ][22] !== 'undefined' && (
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        this.clickFilter(22)
                                                    }
                                                    style={[
                                                        styles.centerContent,
                                                        {
                                                            height:
                                                                30 *
                                                                factorVertical,
                                                            width:
                                                                fullWidth * 0.3,
                                                            marginRight:
                                                                fullWidth *
                                                                0.01,
                                                            marginLeft:
                                                                fullWidth *
                                                                0.01,
                                                            borderWidth:
                                                                0.5 *
                                                                factorRatio,
                                                            borderColor: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][22][1]
                                                                ? 'transparent'
                                                                : colors.secondBackground,
                                                            backgroundColor: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][22][1]
                                                                ? 'red'
                                                                : 'transparent',
                                                            borderRadius: 200,
                                                        },
                                                    ]}
                                                >
                                                    <Text
                                                        style={{
                                                            textAlign: 'center',
                                                            fontWeight: 'bold',
                                                            fontSize:
                                                                12 *
                                                                factorRatio,
                                                            fontFamily:
                                                                'OpenSans-Regular',
                                                            color: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][22][1]
                                                                ? 'white'
                                                                : colors.secondBackground,
                                                        }}
                                                    >
                                                        {
                                                            filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][22][0]
                                                        }
                                                    </Text>
                                                </TouchableOpacity>
                                            )}
                                            {typeof filterDict[
                                                this.props.navigation.state
                                                    .params.type
                                            ][23] !== 'undefined' && (
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        this.clickFilter(23)
                                                    }
                                                    style={[
                                                        styles.centerContent,
                                                        {
                                                            height:
                                                                30 *
                                                                factorVertical,
                                                            width:
                                                                fullWidth * 0.3,
                                                            marginRight:
                                                                fullWidth *
                                                                0.01,
                                                            marginLeft:
                                                                fullWidth *
                                                                0.01,
                                                            borderWidth:
                                                                0.5 *
                                                                factorRatio,
                                                            borderColor: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][23][1]
                                                                ? 'transparent'
                                                                : colors.secondBackground,
                                                            backgroundColor: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][23][1]
                                                                ? 'red'
                                                                : 'transparent',
                                                            borderRadius: 200,
                                                        },
                                                    ]}
                                                >
                                                    <Text
                                                        style={{
                                                            textAlign: 'center',
                                                            fontWeight: 'bold',
                                                            fontSize:
                                                                12 *
                                                                factorRatio,
                                                            fontFamily:
                                                                'OpenSans-Regular',
                                                            color: filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][23][1]
                                                                ? 'white'
                                                                : colors.secondBackground,
                                                        }}
                                                    >
                                                        {
                                                            filterDict[
                                                                this.props
                                                                    .navigation
                                                                    .state
                                                                    .params.type
                                                            ][23][0]
                                                        }
                                                    </Text>
                                                </TouchableOpacity>
                                            )}
                                            <View style={{flex: 1}} />
                                        </View>
                                    </ScrollView>
                                </View>
                            </View>
                            {this.state.type == 'SONGS' && (
                                <View>
                                    <View
                                        style={{height: 30 * factorVertical}}
                                    />
                                    <View key={'artists'}>
                                        <Text
                                            style={{
                                                fontSize: 18 * factorRatio,
                                                marginBottom:
                                                    5 * factorVertical,
                                                textAlign: 'left',
                                                fontFamily:
                                                    'RobotoCondensed-Bold',
                                                color: colors.secondBackground,
                                                paddingLeft: fullWidth * 0.035,
                                            }}
                                        >
                                            CHOOSE YOUR ARTISTS
                                        </Text>
                                        <View
                                            style={{
                                                minHeight: 70 * factorVertical,
                                            }}
                                        >
                                            <ScrollView
                                                style={{
                                                    height: this.state.onlyType
                                                        ? 40 * factorRatio +
                                                          90 * factorVertical
                                                        : 350 * factorVertical,
                                                }}
                                            >
                                                <View
                                                    style={{
                                                        height:
                                                            20 * factorRatio,
                                                    }}
                                                />
                                                <View
                                                    style={{
                                                        height:
                                                            30 * factorVertical,
                                                        justifyContent:
                                                            'space-around',
                                                        alignContent:
                                                            'space-around',
                                                        flexDirection: 'row',
                                                    }}
                                                >
                                                    <View style={{flex: 1}} />
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][0] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    0,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][0][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][0][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][0][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][0][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][1] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    1,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][1][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][1][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][1][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][1][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][2] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    2,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][2][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][2][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][2][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][2][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    <View style={{flex: 1}} />
                                                </View>
                                                <View
                                                    style={{
                                                        height:
                                                            10 * factorRatio,
                                                    }}
                                                />
                                                <View
                                                    style={{
                                                        height:
                                                            30 * factorVertical,
                                                        justifyContent:
                                                            'space-around',
                                                        alignContent:
                                                            'space-around',
                                                        flexDirection: 'row',
                                                    }}
                                                >
                                                    <View style={{flex: 1}} />
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][3] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    3,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][3][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][3][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][3][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][3][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][4] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    4,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][4][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][4][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][4][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][4][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    {typeof filterDict[
                                                        this.props.navigation
                                                            .state.params.type
                                                    ][5] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    5,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][5][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][5][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][5][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][5][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    <View style={{flex: 1}} />
                                                </View>
                                                <View
                                                    style={{
                                                        height:
                                                            10 * factorRatio,
                                                    }}
                                                />
                                                <View
                                                    style={{
                                                        height:
                                                            30 * factorVertical,
                                                        justifyContent:
                                                            'space-around',
                                                        alignContent:
                                                            'space-around',
                                                        flexDirection: 'row',
                                                    }}
                                                >
                                                    <View style={{flex: 1}} />
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][6] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    6,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][6][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][6][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][6][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][6][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][7] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    7,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][7][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][7][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][7][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][7][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][8] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    8,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][8][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][8][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][8][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][8][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    <View style={{flex: 1}} />
                                                </View>
                                                <View
                                                    style={{
                                                        height:
                                                            10 * factorRatio,
                                                    }}
                                                />
                                                <View
                                                    style={{
                                                        height:
                                                            30 * factorVertical,
                                                        justifyContent:
                                                            'space-around',
                                                        alignContent:
                                                            'space-around',
                                                        flexDirection: 'row',
                                                    }}
                                                >
                                                    <View style={{flex: 1}} />
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][9] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    9,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][9][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][9][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][9][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][9][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][10] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    10,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][10][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][10][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][10][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][10][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][11] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    11,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][11][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][11][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][11][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][11][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    <View style={{flex: 1}} />
                                                </View>
                                                <View
                                                    style={{
                                                        height:
                                                            10 * factorRatio,
                                                    }}
                                                />
                                                <View
                                                    style={{
                                                        height:
                                                            30 * factorVertical,
                                                        justifyContent:
                                                            'space-around',
                                                        alignContent:
                                                            'space-around',
                                                        flexDirection: 'row',
                                                    }}
                                                >
                                                    <View style={{flex: 1}} />
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][12] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    12,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][12][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][12][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][12][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][12][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][13] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    13,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][13][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][13][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][13][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][13][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][14] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    14,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][14][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][14][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][14][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][14][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    <View style={{flex: 1}} />
                                                </View>
                                                <View
                                                    style={{
                                                        height:
                                                            10 * factorRatio,
                                                    }}
                                                />
                                                <View
                                                    style={{
                                                        height:
                                                            30 * factorVertical,
                                                        justifyContent:
                                                            'space-around',
                                                        alignContent:
                                                            'space-around',
                                                        flexDirection: 'row',
                                                    }}
                                                >
                                                    <View style={{flex: 1}} />
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][15] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    15,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][15][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][15][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][15][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][15][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][16] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    16,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][16][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][16][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][16][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][16][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][17] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    17,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][17][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][17][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][17][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][17][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    <View style={{flex: 1}} />
                                                </View>
                                                <View
                                                    style={{
                                                        height:
                                                            10 * factorRatio,
                                                    }}
                                                />
                                                <View
                                                    style={{
                                                        height:
                                                            30 * factorVertical,
                                                        justifyContent:
                                                            'space-around',
                                                        alignContent:
                                                            'space-around',
                                                        flexDirection: 'row',
                                                    }}
                                                >
                                                    <View style={{flex: 1}} />
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][18] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    18,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][18][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][18][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][18][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][18][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][19] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    19,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][19][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][19][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][19][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][19][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][20] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    20,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][20][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][20][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][20][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][20][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    <View style={{flex: 1}} />
                                                </View>
                                                <View
                                                    style={{
                                                        height:
                                                            10 * factorRatio,
                                                    }}
                                                />
                                                <View
                                                    style={{
                                                        height:
                                                            30 * factorVertical,
                                                        justifyContent:
                                                            'space-around',
                                                        alignContent:
                                                            'space-around',
                                                        flexDirection: 'row',
                                                    }}
                                                >
                                                    <View style={{flex: 1}} />
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][21] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    21,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][21][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][21][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][21][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][21][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][22] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    22,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][22][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][22][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][22][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][22][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][23] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    23,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][23][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][23][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][23][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][23][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    <View style={{flex: 1}} />
                                                </View>
                                                <View
                                                    style={{
                                                        height:
                                                            10 * factorRatio,
                                                    }}
                                                />
                                                <View
                                                    style={{
                                                        height:
                                                            30 * factorVertical,
                                                        justifyContent:
                                                            'space-around',
                                                        alignContent:
                                                            'space-around',
                                                        flexDirection: 'row',
                                                    }}
                                                >
                                                    <View style={{flex: 1}} />
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][24] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    24,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][24][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][24][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][24][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][24][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][25] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    25,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][25][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][25][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][25][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][25][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][26] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    26,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][26][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][26][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][26][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][26][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    <View style={{flex: 1}} />
                                                </View>
                                                <View
                                                    style={{
                                                        height:
                                                            10 * factorRatio,
                                                    }}
                                                />
                                                <View
                                                    style={{
                                                        height:
                                                            30 * factorVertical,
                                                        justifyContent:
                                                            'space-around',
                                                        alignContent:
                                                            'space-around',
                                                        flexDirection: 'row',
                                                    }}
                                                >
                                                    <View style={{flex: 1}} />
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][27] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    27,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][27][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][27][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][27][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][27][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][28] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    28,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][28][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][28][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][28][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][28][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][29] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    29,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][29][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][29][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][29][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][29][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    <View style={{flex: 1}} />
                                                </View>
                                                <View
                                                    style={{
                                                        height:
                                                            10 * factorRatio,
                                                    }}
                                                />
                                                <View
                                                    style={{
                                                        height:
                                                            30 * factorVertical,
                                                        justifyContent:
                                                            'space-around',
                                                        alignContent:
                                                            'space-around',
                                                        flexDirection: 'row',
                                                    }}
                                                >
                                                    <View style={{flex: 1}} />
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][30] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    30,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][30][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][30][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][30][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][30][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][31] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    31,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][31][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][31][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][31][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][31][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][32] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    32,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][32][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][32][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][32][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][32][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    <View style={{flex: 1}} />
                                                </View>
                                                <View
                                                    style={{
                                                        height:
                                                            10 * factorRatio,
                                                    }}
                                                />
                                                <View
                                                    style={{
                                                        height:
                                                            30 * factorVertical,
                                                        justifyContent:
                                                            'space-around',
                                                        alignContent:
                                                            'space-around',
                                                        flexDirection: 'row',
                                                    }}
                                                >
                                                    <View style={{flex: 1}} />
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][33] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    33,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][33][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][33][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][33][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][33][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][34] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    34,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][34][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][34][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][34][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][34][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][35] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    35,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][35][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][35][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][35][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][35][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    <View style={{flex: 1}} />
                                                </View>
                                                <View
                                                    style={{
                                                        height:
                                                            10 * factorRatio,
                                                    }}
                                                />
                                                <View
                                                    style={{
                                                        height:
                                                            30 * factorVertical,
                                                        justifyContent:
                                                            'space-around',
                                                        alignContent:
                                                            'space-around',
                                                        flexDirection: 'row',
                                                    }}
                                                >
                                                    <View style={{flex: 1}} />
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][36] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    36,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][36][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][36][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][36][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][36][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][37] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    37,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][37][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][37][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][37][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][37][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][38] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    38,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][38][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][38][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][38][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][38][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    <View style={{flex: 1}} />
                                                </View>
                                                <View
                                                    style={{
                                                        height:
                                                            10 * factorRatio,
                                                    }}
                                                />
                                                <View
                                                    style={{
                                                        height:
                                                            30 * factorVertical,
                                                        justifyContent:
                                                            'space-around',
                                                        alignContent:
                                                            'space-around',
                                                        flexDirection: 'row',
                                                    }}
                                                >
                                                    <View style={{flex: 1}} />
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][39] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    39,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][39][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][39][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][39][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][39][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][40] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    40,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][40][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][40][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][40][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][40][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][41] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    41,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][41][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][41][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][41][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][41][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    <View style={{flex: 1}} />
                                                </View>
                                                <View
                                                    style={{
                                                        height:
                                                            10 * factorRatio,
                                                    }}
                                                />
                                                <View
                                                    style={{
                                                        height:
                                                            30 * factorVertical,
                                                        justifyContent:
                                                            'space-around',
                                                        alignContent:
                                                            'space-around',
                                                        flexDirection: 'row',
                                                    }}
                                                >
                                                    <View style={{flex: 1}} />
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][42] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    42,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][42][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][42][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][42][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][42][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][43] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    43,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][43][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][43][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][43][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][43][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][44] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    44,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][44][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][44][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][44][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][44][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    <View style={{flex: 1}} />
                                                </View>
                                                <View
                                                    style={{
                                                        height:
                                                            10 * factorRatio,
                                                    }}
                                                />
                                                <View
                                                    style={{
                                                        height:
                                                            30 * factorVertical,
                                                        justifyContent:
                                                            'space-around',
                                                        alignContent:
                                                            'space-around',
                                                        flexDirection: 'row',
                                                    }}
                                                >
                                                    <View style={{flex: 1}} />
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][45] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    45,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][45][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][45][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][45][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][45][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][46] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    46,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][46][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][46][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][46][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][46][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][47] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    47,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][47][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][47][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][47][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][47][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    <View style={{flex: 1}} />
                                                </View>
                                                <View
                                                    style={{
                                                        height:
                                                            10 * factorRatio,
                                                    }}
                                                />
                                                <View
                                                    style={{
                                                        height:
                                                            30 * factorVertical,
                                                        justifyContent:
                                                            'space-around',
                                                        alignContent:
                                                            'space-around',
                                                        flexDirection: 'row',
                                                    }}
                                                >
                                                    <View style={{flex: 1}} />
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][48] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    48,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][48][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][48][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][48][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][48][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][49] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    49,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][49][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][49][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][49][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][49][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][50] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    50,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][50][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][50][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][50][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][50][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    <View style={{flex: 1}} />
                                                </View>
                                                <View
                                                    style={{
                                                        height:
                                                            10 * factorRatio,
                                                    }}
                                                />
                                                <View
                                                    style={{
                                                        height:
                                                            30 * factorVertical,
                                                        justifyContent:
                                                            'space-around',
                                                        alignContent:
                                                            'space-around',
                                                        flexDirection: 'row',
                                                    }}
                                                >
                                                    <View style={{flex: 1}} />
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][51] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    51,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][51][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][51][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][51][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][51][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][52] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    52,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][52][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][52][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][52][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][52][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][53] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    53,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][53][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][53][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][53][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][53][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    <View style={{flex: 1}} />
                                                </View>
                                                <View
                                                    style={{
                                                        height:
                                                            10 * factorRatio,
                                                    }}
                                                />
                                                <View
                                                    style={{
                                                        height:
                                                            30 * factorVertical,
                                                        justifyContent:
                                                            'space-around',
                                                        alignContent:
                                                            'space-around',
                                                        flexDirection: 'row',
                                                    }}
                                                >
                                                    <View style={{flex: 1}} />
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][54] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    54,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][54][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][54][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][54][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][54][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][55] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    55,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][55][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][55][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][55][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][55][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][56] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    56,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][56][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][56][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        10 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][56][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][56][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    <View style={{flex: 1}} />
                                                </View>
                                                <View
                                                    style={{
                                                        height:
                                                            10 * factorRatio,
                                                    }}
                                                />
                                                <View
                                                    style={{
                                                        height:
                                                            30 * factorVertical,
                                                        justifyContent:
                                                            'space-around',
                                                        alignContent:
                                                            'space-around',
                                                        flexDirection: 'row',
                                                    }}
                                                >
                                                    <View style={{flex: 1}} />
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][57] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    57,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][57][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][57][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][57][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][57][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][58] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    58,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][58][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][58][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][58][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][58][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][59] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    59,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][59][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][59][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][59][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][59][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    <View style={{flex: 1}} />
                                                </View>
                                                <View
                                                    style={{
                                                        height:
                                                            10 * factorRatio,
                                                    }}
                                                />
                                                <View
                                                    style={{
                                                        height:
                                                            30 * factorVertical,
                                                        justifyContent:
                                                            'space-around',
                                                        alignContent:
                                                            'space-around',
                                                        flexDirection: 'row',
                                                    }}
                                                >
                                                    <View style={{flex: 1}} />
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][60] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    60,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][60][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][60][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][60][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][60][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][61] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    61,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][61][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][61][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][61][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][61][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][62] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    62,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][62][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][62][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        10 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][62][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][62][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    <View style={{flex: 1}} />
                                                </View>
                                                <View
                                                    style={{
                                                        height:
                                                            10 * factorRatio,
                                                    }}
                                                />
                                                <View
                                                    style={{
                                                        height:
                                                            30 * factorVertical,
                                                        justifyContent:
                                                            'space-around',
                                                        alignContent:
                                                            'space-around',
                                                        flexDirection: 'row',
                                                    }}
                                                >
                                                    <View style={{flex: 1}} />
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][63] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    63,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][63][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][63][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        10 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][63][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][63][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][64] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    64,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][64][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][64][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][64][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][64][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][65] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    65,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][65][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][65][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][65][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][65][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    <View style={{flex: 1}} />
                                                </View>
                                                <View
                                                    style={{
                                                        height:
                                                            10 * factorRatio,
                                                    }}
                                                />
                                                <View
                                                    style={{
                                                        height:
                                                            30 * factorVertical,
                                                        justifyContent:
                                                            'space-around',
                                                        alignContent:
                                                            'space-around',
                                                        flexDirection: 'row',
                                                    }}
                                                >
                                                    <View style={{flex: 1}} />
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][66] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    66,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][66][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][66][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][66][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][66][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][67] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    67,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][67][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][67][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][67][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][67][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    {typeof filterDict[
                                                        'ARTISTS'
                                                    ][68] !== 'undefined' && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                this.clickFilterArtist(
                                                                    68,
                                                                )
                                                            }
                                                            style={[
                                                                styles.centerContent,
                                                                {
                                                                    height:
                                                                        30 *
                                                                        factorVertical,
                                                                    width:
                                                                        fullWidth *
                                                                        0.3,
                                                                    marginRight:
                                                                        fullWidth *
                                                                        0.01,
                                                                    marginLeft:
                                                                        fullWidth *
                                                                        0.01,
                                                                    borderWidth:
                                                                        0.5 *
                                                                        factorRatio,
                                                                    borderColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][68][1]
                                                                        ? 'transparent'
                                                                        : colors.secondBackground,
                                                                    backgroundColor: filterDict[
                                                                        'ARTISTS'
                                                                    ][68][1]
                                                                        ? 'red'
                                                                        : 'transparent',
                                                                    borderRadius: 200,
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    textAlign:
                                                                        'center',
                                                                    fontWeight:
                                                                        'bold',
                                                                    fontSize:
                                                                        12 *
                                                                        factorRatio,
                                                                    fontFamily:
                                                                        'OpenSans-Regular',
                                                                    color: filterDict[
                                                                        'ARTISTS'
                                                                    ][68][1]
                                                                        ? 'white'
                                                                        : colors.secondBackground,
                                                                }}
                                                            >
                                                                {
                                                                    filterDict[
                                                                        'ARTISTS'
                                                                    ][68][0]
                                                                }
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    <View style={{flex: 1}} />
                                                </View>
                                            </ScrollView>
                                        </View>
                                    </View>
                                </View>
                            )}
                            <View style={{height: 30 * factorVertical}} />
                            {this.state.onlyType && (
                                <TouchableOpacity
                                    key={'chooseProgress'}
                                    onPress={() => {
                                        this.setState({
                                            openProgress: !this.state
                                                .openProgress,
                                        });
                                    }}
                                    style={{
                                        height: fullHeight * 0.1,
                                        flexDirection: 'row',
                                        paddingLeft: fullWidth * 0.035,
                                        paddingRight: fullWidth * 0.035,
                                        borderTopColor: colors.secondBackground,
                                        borderTopWidth: 0.5 * factorRatio,
                                        borderBottomColor:
                                            colors.secondBackground,
                                        borderBottomWidth: this.state
                                            .openProgress
                                            ? 0
                                            : 0.25 * factorRatio,
                                    }}
                                >
                                    <View>
                                        <View style={{flex: 1}} />
                                        <Text
                                            style={{
                                                fontSize: 18 * factorRatio,
                                                marginBottom:
                                                    5 * factorVertical,
                                                textAlign: 'left',
                                                fontFamily:
                                                    'RobotoCondensed-Bold',
                                                color: colors.secondBackground,
                                            }}
                                        >
                                            CHOOSE YOUR PROGRESS
                                        </Text>
                                        <View style={{flex: 1}} />
                                    </View>
                                    <View style={{flex: 1}} />
                                    <View>
                                        <View style={{flex: 1}} />
                                        <View
                                            style={{
                                                paddingLeft: 10 * factorRatio,
                                                paddingRight: 10 * factorRatio,
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
                                        <View style={{flex: 1}} />
                                    </View>
                                </TouchableOpacity>
                            )}
                            {this.state.openProgress && this.state.onlyType && (
                                <View
                                    key={'progressLevels'}
                                    style={{
                                        borderBottomColor:
                                            colors.secondBackground,
                                        borderBottomWidth: 0.5 * factorRatio,
                                    }}
                                >
                                    <View
                                        style={{
                                            height: 30 * factorVertical,
                                            justifyContent: 'space-around',
                                            alignContent: 'space-around',
                                            flexDirection: 'row',
                                        }}
                                    >
                                        <View style={{flex: 1}} />
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setState({
                                                    progressAll: !this.state
                                                        .progressAll,
                                                    progressProgress: false,
                                                    progressComplete: false,
                                                });
                                            }}
                                            style={[
                                                styles.centerContent,
                                                {
                                                    height: 30 * factorVertical,
                                                    width: fullWidth * 0.3,
                                                    marginRight:
                                                        fullWidth * 0.01,
                                                    marginLeft:
                                                        fullWidth * 0.01,
                                                    borderWidth:
                                                        0.5 * factorRatio,
                                                    borderColor: this.state
                                                        .progressAll
                                                        ? null
                                                        : colors.secondBackground,
                                                    backgroundColor: this.state
                                                        .progressAll
                                                        ? colors.pianoteRed
                                                        : colors.mainBackground,
                                                    borderRadius: 200,
                                                },
                                            ]}
                                        >
                                            <Text
                                                style={{
                                                    textAlign: 'center',
                                                    fontWeight: 'bold',
                                                    fontSize: 12 * factorRatio,
                                                    fontFamily: 'OpenSans-Regular',
                                                    color: this.state
                                                        .progressAll
                                                        ? 'white'
                                                        : colors.secondBackground,
                                                }}
                                            >
                                                ALL
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setState({
                                                    progressProgress: !this
                                                        .state.progressProgress,
                                                    progressAll: false,
                                                    progressComplete: false,
                                                });
                                            }}
                                            style={[
                                                styles.centerContent,
                                                {
                                                    height: 30 * factorVertical,
                                                    width: fullWidth * 0.3,
                                                    marginRight:
                                                        fullWidth * 0.01,
                                                    marginLeft:
                                                        fullWidth * 0.01,
                                                    borderWidth:
                                                        0.5 * factorRatio,
                                                    borderColor: this.state
                                                        .progressProgress
                                                        ? null
                                                        : colors.secondBackground,
                                                    backgroundColor: this.state
                                                        .progressProgress
                                                        ? colors.pianoteRed
                                                        : colors.mainBackground,
                                                    borderRadius: 200,
                                                },
                                            ]}
                                        >
                                            <Text
                                                style={{
                                                    textAlign: 'center',
                                                    fontWeight: 'bold',
                                                    fontSize: 12 * factorRatio,
                                                    fontFamily: 'OpenSans-Regular',
                                                    color: this.state
                                                        .progressProgress
                                                        ? 'white'
                                                        : colors.secondBackground,
                                                }}
                                            >
                                                IN PROGRESS
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setState({
                                                    progressComplete: !this
                                                        .state.progressComplete,
                                                    progressAll: false,
                                                    progressProgress: false,
                                                });
                                            }}
                                            style={[
                                                styles.centerContent,
                                                {
                                                    height: 30 * factorVertical,
                                                    width: fullWidth * 0.3,
                                                    marginRight:
                                                        fullWidth * 0.01,
                                                    marginLeft:
                                                        fullWidth * 0.01,
                                                    borderWidth:
                                                        0.5 * factorRatio,
                                                    borderColor: this.state
                                                        .progressComplete
                                                        ? null
                                                        : colors.secondBackground,
                                                    backgroundColor: this.state
                                                        .progressComplete
                                                        ? colors.pianoteRed
                                                        : colors.mainBackground,
                                                    borderRadius: 200,
                                                },
                                            ]}
                                        >
                                            <Text
                                                style={{
                                                    textAlign: 'center',
                                                    fontWeight: 'bold',
                                                    fontSize: 12 * factorRatio,
                                                    fontFamily: 'OpenSans-Regular',
                                                    color: this.state
                                                        .progressComplete
                                                        ? 'white'
                                                        : colors.secondBackground,
                                                }}
                                            >
                                                COMPLETED
                                            </Text>
                                        </TouchableOpacity>
                                        <View style={{flex: 1}} />
                                    </View>
                                    <View
                                        style={{height: 40 * factorVertical}}
                                    />
                                </View>
                            )}
                            {this.state.onlyType &&
                                this.state.type !== 'SONGS' && (
                                    <TouchableOpacity
                                        key={'pianoInstructor'}
                                        onPress={() => {
                                            this.setState({
                                                openInstructors: !this.state
                                                    .openInstructors,
                                            });
                                        }}
                                        style={{
                                            height: fullHeight * 0.1,
                                            flexDirection: 'row',
                                            paddingLeft: fullWidth * 0.035,
                                            paddingRight: fullWidth * 0.035,
                                            borderTopColor:
                                                colors.secondBackground,
                                            borderBottomColor:
                                                colors.secondBackground,
                                            borderBottomWidth: this.state
                                                .openInstructors
                                                ? 0
                                                : 0.5 * factorRatio,
                                        }}
                                    >
                                        <View>
                                            <View style={{flex: 1}} />
                                            <Text
                                                style={{
                                                    fontSize: 18 * factorRatio,
                                                    marginBottom:
                                                        5 * factorVertical,
                                                    textAlign: 'left',
                                                    fontFamily:
                                                        'RobotoCondensed-Bold',
                                                    color:
                                                        colors.secondBackground,
                                                }}
                                            >
                                                CHOOSE YOUR INSTRUCTOR
                                            </Text>
                                            <View style={{flex: 1}} />
                                        </View>
                                        <View style={{flex: 1}} />
                                        <View>
                                            <View style={{flex: 1}} />
                                            <View
                                                style={{
                                                    paddingLeft:
                                                        10 * factorRatio,
                                                    paddingRight:
                                                        10 * factorRatio,
                                                }}
                                            >
                                                <EntypoIcon
                                                    name={
                                                        this.state
                                                            .openInstructors
                                                            ? 'chevron-thin-up'
                                                            : 'chevron-thin-down'
                                                    }
                                                    size={25 * factorRatio}
                                                    color={
                                                        colors.secondBackground
                                                    }
                                                />
                                            </View>
                                            <View style={{flex: 1}} />
                                        </View>
                                    </TouchableOpacity>
                                )}
                            {this.state.openInstructors &&
                                this.state.onlyType &&
                                this.state.type !== 'SONGS' && (
                                    <View
                                        key={'instructors'}
                                        style={{
                                            borderBottomColor:
                                                colors.secondBackground,
                                            borderBottomWidth:
                                                0.5 * factorRatio,
                                        }}
                                    >
                                        <View
                                            style={{
                                                height: 20 * factorVertical,
                                            }}
                                        />
                                        <View
                                            key={'topRow'}
                                            style={{
                                                flexDirection: 'row',
                                                justifyContent: 'space-around',
                                                alignContent: 'space-around',
                                                alignSelf: 'stretch',
                                            }}
                                        >
                                            <View
                                                key={'circle7'}
                                                style={{
                                                    width: 70 * factorRatio,
                                                }}
                                            >
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        this.setState({
                                                            kenny: !this.state
                                                                .kenny,
                                                            lisa: false,
                                                            cassi: false,
                                                            jay: false,
                                                            jordan: false,
                                                            jonny: false,
                                                            brett: false,
                                                            nate: false,
                                                        })
                                                    }
                                                    style={{
                                                        borderWidth: this.state
                                                            .kenny
                                                            ? 2 * factorRatio
                                                            : 0 * factorRatio,
                                                        borderColor: this.state
                                                            .kenny
                                                            ? '#fb1b2f'
                                                            : 'black',
                                                        height:
                                                            70 * factorRatio,
                                                        width: 70 * factorRatio,
                                                        borderRadius: 300,
                                                        backgroundColor:
                                                            'white',
                                                    }}
                                                >
                                                    <FastImage
                                                        style={{
                                                            flex: 1,
                                                            borderRadius: 100,
                                                        }}
                                                        source={require('Pianote2/src/assets/img/imgs/kenny-werner.jpg')}
                                                        resizeMode={
                                                            FastImage.resizeMode
                                                                .stretch
                                                        }
                                                    />
                                                </TouchableOpacity>
                                                <Text
                                                    style={{
                                                        fontFamily: 'OpenSans-Regular',
                                                        marginTop:
                                                            5 * factorRatio,
                                                        fontSize:
                                                            11 * factorRatio,
                                                        textAlign: 'center',
                                                        fontWeight: 'bold',
                                                        color: this.state.kenny
                                                            ? 'white'
                                                            : colors.secondBackground,
                                                    }}
                                                >
                                                    KENNY WERNER
                                                </Text>
                                            </View>
                                            <View
                                                key={'circle1'}
                                                style={{
                                                    width: 70 * factorRatio,
                                                }}
                                            >
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        this.setState({
                                                            lisa: !this.state
                                                                .lisa,
                                                            kenny: false,
                                                            cassi: false,
                                                            jay: false,
                                                            jordan: false,
                                                            jonny: false,
                                                            brett: false,
                                                            nate: false,
                                                        })
                                                    }
                                                    style={{
                                                        borderWidth: this.state
                                                            .lisa
                                                            ? 2 * factorRatio
                                                            : 0 * factorRatio,
                                                        borderColor: this.state
                                                            .lisa
                                                            ? '#fb1b2f'
                                                            : 'black',
                                                        height:
                                                            70 * factorRatio,
                                                        width: 70 * factorRatio,
                                                        borderRadius: 300,
                                                        backgroundColor:
                                                            'white',
                                                        zIndex: 10,
                                                    }}
                                                >
                                                    <FastImage
                                                        style={{
                                                            flex: 1,
                                                            borderRadius: 100,
                                                        }}
                                                        source={require('Pianote2/src/assets/img/imgs/lisa-witt.jpg')}
                                                        resizeMode={
                                                            FastImage.resizeMode
                                                                .stretch
                                                        }
                                                    />
                                                </TouchableOpacity>
                                                <Text
                                                    style={{
                                                        fontFamily: 'OpenSans-Regular',
                                                        marginTop:
                                                            5 * factorRatio,
                                                        fontSize:
                                                            10 * factorRatio,
                                                        textAlign: 'center',
                                                        fontWeight: 'bold',
                                                        color: this.state.lisa
                                                            ? 'white'
                                                            : colors.secondBackground,
                                                    }}
                                                >
                                                    LISA WITT
                                                </Text>
                                            </View>
                                            <View
                                                key={'circle2'}
                                                style={{
                                                    width: 70 * factorRatio,
                                                }}
                                            >
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        this.setState({
                                                            cassi: !this.state
                                                                .cassi,
                                                            kenny: false,
                                                            lisa: false,
                                                            jay: false,
                                                            jordan: false,
                                                            jonny: false,
                                                            brett: false,
                                                            nate: false,
                                                        })
                                                    }
                                                    style={{
                                                        borderWidth: this.state
                                                            .cassi
                                                            ? 2 * factorRatio
                                                            : 0 * factorRatio,
                                                        borderColor: this.state
                                                            .cassi
                                                            ? '#fb1b2f'
                                                            : 'black',
                                                        height:
                                                            70 * factorRatio,
                                                        width: 70 * factorRatio,
                                                        borderRadius: 300,
                                                        backgroundColor:
                                                            'white',
                                                    }}
                                                >
                                                    <FastImage
                                                        style={{
                                                            flex: 1,
                                                            borderRadius: 100,
                                                        }}
                                                        source={require('Pianote2/src/assets/img/imgs/cassi-falk.jpg')}
                                                        resizeMode={
                                                            FastImage.resizeMode
                                                                .stretch
                                                        }
                                                    />
                                                </TouchableOpacity>
                                                <Text
                                                    style={{
                                                        fontFamily: 'OpenSans-Regular',
                                                        marginTop:
                                                            5 * factorRatio,
                                                        fontSize:
                                                            10 * factorRatio,
                                                        textAlign: 'center',
                                                        fontWeight: 'bold',
                                                        color: this.state.cassi
                                                            ? 'white'
                                                            : colors.secondBackground,
                                                    }}
                                                >
                                                    CASSI FALK
                                                </Text>
                                            </View>
                                            <View
                                                key={'circle3'}
                                                style={{
                                                    width: 70 * factorRatio,
                                                }}
                                            >
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        this.setState({
                                                            jordan: !this.state
                                                                .jordan,
                                                            kenny: false,
                                                            lisa: false,
                                                            cassi: false,
                                                            jay: false,
                                                            jonny: false,
                                                            brett: false,
                                                            nate: false,
                                                        })
                                                    }
                                                    style={{
                                                        borderWidth: this.state
                                                            .jordan
                                                            ? 2 * factorRatio
                                                            : 0 * factorRatio,
                                                        borderColor: this.state
                                                            .jordan
                                                            ? '#fb1b2f'
                                                            : 'black',
                                                        height:
                                                            70 * factorRatio,
                                                        width: 70 * factorRatio,
                                                        borderRadius: 300,
                                                        backgroundColor:
                                                            'white',
                                                    }}
                                                >
                                                    <FastImage
                                                        style={{
                                                            flex: 1,
                                                            borderRadius: 100,
                                                        }}
                                                        source={require('Pianote2/src/assets/img/imgs/jordan-leibel.jpg')}
                                                        resizeMode={
                                                            FastImage.resizeMode
                                                                .stretch
                                                        }
                                                    />
                                                </TouchableOpacity>
                                                <Text
                                                    style={{
                                                        fontFamily: 'OpenSans-Regular',
                                                        marginTop:
                                                            5 * factorRatio,
                                                        fontSize:
                                                            10 * factorRatio,
                                                        textAlign: 'center',
                                                        fontWeight: 'bold',
                                                        color: this.state.jordan
                                                            ? 'white'
                                                            : colors.secondBackground,
                                                    }}
                                                >
                                                    JORDAN LEIBEL
                                                </Text>
                                            </View>
                                        </View>
                                        <View
                                            style={{
                                                height: 20 * factorVertical,
                                            }}
                                        />
                                        <View
                                            key={'middleRow'}
                                            style={{
                                                flexDirection: 'row',
                                                justifyContent: 'space-around',
                                                alignContent: 'space-around',
                                                alignSelf: 'stretch',
                                            }}
                                        >
                                            <View
                                                key={'circle4'}
                                                style={{
                                                    width: 70 * factorRatio,
                                                }}
                                            >
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        this.setState({
                                                            nate: !this.state
                                                                .nate,
                                                            kenny: false,
                                                            lisa: false,
                                                            cassi: false,
                                                            jay: false,
                                                            jordan: false,
                                                            jonny: false,
                                                            brett: false,
                                                        })
                                                    }
                                                    style={{
                                                        borderWidth: this.state
                                                            .nate
                                                            ? 2 * factorRatio
                                                            : 0 * factorRatio,
                                                        borderColor: this.state
                                                            .nate
                                                            ? '#fb1b2f'
                                                            : 'black',
                                                        height:
                                                            70 * factorRatio,
                                                        width: 70 * factorRatio,
                                                        borderRadius: 300,
                                                        backgroundColor:
                                                            'white',
                                                    }}
                                                >
                                                    <FastImage
                                                        style={{
                                                            flex: 1,
                                                            borderRadius: 100,
                                                        }}
                                                        source={require('Pianote2/src/assets/img/imgs/nate-bosch.jpg')}
                                                        resizeMode={
                                                            FastImage.resizeMode
                                                                .stretch
                                                        }
                                                    />
                                                </TouchableOpacity>
                                                <Text
                                                    style={{
                                                        fontFamily: 'OpenSans-Regular',
                                                        marginTop:
                                                            5 * factorRatio,
                                                        fontSize:
                                                            11 * factorRatio,
                                                        textAlign: 'center',
                                                        fontWeight: 'bold',
                                                        color: this.state.nate
                                                            ? 'white'
                                                            : colors.secondBackground,
                                                    }}
                                                >
                                                    NATE BOSCH
                                                </Text>
                                            </View>
                                            <View
                                                key={'circle5'}
                                                style={{
                                                    width: 70 * factorRatio,
                                                }}
                                            >
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        this.setState({
                                                            brett: !this.state
                                                                .brett,
                                                            kenny: false,
                                                            lisa: false,
                                                            cassi: false,
                                                            jay: false,
                                                            jordan: false,
                                                            jonny: false,
                                                            nate: false,
                                                        })
                                                    }
                                                    style={{
                                                        borderWidth: this.state
                                                            .brett
                                                            ? 2 * factorRatio
                                                            : 0 * factorRatio,
                                                        borderColor: this.state
                                                            .brett
                                                            ? '#fb1b2f'
                                                            : 'black',
                                                        height:
                                                            70 * factorRatio,
                                                        width: 70 * factorRatio,
                                                        borderRadius: 300,
                                                        backgroundColor:
                                                            'white',
                                                    }}
                                                >
                                                    <FastImage
                                                        style={{
                                                            flex: 1,
                                                            borderRadius: 100,
                                                        }}
                                                        source={require('Pianote2/src/assets/img/imgs/brett-ziegler.jpg')}
                                                        resizeMode={
                                                            FastImage.resizeMode
                                                                .stretch
                                                        }
                                                    />
                                                </TouchableOpacity>
                                                <Text
                                                    style={{
                                                        fontFamily: 'OpenSans-Regular',
                                                        marginTop:
                                                            5 * factorRatio,
                                                        fontSize:
                                                            10 * factorRatio,
                                                        textAlign: 'center',
                                                        fontWeight: 'bold',
                                                        color: this.state.brett
                                                            ? 'white'
                                                            : colors.secondBackground,
                                                    }}
                                                >
                                                    BRETT ZIEGLER
                                                </Text>
                                            </View>
                                            <View
                                                key={'circle6'}
                                                style={{
                                                    width: 70 * factorRatio,
                                                }}
                                            >
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        this.setState({
                                                            jonny: !this.state
                                                                .jonny,
                                                            kenny: false,
                                                            lisa: false,
                                                            cassi: false,
                                                            jay: false,
                                                            jordan: false,
                                                            brett: false,
                                                            nate: false,
                                                        })
                                                    }
                                                    style={{
                                                        borderWidth: this.state
                                                            .jonny
                                                            ? 2 * factorRatio
                                                            : 0 * factorRatio,
                                                        borderColor: this.state
                                                            .jonny
                                                            ? '#fb1b2f'
                                                            : 'black',
                                                        height:
                                                            70 * factorRatio,
                                                        width: 70 * factorRatio,
                                                        borderRadius: 300,
                                                        backgroundColor:
                                                            'white',
                                                    }}
                                                >
                                                    <FastImage
                                                        style={{
                                                            flex: 1,
                                                            borderRadius: 100,
                                                        }}
                                                        source={require('Pianote2/src/assets/img/imgs/jonny-tobin.jpg')}
                                                        resizeMode={
                                                            FastImage.resizeMode
                                                                .stretch
                                                        }
                                                    />
                                                </TouchableOpacity>
                                                <Text
                                                    style={{
                                                        fontFamily: 'OpenSans-Regular',
                                                        marginTop:
                                                            5 * factorRatio,
                                                        fontSize:
                                                            11 * factorRatio,
                                                        textAlign: 'center',
                                                        fontWeight: 'bold',
                                                        color: this.state.jonny
                                                            ? 'white'
                                                            : colors.secondBackground,
                                                    }}
                                                >
                                                    JONNY TOBIN
                                                </Text>
                                            </View>
                                            <View
                                                key={'circle8'}
                                                style={{
                                                    width: 70 * factorRatio,
                                                }}
                                            >
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        this.setState({
                                                            jay: !this.state
                                                                .jay,
                                                            kenny: false,
                                                            lisa: false,
                                                            cassi: false,
                                                            jordan: false,
                                                            jonny: false,
                                                            brett: false,
                                                            nate: false,
                                                        })
                                                    }
                                                    style={{
                                                        borderWidth: this.state
                                                            .jay
                                                            ? 2 * factorRatio
                                                            : 0 * factorRatio,
                                                        borderColor: this.state
                                                            .jay
                                                            ? '#fb1b2f'
                                                            : 'black',
                                                        height:
                                                            70 * factorRatio,
                                                        width: 70 * factorRatio,
                                                        borderRadius: 300,
                                                        backgroundColor:
                                                            'white',
                                                    }}
                                                >
                                                    <FastImage
                                                        style={{
                                                            flex: 1,
                                                            borderRadius: 100,
                                                        }}
                                                        source={require('Pianote2/src/assets/img/imgs/jay-oliver.jpg')}
                                                        resizeMode={
                                                            FastImage.resizeMode
                                                                .stretch
                                                        }
                                                    />
                                                </TouchableOpacity>
                                                <Text
                                                    style={{
                                                        fontFamily: 'OpenSans-Regular',
                                                        marginTop:
                                                            5 * factorRatio,
                                                        fontSize:
                                                            10 * factorRatio,
                                                        textAlign: 'center',
                                                        fontWeight: 'bold',
                                                        color: this.state.jay
                                                            ? 'white'
                                                            : colors.secondBackground,
                                                    }}
                                                >
                                                    JAY OLIVER
                                                </Text>
                                            </View>
                                        </View>
                                        <View
                                            style={{
                                                height: 20 * factorVertical,
                                            }}
                                        />
                                    </View>
                                )}
                            <View style={{height: 50 * factorVertical}} />
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
                        zIndex: 3,
                    }}
                >
                    <View
                        style={[
                            styles.centerContent,
                            {
                                flex: 1,
                                flexDirection: 'row',
                            },
                        ]}
                    >
                        <View style={{flex: 1}} />
                        <View style={styles.centerContent}>
                            <TouchableOpacity
                                onPress={() => this.goBack()}
                                style={[
                                    styles.centerContent,
                                    {
                                        height: fullHeight * 0.05,
                                        width: fullWidth * 0.46,
                                        backgroundColor: colors.pianoteRed,
                                        borderRadius: 200,
                                    },
                                ]}
                            >
                                <Text
                                    style={{
                                        color: 'white',
                                        fontFamily: 'RobotoCondensed-Bold',
                                        fontSize: 14 * factorRatio,
                                    }}
                                >
                                    DONE & APPLY
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex: 1}} />
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
                                        borderRadius: 200,
                                    },
                                ]}
                            >
                                <Text
                                    style={{
                                        color: 'white',
                                        fontFamily: 'RobotoCondensed-Bold',
                                        fontSize: 14 * factorRatio,
                                    }}
                                >
                                    RESET
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex: 1}} />
                    </View>
                    <View style={{height: isNotch ? fullHeight * 0.035 : 0}} />
                </View>
            </View>
        );
    }
}
