/**
 * Foundations
 */
import React from 'react';
import {View, Text, ScrollView, TouchableOpacity, Platform} from 'react-native';
import {
    likeContent,
    unlikeContent,
    resetProgress,
} from '../../services/UserActions';
import Modal from 'react-native-modal';
import {ContentModel} from '@musora/models';
import FastImage from 'react-native-fast-image';
import {getContentChildById} from '@musora/services';
import AntIcon from 'react-native-vector-icons/AntDesign';
import StartIcon from 'Pianote2/src/components/StartIcon.js';
import Pianote from 'Pianote2/src/assets/img/svgs/pianote.svg';
import AsyncStorage from '@react-native-community/async-storage';
import RestartCourse from 'Pianote2/src/modals/RestartCourse.js';
import ContinueIcon from 'Pianote2/src/components/ContinueIcon.js';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import NavMenuHeaders from 'Pianote2/src/components/NavMenuHeaders.js';
import GradientFeature from 'Pianote2/src/components/GradientFeature.js';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import VerticalVideoList from 'Pianote2/src/components/VerticalVideoList.js';

export default class Foundations extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            showRestartCourse: false,
            profileImage: '',
            isStarted: false,
            isLiked: false,
            showInfo: false,
            isLoadingAll: true,
            totalLength: 0,
            level: 1,
        };
    }

    componentDidMount = async () => {
        let profileImage = await AsyncStorage.getItem('profileURI');
        if (profileImage !== null) {
            await this.setState({profileImage});
        }

        this.getContent();
    };

    getContent = async () => {
        const {response, error} = await getContentChildById({
            parentId: '215952',
        });

        const newContent = response.data.data.map((data) => {
            return new ContentModel(data);
        });

        console.log('FOUNDATIONS', newContent);

        items = [];
        for (i in newContent) {
            if (newContent[i].getData('thumbnail_url') !== 'TBD') {
                items.push({
                    title: newContent[i].getField('title'),
                    artist: newContent[i].getField('instructor').fields[0]
                        .value,
                    thumbnail: newContent[i].getData('thumbnail_url'),
                    type: newContent[i].post.type,
                    current_lesson_index:
                        newContent[i].post.current_lesson_index,
                    current_lesson: newContent[i].post.current_lesson,
                    next_lesson: newContent[i].post.next_lesson,
                    description: newContent[i]
                        .getData('description')
                        .replace(/(<([^>]+)>)/gi, ''),
                    xp: newContent[i].post.xp,
                    id: newContent[i].id,
                    lesson_count: newContent[i].post.lesson_count,
                    like_count: newContent[i].post.like_count,
                    duration: this.getDuration(newContent[i]),
                    isLiked: newContent[i].isLiked,
                    isAddedToList: newContent[i].isAddedToList,
                    isStarted: newContent[i].isStarted,
                    isCompleted: newContent[i].isCompleted,
                    bundle_count: newContent[i].post.bundle_count,
                    progress_percent: newContent[i].post.progress_percent,
                });
            }
        }

        for (i in items) {
            this.state.totalLength =
                this.state.totalLength + Number(items[i].duration);
        }
        this.state.totalLength = Math.floor(
            this.state.totalLength / 60,
        ).toString();

        this.setState({
            items: [...this.state.items, ...items],
            isLoadingAll: false,
            totalLength: this.state.totalLength,
        });
    };

    getDuration = (newContent) => {
        var data = 0;
        try {
            for (i in newContent.post.current_lesson.fields) {
                if (newContent.post.current_lesson.fields[i].key == 'video') {
                    var data =
                        newContent.post.current_lesson.fields[i].value.fields;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].key == 'length_in_seconds') {
                            return data[i].value;
                        }
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    render() {
        return (
            <View styles={styles.container}>
                <View
                    style={{
                        height: fullHeight * 0.1,
                        width: fullWidth,
                        position: 'absolute',
                        zIndex: 2,
                        elevation: 2,
                        alignSelf: 'stretch',
                    }}
                >
                    <NavMenuHeaders
                        currentPage={'LESSONS'}
                        parentPage={'FOUNDATIONS'}
                    />
                </View>
                <View
                    style={{
                        height: fullHeight - navHeight,
                        alignSelf: 'stretch',
                        zIndex: 1,
                        elevation: 1,
                    }}
                >
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentInsetAdjustmentBehavior={'never'}
                        style={{
                            flex: 1,
                            backgroundColor: colors.mainBackground,
                        }}
                    >
                        <View
                            key={'backgroundColoring'}
                            style={{
                                backgroundColor: colors.thirdBackground,
                                position: 'absolute',
                                height: fullHeight,
                                top: -fullHeight,
                                left: 0,
                                right: 0,
                                zIndex: 10,
                                elevation: 10,
                            }}
                        />
                        <View
                            key={'header'}
                            style={{
                                height: fullHeight * 0.1,
                                backgroundColor: colors.thirdBackground,
                            }}
                        />
                        <View
                            key={'image'}
                            style={[
                                styles.centerContent,
                                {
                                    height: fullHeight * 0.32,
                                },
                            ]}
                        >
                            <GradientFeature
                                color={'blue'}
                                opacity={1}
                                height={'100%'}
                                borderRadius={0}
                            />
                            <FastImage
                                style={{
                                    flex: 1,
                                    alignSelf: 'stretch',
                                    backgroundColor: colors.mainBackground,
                                }}
                                source={require('Pianote2/src/assets/img/imgs/foundations-background-image.png')}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                            <View
                                key={'pianoteSVG'}
                                style={{
                                    position: 'absolute',
                                    height: '100%',
                                    width: fullWidth,
                                    zIndex: 2,
                                    elevation: 2,
                                }}
                            >
                                <View style={{flex: 0.4}} />
                                <View style={{flexDirection: 'row'}}>
                                    <View style={{flex: 1}} />
                                    <Pianote
                                        height={fullHeight * 0.03}
                                        width={fullWidth * 0.35}
                                        fill={'white'}
                                    />
                                    <View style={{flex: 1}} />
                                </View>
                                <Text
                                    key={'foundations'}
                                    style={{
                                        fontSize: 60 * factorRatio,
                                        fontWeight: '700',
                                        color: 'white',
                                        fontFamily: 'RobotoCondensed-Regular',
                                        transform: [{scaleX: 0.7}],
                                        textAlign: 'center',
                                    }}
                                >
                                    FOUNDATIONS
                                </Text>
                                <View style={{flex: 0.6}} />
                                {this.state.isStarted && (
                                    <ContinueIcon
                                        pxFromTop={
                                            onTablet
                                                ? fullHeight * 0.32 * 0.725
                                                : fullHeight * 0.305 * 0.725
                                        }
                                        buttonHeight={
                                            onTablet
                                                ? fullHeight * 0.06
                                                : Platform.OS == 'ios'
                                                ? fullHeight * 0.05
                                                : fullHeight * 0.055
                                        }
                                        pxFromLeft={(fullWidth * 0.5) / 2}
                                        buttonWidth={fullWidth * 0.5}
                                        pressed={() => {
                                            this.props.navigation.navigate(
                                                'FOUNDATIONSLEVEL',
                                                {
                                                    level: 1,
                                                    data: this.state.items[0],
                                                },
                                            );
                                        }}
                                    />
                                )}
                                {!this.state.isStarted && (
                                    <StartIcon
                                        pxFromTop={
                                            onTablet
                                                ? fullHeight * 0.32 * 0.725
                                                : fullHeight * 0.305 * 0.725
                                        }
                                        buttonHeight={
                                            onTablet
                                                ? fullHeight * 0.06
                                                : Platform.OS == 'ios'
                                                ? fullHeight * 0.05
                                                : fullHeight * 0.055
                                        }
                                        pxFromLeft={(fullWidth * 0.5) / 2}
                                        buttonWidth={fullWidth * 0.5}
                                        pressed={() => {
                                            this.props.navigation.navigate(
                                                'FOUNDATIONSLEVEL',
                                                {
                                                    level: 1,
                                                    data: this.state.items[0],
                                                },
                                            );
                                        }}
                                    />
                                )}
                                <View
                                    key={'info'}
                                    style={[
                                        styles.centerContent,
                                        {
                                            position: 'absolute',
                                            right: 0,
                                            top: onTablet
                                                ? fullHeight * 0.32 * 0.725
                                                : fullHeight * 0.305 * 0.725,
                                            width: fullWidth * 0.25,
                                            height: onTablet
                                                ? fullHeight * 0.06
                                                : Platform.OS == 'ios'
                                                ? fullHeight * 0.05
                                                : fullHeight * 0.055,
                                            zIndex: 3,
                                            elevation: 3,
                                        },
                                    ]}
                                >
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({
                                                showInfo: !this.state.showInfo,
                                            });
                                        }}
                                        style={{
                                            flex: 1,
                                            alignItems: 'center',
                                        }}
                                    >
                                        <AntIcon
                                            name={
                                                this.state.showInfo
                                                    ? 'infocirlce'
                                                    : 'infocirlceo'
                                            }
                                            size={22 * factorRatio}
                                            color={colors.pianoteRed}
                                        />
                                        <Text
                                            style={{
                                                fontFamily: 'OpenSans-Regular',
                                                color: 'white',
                                                marginTop: 3 * factorRatio,
                                                fontSize: 13 * factorRatio,
                                            }}
                                        >
                                            Info
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        {this.state.showInfo && (
                            <View
                                key={'info'}
                                style={{
                                    width: fullWidth,
                                    paddingLeft: fullWidth * 0.05,
                                    paddingRight: fullWidth * 0.05,
                                }}
                            >
                                <View style={{height: 20 * factorVertical}} />
                                <Text
                                    style={{
                                        fontFamily: 'OpenSans-Regular',
                                        marginTop: 5 * factorVertical,
                                        fontSize: 15 * factorRatio,
                                        color: 'white',
                                        textAlign: 'center',
                                    }}
                                >
                                    Hanon exercises have been around forever and
                                    there is a great reason for their sticking
                                    power. Therese exercises make the perfect
                                    warm up for daily practice. They will help
                                    you to develop speed, dexterity and finer
                                    independence as well as give you a platform
                                    to practice dynamics and articulations.
                                </Text>
                                <View key={'containStats'}>
                                    <View
                                        style={{height: 10 * factorVertical}}
                                    />
                                    <View
                                        key={'stats'}
                                        style={[
                                            styles.centerContent,
                                            {
                                                flex: 0.22,
                                                flexDirection: 'row',
                                            },
                                        ]}
                                    >
                                        <View
                                            style={{
                                                flex: 1,
                                                alignSelf: 'stretch',
                                            }}
                                        />
                                        <View
                                            style={[
                                                styles.centerContent,
                                                {
                                                    width: 70 * factorRatio,
                                                },
                                            ]}
                                        >
                                            <Text
                                                style={{
                                                    fontWeight: '700',
                                                    fontSize: 17 * factorRatio,
                                                    textAlign: 'left',
                                                    color: 'white',
                                                    fontFamily:
                                                        'OpenSans-Regular',
                                                    marginTop:
                                                        10 * factorVertical,
                                                }}
                                            >
                                                {this.state.items.length}
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: 13 * factorRatio,
                                                    textAlign: 'left',
                                                    color: 'white',
                                                    fontFamily:
                                                        'OpenSans-Regular',
                                                    marginTop:
                                                        10 * factorVertical,
                                                }}
                                            >
                                                LESSONS
                                            </Text>
                                        </View>
                                        <View
                                            style={{width: 15 * factorRatio}}
                                        />
                                        <View
                                            style={[
                                                styles.centerContent,
                                                {
                                                    width: 70 * factorRatio,
                                                },
                                            ]}
                                        >
                                            <Text
                                                style={{
                                                    fontWeight: '700',
                                                    fontSize: 17 * factorRatio,
                                                    textAlign: 'left',
                                                    color: 'white',
                                                    fontFamily:
                                                        'OpenSans-Regular',
                                                    marginTop:
                                                        10 * factorVertical,
                                                }}
                                            >
                                                {this.state.totalLength}
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: 13 * factorRatio,
                                                    textAlign: 'left',
                                                    color: 'white',
                                                    fontFamily:
                                                        'OpenSans-Regular',
                                                    marginTop:
                                                        10 * factorVertical,
                                                }}
                                            >
                                                MINS
                                            </Text>
                                        </View>
                                        <View
                                            style={{width: 15 * factorRatio}}
                                        />
                                        <View
                                            style={[
                                                styles.centerContent,
                                                {
                                                    width: 70 * factorRatio,
                                                },
                                            ]}
                                        >
                                            <Text
                                                style={{
                                                    fontWeight: '700',
                                                    fontSize: 17 * factorRatio,
                                                    textAlign: 'left',
                                                    color: 'white',
                                                    fontFamily:
                                                        'OpenSans-Regular',
                                                    marginTop:
                                                        10 * factorVertical,
                                                }}
                                            >
                                                2400
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: 13 * factorRatio,
                                                    textAlign: 'left',
                                                    color: 'white',
                                                    fontFamily:
                                                        'OpenSans-Regular',
                                                    marginTop:
                                                        10 * factorVertical,
                                                }}
                                            >
                                                XP
                                            </Text>
                                        </View>

                                        <View
                                            style={{
                                                flex: 1,
                                                alignSelf: 'stretch',
                                            }}
                                        />
                                    </View>
                                    <View
                                        style={{height: 15 * factorVertical}}
                                    />
                                    <View
                                        key={'buttons'}
                                        style={[
                                            styles.centerContent,
                                            {
                                                flex: 0.25,
                                                flexDirection: 'row',
                                            },
                                        ]}
                                    >
                                        <View
                                            style={{
                                                flex: 1,
                                                alignSelf: 'stretch',
                                            }}
                                        />
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setState({
                                                    isLiked: !this.state
                                                        .isLiked,
                                                }),
                                                    this.state.isLiked
                                                        ? unlikeContent(
                                                              '215952',
                                                          )
                                                        : likeContent('215952');
                                            }}
                                            style={[
                                                styles.centerContent,
                                                {
                                                    width: 70 * factorRatio,
                                                },
                                            ]}
                                        >
                                            <View style={{flex: 1}} />
                                            <AntIcon
                                                name={
                                                    this.state.isLiked
                                                        ? 'like1'
                                                        : 'like2'
                                                }
                                                size={27.5 * factorRatio}
                                                color={colors.pianoteRed}
                                            />
                                            <Text
                                                style={{
                                                    fontSize: 13 * factorRatio,
                                                    textAlign: 'left',
                                                    color: 'white',
                                                    fontFamily:
                                                        'OpenSans-Regular',
                                                    marginTop:
                                                        10 * factorVertical,
                                                }}
                                            >
                                                {34 +
                                                    (this.state.isLiked
                                                        ? 1
                                                        : 0)}
                                            </Text>
                                        </TouchableOpacity>
                                        <View
                                            style={{width: 15 * factorRatio}}
                                        />
                                        <TouchableOpacity
                                            style={[
                                                styles.centerContent,
                                                {
                                                    width: 70 * factorRatio,
                                                },
                                            ]}
                                        >
                                            <View style={{flex: 1}} />
                                            <MaterialIcon
                                                name={'arrow-collapse-down'}
                                                size={27.5 * factorRatio}
                                                color={colors.pianoteRed}
                                            />
                                            <Text
                                                style={{
                                                    fontSize: 13 * factorRatio,
                                                    textAlign: 'left',
                                                    color: 'white',
                                                    fontFamily:
                                                        'OpenSans-Regular',
                                                    marginTop:
                                                        10 * factorVertical,
                                                }}
                                            >
                                                Download
                                            </Text>
                                        </TouchableOpacity>
                                        <View
                                            style={{width: 15 * factorRatio}}
                                        />
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setState({
                                                    showRestartCourse: true,
                                                });
                                            }}
                                            style={[
                                                styles.centerContent,
                                                {
                                                    width: 70 * factorRatio,
                                                },
                                            ]}
                                        >
                                            <View style={{flex: 1}} />
                                            <MaterialIcon
                                                name={'replay'}
                                                size={27.5 * factorRatio}
                                                color={colors.pianoteRed}
                                            />
                                            <Text
                                                style={{
                                                    fontSize: 13 * factorRatio,
                                                    textAlign: 'left',
                                                    color: 'white',
                                                    fontFamily:
                                                        'OpenSans-Regular',
                                                    marginTop:
                                                        10 * factorVertical,
                                                }}
                                            >
                                                Restart
                                            </Text>
                                        </TouchableOpacity>
                                        <View
                                            style={{
                                                flex: 1,
                                                alignSelf: 'stretch',
                                            }}
                                        />
                                    </View>
                                    <View
                                        style={{height: 30 * factorVertical}}
                                    />
                                </View>
                            </View>
                        )}
                        {this.state.isStarted && (
                            <View
                                style={{
                                    height: fullHeight * 0.08,
                                    width: fullWidth,
                                    flexDirection: 'row',
                                }}
                            >
                                <View
                                    key={'profileImage'}
                                    style={{
                                        flex: 0.4,
                                        flexDirection: 'row',
                                        paddingRight: fullWidth * 0.035,
                                    }}
                                >
                                    <View style={{flex: 1}} />
                                    <View>
                                        <View style={{flex: 1}} />
                                        <View
                                            style={{
                                                height: fullHeight * 0.075,
                                                width: fullHeight * 0.075,
                                                backgroundColor: 'red',
                                                borderRadius: 200,
                                                borderWidth: 2 * factorRatio,
                                                borderColor:
                                                    colors.secondBackground,
                                                backgroundColor:
                                                    colors.secondBackground,
                                            }}
                                        >
                                            <FastImage
                                                style={{
                                                    flex: 1,
                                                    borderRadius: 100,
                                                    backgroundColor:
                                                        colors.secondBackground,
                                                }}
                                                source={
                                                    require('Pianote2/src/assets/img/imgs/lisa-witt.jpg')
                                                    //    {uri: this.state.profileImage}
                                                }
                                                resizeMode={
                                                    FastImage.resizeMode.cover
                                                }
                                            />
                                        </View>
                                        <View style={{flex: 1}} />
                                    </View>
                                </View>
                                <View style={{flex: 0.6}}>
                                    <View style={{flex: 1}} />
                                    <Text
                                        style={{
                                            fontFamily: 'OpenSans-Regular',
                                            fontWeight:
                                                Platform.OS == 'ios'
                                                    ? '800'
                                                    : 'bold',
                                            color: 'white',
                                            textAlign: 'left',
                                            fontSize: 28 * factorRatio,
                                        }}
                                    >
                                        LEVEL {this.state.level}
                                    </Text>
                                    <View style={{flex: 1}} />
                                </View>
                            </View>
                        )}
                        <VerticalVideoList
                            items={this.state.items}
                            isLoading={this.state.isLoadingAll}
                            title={'FOUNDATIONS'}
                            type={'LESSONS'}
                            showFilter={false}
                            showType={false}
                            showArtist={false}
                            showLength={false}
                            showSort={false}
                            isFoundationsLevel={true}
                            imageRadius={5 * factorRatio}
                            containerBorderWidth={0}
                            containerWidth={fullWidth}
                            containerHeight={fullWidth * 0.3}
                            imageHeight={fullWidth * 0.26}
                            imageWidth={fullWidth * 0.26}
                            imageRadius={7.5 * factorRatio}
                            containerBorderWidth={0}
                            containerWidth={fullWidth}
                            containerHeight={fullWidth * 0.285}
                            imageHeight={fullWidth * 0.25}
                            imageWidth={fullWidth * 0.25}
                            navigator={(row, index) => {
                                this.props.navigation.navigate(
                                    'FOUNDATIONSLEVEL',
                                    {
                                        level: index + 1,
                                        data: row,
                                    },
                                );
                            }}
                        />
                    </ScrollView>
                    <Modal
                        key={'restartCourse'}
                        isVisible={this.state.showRestartCourse}
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
                        <RestartCourse
                            restartCourse={() => {
                                resetProgress('215952');
                            }}
                            hideRestartCourse={() => {
                                this.setState({
                                    showRestartCourse: false,
                                });
                            }}
                        />
                    </Modal>
                    <NavigationBar currentPage={''} />
                </View>
            </View>
        );
    }
}
