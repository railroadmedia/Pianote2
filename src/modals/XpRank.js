/**
 * XpRank
 */
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {withNavigation} from 'react-navigation';
import ProgressCircle from 'react-native-progress-circle';

class XpRank extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            rankProgress: 62.5,
            XP: this.props.xp,
            rank: this.props.rank,
        };
    }

    render = () => {
        return (
            <View
                key={'container'}
                style={{
                    height: fullHeight,
                    width: fullWidth,
                }}
            >
                <View
                    style={{
                        position: 'absolute',
                        zIndex: 5,
                        elevation: 5,
                        height: '100%',
                        width: '100%',
                    }}
                >
                    <View
                        key={'buffTop'}
                        style={{
                            flex: 1,
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => this.props.hideXpRank()}
                            style={{
                                height: '100%',
                                width: '100%',
                            }}
                        ></TouchableOpacity>
                    </View>
                    <View
                        key={'content'}
                        style={{
                            height: onTablet
                                ? fullHeight * 0.8
                                : (fullHeight * 0.625) / factorRatio,
                            width: '100%',
                            flexDirection: 'row',
                            elevation: 5,
                        }}
                    >
                        <View key={'buffLeft'} style={{width: '5%'}}>
                            <TouchableOpacity
                                onPress={() => this.props.hideXpRank()}
                                style={{
                                    height: '100%',
                                    width: '100%',
                                }}
                            ></TouchableOpacity>
                        </View>
                        <View
                            key={'content'}
                            style={{
                                height: '100%',
                                width: '90%',
                                borderRadius: 15 * factorRatio,
                                backgroundColor: 'white',
                                elevation: 10,
                            }}
                        >
                            <View style={{flex: 0.08}} />
                            <View
                                key={'yourXpRank'}
                                style={[styles.centerContent]}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'OpenSans-Regular',
                                        fontSize: 20 * factorRatio,
                                        fontWeight: 'bold',
                                        textAlign: 'center',
                                    }}
                                >
                                    Your XP Rank
                                </Text>
                            </View>
                            <View style={{flex: 0.05}} />
                            <View key={'gainXP'}>
                                <View style={{flex: 1}} />
                                <Text
                                    style={{
                                        fontFamily: 'OpenSans-Regular',
                                        fontSize: 16 * factorRatio,
                                        fontWeight: '300',
                                        textAlign: 'center',
                                    }}
                                >
                                    You earn XP by completing lessons,{'\n'}
                                    commenting on videos and more!
                                </Text>
                                <View style={{flex: 1}} />
                            </View>
                            <View style={{flex: 0.05}} />
                            <View key={'circle'} style={{flex: 0.7}}>
                                <View style={{flex: 1}} />
                                <View style={{flexDirection: 'row'}}>
                                    <View style={{flex: 1}} />
                                    <View
                                        style={{
                                            transform: [{rotate: '315deg'}],
                                        }}
                                    >
                                        <ProgressCircle
                                            percent={this.state.rankProgress}
                                            radius={fullWidth * 0.27}
                                            borderWidth={4 * factorRatio}
                                            shadowColor={'pink'}
                                            color={'red'}
                                            bgColor={'white'}
                                        >
                                            <View
                                                style={{
                                                    transform: [
                                                        {rotate: '45deg'},
                                                    ],
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontFamily:
                                                            'OpenSans-Regular',
                                                        textAlign: 'center',
                                                        fontWeight: '700',
                                                        fontSize:
                                                            34 * factorRatio,
                                                    }}
                                                >
                                                    {Number(
                                                        this.state.XP,
                                                    ).toLocaleString()}
                                                </Text>
                                                <Text
                                                    style={{
                                                        fontFamily:
                                                            'OpenSans-Regular',
                                                        textAlign: 'center',
                                                        fontWeight: '700',
                                                        fontSize:
                                                            24 * factorRatio,
                                                    }}
                                                >
                                                    {this.state.rank}
                                                </Text>
                                            </View>
                                        </ProgressCircle>
                                    </View>
                                    <View style={{flex: 1}} />
                                </View>
                                <View style={{flex: 1}} />
                            </View>
                            <View key={'nextRank'}>
                                <Text
                                    style={{
                                        fontFamily: 'OpenSans-Regular',
                                        fontSize: 16 * factorRatio,
                                        color: 'grey',
                                        textAlign: 'center',
                                    }}
                                >
                                    Next rank: 20,000
                                </Text>
                            </View>
                        </View>
                        <View key={'buffRight'} style={{width: '5%'}}>
                            <TouchableOpacity
                                onPress={() => this.props.hideXpRank()}
                                style={{
                                    height: '100%',
                                    width: '100%',
                                }}
                            ></TouchableOpacity>
                        </View>
                    </View>
                    <View key={'buffBottom'} style={{flex: 1}}>
                        <TouchableOpacity
                            onPress={() => this.props.hideXpRank()}
                            style={{
                                height: '100%',
                                width: '100%',
                            }}
                        ></TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };
}

export default withNavigation(XpRank);
