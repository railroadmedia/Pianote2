/**
 * Packs
 */
import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Platform,
} from 'react-native';
import Modal from 'react-native-modal';
import {getContent} from '@musora/services';
import {ContentModel} from '@musora/models';
import FastImage from 'react-native-fast-image';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import NavigationMenu from 'Pianote2/src/components/NavigationMenu.js';
import NavMenuHeaders from 'Pianote2/src/components/NavMenuHeaders.js';
import GradientFeature from 'Pianote2/src/components/GradientFeature.js';

export default class Packs extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            showModalMenu: false,
            packs: [],
            isLoading: true,
        };
    }

    componentDidMount = async () => {
        const {response, error} = await getContent({
            brand: 'pianote',
            limit: '30',
            page: 1,
            sort: '-created_on',
            statuses: ['published'],
            included_types: ['pack'],
        });

        const newContent = response.data.data.map((data) => {
            return new ContentModel(data);
        });

        items = [];
        for (i in newContent) {
            if (newContent[i].getData('thumbnail_url') !== 'TBD') {
                items.push({
                    title: newContent[i].getField('title'),
                    artist: newContent[i].getField('instructor').fields[0]
                        .value,
                    thumbnail: newContent[i].getData('thumbnail_url'),
                    type: newContent[i].post.type,
                    description: newContent[i]
                        .getData('description')
                        .replace(/(<([^>]+)>)/gi, ''),
                    xp: newContent[i].getField('xp'),
                    logo: newContent[i].getData('logo_image_url'),
                    header: newContent[i].getData('header_image_url'),
                    id: newContent[i].id,
                    like_count: newContent[i].likeCount,
                    isLiked: newContent[i].isLiked,
                    isAddedToList: newContent[i].isAddedToList,
                    isStarted: newContent[i].isStarted,
                    isCompleted: newContent[i].isCompleted,
                    bundle_count: newContent[i].post.bundle_count,
                    progress_percent: newContent[i].post.progress_percent,
                });
            }
        }

        items.reverse();

        await this.setState({
            packs: [...this.state.packs, ...items],
            isLoading: false,
        });

        console.log(this.state.packs);
    };

    render() {
        return (
            <View styles={styles.container}>
                <View
                    style={{
                        height: fullHeight - navHeight,
                        alignSelf: 'stretch',
                        backgroundColor: colors.mainBackground,
                    }}
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
                    <ScrollView key={'contentContainer'} style={{flex: 1}}>
                        <View
                            key={'header'}
                            style={{
                                height:
                                    Platform.OS == 'ios'
                                        ? fullHeight * 0.05
                                        : fullHeight * 0.1,
                                backgroundColor: colors.mainBackground,
                            }}
                        />
                        <View style={{height: 20 * factorVertical}} />
                        <Text
                            style={{
                                paddingLeft: 12 * factorHorizontal,
                                fontSize: 30 * factorRatio,
                                color: 'white',
                                fontFamily: 'OpenSans-Regular',
                                fontWeight:
                                    Platform.OS == 'ios' ? '900' : 'bold',
                            }}
                        >
                            Packs
                        </Text>
                        <View style={{height: 20 * factorVertical}} />
                        {this.state.isLoading && (
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
                        {!this.state.isLoading && (
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignContent: 'space-around',
                                    justifyContent: 'space-around',
                                    paddingLeft: 5 * factorHorizontal,
                                    paddingRight: 5 * factorHorizontal,
                                }}
                            >
                                {this.state.packs.length > 0 && (
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.props.navigation.push(
                                                'SINGLEPACK',
                                                {
                                                    data: this.state.packs[0],
                                                },
                                            );
                                        }}
                                        style={{
                                            width: fullWidth * 0.285,
                                            height:
                                                fullWidth * 0.285 * (95 / 65),
                                            backgroundColor:
                                                colors.secondBackground,
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
                                                height:
                                                    fullWidth *
                                                    0.285 *
                                                    (95 / 65),
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
                                                        borderRadius:
                                                            7.5 * factorRatio,
                                                        alignSelf: 'stretch',
                                                    }}
                                                    source={{
                                                        uri: this.state.packs[0]
                                                            .logo,
                                                    }}
                                                    resizeMode={
                                                        FastImage.resizeMode
                                                            .contain
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
                                                uri: this.state.packs[0]
                                                    .thumbnail,
                                            }}
                                            resizeMode={
                                                FastImage.resizeMode.cover
                                            }
                                        />
                                    </TouchableOpacity>
                                )}
                                {this.state.packs.length > 1 && (
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.props.navigation.push(
                                                'SINGLEPACK',
                                                {
                                                    data: this.state.packs[1],
                                                },
                                            );
                                        }}
                                        style={{
                                            width: fullWidth * 0.285,
                                            height:
                                                fullWidth * 0.285 * (95 / 65),
                                            backgroundColor:
                                                colors.secondBackground,
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
                                            style={{
                                                position: 'absolute',
                                                zIndex: 10,
                                                elevation: 5000,
                                                left: 0,
                                                top: 0,
                                                height:
                                                    fullWidth *
                                                    0.285 *
                                                    (95 / 65),
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
                                                        width: '90%',
                                                        height: '100%',
                                                        borderRadius:
                                                            7.5 * factorRatio,
                                                        alignSelf: 'stretch',
                                                        elevation: 10,
                                                    }}
                                                    source={{
                                                        uri: this.state.packs[1]
                                                            .logo,
                                                    }}
                                                    resizeMode={
                                                        FastImage.resizeMode
                                                            .contain
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
                                                uri: this.state.packs[1]
                                                    .thumbnail,
                                            }}
                                            resizeMode={
                                                FastImage.resizeMode.cover
                                            }
                                        />
                                    </TouchableOpacity>
                                )}
                                {this.state.packs.length > 2 && (
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.props.navigation.push(
                                                'SINGLEPACK',
                                                {
                                                    data: this.state.packs[2],
                                                },
                                            );
                                        }}
                                        style={{
                                            width: fullWidth * 0.285,
                                            height:
                                                fullWidth * 0.285 * (95 / 65),
                                            backgroundColor:
                                                colors.secondBackground,
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
                                            style={{
                                                position: 'absolute',
                                                zIndex: 10,
                                                elevation: 5000,
                                                left: 0,
                                                top: 0,
                                                height:
                                                    fullWidth *
                                                    0.285 *
                                                    (95 / 65),
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
                                                        borderRadius:
                                                            7.5 * factorRatio,
                                                        alignSelf: 'stretch',
                                                    }}
                                                    source={{
                                                        uri: this.state.packs[2]
                                                            .logo,
                                                    }}
                                                    resizeMode={
                                                        FastImage.resizeMode
                                                            .contain
                                                    }
                                                />
                                                <View style={{flex: 1}} />
                                            </View>
                                            <View
                                                style={{
                                                    height: 10 * factorVertical,
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
                                                uri: this.state.packs[2]
                                                    .thumbnail,
                                            }}
                                            resizeMode={
                                                FastImage.resizeMode.cover
                                            }
                                        />
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}
                        <View style={{height: 20 * factorVertical}} />
                        {!this.state.isLoading && (
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignContent: 'space-around',
                                    justifyContent: 'space-around',
                                    paddingLeft: 5 * factorHorizontal,
                                    paddingRight: 5 * factorHorizontal,
                                }}
                            >
                                {this.state.packs.length > 3 && (
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.props.navigation.push(
                                                'SINGLEPACK',
                                                {
                                                    data: this.state.packs[3],
                                                },
                                            );
                                        }}
                                        style={{
                                            width: fullWidth * 0.285,
                                            height:
                                                fullWidth * 0.285 * (95 / 65),
                                            backgroundColor:
                                                colors.secondBackground,
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
                                            style={{
                                                position: 'absolute',
                                                zIndex: 10,
                                                elevation: 5000,
                                                left: 0,
                                                top: 0,
                                                height:
                                                    fullWidth *
                                                    0.285 *
                                                    (95 / 65),
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
                                                        width: '90%',
                                                        height: '100%',
                                                        borderRadius:
                                                            7.5 * factorRatio,
                                                        alignSelf: 'stretch',
                                                    }}
                                                    source={{
                                                        uri: this.state.packs[3]
                                                            .logo,
                                                    }}
                                                    resizeMode={
                                                        FastImage.resizeMode
                                                            .contain
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
                                                uri: this.state.packs[3]
                                                    .thumbnail,
                                            }}
                                            resizeMode={
                                                FastImage.resizeMode.cover
                                            }
                                        />
                                    </TouchableOpacity>
                                )}
                                {this.state.packs.length > 4 && (
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.props.navigation.push(
                                                'SINGLEPACK',
                                                {
                                                    data: this.state.packs[4],
                                                },
                                            );
                                        }}
                                        style={{
                                            width: fullWidth * 0.285,
                                            height:
                                                fullWidth * 0.285 * (95 / 65),
                                            backgroundColor:
                                                colors.secondBackground,
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
                                            style={{
                                                position: 'absolute',
                                                zIndex: 10,
                                                elevation: 5000,
                                                left: 0,
                                                top: 0,
                                                height:
                                                    fullWidth *
                                                    0.285 *
                                                    (95 / 65),
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
                                                        borderRadius:
                                                            7.5 * factorRatio,
                                                        alignSelf: 'stretch',
                                                    }}
                                                    source={{
                                                        uri: this.state.packs[4]
                                                            .logo,
                                                    }}
                                                    resizeMode={
                                                        FastImage.resizeMode
                                                            .contain
                                                    }
                                                />
                                                <View style={{flex: 1}} />
                                            </View>
                                            <View
                                                style={{
                                                    height: 10 * factorVertical,
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
                                                uri: this.state.packs[4]
                                                    .thumbnail,
                                            }}
                                            resizeMode={
                                                FastImage.resizeMode.cover
                                            }
                                        />
                                    </TouchableOpacity>
                                )}
                                {this.state.packs.length > 5 && (
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.props.navigation.push(
                                                'SINGLEPACK',
                                                {
                                                    data: this.state.packs[5],
                                                },
                                            );
                                        }}
                                        style={{
                                            width: fullWidth * 0.285,
                                            height:
                                                fullWidth * 0.285 * (95 / 65),
                                            backgroundColor:
                                                colors.secondBackground,
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
                                            style={{
                                                position: 'absolute',
                                                zIndex: 10,
                                                elevation: 5000,
                                                left: 0,
                                                top: 0,
                                                height:
                                                    fullWidth *
                                                    0.285 *
                                                    (95 / 65),
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
                                                        width: '90%',
                                                        height: '100%',
                                                        borderRadius:
                                                            7.5 * factorRatio,
                                                        alignSelf: 'stretch',
                                                    }}
                                                    source={{
                                                        uri: this.state.packs[5]
                                                            .logo,
                                                    }}
                                                    resizeMode={
                                                        FastImage.resizeMode
                                                            .contain
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
                                                uri: this.state.packs[5]
                                                    .thumbnail,
                                            }}
                                            resizeMode={
                                                FastImage.resizeMode.cover
                                            }
                                        />
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}
                        <View style={{height: 20 * factorVertical}} />
                        {!this.state.isLoading && (
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignContent: 'space-around',
                                    justifyContent: 'space-around',
                                    paddingLeft: 5 * factorHorizontal,
                                    paddingRight: 5 * factorHorizontal,
                                }}
                            >
                                {this.state.packs.length > 6 && (
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.props.navigation.push(
                                                'SINGLEPACK',
                                                {
                                                    data: this.state.packs[6],
                                                },
                                            );
                                        }}
                                        style={{
                                            width: fullWidth * 0.285,
                                            height:
                                                fullWidth * 0.285 * (95 / 65),
                                            backgroundColor:
                                                colors.secondBackground,
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
                                            style={{
                                                position: 'absolute',
                                                zIndex: 10,
                                                elevation: 5000,
                                                left: 0,
                                                top: 0,
                                                height:
                                                    fullWidth *
                                                    0.285 *
                                                    (95 / 65),
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
                                                        borderRadius:
                                                            7.5 * factorRatio,
                                                        alignSelf: 'stretch',
                                                    }}
                                                    source={{
                                                        uri: this.state.packs[6]
                                                            .logo,
                                                    }}
                                                    resizeMode={
                                                        FastImage.resizeMode
                                                            .contain
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
                                                uri: this.state.packs[6]
                                                    .thumbnail,
                                            }}
                                            resizeMode={
                                                FastImage.resizeMode.cover
                                            }
                                        />
                                    </TouchableOpacity>
                                )}
                                {this.state.packs.length > 7 && (
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.props.navigation.push(
                                                'SINGLEPACK',
                                                {
                                                    data: this.state.packs[7],
                                                },
                                            );
                                        }}
                                        style={{
                                            width: fullWidth * 0.285,
                                            height:
                                                fullWidth * 0.285 * (95 / 65),
                                            backgroundColor:
                                                colors.secondBackground,
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
                                                height:
                                                    fullWidth *
                                                    0.285 *
                                                    (95 / 65),
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
                                                        borderRadius:
                                                            7.5 * factorRatio,
                                                        alignSelf: 'stretch',
                                                    }}
                                                    source={{
                                                        uri: this.state.packs[7]
                                                            .logo,
                                                    }}
                                                    resizeMode={
                                                        FastImage.resizeMode
                                                            .contain
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
                                                uri: this.state.packs[7]
                                                    .thumbnail,
                                            }}
                                            resizeMode={
                                                FastImage.resizeMode.cover
                                            }
                                        />
                                    </TouchableOpacity>
                                )}
                                {this.state.packs.length > 8 && (
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.props.navigation.push(
                                                'SINGLEPACK',
                                                {
                                                    data: this.state.packs[8],
                                                },
                                            );
                                        }}
                                        style={{
                                            width: fullWidth * 0.285,
                                            height:
                                                fullWidth * 0.285 * (95 / 65),
                                            backgroundColor:
                                                colors.secondBackground,
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
                                                height:
                                                    fullWidth *
                                                    0.285 *
                                                    (95 / 65),
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
                                                        borderRadius:
                                                            7.5 * factorRatio,
                                                        alignSelf: 'stretch',
                                                    }}
                                                    source={{
                                                        uri: this.state.packs[8]
                                                            .logo,
                                                    }}
                                                    resizeMode={
                                                        FastImage.resizeMode
                                                            .contain
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
                                                uri: this.state.packs[8]
                                                    .thumbnail,
                                            }}
                                            resizeMode={
                                                FastImage.resizeMode.cover
                                            }
                                        />
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}
                        <View style={{height: 20 * factorVertical}} />
                    </ScrollView>
                    <NavigationBar currentPage={'PACKS'} />
                </View>
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
                        onClose={(e) => this.setState({showModalMenu: e})}
                        menu={this.state.menu}
                        parentPage={this.state.parentPage}
                    />
                </Modal>
            </View>
        );
    }
}
