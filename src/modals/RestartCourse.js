/**
 * RestartCourse
 */
import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Platform,
} from 'react-native';
import {withNavigation} from 'react-navigation';

class RestartCourse extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {};
    }

    changeType = word => {
        word = word.replace(/[- )(]/g, ' ').split(' ');
        let string = '';

        for (let i = 0; i < word.length; i++) {
            if (word[i] !== 'and') {
                word[i] = word[i][0].toUpperCase() + word[i].substr(1);
            }
        }

        for (i in word) {
            string = string + word[i] + ' ';
        }

        return string;
    };

    render = () => {
        const {type} = this.props;
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
                    <View style={{flex: 1, alignSelf: 'stretch'}}>
                        <TouchableWithoutFeedback
                            onPress={() => this.props.hideRestartCourse()}
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
                        style={{
                            height:
                                fullHeight * 0.35 +
                                (onTablet || Platform.OS == 'android'
                                    ? fullHeight * 0.1
                                    : 0),
                            flexDirection: 'row',
                            borderRadius: 10 * factorRatio,
                        }}
                    >
                        <TouchableWithoutFeedback
                            onPress={() => this.props.hideRestartCourse()}
                            style={{width: fullWidth * 0.05}}
                        >
                            <View style={{flex: 1, alignSelf: 'stretch'}} />
                        </TouchableWithoutFeedback>
                        <View
                            key={'card'}
                            style={{
                                width: fullWidth * 0.9,
                                borderRadius: 10 * factorRatio,
                                backgroundColor: 'white',
                                elevation: 2,
                            }}
                        >
                            <View style={{flex: 0.03}} />
                            <View
                                key={'restartCourse'}
                                style={[
                                    styles.centerContent,
                                    {
                                        flex: 0.175,
                                    },
                                ]}
                            >
                                <Text
                                    style={{
                                        fontWeight: 'bold',
                                        fontSize: 20 * factorRatio,
                                        marginTop: 10 * factorRatio,
                                    }}
                                >
                                    Restart{' '}
                                    {type == 'foundations'
                                        ? 'foundations'
                                        : 'this ' + this.changeType(type)}
                                    ?
                                </Text>
                            </View>
                            <View
                                key={'text'}
                                style={[
                                    styles.centerContent,
                                    {
                                        flex: 0.325,
                                        paddingLeft: fullWidth * 0.1,
                                        paddingRight: fullWidth * 0.1,
                                    },
                                ]}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'OpenSans-Regular',
                                        fontSize: 16 * factorRatio,
                                        textAlign: 'justify',
                                    }}
                                >
                                    Take{' '}
                                    {type == 'foundations'
                                        ? 'foundations'
                                        : 'this ' + type}{' '}
                                    again as a refresher, or just to make sure
                                    you've got the concepts nailed! This will
                                    remove the XP you've earned.
                                </Text>
                            </View>
                            <View
                                key={'ok'}
                                style={[
                                    styles.centerContent,
                                    {
                                        flex: 0.25,
                                        paddingLeft:
                                            fullWidth * 0.1 * factorRatio,
                                        paddingRight:
                                            fullWidth * 0.1 * factorRatio,
                                    },
                                ]}
                            >
                                <View style={{flex: 0.15}} />
                                <View
                                    style={[
                                        styles.centerContent,
                                        {
                                            flex: 0.675,
                                            backgroundColor: '#fb1b2f',
                                            alignSelf: 'stretch',
                                            borderRadius: 40 * factorRatio,
                                        },
                                    ]}
                                >
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.props.onRestart();
                                        }}
                                        style={[
                                            styles.centerContent,
                                            {
                                                flex: 1,
                                            },
                                        ]}
                                    >
                                        <Text
                                            style={{
                                                color: 'white',
                                                fontFamily:
                                                    'RobotoCondensed-Bold',
                                                fontSize: 14 * factorRatio,
                                            }}
                                        >
                                            RESTART {this.changeType(type).toUpperCase()}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{flex: 0.15}} />
                            </View>
                            <View
                                key={'cancel'}
                                style={[
                                    styles.centerContent,
                                    {
                                        flex: 0.125,
                                        paddingLeft: fullWidth * 0.1,
                                        paddingRight: fullWidth * 0.1,
                                    },
                                ]}
                            >
                                <View
                                    style={[
                                        styles.centerContent,
                                        {
                                            flex: 0.8,
                                            alignSelf: 'stretch',
                                        },
                                    ]}
                                >
                                    <View
                                        style={[
                                            styles.centerContent,
                                            {
                                                flexDirection: 'row',
                                            },
                                        ]}
                                    >
                                        <TouchableOpacity
                                            onPress={() =>
                                                this.props.hideRestartCourse()
                                            }
                                            style={[
                                                styles.centerContent,
                                                {
                                                    height: '100%',
                                                    width: '100%',
                                                },
                                            ]}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 14 * factorRatio,
                                                    fontFamily:
                                                        'RobotoCondensed-Bold',
                                                    color: 'grey',
                                                }}
                                            >
                                                CANCEL
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <TouchableWithoutFeedback
                            onPress={() => this.props.hideRestartCourse()}
                            style={{width: fullWidth * 0.05}}
                        >
                            <View style={{flex: 1, alignSelf: 'stretch'}} />
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={{flex: 1, alignSelf: 'stretch'}}>
                        <TouchableWithoutFeedback
                            onPress={() => this.props.hideRestartCourse()}
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

export default withNavigation(RestartCourse);
