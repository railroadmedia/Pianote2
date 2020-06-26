/**
 * TheFourPillars
 */
import React from 'react';
import { 
    View, 
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { withNavigation } from 'react-navigation';
import { BlurView } from '@react-native-community/blur';
import AntIcon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';


class TheFourPillars extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    capitalize = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    render = () => {
        return (
            <View style={styles.container}>
                <BlurView
                    style={[
                        styles.centerContent, {
                        height: fullHeight,
                        width: fullWidth,
                        backgroundColor: 'transparent'
                    }]}
                    blurType={'xlight'}
                    blurAmount={(Platform.OS == 'android') ? 1 : 10}
                />
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
                            onPress={() => this.props.hideTheFourPillars()}
                            style={{height: '100%', width: '100%', alignSelf: 'stretch'}}
                        >
                            <View style={{flex: 1, alignSelf: 'stretch'}}/>
                        </TouchableWithoutFeedback>
                    </View>
                    <View key={'contentContainer'}
                        style={{
                            flexDirection: 'row',
                            borderRadius: 10*factorRatio,
                        }}
                    >
                        <TouchableWithoutFeedback
                            onPress={() => this.props.hideTheFourPillars()}
                            style={{width: fullWidth*0.05}}    
                        >
                            <View style={{flex: 1, alignSelf: 'stretch'}}/>
                        </TouchableWithoutFeedback>
                        <View 
                            style={{
                                width: fullWidth*0.9,
                                borderRadius: 10*factorRatio,
                                shadowOffset: { 
                                    width: 5*factorRatio, 
                                    height: 10*factorRatio,
                                },
                                shadowColor: 'black',
                                shadowOpacity: 0.1,
                                elevation: 3,
                                backgroundColor: 'white',
                            }}
                        >
                            <View style={{height: fullHeight*0.0225}}/>
                            <View key={'image'}
                                style={styles.centerContent}
                            >
                                <View
                                    style={{
                                        height: 180*factorRatio,
                                        width: fullWidth*0.8,
                                        backgroundColor: 'white',
                                        zIndex: 10,
                                    }}
                                >
                                    <FastImage
                                        style={{flex:1, borderRadius: 10}}
                                        source={{uri: this.props.data.thumbnail}}
                                        resizeMode={FastImage.resizeMode.stretch}
                                    />
                                </View>
                            </View>
                            <View style={{height: 10*factorVertical}}/>
                            <View key={'title'}
                                style={styles.centerContent}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'OpenSans-Regular',
                                        fontWeight: '700',
                                        fontSize: 22*factorRatio,
                                        textAlign: 'center',
                                    }}
                                >
                                    {this.props.data.title}
                                </Text>
                            </View>
                            <View key={'artist'}
                                style={[
                                    styles.centerContent, {
                                    marginTop: 5*factorRatio,
                                }]}
                            >
                                <Text 
                                    style={{
                                        fontFamily: 'OpenSans-Regular',
                                        textAlign: 'center',
                                        fontSize: 12*factorRatio,
                                        color: 'grey',
                                    }}
                                >
                                    {this.capitalize(this.props.data.type)} / {this.props.data.artist}
                                </Text>
                            </View>
                            <View style={{height: 10*factorVertical}}/>
                            <View key={'description'}
                                style={[
                                    styles.centerContent, {
                                    paddingLeft: fullWidth*0.05,
                                    paddingRight: fullWidth*0.05,
                                }]}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'OpenSans-Regular',
                                        fontSize: 14*factorRatio,
                                        textAlign: 'left',
                                    }}
                                >
                                    {this.props.data.description}
                                </Text>
                            </View>
                            <View key={'stats'}
                                style={[
                                    styles.centerContent, {
                                    flexDirection: 'row',
                                }]}
                            >
                                <View style={{flex: 1, alignSelf: 'stretch'}}/>
                                <View 
                                    style={[
                                        styles.centerContent, {
                                        width: 70*factorRatio,
                                    }]}
                                >
                                    <Text
                                        style={{
                                            fontFamily: 'OpenSans-Regular',
                                            fontWeight: '700',
                                            fontSize: 18*factorRatio,
                                            textAlign: 'left',
                                            marginTop: 10*factorVertical,
                                        }}
                                    >
                                        11
                                    </Text>
                                    <Text
                                        style={{
                                            fontFamily: 'OpenSans-Regular',
                                            fontSize: 12*factorRatio,
                                            textAlign: 'left',
                                            marginTop: 5*factorVertical,
                                        }}
                                    >
                                        LESSONS
                                    </Text>
                                </View>
                                <View style={{width: 15*factorRatio}}/>
                                <View 
                                    style={[
                                        styles.centerContent, {
                                        width: 70*factorRatio,
                                    }]}
                                >
                                    <Text
                                        style={{
                                            fontFamily: 'OpenSans-Regular',
                                            fontWeight: 'bold',
                                            fontSize: 18*factorRatio,
                                            textAlign: 'left',
                                            marginTop: 10*factorVertical,
                                        }}
                                    >
                                        {this.props.data.xp}
                                    </Text>
                                    <Text
                                        style={{
                                            fontFamily: 'OpenSans-Regular',
                                            fontWeight: '400',
                                            fontSize: 12*factorRatio,
                                            textAlign: 'left',
                                            marginTop: 5*factorVertical,
                                        }}
                                    >
                                        XP
                                    </Text>
                                </View>
                                <View style={{flex: 1, alignSelf: 'stretch'}}/>
                            </View>
                            <View style={{height: 10*factorVertical}}/>
                            <View key={'buttons'}
                                    style={[
                                        styles.centerContent, {
                                        flexDirection: 'row',
                                    }]}
                                >
                                    <View style={{flex: 1, alignSelf: 'stretch'}}/>
                                    <View 
                                        style={[
                                            styles.centerContent, {
                                            width: 70*factorRatio,
                                        }]}
                                    >
                                        <TouchableOpacity>
                                            <AntIcon
                                                name={'like2'}
                                                size={25*factorRatio}
                                            />
                                        </TouchableOpacity>
                                        <Text
                                            style={{
                                                fontFamily: 'OpenSans-Regular',
                                                fontSize: 12*factorRatio,
                                                textAlign: 'left',
                                                marginTop: 10*factorVertical,
                                            }}
                                        >
                                            {this.props.data.likeCount}
                                        </Text>
                                    </View>
                                    <View style={{width: 15*factorRatio}}/>
                                    <View 
                                        style={[
                                            styles.centerContent, {
                                            width: 70*factorRatio,
                                        }]}
                                    >
                                        <TouchableOpacity>
                                            <AntIcon
                                                name={'plus'}
                                                size={30*factorRatio}
                                            />
                                        </TouchableOpacity>
                                        <Text
                                            style={{
                                                fontFamily: 'OpenSans-Regular',
                                                fontSize: 12*factorRatio,
                                                textAlign: 'left',
                                                marginTop: 10*factorVertical,
                                            }}
                                        >
                                            My List
                                        </Text>
                                    </View>
                                    <View style={{width: 15*factorRatio}}/>
                                    <View 
                                        style={[
                                            styles.centerContent, {
                                            width: 70*factorRatio,
                                        }]}
                                    >
                                        <TouchableOpacity>
                                            <MaterialIcon
                                                name={'arrow-collapse-down'}
                                                size={30*factorRatio}
                                            />
                                        </TouchableOpacity>
                                        <Text
                                            style={{
                                                fontFamily: 'OpenSans-Regular',
                                                fontSize: 12*factorRatio,
                                                textAlign: 'left',
                                                marginTop: 10*factorVertical,
                                            }}
                                        >
                                            Download
                                        </Text>
                                    </View>
                                    <View style={{flex: 1, alignSelf: 'stretch'}}/>
                                </View>
                                <View style={{height: 20*factorVertical}}/>
                        </View>
                        <TouchableWithoutFeedback
                            onPress={() => this.props.hideTheFourPillars()}
                            style={{width: fullWidth*0.05}}    
                        >
                            <View style={{flex: 1, alignSelf: 'stretch'}}/>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={{flex: 1.1, alignSelf: 'stretch'}}>
                        <TouchableWithoutFeedback
                            onPress={() => this.props.hideTheFourPillars()}
                            style={{height: '100%', width: '100%', alignSelf: 'stretch'}}
                        >
                            <View style={{flex: 1, alignSelf: 'stretch'}}/>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </View>
        )
    }
}


export default withNavigation(TheFourPillars);