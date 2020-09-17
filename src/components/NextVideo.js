/**
 * Taskbar for navigation
 */
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {withNavigation} from 'react-navigation';
import FastImage from 'react-native-fast-image';
import EntypoIcon from 'react-native-vector-icons/Entypo';

class NextVideo extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            hasNotch: 0,
        };
    }

    componentDidMount = async () => {};

    render = () => {
        const {progress_percent} = this.props.item.post;
        return (
            <TouchableOpacity
                onPress={this.props.onNextLesson}
                style={{
                    backgroundColor: colors.mainBackground,
                    borderBottomColor: colors.secondBackground,
                    borderBottomWidth: 0.25 * factorRatio,
                }}
            >
                <View style={{width: fullWidth}}>
                    <View
                        key={'progress'}
                        style={{
                            height: 3 * factorVertical,
                            flexDirection: 'row',
                        }}
                    >
                        <View
                            style={{
                                flex: progress_percent,
                                backgroundColor: colors.pianoteRed,
                            }}
                        />
                        <View
                            style={{
                                flex: 1 - progress_percent,
                                backgroundColor: colors.secondBackground,
                            }}
                        />
                    </View>
                    <View style={{height: 10 * factorVertical}} />
                    <View
                        key={'nextLesson'}
                        style={{
                            flexDirection: 'row',
                            paddingLeft: fullWidth * 0.035,
                            paddingRight: fullWidth * 0.035,
                        }}
                    >
                        <View>
                            <View style={{flex: 1}} />
                            <Text
                                style={{
                                    fontSize: 16 * factorRatio,
                                    textAlign: 'left',
                                    fontFamily: 'RobotoCondensed-Bold',
                                    color: colors.secondBackground,
                                }}
                            >
                                YOUR NEXT LESSON
                            </Text>
                            <View style={{flex: 1}} />
                        </View>
                        <View style={{flex: 1}} />
                        <View>
                            <View style={{flex: 1}} />
                            <Text
                                style={{
                                    fontSize: 12 * factorRatio,
                                    fontFamily: 'OpenSans',
                                    color: colors.secondBackground,
                                    textAlign: 'right',
                                }}
                            >
                                LEVEL - {progress_percent * 100}% COMPLETE
                            </Text>
                            <View style={{flex: 1}} />
                        </View>
                    </View>
                    <View style={{height: 5 * factorVertical}} />
                    <View
                        key={'video'}
                        style={{
                            flexDirection: 'row',
                            paddingLeft: fullWidth * 0.035,
                            paddingRight: fullWidth * 0.035,
                        }}
                    >
                        <View
                            key={'thumbnail'}
                            style={{justifyContent: 'center'}}
                            underlayColor={'transparent'}
                        >
                            <View style={{flex: 2}} />
                            <View
                                style={{
                                    width: fullWidth * 0.24,
                                    height: onTablet
                                        ? fullWidth * 0.14
                                        : fullWidth * 0.14,
                                    borderRadius: 7 * factorRatio,
                                }}
                            >
                                <FastImage
                                    style={{
                                        flex: 1,
                                        borderRadius: 7 * factorRatio,
                                    }}
                                    source={{
                                        uri: this.props.item.getData(
                                            'thumbnail_url',
                                        ),
                                    }}
                                    resizeMode={FastImage.resizeMode.cover}
                                />
                            </View>
                            <View style={{flex: 1}} />
                        </View>
                        <View
                            key={'titles'}
                            style={{
                                paddingLeft: fullWidth * 0.035,
                            }}
                        >
                            <View style={{flex: 1}} />
                            <View>
                                <Text
                                    style={{
                                        fontSize: 15 * factorRatio,
                                        textAlign: 'left',
                                        fontWeight: 'bold',
                                        fontFamily: 'OpenSans',
                                        color: 'white',
                                    }}
                                >
                                    {this.props.item.getField('title')}
                                </Text>
                                <View style={{height: 2 * factorVertical}} />
                                <Text
                                    numberOfLines={2}
                                    style={{
                                        fontSize: 12 * factorRatio,
                                        fontFamily: 'OpenSans',
                                        textAlign: 'left',
                                        color: colors.secondBackground,
                                    }}
                                >
                                    2 mins
                                </Text>
                            </View>
                            <View style={{flex: 1}} />
                        </View>
                        <View
                            key={'play'}
                            onPress={() => {}}
                            style={[
                                styles.centerContent,
                                {
                                    flex: 1,
                                    flexDirection: 'row',
                                },
                            ]}
                        >
                            <View style={{flex: 1}} />
                            <EntypoIcon
                                name={'controller-play'}
                                size={30 * factorRatio}
                                color={colors.pianoteRed}
                            />
                        </View>
                    </View>
                </View>
                <View style={{height: 15 * factorVertical}} />
            </TouchableOpacity>
        );
    };
}

export default withNavigation(NextVideo);
