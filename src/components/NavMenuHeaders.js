/**
 * NavMenuHeaders
*/
import React from 'react';
import { 
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import { BlurView } from '@react-native-community/blur';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import Pianote from 'Pianote2/src/assets/img/svgs/pianote.svg';

class NavMenuHeaders extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
    }

    render = () => {
        return (
            <View 
                style={[
                    styles.centerContent, {
                    top: 0,
                    height: fullHeight*0.1 + (isNotch ? 10*factorVertical : 0), 
                    flexDirection: 'row',
                    left: 0,
                    backgroundColor: colors.mainBackground,
                }]}
            >
                <View 
                    style={{
                        flex: 1,
                        backgroundColor: colors.thirdBackground,
                        alignSelf: 'stretch',
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            width: fullWidth,
                            backgroundColor: colors.thirdBackground,
                        }}
                    >
                        <View key={'pianoteSign'}
                            style={{
                                position: 'relative',
                                left: 0,
                                bottom: 0,
                                height: fullHeight*0.1,
                                width: 0.33*fullWidth,
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => this.props.navigation.navigate('LESSONS')}
                                style={[
                                    styles.centerContent, {
                                    height: '100%',
                                    width: '100%',
                                }]}
                            >
                                <View style={{flex: 1}}/>
                                <Pianote
                                    height={30*factorHorizontal}
                                    width={fullWidth*0.25}
                                    fill={'#fb1b2f'}
                                />
                                <View style={{flex: 0.25}}/>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity key={'lessons'}
                            onPress={() => {
                                this.props.navigation.navigate('LESSONS')
                            }}
                        >
                            <View style={{flex: 1.25}}/>
                            <View 
                                style={{
                                    flexDirection: 'row',
                                    flex: 1,
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 14*factorRatio,
                                        fontFamily: 'OpenSans-Regular',
                                        fontWeight: (Platform.OS == 'android') ? 'bold' : '900',
                                        color: (this.props.currentPage == 'LESSONS') ? 'white' : colors.secondBackground,
                                    }}
                                >
                                    LESSONS{' '}
                                </Text>
                                <EntypoIcon
                                    name={'chevron-down'}
                                    color={(this.props.currentPage == 'LESSONS') ? 'white' : colors.secondBackground}
                                    size={20*factorRatio}
                                />
                            </View>
                        </TouchableOpacity>
                        <View style={{flex: 1}}/>
                        <TouchableOpacity key={'packs'}
                            onPress={() => {
                                this.props.navigation.navigate('PACKS')
                            }}
                        >
                            <View style={{flex: 1.25}}/>
                            <View 
                                style={{
                                    flexDirection: 'row',
                                    flex: 1,
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 14*factorRatio,
                                        fontFamily: 'OpenSans-Regular',
                                        fontWeight: (Platform.OS == 'android') ? 'bold' : '900',
                                        color: (this.props.currentPage == 'PACKS') ? 'white' : colors.secondBackground,
                                    }}
                                >
                                    PACKS{' '}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <View style={{flex: 1}}/>
                        <TouchableOpacity key={'mylist'}
                            onPress={() => {
                                this.props.navigation.navigate('MYLIST')
                            }}
                        >
                            <View style={{flex: 1.25}}/>
                            <View 
                                style={{
                                    flexDirection: 'row',
                                    flex: 1,
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 14*factorRatio,
                                        fontFamily: 'OpenSans-Regular',
                                        fontWeight: (Platform.OS == 'android') ? 'bold' : '900',
                                        color: (this.props.currentPage == 'MYLIST') ? 'white' : colors.secondBackground,
                                    }}
                                >
                                    MY LIST{' '}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <View style={{flex: 1}}/>
                    </View>
                </View>
            </View>
        )
    }
}

/**
<BlurView
    style={{
        height: '100%',
        width: '100%',
        opacity: 0.1,
    }}
    blurType={'dark'}
    blurAmount={20}
    blurRadius={1}
/>
 */

export default withNavigation(NavMenuHeaders);