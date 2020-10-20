/**
 * VerticalVideoList
 */
import React from 'react';
import {View, Text, ActivityIndicator, TouchableOpacity} from 'react-native';
import {
    addToMyList,
    removeFromMyList,
} from 'Pianote2/src/services/UserActions.js';
import Modal from 'react-native-modal';
import Relevance from '../modals/Relevance';
import FastImage from 'react-native-fast-image';
import {withNavigation} from 'react-navigation';
import ContentModal from '../modals/ContentModal';
import IonIcon from 'react-native-vector-icons/Ionicons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import Pianote from 'Pianote2/src/assets/img/svgs/pianote.svg';
import GradientFeature from 'Pianote2/src/components/GradientFeature.js';
import ApprovedTeacher from 'Pianote2/src/assets/img/svgs/approved-teacher.svg';

const sortDict = {
    newest: 'NEWEST',
    oldest: 'OLDEST',
    popularity: 'POPULAR',
    trending: 'TRENDING',
    relevance: 'RELEVANCE',
};

const instructorDict = {
    196999: 'LISA',
    197077: 'BRETT',
    197087: 'CASSI',
    202588: 'JAY',
    196994: 'JORDAN',
    203416: 'KENNY',
    243082: 'SAM',
    221245: 'JOSH',
    'Colin Swatzsky': ['COLIN', 197106],
    'Dave Attkinson': [266932],
    'DR Sean Kiligaon': [247373],
    'Gabriel Patelchi': [218895],
};

