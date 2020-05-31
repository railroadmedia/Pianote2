/**
 * BlurredList
*/
import React from 'react';
import { 
    View, 
    Text,
    TouchableOpacity,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import { BlurView } from '@react-native-community/blur';
import FeatherIcon from 'react-native-vector-icons/Feather';

class NavigationMenu extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
        }
    }


    lessonNav() {
        return (
            <View>
                <View key={'LEARNING PATHES'}
                    style={[styles.centerContent, {
                        height: (onTablet) ?  fullHeight*0.125 : fullHeight*0.1,
                    }]}
                >
                    <TouchableOpacity
                        onPress={() => {
                            this.props.onClose(false),
                            this.props.navigation.navigate('LEARNINGPATHS')
                        }}
                        style={{flex: 1}}
                    >
                        <Text
                            style={{
                                fontFamily: 'OpenSans-Regular',
                                color: (this.props.parentPage == 'LEARNING PATHES') ? 
                                    colors.secondBackground : 'white',
                                fontSize: (this.props.parentPage == 'LEARNING PATHES' ? 25 : 21) + 
                                        (onTablet ? 27.5 : 0),
                                fontWeight: (Platform.OS == 'android') ? 'bold' : (this.props.parentPage == 'LEARNING PATHES') ? 
                                    '900' : '700',
                            }}
                        >
                            LEARNING PATHES
                        </Text>
                    </TouchableOpacity>
                </View>
                <View key={'COURSES'}
                    style={[styles.centerContent, {
                        height: (onTablet) ?  fullHeight*0.125 : fullHeight*0.1,
                    }]}
                >
                    <TouchableOpacity
                        onPress={() => {
                            this.props.onClose(false),
                            this.props.navigation.navigate('COURSECATALOG')
                        }}
                        style={{flex: 1}}
                    >
                        <Text
                            style={{
                                fontFamily: 'OpenSans-Regular',
                                color: (this.props.parentPage == 'COURSES') ? 
                                    colors.secondBackground : 'white',
                                fontSize: (this.props.parentPage == 'COURSES' ? 25 : 21) + 
                                        (onTablet ? 27.5 : 0),
                                fontWeight: (Platform.OS == 'android') ? 'bold' : (this.props.parentPage == 'COURSES') ? 
                                    '900' : '700',
                            }}
                        >
                            COURSES
                        </Text>
                    </TouchableOpacity>
                </View>
                <View key={'SONGS'}
                    style={[styles.centerContent, {
                        height: (onTablet) ?  fullHeight*0.125 : fullHeight*0.1,
                    }]}
                >
                    <TouchableOpacity
                        onPress={() => {
                            this.props.onClose(false),
                            this.props.navigation.navigate('SONGCATALOG')
                        }}
                        style={{flex: 1}}
                    >
                        <Text
                            style={{
                                fontFamily: 'OpenSans-Regular',
                                color: (this.props.parentPage == 'SONGS') ? 
                                    colors.secondBackground : 'white',
                                fontSize: (this.props.parentPage == 'SONGS' ? 25 : 21) + 
                                        (onTablet ? 27.5 : 0),
                                fontWeight: (Platform.OS == 'android') ? 'bold' : (this.props.parentPage == 'SONGS') ? 
                                    '900' : '700',
                            }}
                        >
                            SONGS
                        </Text>
                    </TouchableOpacity>
                </View>
                <View key={'STUDENT FOCUS'}
                    style={[styles.centerContent, {
                        height: (onTablet) ?  fullHeight*0.125 : fullHeight*0.1,
                    }]}
                >
                    <TouchableOpacity
                        onPress={() => {
                            this.props.onClose(false),
                            this.props.navigation.navigate('STUDENTFOCUSCATALOG')
                        }}
                        style={{flex: 1}}
                    >
                        <Text
                            style={{
                                fontFamily: 'OpenSans-Regular',
                                color: (this.props.parentPage == 'STUDENT FOCUS') ? 
                                    colors.secondBackground : 'white',
                                fontSize: (this.props.parentPage == 'STUDENT FOCUS' ? 25 : 21) + 
                                        (onTablet ? 27.5 : 0),
                                fontWeight: (Platform.OS == 'android') ? 'bold' : (this.props.parentPage == 'STUDENT FOCUS') ? 
                                    '900' : '700',
                            }}
                        >
                            STUDENT FOCUS
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }


    render = () => {
        return (
            <View key={'componentContainer'}
                style={[
                    styles.centerContent, {
                    height: fullHeight,
                    width: fullWidth,
                    elevation: 5,
                    backgroundColor: 'transparent',
                }]}
            >
                <BlurView
                    style={[
                        styles.centerContent, {
                        height: fullHeight,
                        width: fullWidth,
                    }]}
                    blurType={'extraDark'}
                    blurAmount={15}
                />
                <View
                    style={{
                        position: 'absolute',
                        zIndex: 5,
                        height: fullHeight - navHeight,
                        width: fullWidth,
                    }}
                >
                    <View style={{flex: 0.225, alignSelf: 'stretch'}}/>
                    <View key={'menuItems'} 
                        style={{alignSelf: 'stretch'}}
                    >
                        {this.lessonNav()}
                    </View>
                    <View style={{flex: 0.55, alignSelf: 'stretch'}}/>
                    <View key={'buttonContainer'}
                        style={[
                            styles.buttonContainer,
                            styles.centerContent, {
                        }]}
                    >
                        <View style={{flex: 1, alignSelf: 'stretch'}}/>
                        <View key={'closeButton'}
                            style={[
                                styles.centerContent,
                                styles.redButton,
                            ]}
                        >
                            <TouchableOpacity 
                                onPress={() => {
                                    this.props.onClose(false)
                                }}
                                style={[
                                    styles.centerContent, 
                                    styles.innerRedButton, {
                                }]}
                            >
                                <View style={{flex: 1}}/>
                                <FeatherIcon
                                    size={50*factorRatio}
                                    name={'x'}
                                    color={'white'}
                                />
                                <View style={{flex: 1}}/>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex: 1, alignSelf: 'stretch'}}/>
                    </View>   
                </View>                
            </View>
        )
    }
}

export default withNavigation(NavigationMenu);