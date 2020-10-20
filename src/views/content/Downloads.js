/**
 * Downloads
 */
import React from 'react';
import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import {Download_V2, offlineContent} from 'RNDownload';
import IconFeather from 'react-native-vector-icons/Feather';
import {SafeAreaView} from 'react-navigation';

export default class Downloads extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            edit: false,
            items: Object.values(offlineContent),
        };
    }

    componentDidMount() {
        this.dldEventListener =
            this.dldEventListener ||
            Download_V2.addEventListener(this.percentageListener);
    }

    componentWillUnmount() {
        this.dldEventListener?.remove();
    }

    percentageListener = p => {
        if (this.state.items.length !== Object.values(offlineContent).length)
            this.setState({
                items: Object.values(offlineContent),
            });
    };

    onDone = () => {
        this.setState({items: Object.values(offlineContent)});
    };

    render() {
        let {edit, items} = this.state;
        return (
            <SafeAreaView
                style={{
                    flex: 1,
                    backgroundColor: colors.thirdBackground,
                }}
            >
                <View>
                    <Text
                        style={{
                            padding: 15,
                            fontSize: 20,
                            color: 'white',
                            textAlign: 'center',
                            fontFamily: 'OpenSans-SemiBold',
                        }}
                    >
                        Downloads
                    </Text>
                    <TouchableOpacity
                        onPress={() =>
                            this.setState(({edit}) => ({edit: !edit}))
                        }
                        style={{
                            right: 0,
                            bottom: 15,
                            padding: 15,
                            paddingBottom: 0,
                            position: 'absolute',
                        }}
                    >
                        <Text
                            style={{
                                color: colors.pianoteRed,
                                fontFamily: 'OpenSans-SemiBold',
                            }}
                        >
                            EDIT
                        </Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={items}
                    keyboardShouldPersistTaps='handled'
                    keyExtractor={item => item.id.toString()}
                    style={{
                        flex: 1,
                        backgroundColor: colors.mainBackground,
                    }}
                    ListEmptyComponent={() => (
                        <Text
                            style={{
                                padding: 20,
                                color: 'white',
                                textAlign: 'center',
                            }}
                        >
                            Any lessons you download will be available here.
                        </Text>
                    )}
                    renderItem={({item, index}) => {
                        let type = item.lesson ? 'lesson' : 'overview';
                        return (
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.navigate(
                                        'VIDEOPLAYER',
                                        {
                                            id: item.id,
                                        },
                                    );
                                }}
                                style={{
                                    padding: 5,
                                    borderTopWidth: 0.5,
                                    flexDirection: 'row',
                                    borderBottomWidth: 0.5,
                                    borderColor: 'lightgrey',
                                }}
                            >
                                <FastImage
                                    style={{
                                        width: '30%',
                                        borderRadius: 5,
                                        aspectRatio: 16 / 9,
                                    }}
                                    source={{
                                        uri: item[type]?.data?.find(
                                            d => d.key === 'thumbnail_url',
                                        )?.value,
                                    }}
                                    resizeMode={FastImage.resizeMode.stretch}
                                />
                                <View
                                    style={{
                                        flex: 1,
                                        padding: 10,
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 18,
                                            color: 'white',
                                            fontFamily: 'OpenSans-Bold',
                                        }}
                                    >
                                        {
                                            item[type]?.fields?.find(
                                                f => f.key === 'title',
                                            )?.value
                                        }
                                    </Text>
                                    <Text
                                        style={{
                                            color: 'white',
                                        }}
                                    >
                                        {item[type]?.type?.replace('-', ' ')} |{' '}
                                        {parseInt(
                                            item.sizeInBytes / 1024 / 1024,
                                        )}
                                        MB
                                    </Text>
                                </View>
                                {!item.dlding.length && !edit ? (
                                    <View style={{justifyContent: 'center'}}>
                                        <IconFeather
                                            name={'chevron-right'}
                                            size={25 * factorRatio}
                                            color={'white'}
                                        />
                                    </View>
                                ) : (
                                    <Download_V2
                                        onDone={this.onDone}
                                        entity={item}
                                        styles={{
                                            touchable: {
                                                padding: 10,
                                                paddingRight: 0,
                                                alignSelf: 'center',
                                            },
                                            iconDownloadColor:
                                                colors.pianoteRed,
                                            activityIndicatorColor:
                                                colors.pianoteRed,
                                            animatedProgressBackground:
                                                colors.pianoteRed,
                                            alert: {
                                                alertTextMessageFontFamily:
                                                    'OpenSans',
                                                alertTouchableTextDeleteColor:
                                                    'white',
                                                alertTextTitleColor: 'black',
                                                alertTextMessageColor: 'black',
                                                alertTextTitleFontFamily:
                                                    'OpenSans-Bold',
                                                alertTouchableTextCancelColor:
                                                    colors.pianoteRed,
                                                alertTouchableDeleteBackground:
                                                    colors.pianoteRed,
                                                alertBackground: 'white',
                                                alertTouchableTextDeleteFontFamily:
                                                    'OpenSans-Bold',
                                                alertTouchableTextCancelFontFamily:
                                                    'OpenSans-Bold',
                                            },
                                        }}
                                    />
                                )}
                            </TouchableOpacity>
                        );
                    }}
                />
                <NavigationBar currentPage={'DOWNLOAD'} />
            </SafeAreaView>
        );
    }
}
