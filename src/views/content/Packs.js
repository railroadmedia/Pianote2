/**
 * Packs
 */
import React from 'react';
import {
    View,
    TouchableOpacity,
    ActivityIndicator,
    Platform,
    FlatList,
    RefreshControl,
} from 'react-native';
import Modal from 'react-native-modal';
import {ContentModel} from '@musora/models';
import FastImage from 'react-native-fast-image';
import StartIcon from 'Pianote2/src/components/StartIcon.js';
import MoreInfoIcon from 'Pianote2/src/components/MoreInfoIcon.js';
import RestartCourse from 'Pianote2/src/modals/RestartCourse.js';
import ContinueIcon from 'Pianote2/src/components/ContinueIcon.js';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import NavigationMenu from 'Pianote2/src/components/NavigationMenu.js';
import NavMenuHeaders from 'Pianote2/src/components/NavMenuHeaders.js';
import GradientFeature from 'Pianote2/src/components/GradientFeature.js';
import {resetProgress} from 'Pianote2/src/services/UserActions.js';
import packsService from '../../services/packs.service';
import {NetworkContext} from '../../context/NetworkProvider';

export default class Packs extends React.Component {
    static navigationOptions = {header: null};
    static contextType = NetworkContext;
    constructor(props) {
        super(props);
        this.state = {
            showModalMenu: false,
            packs: [],
            headerPackImg: '',
            headerPackLogo: '',
            headerPackUrl: '',
            headerPackNextLessonUrl: '',
            headerPackCompleted: false,
            headerPackStarted: false,
            isLoading: true,
            showRestartCourse: false,
        };
    }

    componentDidMount = () => {
        this.getData();
    };

    async getData() {
        if (!this.context.isConnected) {
            return this.context.showNoConnectionAlert();
        }
        const response = await packsService.allPacks();
        const newContent = response.myPacks.map(data => {
            return new ContentModel(data);
        });
        const topHeaderPack = new ContentModel(response.topHeaderPack);

        let items = [];
        for (let i in newContent) {
            if (newContent[i].getData('thumbnail_url') !== 'TBD') {
                items.push({
                    id: newContent[i].id,
                    thumbnail: newContent[i].getData('thumbnail_url'),
                    logo: newContent[i].getData('logo_image_url'),
                    bundle_count: newContent[i].post.bundle_count,
                    mobile_app_url: newContent[i].post.mobile_app_url,
                });
            }
        }

        this.setState({
            packs: [...this.state.packs, ...items],
            isLoading: false,
            showRestartCourse: false,
            headerPackImg: topHeaderPack.getData('thumbnail_url'),
            headerPackLogo: topHeaderPack.getData('logo_image_url'),
            headerPackUrl: topHeaderPack.post.mobile_app_url,
            headerPackCompleted: topHeaderPack.isCompleted,
            headerPackStarted: topHeaderPack.isStarted,
            headerPackNextLessonUrl:
                topHeaderPack.post.next_lesson_mobile_app_url,
        });
    }

    onRestartPack = async () => {
        if (!this.context.isConnected) {
            return this.context.showNoConnectionAlert();
        }
        await resetProgress(this.state.id);
        this.setState({isLoading: true}, () => this.getData());
    };

    refresh = () => {
        this.setState({isLoading: true, packs: []}, () => {
            this.getData();
        });
    };

