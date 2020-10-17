/**
 * PathOverview
 */
import React from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {
    addToMyList,
    removeFromMyList,
    resetProgress,
} from '../../services/UserActions';
import Modal from 'react-native-modal';
import FastImage from 'react-native-fast-image';
import AntIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import StartIcon from '../../components/StartIcon';
import NavigationBar from '../../components/NavigationBar';
import VerticalVideoList from '../../components/VerticalVideoList';
import RestartCourse from '../../modals/RestartCourse';
import contentService from '../../services/content.service';

export default class PathOverview extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.navigation.state.params.data,
            level: this.props.navigation.state.params.level,
            items: this.props.navigation.state.params.items || [],
            isAddedToList: this.props.navigation.state.params.data.isAddedToList,
            showInfo: false,
            totalLength: 0,
        };
    }

    componentDidMount() {
        if (!this.state.items.length) this.getItems();
    }

    getItems = async () => {
        let response = await contentService.getContent(this.state.data.id)
        console.log(response)
        contentService.getContent(this.state.data.id).then(r =>
            this.setState({
                items:
                    r?.data[0]?.lessons?.map(l => ({
                        ...l,
                        thumbnail: l.data?.find(d => d.key === 'thumbnail_url')
                            ?.value,
                    })) || [],
            }),
        );
    }

    addToMyList = async () => {
        this.setState({isAddedToList: !this.state.isAddedToList});
        if (this.state.isAddedToList) {
            removeFromMyList(this.state.data.id);
        } else {
            addToMyList(this.state.data.id);
        }
    };

    render() {
        return (
            <View styles={styles.container}>
                <View
                    key={'contentContainer'}
                    style={{
                        height: fullHeight * 0.90625 - navHeight,
                        width: fullWidth,
                        alignSelf: 'stretch',
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
                            style={{
                                height: isNotch
                                    ? fullHeight * 0.05
                                    : fullHeight * 0.03,
                            }}
                        />
                        <View
                            key={'image'}
                            style={[
                                styles.centerContent,
                                {
                                    height:
                                        fullHeight * 0.31 +
                                        (isNotch ? fullHeight * 0.035 : 0),
                                },
                            ]}
                        >
                            <FastImage
                                style={{
                                    flex: 1,
                                    alignSelf: 'stretch',
                                    backgroundColor: colors.mainBackground,
                                }}
                                source={{uri: this.state.data.thumbnail}}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                            <View
                                key={'goBackIcon'}
                                style={[
                                    styles.centerContent,
                                    {
                                        position: 'absolute',
                                        left: 10 * factorHorizontal,
                                        top: isNotch
                                            ? 55 * factorVertical -
                                              fullHeight * 0.05
                                            : 45 * factorVertical -
                                              fullHeight * 0.03,
                                        height: 35 * factorRatio,
                                        width: 35 * factorRatio,
                                        borderRadius: 100,
                                        zIndex: 5,
                                    },
                                ]}
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        this.props.navigation.goBack();
                                    }}
                                    style={[
                                        styles.centerContent,
                                        {
                                            height: '100%',
                                            width: '100%',
                                            borderRadius: 100,
                                            backgroundColor: 'black',
                                            opacity: 0.4,
                                        },
                                    ]}
                                >
                                    <EntypoIcon
                                        name={'chevron-thin-left'}
                                        size={22.5 * factorRatio}
                                        color={'white'}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.props.navigation.goBack();
                                    }}
                                    style={[
                                        styles.centerContent,
                                        {
                                            height: '100%',
                                            width: '100%',
                                            borderRadius: 100,
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                        },
                                    ]}
                                >
                                    <EntypoIcon
                                        name={'chevron-thin-left'}
                                        size={22.5 * factorRatio}
                                        color={'white'}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View key={'title'}>
                            <View style={{height: 20 * factorVertical}} />
                            <View style={{flex: 1}}>
                                <Text
                                    numberOfLines={2}
                                    style={{
                                        fontFamily: 'OpenSans-Regular',
                                        fontWeight: 'bold',
                                        color: 'white',
                                        textAlign: 'center',
                                        fontSize: 24 * factorRatio,
                                    }}
                                >
                                    {this.state.data.title}
                                </Text>
                                <View style={{height: 10 * factorVertical}} />
                                <Text
                                    numberOfLines={2}
                                    style={{
                                        fontFamily: 'OpenSans-Regular',
                                        color: colors.secondBackground,
                                        textAlign: 'center',
                                        fontSize: 14 * factorRatio,
                                    }}
                                >
                                    {this.state.data.artist} | LEVEL{' '}
                                    {this.state.level} | {this.state.data.xp}XP
                                </Text>
                            </View>
                            <View style={{height: 20 * factorVertical}} />
                            <View
                                key={'thumb/Start/Info'}
                                style={{
                                    height: onTablet
                                        ? fullHeight * 0.065
                                        : fullHeight * 0.053,
                                }}
                            >
                                <View
                                    key={'thumbs'}
                                    style={[
                                        styles.centerContent,
                                        {
                                            position: 'absolute',
                                            left: 0,
                                            top: 0,
                                            width: fullWidth * 0.25,
                                            height: onTablet
                                                ? fullHeight * 0.065
                                                : fullHeight * 0.053,
                                            zIndex: 3,
                                            elevation: 3,
                                        },
                                    ]}
                                >
                                    <TouchableOpacity
                                        onPress={() => this.addToMyList()}
                                        style={{
                                            flex: 1,
                                            alignItems: 'center',
                                        }}
                                    >
                                        {!this.state.isAddedToList && (
                                            <AntIcon
                                                name={'plus'}
                                                size={27.5 * factorRatio}
                                                color={colors.pianoteRed}
                                            />
                                        )}
                                        {this.state.isAddedToList && (
                                            <AntIcon
                                                name={'close'}
                                                size={27.5 * factorRatio}
                                                color={colors.pianoteRed}
                                            />
                                        )}
                                        <Text
                                            style={{
                                                fontFamily: 'OpenSans-Regular',
                                                color: 'white',
                                                fontSize: 12 * factorRatio,
                                            }}
                                        >
                                            My List
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <StartIcon
                                    pxFromTop={0}
                                    buttonHeight={
                                        onTablet
                                            ? fullHeight * 0.065
                                            : fullHeight * 0.053
                                    }
                                    pxFromLeft={(fullWidth * 0.5) / 2}
                                    buttonWidth={fullWidth * 0.5}
                                    pressed={() =>
                                        this.props.navigation.navigate(
                                            'VIDEOPLAYER',
                                            {
                                                id: this.state.data.id,
                                            },
                                        )
                                    }
                                />
                                <View
                                    key={'info'}
                                    style={[
                                        styles.centerContent,
                                        {
                                            position: 'absolute',
                                            right: 0,
                                            top: 0,
                                            width: fullWidth * 0.25,
                                            height: onTablet
                                                ? fullHeight * 0.065
                                                : fullHeight * 0.053,
                                            zIndex: 3,
                                            elevation: 3,
                                        },
                                    ]}
                                >
                                    <TouchableOpacity
                                        onPress={() =>
                                            this.setState({
                                                showInfo: !this.state.showInfo,
                                            })
                                        }
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
                                    {this.state.data.description}
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
                                                    fontFamily: 'OpenSans-Regular',
                                                    marginTop:
                                                        10 * factorVertical,
                                                }}
                                            >
                                                {Math.floor(
                                                    Number(
                                                        this.state.data
                                                            .duration,
                                                    ) / 60,
                                                ).toString()}
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: 13 * factorRatio,
                                                    textAlign: 'left',
                                                    color: 'white',
                                                    fontFamily: 'OpenSans-Regular',
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
                                                    fontFamily: 'OpenSans-Regular',
                                                    marginTop:
                                                        10 * factorVertical,
                                                }}
                                            >
                                                {this.state.data.xp}
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: 13 * factorRatio,
                                                    textAlign: 'left',
                                                    color: 'white',
                                                    fontFamily: 'OpenSans-Regular',
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
                                            onPress={() => this.like()}
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
                                                    fontFamily: 'OpenSans-Regular',
                                                    marginTop:
                                                        10 * factorVertical,
                                                }}
                                            >
                                                {this.state.isLiked
                                                    ? this.state.data
                                                          .like_count + 1
                                                    : this.state.data
                                                          .like_count}
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
                                                    fontFamily: 'OpenSans-Regular',
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
                                                    fontFamily: 'OpenSans-Regular',
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
                        <View style={{height: 15 * factorVertical}} />
                        <View
                            key={'verticalVideoList'}
                            style={[
                                styles.centerContent,
                                {
                                    minHeight: fullHeight * 0.29 * 0.90625,
                                    justifyContent: 'space-around',
                                    alignContent: 'space-around',
                                    flexDirection: 'row',
                                },
                            ]}
                        >
                            <VerticalVideoList
                                items={this.state.items}
                                isLoading={false}
                                title={'Foundations'} // title for see all page
                                showFilter={false}
                                showType={false}
                                showArtist={false}
                                showLength={true}
                                showSort={false}
                                imageRadius={5 * factorRatio} // radius of image shown
                                containerBorderWidth={0} // border of box
                                containerWidth={fullWidth} // width of list
                                containerHeight={
                                    onTablet
                                        ? fullHeight * 0.15
                                        : Platform.OS == 'android'
                                        ? fullHeight * 0.115
                                        : fullHeight * 0.0925
                                } // height per row
                                imageHeight={
                                    onTablet
                                        ? fullHeight * 0.12
                                        : Platform.OS == 'android'
                                        ? fullHeight * 0.09
                                        : fullHeight * 0.0825
                                } // image height
                                imageWidth={fullWidth * 0.26} // image width
                                navigator={row =>
                                    this.props.navigation.navigate(
                                        'VIDEOPLAYER',
                                        {id: row.id},
                                    )
                                }
                            />
                        </View>
                    </ScrollView>
                </View>
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
                            resetProgress(this.state.data.id);
                        }}
                        hideRestartCourse={() => {
                            this.setState({
                                showRestartCourse: false,
                            });
                        }}
                        type=''
                        onRestart={() => {}}
                    />
                </Modal>
                <NavigationBar currentPage={'LessonsPathOverview'} />
            </View>
        );
    }
}
