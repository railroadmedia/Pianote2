/**
 * StudentFocusCatalog
 */
import React from 'react';
import {View, ScrollView, Text, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import {ContentModel} from '@musora/models';
import FastImage from 'react-native-fast-image';
import {getStartedContent} from '../../services/GetContent';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import NavMenuHeaders from 'Pianote2/src/components/NavMenuHeaders.js';
import NavigationMenu from 'Pianote2/src/components/NavigationMenu.js';
import HorizontalVideoList from 'Pianote2/src/components/HorizontalVideoList.js';
import {NetworkContext} from '../../context/NetworkProvider';

export default class StudentFocusCatalog extends React.Component {
    static navigationOptions = {header: null};
    static contextType = NetworkContext;
    constructor(props) {
        super(props);
        this.state = {
            progressStudentFocus: [], // videos
            isLoadingProgress: true,
            started: true,
        };
    }

    componentDidMount = async () => {
        if (!this.context.isConnected) {
            return this.context.showNoConnectionAlert();
        }
        let response = await getStartedContent(
            'quick-tips&included_types[]=question-and-answer&included_types[]=student-review&included_types[]=boot-camps',
        );
        const newContent = await response.data.map(data => {
            return new ContentModel(data);
        });

        let items = [];
        for (let i in newContent) {
            if (newContent[i].getData('thumbnail_url') !== 'TBD') {
                items.push({
                    title: newContent[i].getField('title'),
                    artist: newContent[i].getField('instructor').fields[0]
                        .value,
                    thumbnail: newContent[i].getData('thumbnail_url'),
                    type: newContent[i].post.type,
                    description: newContent[i]
                        .getData('description')
                        .replace(/(<([^>]+)>)/g, '')
                        .replace(/&nbsp;/g, '')
                        .replace(/&amp;/g, '&')
                        .replace(/&#039;/g, "'")
                        .replace(/&quot;/g, '"')
                        .replace(/&gt;/g, '>')
                        .replace(/&lt;/g, '<'),
                    xp: newContent[i].post.xp,
                    id: newContent[i].id,
                    like_count: newContent[i].likeCount,
                    duration: this.getDuration(newContent[i]),
                    isLiked: newContent[i].post.is_liked_by_current_user,
                    isAddedToList: newContent[i].isAddedToList,
                    isStarted: newContent[i].isStarted,
                    isCompleted: newContent[i].isCompleted,
                    bundle_count: newContent[i].post.bundle_count,
                    progress_percent: newContent[i].post.progress_percent,
                });
            }
        }

        this.setState({
            progressStudentFocus: [
                ...this.state.progressStudentFocus,
                ...items,
            ],
            isLoadingProgress: false,
            started:
                response.data.length == 0 &&
                this.state.progressStudentFocus.length == 0
                    ? false
                    : true,
        });
    };

    getDuration = async newContent => {
        if (newContent.post.fields[0].key == 'video') {
            return newContent.post.fields[0].value.fields[1].value;
        } else if (newContent.post.fields[1].key == 'video') {
            return newContent.post.fields[1].value.fields[1].value;
        } else if (newContent.post.fields[2].key == 'video') {
            return newContent.post.fields[2].value.fields[1].value;
        }
    };

    render() {
        return (
            <View style={styles.container}>
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
                        parentPage={'STUDENT FOCUS'}
                    />
                </View>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentInsetAdjustmentBehavior={'never'}
                    style={{
                        flex: 1,
                        backgroundColor: colors.mainBackground,
                    }}
                >
                    <View
                        key={'header'}
                        style={{
                            height: fullHeight * 0.1,
                            backgroundColor: colors.thirdBackground,
                        }}
                    />
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
                    <View style={{height: 20 * factorVertical}} />
                    <Text
                        style={{
                            paddingLeft: 12 * factorHorizontal,
                            fontSize: 30 * factorRatio,
                            color: 'white',
                            fontFamily: 'OpenSans-ExtraBold',
                        }}
                    >
                        Student Focus
                    </Text>
                    <View style={{height: 15 * factorVertical}} />
                    {this.state.started && (
                        <View
                            key={'continueCourses'}
                            style={{
                                minHeight: fullHeight * 0.305,
                                paddingLeft: fullWidth * 0.035,
                                backgroundColor: colors.mainBackground,
                            }}
                        >
                            <HorizontalVideoList
                                Title={'CONTINUE'}
                                seeAll={() =>
                                    this.props.navigation.navigate('SEEALL', {
                                        title: 'Continue',
                                        parent: 'Student Focus',
                                    })
                                }
                                hideSeeAll={true}
                                showArtist={true}
                                isLoading={this.state.isLoadingProgress}
                                showType={true}
                                items={this.state.progressStudentFocus}
                                itemWidth={
                                    isNotch
                                        ? fullWidth * 0.6
                                        : onTablet
                                        ? fullWidth * 0.425
                                        : fullWidth * 0.55
                                }
                                itemHeight={
                                    isNotch
                                        ? fullHeight * 0.155
                                        : fullHeight * 0.175
                                }
                            />
                        </View>
                    )}

                    <View
                        key={'pack'}
                        style={{
                            height: fullWidth * 0.45 * 2 + fullWidth * 0.033,
                            width: fullWidth,
                            justifyContent: 'space-around',
                            alignContent: 'space-around',
                        }}
                    >
                        <View
                            key={'Q&A'}
                            style={{
                                borderRadius: 12.5 * factorRatio,
                                position: 'absolute',
                                top: 0,
                                right: fullWidth * 0.035,
                                height: fullWidth * 0.45,
                                width: fullWidth * 0.45,
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.navigate(
                                        'STUDENTFOCUSSHOW',
                                        {
                                            pack: 'Q&A',
                                        },
                                    );
                                }}
                                style={{
                                    height: fullWidth * 0.45,
                                    width: fullWidth * 0.45,
                                    zIndex: 10,
                                    elevation: 10,
                                }}
                            >
                                <FastImage
                                    style={{
                                        flex: 1,
                                        borderRadius: 10 * factorRatio,
                                    }}
                                    source={require('Pianote2/src/assets/img/imgs/questionAnswer.jpg')}
                                    resizeMode={FastImage.resizeMode.cover}
                                />
                            </TouchableOpacity>
                        </View>
                        <View
                            key={'bootcamps'}
                            style={{
                                borderRadius: 12.5 * factorRatio,
                                position: 'absolute',
                                top: 0,
                                left: fullWidth * 0.035,
                                height: fullWidth * 0.45,
                                width: fullWidth * 0.45,
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.navigate(
                                        'STUDENTFOCUSSHOW',
                                        {
                                            pack: 'Bootcamps',
                                        },
                                    );
                                }}
                                style={{
                                    height: fullWidth * 0.45,
                                    width: fullWidth * 0.45,
                                }}
                            >
                                <FastImage
                                    style={{
                                        flex: 1,
                                        borderRadius: 10 * factorRatio,
                                    }}
                                    source={require('Pianote2/src/assets/img/imgs/bootcamps.jpg')}
                                    resizeMode={FastImage.resizeMode.cover}
                                />
                            </TouchableOpacity>
                        </View>
                        <View
                            key={'studentReviews'}
                            style={{
                                borderRadius: 12.5 * factorRatio,
                                position: 'absolute',
                                bottom: 0,
                                right: fullWidth * 0.035,
                                height: fullWidth * 0.45,
                                width: fullWidth * 0.45,
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.navigate(
                                        'STUDENTFOCUSSHOW',
                                        {
                                            pack: 'Student Review',
                                        },
                                    );
                                }}
                                style={{
                                    height: fullWidth * 0.45,
                                    width: fullWidth * 0.45,
                                }}
                            >
                                <FastImage
                                    style={{
                                        flex: 1,
                                        borderRadius: 10 * factorRatio,
                                    }}
                                    source={require('Pianote2/src/assets/img/imgs/studentReview.jpg')}
                                    resizeMode={FastImage.resizeMode.cover}
                                />
                            </TouchableOpacity>
                        </View>
                        <View
                            key={'quicktips'}
                            style={{
                                borderRadius: 12.5 * factorRatio,
                                position: 'absolute',
                                bottom: 0,
                                left: fullWidth * 0.035,
                                height: fullWidth * 0.45,
                                width: fullWidth * 0.45,
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.navigate(
                                        'STUDENTFOCUSSHOW',
                                        {
                                            pack: 'Quick Tips',
                                        },
                                    );
                                }}
                                style={{
                                    height: fullWidth * 0.45,
                                    width: fullWidth * 0.45,
                                }}
                            >
                                <FastImage
                                    style={{
                                        flex: 1,
                                        borderRadius: 10 * factorRatio,
                                    }}
                                    source={require('Pianote2/src/assets/img/imgs/quickTips.jpg')}
                                    resizeMode={FastImage.resizeMode.cover}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{height: 15 * factorVertical}} />
                </ScrollView>

                <NavigationBar currentPage={''} />
                <Modal
                    key={'navMenu'}
                    isVisible={this.state.showModalMenu}
                    style={{
                        margin: 0,
                        height: fullHeight,
                        width: fullWidth,
                    }}
                    animation={'slideInUp'}
                    animationInTiming={250}
                    animationOutTiming={250}
                    coverScreen={true}
                    hasBackdrop={false}
                >
                    <NavigationMenu
                        onClose={e => this.setState({showModalMenu: e})}
                        menu={this.state.menu}
                        parentPage={this.state.parentPage}
                    />
                </Modal>
            </View>
        );
    }
}