    render() {
        return (
            <View
                style={[
                    styles.container,
                    {backgroundColor: colors.mainBackground},
                ]}
            >
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
                    <NavMenuHeaders currentPage={'PACKS'} />
                </View>

                <FlatList
                    windowSize={10}
                    style={{flex: 1}}
                    initialNumToRender={5}
                    maxToRenderPerBatch={10}
                    numColumns={3}
                    removeClippedSubviews={true}
                    keyExtractor={item => item.id}
                    data={this.state.packs}
                    keyboardShouldPersistTaps='handled'
                    refreshControl={
                        <RefreshControl
                            colors={[colors.pianoteRed]}
                            refreshing={this.state.isLoading}
                            onRefresh={() => this.refresh()}
                        />
                    }
                    ListEmptyComponent={() => (
                        <View
                            style={[
                                styles.centerContent,
                                {
                                    height: fullHeight * 0.4,
                                    width: '100%',
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
                    ListHeaderComponent={() => (
                        <View
                            key={'image'}
                            style={[
                                styles.centerContent,
                                {
                                    height: fullHeight * 0.5,
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
                                source={{
                                    uri: `https://cdn.musora.com/image/fetch/fl_lossy,q_auto:eco,w_${Math.round(
                                        fullWidth,
                                    )},ar_2,c_fill,g_face/${
                                        this.state.headerPackImg
                                    }`,
                                }}
                                resizeMode={FastImage.resizeMode.contain}
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
                                <FastImage
                                    style={{
                                        width: '80%',
                                        height: '100%',
                                        borderRadius: 7.5 * factorRatio,
                                        alignSelf: 'center',
                                    }}
                                    source={{
                                        uri: this.state.headerPackLogo,
                                    }}
                                    resizeMode={FastImage.resizeMode.contain}
                                />

                                {this.state.headerPackCompleted ? (
                                    <ResetIcon
                                        pxFromTop={
                                            onTablet
                                                ? fullHeight * 0.5 * 0.725
                                                : fullHeight * 0.5 * 0.725
                                        }
                                        buttonHeight={
                                            onTablet
                                                ? fullHeight * 0.06
                                                : Platform.OS == 'ios'
                                                ? fullHeight * 0.05
                                                : fullHeight * 0.055
                                        }
                                        pxFromLeft={fullWidth * 0.065}
                                        buttonWidth={fullWidth * 0.42}
                                        pressed={() =>
                                            this.setState({
                                                showRestartCourse: true,
                                            })
                                        }
                                    />
                                ) : !this.state.headerPackStarted ? (
                                    <StartIcon
                                        pxFromTop={
                                            onTablet
                                                ? fullHeight * 0.5 * 0.725
                                                : fullHeight * 0.5 * 0.725
                                        }
                                        buttonHeight={
                                            onTablet
                                                ? fullHeight * 0.06
                                                : Platform.OS == 'ios'
                                                ? fullHeight * 0.05
                                                : fullHeight * 0.055
                                        }
                                        pxFromLeft={fullWidth * 0.065}
                                        buttonWidth={fullWidth * 0.42}
                                        pressed={() =>
                                            this.props.navigation.navigate(
                                                'VIDEOPLAYER',
                                                {
                                                    url: this.state
                                                        .headerPackNextLessonUrl,
                                                },
                                            )
                                        }
                                    />
                                ) : (
                                    <ContinueIcon
                                        pxFromTop={
                                            onTablet
                                                ? fullHeight * 0.5 * 0.725
                                                : fullHeight * 0.5 * 0.725
                                        }
                                        buttonHeight={
                                            onTablet
                                                ? fullHeight * 0.06
                                                : Platform.OS == 'ios'
                                                ? fullHeight * 0.05
                                                : fullHeight * 0.055
                                        }
                                        pxFromLeft={fullWidth * 0.065}
                                        buttonWidth={fullWidth * 0.42}
                                        pressed={() =>
                                            this.props.navigation.navigate(
                                                'VIDEOPLAYER',
                                                {
                                                    url: this.state
                                                        .headerPackNextLessonUrl,
                                                },
                                            )
                                        }
                                    />
                                )}
                                <MoreInfoIcon
                                    pxFromTop={
                                        onTablet
                                            ? fullHeight * 0.5 * 0.725
                                            : fullHeight * 0.5 * 0.725
                                    }
                                    buttonHeight={
                                        onTablet
                                            ? fullHeight * 0.06
                                            : Platform.OS == 'ios'
                                            ? fullHeight * 0.05
                                            : fullHeight * 0.055
                                    }
                                    pxFromRight={fullWidth * 0.065}
                                    buttonWidth={fullWidth * 0.42}
                                    pressed={() => {
                                        this.props.navigation.push(
                                            'SINGLEPACK',
                                            {
                                                url: this.state.headerPackUrl,
                                            },
                                        );
                                    }}
                                />
                            </View>
                        </View>
                    )}
                    renderItem={({item}) => (
                        <TouchableOpacity
                            onPress={() => {
                                this.props.navigation.push('SINGLEPACK', {
                                    url: item.mobile_app_url,
                                });
                            }}
                            style={{
                                marginLeft: 5 * factorHorizontal,
                                marginBottom: 5 * factorHorizontal,
                                width:
                                    (fullWidth - 3 * 5 * factorHorizontal) / 3,
                                height: fullWidth * 0.285 * (95 / 65),
                                backgroundColor: colors.secondBackground,
                                borderRadius: 7.5 * factorRatio,
                            }}
                        >
                            <GradientFeature
                                color={'black'}
                                opacity={0.45}
                                height={'100%'}
                                borderRadius={0}
                            />
                            <View
                                key={'logo'}
                                style={{
                                    position: 'absolute',
                                    zIndex: 10,
                                    elevation: 5000,
                                    left: 0,
                                    top: 0,
                                    height: fullWidth * 0.285 * (95 / 65),
                                    width: fullWidth * 0.285,
                                    borderRadius: 7.5 * factorRatio,
                                }}
                            >
                                <View style={{flex: 1}} />
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        width: '100%',
                                        height: '25%',
                                    }}
                                >
                                    <View style={{flex: 1}} />
                                    <FastImage
                                        style={{
                                            width: '80%',
                                            height: '100%',
                                            borderRadius: 7.5 * factorRatio,
                                            alignSelf: 'stretch',
                                        }}
                                        source={{
                                            uri: item.logo,
                                        }}
                                        resizeMode={
                                            FastImage.resizeMode.contain
                                        }
                                    />
                                    <View style={{flex: 1}} />
                                </View>
                                <View
                                    style={{
                                        height: 5 * factorVertical,
                                    }}
                                />
                            </View>
                            <FastImage
                                style={{
                                    flex: 1,
                                    borderRadius: 7.5 * factorRatio,
                                    alignSelf: 'stretch',
                                }}
                                source={{
                                    uri: item.thumbnail,
                                }}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                        </TouchableOpacity>
                    )}
                />

                <NavigationBar currentPage={'PACKS'} />

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
                        hideRestartCourse={() => {
                            this.setState({
                                showRestartCourse: false,
                            });
                        }}
                        type='pack'
                        onRestart={() => this.onRestartPack()}
                    />
                </Modal>
            </View>
        );
    }
}
