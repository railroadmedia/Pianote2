/**
 * VideoPlayerOptions
 */
import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
} from 'react-native';
import { withNavigation } from 'react-navigation';
import X from 'Pianote2/src/assets/img/svgs/X.svg';
import { BlurView } from '@react-native-community/blur';
import Settings from 'Pianote2/src/assets/img/svgs/settings.svg';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

class VideoPlayerOptions extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
        }
    }


    render = () => {
        return (
            <View style={styles.container}>          
                <View style={{flex: 1, alignSelf: 'stretch'}}>
                    <TouchableWithoutFeedback
                        onPress={() => this.props.hideVideoPlayerOptions()}
                        style={{height: '100%', width: '100%', alignSelf: 'stretch'}}
                    >
                    </TouchableWithoutFeedback>
                </View>
                <View
                    style={{
                        height: fullHeight*0.275 + (
                            (global.isTablet) ? fullHeight*0.1 : 0),
                        flexDirection: 'row',
                    }}
                >
                    <View 
                        style={{
                            width: '100%',
                            backgroundColor: 'white',
                        }}
                    >
                        <TouchableOpacity key={'quality'}
                            style={{
                                flex: 0.4,
                                paddingLeft: fullWidth*0.05,
                                flexDirection: 'row',
                            }}
                        >
                            <View>
                                <View style={{flex: 1}}/>
                                <Settings
                                    height={20*factorRatio}
                                    width={20*factorRatio}
                                    fill={'black'}
                                />
                                <View style={{flex: 1}}/>
                            </View>
                            <View style={{width: 10*factorHorizontal}}/>
                            <View>
                                <View style={{flex: 1}}/>
                                <Text
                                    style={{
                                        fontSize: 18*factorRatio,
                                        fontFamily: 'Roboto',
                                    }}
                                >
                                    Video Quality
                                </Text>
                                <View style={{flex: 1}}/>
                            </View>
                            <View>
                                <View style={{flex: 1}}/>
                                <Text
                                    style={{
                                        fontSize: 18*factorRatio,
                                        color: 'grey',
                                        fontFamily: 'Roboto',
                                    }}
                                > - Auto (360p)
                                </Text>
                                <View style={{flex: 1}}/>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity key={'speed'}
                            style={{
                                flex: 0.4,
                                paddingLeft: fullWidth*0.05,
                                flexDirection: 'row',
                            }}
                        >
                            <TouchableOpacity>
                                <View style={{flex: 1}}/>
                                <X
                                    height={20*factorRatio}
                                    width={20*factorRatio}
                                    fill={'black'}
                                />
                                <View style={{flex: 1}}/>
                            </TouchableOpacity>
                            <View style={{width: 10*factorHorizontal}}/>
                            <View>
                                <View style={{flex: 1}}/>
                                <Text
                                    style={{
                                        fontSize: 18*factorRatio,
                                        fontFamily: 'Roboto',
                                    }}
                                >
                                    Playback Speed
                                </Text>
                                <View style={{flex: 1}}/>
                            </View>
                            <View>
                                <View style={{flex: 1}}/>
                                <Text
                                    style={{
                                        fontSize: 18*factorRatio,
                                        color: 'grey',
                                        fontFamily: 'Roboto',
                                    }}
                                > - Normal
                                </Text>
                                <View style={{flex: 1}}/>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity key={'cancel'}
                            onPress={() => {
                                this.props.hideVideoPlayerOptions()
                            }}
                            style={{
                                flex: 0.4,
                                paddingLeft: fullWidth*0.05,
                                flexDirection: 'row',
                                zIndex: 10,
                            }}
                        >
                            <View
                                style={{

                                }}
                            >
                                <View style={{flex: 1}}/>
                                <X
                                    height={20*factorRatio}
                                    width={20*factorRatio}
                                    fill={'black'}
                                />
                                <View style={{flex: 1}}/>
                            </View>
                            <View style={{width: 10*factorHorizontal}}/>
                            <View>
                                <View style={{flex: 1}}/>
                                <Text
                                    style={{
                                        fontSize: 18*factorRatio,
                                        fontFamily: 'Roboto',
                                    }}
                                >
                                    Cancel
                                </Text>
                                <View style={{flex: 1}}/>
                            </View>
                        </TouchableOpacity>
                        <View style={{flex: 0.25}}/>
                    </View>
                </View>
            </View>
        )
    }
}

export default withNavigation(VideoPlayerOptions);