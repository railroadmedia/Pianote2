/**
 * ContentModal
 */
import React from 'react';
import {
    View,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
} from 'react-native';
import {
    likeContent,
    unlikeContent,
    addToMyList,
    removeFromMyList,
    resetProgress,
} from 'Pianote2/src/services/UserActions.js';
import FastImage from 'react-native-fast-image';
import {withNavigation} from 'react-navigation';
import AntIcon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

class ContentModal extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data,
        };
    }

    componentWillMount() {
        console.log(this.state.data);
    }

    addToMyList = async contentID => {
        // change status of content on parent data structure
        this.props.addToMyList(contentID);
        // make added to list on current data structure
        this.state.data.isAddedToList = true;
        this.setState({data: this.state.data});
        // add to list on backend
        addToMyList(contentID);
    };

    removeFromMyList = async contentID => {
        // change status of parent data
        this.props.removeFromMyList(contentID);
        // change data on modal
        this.state.data.isAddedToList = false;
        this.setState({data: this.state.data});
        // change data on backend
        removeFromMyList(contentID);
    };

    like = async contentID => {
        // change data on modal
        this.state.data.isLiked = !this.state.data.isLiked;
        this.state.data.like_count = Number(this.state.data.like_count) + 1;
        this.setState({data: this.state.data});
        // change data on parent data
        // ADD IN
        // like on backend
        likeContent(contentID);
    };

    unlike = async contentID => {
        // change data on modal
        this.state.data.isLiked = !this.state.data.isLiked;
        this.state.data.like_count = Number(this.state.data.like_count) - 1;
        this.setState({data: this.state.data});
        // change data on parent data
        // ADD IN
        // unlike on backend
        unlikeContent(contentID);
    };

    download = async contentID => {};

    render = () => {
        return (
            <View style={styles.container}>
                <View
                    style={{
                        position: 'absolute',
                        zIndex: 5,
                        elevation: 5,
                        height: '100%',
                        width: '100%',
                    }}
                >
                    <View style={{flex: 0.9, alignSelf: 'stretch'}}>
                        <TouchableWithoutFeedback
                            onPress={() => this.props.hideContentModal()}
                            style={{
                                height: '100%',
                                width: '100%',
                                alignSelf: 'stretch',
                            }}
                        >
                            <View style={{flex: 1, alignSelf: 'stretch'}} />
                        </TouchableWithoutFeedback>
                    </View>
                    <View
                        key={'contentContainer'}
                        style={{
                            flexDirection: 'row',
                            borderRadius: 10 * factorRatio,
                        }}
                    >
                        <TouchableWithoutFeedback
                            onPress={() => this.props.hideContentModal()}
                            style={{width: fullWidth * 0.05}}
                        >
                            <View style={{flex: 1, alignSelf: 'stretch'}} />
                        </TouchableWithoutFeedback>
                        <View
                            style={{
                                width: fullWidth * 0.9,
                                paddingLeft: 10 * factorHorizontal,
                                paddingRight: 10 * factorHorizontal,
                                borderRadius: 10 * factorRatio,
                                shadowOffset: {
                                    width: 5 * factorRatio,
                                    height: 10 * factorRatio,
                                },
                                shadowColor: 'black',
                                shadowOpacity: 0.1,
                                elevation: 3,
                                backgroundColor: 'white',
                            }}
                        >
                            <View style={{height: fullHeight * 0.0225}} />
                            <View key={'image'} style={styles.centerContent}>
                                <View
                                    style={{
                                        height: 180 * factorRatio,
                                        width:
                                            this.state.data.type == 'song'
                                                ? 180 * factorRatio
                                                : fullWidth * 0.8,
                                        backgroundColor: 'white',
                                        zIndex: 10,
                                    }}
                                >
                                    <FastImage
                                        style={{flex: 1, borderRadius: 10}}
                                        source={{
                                            uri: this.state.data.thumbnail,
                                        }}
                                        resizeMode={
                                            FastImage.resizeMode.stretch
                                        }
                                    />
                                </View>
                            </View>
                            <View style={{height: 10 * factorVertical}} />
                            <View key={'title'} style={styles.centerContent}>
                                <Text
                                    style={{
                                        fontFamily: 'OpenSans',
                                        fontWeight: 'bold',
                                        fontSize: 22 * factorRatio,
                                        textAlign: 'center',
                                    }}
                                >
                                    {this.state.data.title}
                                </Text>
                            </View>
                            <View
                                key={'artist'}
                                style={[
                                    styles.centerContent,
                                    {
                                        marginTop: 5 * factorRatio,
                                    },
                                ]}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'OpenSans',
                                        textAlign: 'center',
                                        fontSize: 12 * factorRatio,
                                        color: 'grey',
                                    }}
                                >
                                    {this.state.data.type
                                        .charAt(0)
                                        .toUpperCase() +
                                        this.state.data.type.slice(1)}{' '}
                                    / {this.state.data.artist}
                                </Text>
                            </View>
                            <View style={{height: 10 * factorVertical}} />
                            <View
                                key={'description'}
                                style={[
                                    styles.centerContent,
                                    {
                                        paddingLeft: fullWidth * 0.05,
                                        paddingRight: fullWidth * 0.05,
                                    },
                                ]}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'OpenSans',
                                        fontSize: 14 * factorRatio,
                                        textAlign: 'left',
                                    }}
                                >
                                    {this.state.data.description}
                                </Text>
                            </View>
                            <View
                                key={'stats'}
                                style={[
                                    styles.centerContent,
                                    {
                                        flexDirection: 'row',
                                    },
                                ]}
                            >
                                <View style={{flex: 1, alignSelf: 'stretch'}} />
                                {(this.state.data.bundle_count > 1 ||
                                    this.state.data.lesson_count) && (
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
                                                fontFamily: 'OpenSans',
                                                fontWeight: 'bold',
                                                fontSize: 18 * factorRatio,
                                                textAlign: 'left',
                                                marginTop: 10 * factorVertical,
                                            }}
                                        >
                                            {this.state.data.lesson_count > 1
                                                ? this.state.data.lesson_count
                                                : this.state.data.bundle_count}
                                        </Text>
                                        <Text
                                            style={{
                                                fontFamily: 'OpenSans',
                                                fontSize: 12 * factorRatio,
                                                textAlign: 'left',
                                                marginTop: 5 * factorVertical,
                                            }}
                                        >
                                            LESSONS
                                        </Text>
                                    </View>
                                )}
                                {this.state.data.bundle_count > 1 && (
                                    <View style={{width: 15 * factorRatio}} />
                                )}
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
                                            fontFamily: 'OpenSans',
                                            fontWeight: 'bold',
                                            fontSize: 18 * factorRatio,
                                            textAlign: 'left',
                                            marginTop: 10 * factorVertical,
                                        }}
                                    >
                                        {this.state.data.xp}
                                    </Text>
                                    <Text
                                        style={{
                                            fontFamily: 'OpenSans',
                                            fontSize: 12 * factorRatio,
                                            textAlign: 'left',
                                            marginTop: 5 * factorVertical,
                                        }}
                                    >
                                        XP
                                    </Text>
                                </View>
                                <View style={{flex: 1, alignSelf: 'stretch'}} />
                            </View>
                            <View style={{height: 10 * factorVertical}} />
                            <View
                                key={'buttons'}
                                style={[
                                    styles.centerContent,
                                    {
                                        flexDirection: 'row',
                                    },
                                ]}
                            >
                                <View style={{flex: 1, alignSelf: 'stretch'}} />
                                <View
                                    style={[
                                        styles.centerContent,
                                        {
                                            width: 70 * factorRatio,
                                        },
                                    ]}
                                >
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.state.data.isLiked
                                                ? this.unlike(
                                                      this.state.data.id,
                                                  )
                                                : this.like(this.state.data.id);
                                        }}
                                    >
                                        <AntIcon
                                            name={
                                                this.state.data.isLiked
                                                    ? 'like1'
                                                    : 'like2'
                                            }
                                            size={25 * factorRatio}
                                        />
                                    </TouchableOpacity>
                                    <Text
                                        style={{
                                            fontFamily: 'OpenSans',
                                            fontSize: 12 * factorRatio,
                                            textAlign: 'left',
                                            marginTop: 15 * factorVertical,
                                        }}
                                    >
                                        {this.state.data.like_count}
                                    </Text>
                                </View>
                                <View style={{width: 15 * factorRatio}} />
                                <View
                                    style={[
                                        styles.centerContent,
                                        {
                                            width: 70 * factorRatio,
                                        },
                                    ]}
                                >
                                    <View>
                                        {!this.state.data.isAddedToList && (
                                            <TouchableOpacity
                                                style={{
                                                    paddingTop:
                                                        5 * factorVertical,
                                                }}
                                                onPress={() =>
                                                    this.addToMyList(
                                                        this.state.data.id,
                                                    )
                                                }
                                            >
                                                <AntIcon
                                                    name={'plus'}
                                                    size={30 * factorRatio}
                                                    color={'black'}
                                                />
                                            </TouchableOpacity>
                                        )}
                                        {this.state.data.isAddedToList && (
                                            <TouchableOpacity
                                                style={{
                                                    paddingTop:
                                                        5 * factorVertical,
                                                }}
                                                onPress={() =>
                                                    this.removeFromMyList(
                                                        this.state.data.id,
                                                    )
                                                }
                                            >
                                                <AntIcon
                                                    name={'close'}
                                                    size={30 * factorRatio}
                                                    color={'black'}
                                                />
                                            </TouchableOpacity>
                                        )}
                                    </View>

                                    <Text
                                        style={{
                                            fontFamily: 'OpenSans',
                                            fontSize: 12 * factorRatio,
                                            textAlign: 'left',
                                            marginTop: 10 * factorVertical,
                                        }}
                                    >
                                        My List
                                    </Text>
                                </View>
                                <View style={{width: 15 * factorRatio}} />
                                <View
                                    style={[
                                        styles.centerContent,
                                        {
                                            width: 70 * factorRatio,
                                        },
                                    ]}
                                >
                                    <TouchableOpacity
                                        onPress={() => {
                                            resetProgress(this.state.data.id),
                                                this.download(
                                                    this.state.data.id,
                                                );
                                        }}
                                    >
                                        <MaterialIcon
                                            name={'arrow-collapse-down'}
                                            size={30 * factorRatio}
                                        />
                                    </TouchableOpacity>
                                    <Text
                                        style={{
                                            fontFamily: 'OpenSans',
                                            fontSize: 12 * factorRatio,
                                            textAlign: 'left',
                                            marginTop: 10 * factorVertical,
                                        }}
                                    >
                                        Download
                                    </Text>
                                </View>
                                <View style={{flex: 1, alignSelf: 'stretch'}} />
                            </View>
                            <View style={{height: 20 * factorVertical}} />
                        </View>
                        <TouchableWithoutFeedback
                            onPress={() => this.props.hideContentModal()}
                            style={{width: fullWidth * 0.05}}
                        >
                            <View style={{flex: 1, alignSelf: 'stretch'}} />
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={{flex: 1.1, alignSelf: 'stretch'}}>
                        <TouchableWithoutFeedback
                            onPress={() => this.props.hideContentModal()}
                            style={{
                                height: '100%',
                                width: '100%',
                                alignSelf: 'stretch',
                            }}
                        >
                            <View style={{flex: 1, alignSelf: 'stretch'}} />
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </View>
        );
    };
}

export default withNavigation(ContentModal);
