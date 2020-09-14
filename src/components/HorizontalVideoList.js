/**
 * HorizontalVideoList
 */
import React from 'react';
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    TouchableHighlight,
} from 'react-native';
import {
    addToMyList,
    removeFromMyList,
} from 'Pianote2/src/services/UserActions.js';
import Modal from 'react-native-modal';
import FastImage from 'react-native-fast-image';
import {withNavigation} from 'react-navigation';
import ContentModal from '../modals/ContentModal';
import AntIcon from 'react-native-vector-icons/AntDesign';

class HorizontalVideoList extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            items: this.props.items,
            isLoading: this.props.isLoading,
        };
    }

    componentWillReceiveProps = async (props) => {
        if (props.isLoading !== this.state.isLoading) {
            await this.setState({
                isLoading: props.isLoading,
                items: props.items,
            });
        }
    };

    addToMyList = async (contentID) => {
        // change data structure
        for (i in this.state.items) {
            if (this.state.items[i].id == contentID) {
                this.state.items[i].isAddedToList = true;
            }
        }
        this.setState({items: this.state.items});

        // add to list on backend
        addToMyList(contentID);
    };

    removeFromMyList = async (contentID) => {
        for (i in this.state.items) {
            if (this.state.items[i].id == contentID) {
                this.state.items[i].isAddedToList = false;
            }
        }
        this.setState({items: this.state.items});
        removeFromMyList(contentID);
    };

    showFooter = () => {
        if (this.state.items.length == 0) {
            return (
                <View
                    style={[
                        styles.centerContent,
                        {
                            height: '100%',
                        },
                    ]}
                >
                    <View style={{flex: 0.33}} />
                    <ActivityIndicator
                        size={onTablet ? 'large' : 'small'}
                        animating={true}
                        color={colors.secondBackground}
                    />
                    <View style={{flex: 0.66}} />
                </View>
            );
        }
    };

    like = (contentID) => {
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

    render = () => {
        return (
            <View style={styles.container}>
                <View
                    key={'container'}
                    style={[
                        styles.centerContent,
                        {
                            minHeight: this.props.itemHeight,
                        },
                    ]}
                >
                    <View
                        key={'title'}
                        style={[
                            styles.centerContent,
                            {
                                width: fullWidth - 20 * factorHorizontal,
                            },
                        ]}
                    >
                        <View style={{height: 10 * factorVertical}} />
                        <View
                            key={'title'}
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignContent: 'center',
                                paddingBottom: 5 * factorVertical,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 18 * factorRatio,
                                    marginBottom: 5 * factorVertical,
                                    textAlign: 'left',
                                    fontWeight:
                                        Platform.OS == 'ios' ? '900' : 'bold',
                                    fontFamily: 'RobotoCondensed-Bold',
                                    color: colors.secondBackground,
                                }}
                            >
                                {this.props.Title}
                            </Text>
                            <View style={{flex: 1}} />
                            <TouchableOpacity
                                key={'seeAll'}
                                style={{flex: 1}}
                                onPress={() => this.props.seeAll()}
                            >
                                <Text
                                    style={{
                                        textAlign: 'right',
                                        fontSize: 14.5 * factorRatio,
                                        marginRight: 3.5 * factorHorizontal,
                                        fontWeight: '300',
                                        marginTop: 5 * factorVertical,
                                        color: 'red',
                                    }}
                                >
                                    See All
                                </Text>
                            </TouchableOpacity>
                            <View style={{flex: 0.1}} />
                        </View>
                    </View>

                    {this.state.isLoading && (
                        <View
                            style={[
                                styles.centerContent,
                                {
                                    width: fullWidth,
                                    height:
                                        this.props.itemHeight +
                                        80 * factorVertical,
                                    alignSelf: 'stretch',
                                },
                            ]}
                        >
                            {this.showFooter()}
                        </View>
                    )}
                    {!this.state.isLoading && (
                        <FlatList
                            key={'videos'}
                            data={this.state.items}
                            extraData={this.state}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({item, index}) => (
                                <View>
                                    <TouchableHighlight
                                        underlayColor={'transparent'}
                                        onPress={() =>
                                            this.props.navigation.goBack()
                                        }
                                    >
                                        <View
                                            style={[
                                                styles.centerContent,
                                                {
                                                    width: this.props.itemWidth,
                                                    height: this.props
                                                        .itemHeight,
                                                    marginRight:
                                                        10 * factorHorizontal,
                                                    borderRadius:
                                                        7.5 * factorRatio,
                                                },
                                            ]}
                                        >
                                            <TouchableOpacity
                                                onLongPress={() => {
                                                    this.setState({
                                                        showModal: true,
                                                        item,
                                                    });
                                                }}
                                                delayLongPress={350}
                                                onPress={() => {
                                                    this.props.navigation.navigate(
                                                        'VIDEOPLAYER',
                                                        {
                                                            data: item,
                                                        },
                                                    );
                                                }}
                                                style={{
                                                    flex: 1,
                                                    alignSelf: 'stretch',
                                                }}
                                            >
                                                <FastImage
                                                    style={{
                                                        flex: 1,
                                                        borderRadius:
                                                            7.5 * factorRatio,
                                                    }}
                                                    source={{
                                                        uri: item.thumbnail,
                                                    }}
                                                    resizeMode={
                                                        FastImage.resizeMode
                                                            .cover
                                                    }
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </TouchableHighlight>
                                    <View
                                        style={{
                                            width: this.props.itemWidth,
                                            height: 80 * factorVertical,
                                            flexDirection: 'row',
                                        }}
                                    >
                                        <View style={{flex: 0.8}}>
                                            <Text
                                                numberOfLines={2}
                                                style={{
                                                    fontSize:
                                                        15.5 * factorRatio,
                                                    marginTop:
                                                        7.5 * factorRatio,
                                                    textAlign: 'left',
                                                    fontWeight:
                                                        Platform.OS == 'ios'
                                                            ? '800'
                                                            : 'bold',
                                                    fontFamily:
                                                        'OpenSans-Regular',
                                                    color: 'white',
                                                }}
                                            >
                                                {item.title}
                                            </Text>
                                            <View
                                                style={{
                                                    height: 3 * factorRatio,
                                                }}
                                            />
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                }}
                                            >
                                                {this.props.showType && (
                                                    <Text
                                                        numberOfLines={2}
                                                        style={{
                                                            textAlign: 'left',
                                                            fontFamily:
                                                                'OpenSans-Regular',
                                                            color:
                                                                colors.secondBackground,
                                                            fontSize:
                                                                12 *
                                                                factorRatio,
                                                        }}
                                                    >
                                                        {item.type
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            item.type.slice(
                                                                1,
                                                            )}{' '}
                                                        /
                                                    </Text>
                                                )}
                                                {this.props.showArtist && (
                                                    <Text
                                                        numberOfLines={2}
                                                        style={{
                                                            textAlign: 'left',
                                                            fontFamily:
                                                                'OpenSans-Regular',
                                                            color:
                                                                colors.secondBackground,
                                                            fontSize:
                                                                12 *
                                                                factorRatio,
                                                        }}
                                                    >
                                                        {' '}
                                                        {item.artist}
                                                    </Text>
                                                )}
                                            </View>
                                        </View>
                                        <View
                                            style={{
                                                flex: 0.2,
                                                flexDirection: 'row',
                                            }}
                                        >
                                            <View style={{flex: 1}} />
                                            {this.props.showArtist && (
                                                <View>
                                                    {!item.isAddedToList && (
                                                        <TouchableOpacity
                                                            style={{
                                                                paddingTop:
                                                                    5 *
                                                                    factorVertical,
                                                            }}
                                                            onPress={() =>
                                                                this.addToMyList(
                                                                    item.id,
                                                                )
                                                            }
                                                        >
                                                            <AntIcon
                                                                name={'plus'}
                                                                size={
                                                                    30 *
                                                                    factorRatio
                                                                }
                                                                color={
                                                                    colors.pianoteRed
                                                                }
                                                            />
                                                        </TouchableOpacity>
                                                    )}
                                                    {item.isAddedToList && (
                                                        <TouchableOpacity
                                                            style={{
                                                                paddingTop:
                                                                    5 *
                                                                    factorVertical,
                                                            }}
                                                            onPress={() =>
                                                                this.removeFromMyList(
                                                                    item.id,
                                                                )
                                                            }
                                                        >
                                                            <AntIcon
                                                                name={'close'}
                                                                size={
                                                                    30 *
                                                                    factorRatio
                                                                }
                                                                color={
                                                                    colors.pianoteRed
                                                                }
                                                            />
                                                        </TouchableOpacity>
                                                    )}
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                </View>
                            )}
                        />
                    )}
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
                            like={(contentID) => this.like(contentID)}
                            addToMyList={(contentID) =>
                                this.addToMyList(contentID)
                            }
                            removeFromMyList={(contentID) =>
                                this.removeFromMyList(contentID)
                            }
                        />
                    </Modal>
                </View>
            </View>
        );
    };
}

export default withNavigation(HorizontalVideoList);