class VerticalVideoList extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            outVideos: this.props.outVideos,
            showRelevance: false,
            items: this.props.items,
            isLoading: this.props.isLoading,
            isPaging: false,
        };
    }

    UNSAFE_componentWillReceiveProps = async props => {
        if (props.isPaging !== this.state.isPaging) {
            if (!this.state.isLoading) {
                await this.setState({isPaging: props.isPaging});
            }
        }
        if (props.outVideos !== this.state.outVideos) {
            await this.setState({outVideos: props.outVideos});
        }
        if (props.isLoading !== this.state.isLoading) {
            await this.setState({
                isLoading: props.isLoading,
                items: [...this.state.items, ...props.items],
            });
        } else if (props.items !== this.state.items) {
            await this.setState({
                items: props.items,
            });
        }
    };

    showSpinner = () => {
        return (
            <View
                style={[
                    styles.centerContent,
                    {
                        height: fullHeight * 0.415,
                        marginTop: 15 * factorRatio,
                    },
                ]}
            >
                <ActivityIndicator
                    size={onTablet ? 'large' : 'small'}
                    animating={true}
                    color={colors.secondBackground}
                />
            </View>
        );
    };

    addToMyList = async contentID => {
        for (i in this.state.items) {
            if (this.state.items[i].id == contentID) {
                this.state.items[i].isAddedToList = true;
            }
        }
        addToMyList(contentID);
        this.setState({items: this.state.items});
    };

    removeFromMyList = async contentID => {
        for (i in this.state.items) {
            if (this.state.items[i].id == contentID) {
                this.state.items[i].isAddedToList = false;
            }
        }
        removeFromMyList(contentID);
        // if on my list page and user removes then delete item from listview
        if (this.props.type == 'MYLIST') {
            this.props.removeItem(contentID);
        }
        this.setState({items: this.state.items});
    };

    topics = () => {
        let topics = this.props.filters.displayTopics;
        if (topics.length > 0) {
            var topicString = '/ ';

            for (i in topics) {
                if (i == topics.length - 1) {
                    topicString = topicString + topics[i];
                } else {
                    topicString = topicString + topics[i] + ', ';
                }
            }

            return topicString;
        } else {
            return '';
        }
    };

    instructors = () => {
        let instructors = [];

        for (i in this.props.filters.instructors) {
            instructors.push(instructorDict[this.props.filters.instructors[i]]);
        }

        if (instructors.length > 0) {
            var instructorString = '/ ';

            for (i in instructors) {
                if (i == instructors.length - 1) {
                    instructorString = instructorString + instructors[i];
                } else {
                    instructorString = instructorString + instructors[i] + ', ';
                }
            }

            return instructorString;
        } else {
            return '';
        }
    };

    progress = () => {
        if (this.props.filters.progress.length > 0) {
            var progressString = '/ ';

            for (i in this.props.filters.progress) {
                if (i == this.props.filters.progress.length - 1) {
                    progressString =
                        progressString + this.props.filters.progress[i];
                } else {
                    progressString =
                        progressString + this.props.filters.progress[i] + ', ';
                }
            }

            return progressString;
        } else {
            return '';
        }
    };

    stringifyFilters = () => {
        return (
            (this.props.filters.level.length > 0
                ? '/ ' +
                  this.props.filters.level[1] +
                  ' ' +
                  this.props.filters.level[0] +
                  ' '
                : '') +
            (typeof this.topics() !== 'undefined' ? this.topics() + ' ' : '') +
            (typeof this.instructors() !== 'undefined'
                ? this.instructors() + ' '
                : '') +
            (typeof this.progress() !== 'undefined' ? this.progress() : '')
        );
    };

    like = contentID => {
        for (i in this.state.items) {
            if (this.state.items[i].id == contentID) {
                this.state.items[i].isLiked = !this.state.items.isLiked;
                this.state.items[i].like_count = this.state.items.isLiked
                    ? this.state.items.like_count + 1
                    : this.state.items.like_count - 1;
            }
        }
        this.setState({items: this.state.items});
    };

    renderMappedList = () => {
        if (this.state.items.length == 0 && this.state.outVideos) {
            return;
        } else if (this.state.items.length == 0 || this.state.isLoading) {
            return this.showSpinner();
        }

        return this.state.items.map((row, index) => {
            return (
                <View key={index}>
                    {(index >= 0 || this.props.showNextVideo == false) && (
                        <View
                            style={{
                                height: this.props.containerHeight,
                                width: this.props.containerWidth,
                                borderTopWidth: this.props.containerBorderWidth,
                                paddingLeft: 10 * factorHorizontal,
                                flexDirection: 'row',
                                borderTopColor: '#ececec',
                            }}
                        >
                            <TouchableOpacity
                                onLongPress={() => {
                                    row.type == 'unit'
                                        ? null
                                        : this.setState({
                                              showModal: true,
                                              item: row,
                                          });
                                }}
                                onPress={() => this.props.navigator(row, index)}
                                style={{justifyContent: 'center'}}
                                underlayColor={'transparent'}
                            >
                                <View
                                    style={{
                                        width: this.props.imageWidth,
                                        height: this.props.imageHeight,
                                        borderRadius: this.props.imageRadius,
                                    }}
                                >
                                    <View
                                        style={[
                                            styles.centerContent,
                                            {
                                                width: this.props.imageWidth,
                                                height: this.props.imageHeight,
                                                borderRadius: this.props
                                                    .imageRadius,
                                                zIndex: 4,
                                                opacity: 0.3,
                                                top: 0,
                                                left: 0,
                                                position: 'absolute',
                                                backgroundColor:
                                                    row.progress == 'check' ||
                                                    row.progress == 'progress'
                                                        ? '#ff3333'
                                                        : 'transparent',
                                            },
                                        ]}
                                    />
                                    <View
                                        style={[
                                            styles.centerContent,
                                            {
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: this.props.imageWidth,
                                                height: this.props.imageHeight,
                                                borderRadius: this.props
                                                    .imageRadius,
                                                zIndex: 4,
                                                opacity: 1,
                                                backgroundColor: 'transparent',
                                            },
                                        ]}
                                    >
                                        {(row.progress == 'check' ||
                                            row.progress == 'progress') && (
                                            <ApprovedTeacher
                                                height={50}
                                                width={50 * factorRatio}
                                                fill={'white'}
                                            />
                                        )}
                                    </View>

                                    {this.props.showLines && (
                                        <View
                                            style={[
                                                styles.centerContent,
                                                {
                                                    top: -3.5 * factorVertical,
                                                    height: 5 * factorVertical,
                                                    left: 0,
                                                    zIndex: 9,
                                                    width: '100%',
                                                    position: 'absolute',
                                                },
                                            ]}
                                        >
                                            <View
                                                style={{
                                                    backgroundColor: 'red',
                                                    width: '95%',
                                                    height: '100%',
                                                    borderRadius: 20,
                                                }}
                                            />
                                        </View>
                                    )}
                                    {this.props.showLines && (
                                        <View
                                            style={[
                                                styles.centerContent,
                                                {
                                                    position: 'absolute',
                                                    top: -7.5 * factorVertical,
                                                    left: 0,
                                                    width: '100%',
                                                    height:
                                                        7.5 * factorVertical,
                                                    zIndex: 8,
                                                },
                                            ]}
                                        >
                                            <View
                                                style={{
                                                    backgroundColor: '#7c1526',
                                                    width: '90%',
                                                    height: '100%',
                                                    borderRadius: 20,
                                                }}
                                            />
                                        </View>
                                    )}
                                    {this.props.isFoundationsLevel && (
                                        <View
                                            style={{
                                                height: '100%',
                                                width: '100%',
                                                position: 'absolute',
                                                left: 0,
                                                top: 0,
                                                zIndex: 15,
                                                elevation: 15,
                                            }}
                                        >
                                            <GradientFeature
                                                color={'red'}
                                                opacity={1}
                                                height={'100%'}
                                                borderRadius={
                                                    this.props.imageRadius
                                                }
                                            />
                                            <View style={{flex: 1.5}} />
                                            <View
                                                style={{
                                                    zIndex: 20,
                                                    elevation: 20,
                                                    flexDirection: 'row',
                                                }}
                                            >
                                                <FastImage
                                                    style={{
                                                        height: 8 * factorRatio,
                                                        flex: 1,
                                                        alignSelf: 'stretch',
                                                    }}
                                                    source={require('Pianote2/src/assets/img/imgs/Pianote.png')}
                                                    resizeMode={
                                                        FastImage.resizeMode
                                                            .contain
                                                    }
                                                />
                                            </View>
                                            <View
                                                style={{
                                                    height:
                                                        2.5 * factorVertical,
                                                }}
                                            />
                                            <Text
                                                style={{
                                                    zIndex: 20,
                                                    elevation: 20,
                                                    textAlign: 'center',
                                                    color: 'white',
                                                    fontFamily:
                                                        'RobotoCondensed-Bold',
                                                    fontSize: 21 * factorRatio,
                                                }}
                                            >
                                                LEVEL {index + 1}
                                            </Text>
                                            <View style={{flex: 1}} />
                                        </View>
                                    )}
                                    {row.thumbnail !== 'TBD' && (
                                        <FastImage
                                            style={{
                                                flex: 1,
                                                zIndex: 10,
                                                borderRadius: this.props
                                                    .imageRadius,
                                            }}
                                            source={{uri: row.thumbnail || ''}}
                                            resizeMode={
                                                FastImage.resizeMode.cover
                                            }
                                        />
                                    )}
                                </View>
                            </TouchableOpacity>
                            <View style={{width: 10 * factorHorizontal}} />
                            <View style={{flex: 1.5, justifyContent: 'center'}}>
                                {this.props.isFoundationsLevel && (
                                    <Text
                                        style={{
                                            fontSize: 10 * factorRatio,
                                            marginBottom: 2 * factorRatio,
                                            textAlign: 'left',
                                            fontWeight: 'bold',
                                            fontFamily: 'OpenSans-Regular',
                                            color: colors.pianoteRed,
                                        }}
                                    >
                                        {row.artist}
                                    </Text>
                                )}
                                <Text
                                    numberOfLines={2}
                                    style={{
                                        fontSize: 15 * factorRatio,
                                        textAlign: 'left',
                                        fontWeight: 'bold',
                                        fontFamily: 'OpenSans-Regular',
                                        color: 'white',
                                    }}
                                >
                                    {row.title}
                                </Text>
                                {this.props.isFoundationsLevel && (
                                    <Text
                                        numberOfLines={2}
                                        style={{
                                            marginTop: 2 * factorRatio,
                                            fontSize: 12 * factorRatio,
                                            color: colors.secondBackground,
                                            textAlign: 'left',
                                            fontFamily: 'OpenSans-Regular',
                                            paddingRight: 20 * factorHorizontal,
                                        }}
                                    >
                                        {row.description}
                                    </Text>
                                )}
                                <View style={{height: 2 * factorVertical}} />
                                <View style={{flexDirection: 'row'}}>
                                    {this.props.showLength && (
                                        <Text
                                            numberOfLines={2}
                                            style={{
                                                fontSize: 12 * factorRatio,
                                                color: colors.secondBackground,
                                                textAlign: 'left',
                                                fontFamily: 'OpenSans-Regular',
                                            }}
                                        >
                                            {Math.floor(row.duration / 60)}{' '}
                                            {Math.floor(row.duration / 60) == 1
                                                ? 'min'
                                                : 'mins'}
                                        </Text>
                                    )}
                                    {this.props.showLines && (
                                        <Text
                                            numberOfLines={1}
                                            style={{
                                                fontSize: 12 * factorRatio,
                                                color: colors.secondBackground,
                                                textAlign: 'left',
                                                fontFamily: 'OpenSans-Regular',
                                            }}
                                        >
                                            Level{' '}
                                            {(1.1 + index / 10).toFixed(1)}
                                        </Text>
                                    )}
                                    {this.props.showType && (
                                        <Text
                                            numberOfLines={2}
                                            style={{
                                                fontSize: 12 * factorRatio,
                                                color: colors.secondBackground,
                                                textAlign: 'left',
                                                fontFamily: 'OpenSans-Regular',
                                            }}
                                        >
                                            {row.type.charAt(0).toUpperCase() +
                                                row.type.slice(1)}
                                            {' / '}
                                        </Text>
                                    )}
                                    {this.props.showArtist && (
                                        <Text
                                            numberOfLines={2}
                                            style={{
                                                fontSize: 12 * factorRatio,
                                                color: colors.secondBackground,
                                                textAlign: 'left',
                                                fontFamily: 'OpenSans-Regular',
                                            }}
                                        >
                                            {row.artist}
                                        </Text>
                                    )}
                                </View>
                            </View>
                            {!this.props.isFoundationsLevel && (
                                <View style={{flex: 0.5}}>
                                    <View
                                        style={[
                                            styles.centerContent,
                                            {flex: 1},
                                        ]}
                                    >
                                        {!row.isAddedToList && (
                                            <TouchableOpacity
                                                style={{
                                                    paddingTop:
                                                        5 * factorVertical,
                                                }}
                                                onPress={() =>
                                                    this.addToMyList(row.id)
                                                }
                                            >
                                                <AntIcon
                                                    name={'plus'}
                                                    size={30 * factorRatio}
                                                    color={colors.pianoteRed}
                                                />
                                            </TouchableOpacity>
                                        )}
                                        {row.isAddedToList && (
                                            <TouchableOpacity
                                                style={{
                                                    paddingTop:
                                                        5 * factorVertical,
                                                }}
                                                onPress={() =>
                                                    this.removeFromMyList(
                                                        row.id,
                                                    )
                                                }
                                            >
                                                <AntIcon
                                                    name={'close'}
                                                    size={30 * factorRatio}
                                                    color={colors.pianoteRed}
                                                />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            )}
                        </View>
                    )}
                    {index == 0 && this.props.showNextVideo == true && (
                        <View
                            style={{
                                height:
                                    this.props.showNextVideo && index == 0
                                        ? this.props.containerHeight
                                        : this.props.containerHeight +
                                          50 * factorVertical,
                                width: this.props.containerWidth,
                                flexDirection: 'row',
                                paddingLeft: 10 * factorHorizontal,
                                backgroundColor: '#FFF1F2',
                            }}
                        >
                            <View
                                style={{
                                    position: 'absolute',
                                    top: 22.5 * factorVertical,
                                    left: 10 * factorHorizontal,
                                    width: fullWidth * 0.5,
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 12 * factorRatio,
                                        fontFamily: 'OpenSans-Bold',
                                    }}
                                    numberOfLines={1}
                                >
                                    YOUR NEXT LESSON
                                </Text>
                            </View>
                            <View
                                style={{
                                    position: 'absolute',
                                    top: 25 * factorVertical,
                                    right: 15 * factorHorizontal,
                                    width: fullWidth * 0.2,
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 12 * factorRatio,
                                        fontFamily: 'OpenSans-Regular',
                                        color: 'red',
                                        textAlign: 'right',
                                    }}
                                    numberOfLines={1}
                                >
                                    LESSON 7
                                </Text>
                            </View>
                            <TouchableOpacity
                                onLongPress={() => {
                                    row.type == 'unit'
                                        ? null
                                        : this.setState({
                                              showModal: true,
                                              item: row,
                                          });
                                }}
                                onPress={() => this.props.navigator(row, index)}
                                style={{justifyContent: 'center'}}
                                underlayColor={'transparent'}
                            >
                                <View style={{flex: 2}} />
                                <View
                                    style={{
                                        width: this.props.imageWidth,
                                        height: this.props.imageHeight,
                                        borderRadius: this.props.imageRadius,
                                        borderColor: '#ececec',
                                        borderWidth: this.props
                                            .containerBorderWidth,
                                    }}
                                >
                                    <View
                                        style={[
                                            styles.centerContent,
                                            {
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: this.props.imageWidth,
                                                height: this.props.imageHeight,
                                                borderRadius: this.props
                                                    .imageRadius,
                                                zIndex: 4,
                                                opacity: 0.3,
                                                backgroundColor:
                                                    row.progress == 'check' ||
                                                    row.progress == 'progress'
                                                        ? '#ff3333'
                                                        : 'transparent',
                                            },
                                        ]}
                                    ></View>
                                    <View
                                        style={[
                                            styles.centerContent,
                                            {
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: this.props.imageWidth,
                                                height: this.props.imageHeight,
                                                borderRadius: this.props
                                                    .imageRadius,
                                                zIndex: 4,
                                                opacity: 1,
                                                backgroundColor: 'transparent',
                                            },
                                        ]}
                                    >
                                        {(row.progress == 'check' ||
                                            row.progress == 'progress') && (
                                            <ApprovedTeacher
                                                height={50}
                                                width={50 * factorRatio}
                                                fill={'white'}
                                            />
                                        )}
                                    </View>
                                    <FastImage
                                        style={{
                                            flex: 1,
                                            borderRadius: this.props
                                                .imageRadius,
                                        }}
                                        source={{uri: row.thumbnail || ''}}
                                        resizeMode={FastImage.resizeMode.cover}
                                    />
                                </View>
                                <View style={{flex: 1}} />
                            </TouchableOpacity>
                            <View style={{width: 10 * factorHorizontal}} />
                            <View style={{flex: 1.5, justifyContent: 'center'}}>
                                <View style={{flex: 1.66}} />
                                <View style={{flex: 1}}>
                                    <Text
                                        style={{
                                            fontSize: 15 * factorRatio,
                                            textAlign: 'left',
                                            fontFamily: 'OpenSans-Bold',
                                        }}
                                    >
                                        {row.title}
                                    </Text>
                                    <View
                                        style={{height: 2 * factorVertical}}
                                    />
                                    <Text
                                        numberOfLines={2}
                                        style={{
                                            fontSize: 12 * factorRatio,
                                            color: '#9b9b9b',
                                            textAlign: 'left',
                                            fontWeight: '500',
                                        }}
                                    >
                                        {Math.floor(row.duration / 60)} mins
                                    </Text>
                                </View>
                                <View style={{flex: 1}} />
                            </View>
                            <View style={{flex: 0.5}}>
                                <View style={{flex: 1.66}} />
                                <View style={{flex: 1}}>
                                    {this.props.showPlus == null && (
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.addToMyList(row.id);
                                            }}
                                            style={[
                                                styles.centerContent,
                                                {flex: 1},
                                            ]}
                                        >
                                            <AntIcon
                                                name={'plus'}
                                                size={30 * factorRatio}
                                                color={'#c2c2c2'}
                                            />
                                        </TouchableOpacity>
                                    )}
                                </View>
                                <View style={{flex: 1}} />
                            </View>
                        </View>
                    )}
                </View>
            );
        });
    };

    render = () => {
        return (
            <View style={styles.container}>
                <View>
                    <View style={{height: 5 * factorVertical}} />
                    {this.props.showFilter && (
                        <View style={{flexDirection: 'row'}}>
                            <View style={{paddingLeft: 10 * factorHorizontal}}>
                                {this.props.showLargeTitle && (
                                    <Text
                                        style={{
                                            fontSize: 30 * factorRatio,
                                            color: 'white',
                                            fontFamily: 'OpenSans-ExtraBold',
                                        }}
                                    >
                                        {this.props.title}
                                    </Text>
                                )}
                                {!this.props.showLargeTitle && (
                                    <Text
                                        style={{
                                            fontSize: 18 * factorRatio,
                                            marginBottom: 5 * factorVertical,
                                            textAlign: 'left',
                                            fontFamily: 'RobotoCondensed-Bold',
                                            color: colors.secondBackground,
                                        }}
                                    >
                                        {this.props.title}
                                    </Text>
                                )}
                            </View>
                            <View style={{flex: 1}} />
                            {!this.props.showTitleOnly && (
                                <View
                                    style={{
                                        paddingRight: 10 * factorHorizontal,
                                        flexDirection: 'row',
                                    }}
                                >
                                    {this.props.showSort && (
                                        <TouchableOpacity
                                            style={{
                                                flexDirection: 'row',
                                                justifyContent: 'center',
                                                alignContent: 'center',
                                                alignItems: 'center',
                                            }}
                                            onPress={() => {
                                                this.setState({
                                                    showRelevance: !this.state
                                                        .showRelevance,
                                                });
                                            }}
                                        >
                                            <View style={{flex: 1}} />
                                            <Text
                                                style={{
                                                    color: colors.pianoteRed,
                                                    fontSize: 12 * factorRatio,
                                                    fontFamily:
                                                        'OpenSans-Regular',
                                                }}
                                            >
                                                {
                                                    sortDict[
                                                        this.props.currentSort
                                                    ]
                                                }
                                            </Text>
                                            <View
                                                style={{
                                                    width: 5 * factorHorizontal,
                                                }}
                                            />
                                            <View>
                                                <FontIcon
                                                    size={14 * factorRatio}
                                                    name={'sort-amount-down'}
                                                    color={colors.pianoteRed}
                                                />
                                            </View>
                                            <View style={{flex: 1}} />
                                        </TouchableOpacity>
                                    )}
                                    <View
                                        style={{width: 10 * factorHorizontal}}
                                    />
                                    <View>
                                        <View style={{flex: 1}} />
                                        {!this.props.hideFilterButton && (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    this.props.filterResults();
                                                }}
                                                style={[
                                                    styles.centerContent,
                                                    {
                                                        borderWidth:
                                                            1.5 * factorRatio,
                                                        borderColor:
                                                            colors.pianoteRed,
                                                        height:
                                                            30 * factorRatio,
                                                        width: 30 * factorRatio,
                                                        borderRadius:
                                                            20 * factorRatio,
                                                    },
                                                ]}
                                            >
                                                <View style={{flex: 1}} />
                                                <View
                                                    style={{
                                                        transform: [
                                                            {rotate: '90deg'},
                                                        ],
                                                    }}
                                                >
                                                    <IonIcon
                                                        size={14 * factorRatio}
                                                        name={'md-options'}
                                                        color={
                                                            colors.pianoteRed
                                                        }
                                                    />
                                                </View>
                                                <View style={{flex: 1}} />
                                            </TouchableOpacity>
                                        )}
                                        <View style={{flex: 1}} />
                                    </View>
                                    <View
                                        style={{width: 5 * factorHorizontal}}
                                    />
                                </View>
                            )}
                        </View>
                    )}
                    {!this.props.showTitleOnly && this.props.showFilter && (
                        <View>
                            {this.props.filters !== null &&
                                (this.props.filters.topics.length > 0 ||
                                    this.props.filters.level.length > 0 ||
                                    this.props.filters.progress.length > 0 ||
                                    this.props.filters.instructors.length >
                                        0) && (
                                    <View
                                        style={{
                                            paddingLeft: 10 * factorHorizontal,
                                            paddingRight: 10 * factorHorizontal,
                                            paddingTop: 5 * factorVertical,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 12 * factorRatio,
                                                marginBottom:
                                                    5 * factorVertical,
                                                textAlign: 'left',
                                                fontFamily: 'OpenSans-Regular',
                                                color: colors.secondBackground,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 12 * factorRatio,
                                                    marginBottom:
                                                        5 * factorVertical,
                                                    textAlign: 'left',
                                                    fontFamily: 'OpenSans-Bold',
                                                    color:
                                                        colors.secondBackground,
                                                }}
                                            >
                                                FILTERS APPLIED{' '}
                                            </Text>
                                            {this.stringifyFilters()}
                                        </Text>
                                    </View>
                                )}
                        </View>
                    )}
                    {this.state.items.length == 0 &&
                        this.state.outVideos &&
                        !this.state.isLoading && (
                            <View
                                style={{
                                    marginTop: 7.5 * factorRatio,
                                    paddingLeft: 10 * factorHorizontal,
                                    paddingRight: 10 * factorHorizontal,
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 12 * factorRatio,
                                        color: colors.secondBackground,
                                        fontFamily: 'OpenSans-Regular',
                                        textAlign: 'left',
                                    }}
                                >
                                    There are no results that match those
                                    filters.
                                </Text>
                                <View
                                    style={{
                                        height: fullHeight * 0.3,
                                    }}
                                />
                            </View>
                        )}
                    <View style={{height: 5 * factorVertical}} />
                </View>
                <View
                    style={[
                        styles.centerContent,
                        {
                            minHeight: this.props.containerHeight * 4,
                            flex: 1,
                        },
                    ]}
                >
                    {this.renderMappedList()}
                    {this.state.isPaging && !this.state.isLoading && (
                        <View
                            style={[
                                styles.centerContent,
                                {
                                    height: fullHeight * 0.115,
                                    marginTop: 15 * factorRatio,
                                },
                            ]}
                        >
                            <ActivityIndicator
                                size={onTablet ? 'large' : 'small'}
                                animating={true}
                                color={colors.secondBackground}
                            />
                        </View>
                    )}
                    <View style={{flex: 1}} />
                </View>
                <Modal
                    key={'modal'}
                    isVisible={this.state.showModal}
                    style={[
                        styles.centerContent,
                        {
                            margin: 0,
                            height: fullHeight,
                            width: fullWidth,
                        },
                    ]}
                    animation={'slideInUp'}
                    animationInTiming={250}
                    animationOutTiming={250}
                    coverScreen={true}
                    hasBackdrop={true}
                >
                    <ContentModal
                        data={this.state.item}
                        hideContentModal={() =>
                            this.setState({showModal: false})
                        }
                        like={contentID => this.like(contentID)}
                        addToMyList={contentID => this.addToMyList(contentID)}
                        removeFromMyList={contentID =>
                            this.removeFromMyList(contentID)
                        }
                    />
                </Modal>
                <Modal
                    key={'modalRelevance'}
                    isVisible={this.state.showRelevance}
                    style={[
                        styles.centerContent,
                        {
                            margin: 0,
                            height: fullHeight,
                            width: fullWidth,
                        },
                    ]}
                    animation={'slideInUp'}
                    animationInTiming={250}
                    animationOutTiming={250}
                    coverScreen={true}
                    hasBackdrop={false}
                    backdropColor={'white'}
                    backdropOpacity={0.79}
                >
                    <Relevance
                        hideRelevance={() => {
                            this.setState({showRelevance: false});
                        }}
                        currentSort={this.props.currentSort}
                        changeSort={sort => {
                            this.props.changeSort(sort);
                        }}
                    />
                </Modal>
            </View>
        );
    };
}

export default withNavigation(VerticalVideoList);
