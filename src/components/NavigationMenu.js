/**
 * BlurredList
*/
import React from 'react';
import { View, Text } from 'react-native';
import { withNavigation } from 'react-navigation';
import { BlurView } from '@react-native-community/blur';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { TouchableOpacity } from 'react-native-gesture-handler';

class NavigationMenu extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
        }
    }


    homeNav() {
        return (
            <View>
                <View key={'HOME'}
                    style={[styles.centerContent, {
                        height: fullHeight*0.1,
                    }]}
                >
                    <TouchableOpacity
                        onPress={() => {
                            this.props.onClose(false),
                            this.props.navigation.navigate('HOME')
                        }}
                        style={{flex: 1}}
                    >
                        <Text
                            style={{
                                fontFamily: 'Roboto',
                                color: (this.props.parentPage == 'HOME') ? 
                                    '#fb1b2f' : 'black',
                                fontSize: (this.props.parentPage == 'HOME' ? 25 : 21) + 
                                        (global.isTablet ? 27.5 : 0),
                                fontWeight: (this.props.parentPage == 'HOME') ? 
                                    '900' : '700',
                            }}
                        >
                            HOME
                        </Text>
                    </TouchableOpacity>
                </View>
                <View key={'LESSONS'}
                    style={[styles.centerContent, {
                        height: fullHeight*0.1,
                    }]}
                >
                    <TouchableOpacity
                        onPress={() => {
                            this.props.onClose(false),
                            this.props.navigation.navigate('LESSONS')
                        }}
                        style={{flex: 1}}
                    >
                        <Text
                            style={{
                                fontFamily: 'Roboto',
                                color: (this.props.parentPage == 'LESSONS') ? 
                                    '#fb1b2f' : 'black',
                                fontSize: (this.props.parentPage == 'LESSONS' ? 25 : 21) + 
                                        (global.isTablet ? 27.5 : 0),
                                fontWeight: (this.props.parentPage == 'LESSONS') ? 
                                    '900' : '700',
                            }}
                        >
                            LESSONS
                        </Text>
                    </TouchableOpacity>
                </View>
                <View key={'PACKS'}
                    style={[styles.centerContent, {
                        height: fullHeight*0.1,
                    }]}
                >
                    <TouchableOpacity
                        onPress={() => {
                            this.props.onClose(false),
                            this.props.navigation.navigate('PACKS')
                        }}
                        style={{flex: 1}}
                    >
                        <Text
                            style={{
                                fontFamily: 'Roboto',
                                color: (this.props.parentPage == 'PACKS') ? 
                                    '#fb1b2f' : 'black',
                                fontSize: (this.props.parentPage == 'PACKS' ? 25 : 21) + 
                                        (global.isTablet ? 27.5 : 0),
                                fontWeight: (this.props.parentPage == 'PACKS') ? 
                                    '900' : '700',
                            }}
                        >
                            PACKS
                        </Text>
                    </TouchableOpacity>
                </View>
                <View key={'MYLIST'}
                    style={[styles.centerContent, {
                        height: fullHeight*0.1,
                    }]}
                >
                    <TouchableOpacity
                        onPress={() => {
                            this.props.onClose(false),
                            this.props.navigation.navigate('MYLIST')
                        }}
                        style={{flex: 1}}
                    >
                        <Text
                            style={{
                                fontFamily: 'Roboto',
                                color: (this.props.parentPage == 'MY LIST') ? 
                                    '#fb1b2f' : 'black',
                                fontSize: (this.props.parentPage == 'MY LIST' ? 25 : 21) + 
                                        (global.isTablet ? 27.5 : 0),
                                fontWeight: (this.props.parentPage == 'MY LIST') ? 
                                    '900' : '700',
                            }}
                        >
                            MY LIST
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }


    lessonNav() {
        return (
            <View>
                <View key={'ALL TYPES'}
                    style={[styles.centerContent, {
                        height: fullHeight*0.1,
                    }]}
                >
                    <TouchableOpacity
                        onPress={() => {
                            this.props.onClose(false),
                            this.props.navigation.navigate('LESSONS')
                        }}
                        style={{flex: 1}}
                    >
                        <Text
                            style={{
                                fontFamily: 'Roboto',
                                color: (this.props.parentPage == 'ALL TYPES') ? 
                                    '#fb1b2f' : 'black',
                                fontSize: (this.props.parentPage == 'ALL TYPES' ? 25 : 21) + 
                                        (global.isTablet ? 27.5 : 0),
                                fontWeight: (this.props.parentPage == 'ALL TYPES') ? 
                                    '900' : '700',
                            }}
                        >
                            ALL TYPES
                        </Text>
                    </TouchableOpacity>
                </View>
                <View key={'LEARNING PATHES'}
                    style={[styles.centerContent, {
                        height: fullHeight*0.1,
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
                                fontFamily: 'Roboto',
                                color: (this.props.parentPage == 'LEARNING PATHES') ? 
                                    '#fb1b2f' : 'black',
                                fontSize: (this.props.parentPage == 'LEARNING PATHES' ? 25 : 21) + 
                                        (global.isTablet ? 27.5 : 0),
                                fontWeight: (this.props.parentPage == 'LEARNING PATHES') ? 
                                    '900' : '700',
                            }}
                        >
                            LEARNING PATHES
                        </Text>
                    </TouchableOpacity>
                </View>
                <View key={'COURSES'}
                    style={[styles.centerContent, {
                        height: fullHeight*0.1,
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
                                fontFamily: 'Roboto',
                                color: (this.props.parentPage == 'COURSES') ? 
                                    '#fb1b2f' : 'black',
                                fontSize: (this.props.parentPage == 'COURSES' ? 25 : 21) + 
                                        (global.isTablet ? 27.5 : 0),
                                fontWeight: (this.props.parentPage == 'COURSES') ? 
                                    '900' : '700',
                            }}
                        >
                            COURSES
                        </Text>
                    </TouchableOpacity>
                </View>
                <View key={'SONGS'}
                    style={[styles.centerContent, {
                        height: fullHeight*0.1,
                    }]}
                >
                    <TouchableOpacity
                        onPress={() => {
                            this.props.onClose(false),
                            this.props.navigation.navigate('')
                        }}
                        style={{flex: 1}}
                    >
                        <Text
                            style={{
                                fontFamily: 'Roboto',
                                color: (this.props.parentPage == 'SONGS') ? 
                                    '#fb1b2f' : 'black',
                                fontSize: (this.props.parentPage == 'SONGS' ? 25 : 21) + 
                                        (global.isTablet ? 27.5 : 0),
                                fontWeight: (this.props.parentPage == 'SONGS') ? 
                                    '900' : '700',
                            }}
                        >
                            SONGS
                        </Text>
                    </TouchableOpacity>
                </View>
                <View key={'STUDENT FOCUS'}
                    style={[styles.centerContent, {
                        height: fullHeight*0.1,
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
                                fontFamily: 'Roboto',
                                color: (this.props.parentPage == 'STUDENT FOCUS') ? 
                                    '#fb1b2f' : 'black',
                                fontSize: (this.props.parentPage == 'STUDENT FOCUS' ? 25 : 21) + 
                                        (global.isTablet ? 27.5 : 0),
                                fontWeight: (this.props.parentPage == 'STUDENT FOCUS') ? 
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


    packNav() {
        return (
            <View>
                <View key={'ALL PACKS'}
                    style={[styles.centerContent, {
                        height: fullHeight*0.1,
                    }]}
                >
                    <TouchableOpacity
                        onPress={() => {
                            this.props.onClose(false),
                            this.props.navigation.navigate('PACKS')
                        }}
                        style={{flex: 1}}
                    >
                        <Text
                            style={{
                                fontFamily: 'Roboto',
                                color: (this.props.parentPage == 'ALL PACKS') ? 
                                    '#fb1b2f' : 'black',
                                fontSize: (this.props.parentPage == 'ALL PACKS' ? 25 : 21) + 
                                        (global.isTablet ? 27.5 : 0),
                                fontWeight: (this.props.parentPage == 'ALL PACKS') ? 
                                    '900' : '700',
                            }}
                        >
                            ALL PACKS
                        </Text>
                    </TouchableOpacity>
                </View>
                <View key={'500 SONGS'}
                    style={[styles.centerContent, {
                        height: fullHeight*0.1,
                    }]}
                >
                    <TouchableOpacity
                        onPress={() => {
                            this.props.onClose(false),
                            this.props.navigation.push('SINGLEPACK', {data: '500 SONGS'})
                        }}
                        style={{flex: 1}}
                    >
                        <Text
                            style={{
                                fontFamily: 'Roboto',
                                color: (this.props.parentPage == '500 SONGS') ? 
                                    '#fb1b2f' : 'black',
                                fontSize: (this.props.parentPage == '500 SONGS' ? 25 : 21) + 
                                        (global.isTablet ? 27.5 : 0),
                                fontWeight: (this.props.parentPage == '500 SONGS') ? 
                                    '900' : '700',
                            }}
                        >
                            500 SONGS IN 5 DAYS
                        </Text>
                    </TouchableOpacity>
                </View>
                <View key={'SIGHT READING'}
                    style={[styles.centerContent, {
                        height: fullHeight*0.1,
                    }]}
                >
                    <TouchableOpacity
                        onPress={() => {
                            this.props.navigation.push('SINGLEPACK', {data: 'SIGHT READING'}),
                            this.props.onClose(false)
                        }}
                        style={{flex: 1}}
                    >
                        <Text
                            style={{
                                fontFamily: 'Roboto',
                                color: (this.props.parentPage == 'SIGHT READING') ? 
                                    '#fb1b2f' : 'black',
                                fontSize: (this.props.parentPage == 'SIGHT READING' ? 25 : 21) + 
                                        (global.isTablet ? 27.5 : 0),
                                fontWeight: (this.props.parentPage == 'SIGHT READING') ? 
                                    '900' : '700',
                            }}
                        >
                            SIGHT READING MADE SIMPLE
                        </Text>
                    </TouchableOpacity>
                </View>
                <View key={'FASTER FINGERS'}
                    style={[styles.centerContent, {
                        height: fullHeight*0.1,
                    }]}
                >
                    <TouchableOpacity
                        onPress={() => {
                            this.props.onClose(false),
                            this.props.navigation.push('SINGLEPACK', {data: 'FASTER FINGERS'})
                        }}
                        style={{flex: 1}}
                    >
                        <Text
                            style={{
                                fontFamily: 'Roboto',
                                color: (this.props.parentPage == 'FASTER FINGERS') ? 
                                    '#fb1b2f' : 'black',
                                fontSize: (this.props.parentPage == 'FASTER FINGERS' ? 25 : 21) + 
                                        (global.isTablet ? 27.5 : 0),
                                fontWeight: (this.props.parentPage == 'FASTER FINGERS') ? 
                                    '900' : '700',
                            }}
                        >
                            FASTER FINGERS
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }


    myListNav() {
        return (
            <View>
                <View key={'ALL LESSONS'}
                    style={[styles.centerContent, {
                        height: fullHeight*0.1,
                    }]}
                >
                    <TouchableOpacity
                        onPress={() => {
                            this.props.onClose(false)
                        }}
                        style={{flex: 1}}
                    >
                        <Text
                            style={{
                                fontFamily: 'Roboto',
                                color: (this.props.parentPage == 'ALL LESSONS') ? 
                                    '#fb1b2f' : 'black',
                                fontSize: (this.props.parentPage == 'ALL LESSONS' ? 25 : 21) + 
                                        (global.isTablet ? 27.5 : 0),
                                fontWeight: (this.props.parentPage == 'ALL LESSONS') ? 
                                    '900' : '700',
                            }}
                        >
                            ALL LESSONS
                        </Text>
                    </TouchableOpacity>
                </View>
                <View key={'ADDED TO LIST'}
                    style={[
                        styles.centerContent, {
                        height: fullHeight*0.1,
                    }]}
                >
                    <TouchableOpacity
                        onPress={() => {
                            this.props.onClose(false)
                        }}
                        style={{flex: 1}}
                    >
                        <Text
                            style={{
                                fontFamily: 'Roboto',
                                color: (this.props.parentPage == 'ADDED TO LIST') ? 
                                    '#fb1b2f' : 'black',
                                fontSize: (this.props.parentPage == 'ADDED TO LIST' ? 25 : 21) + 
                                        (global.isTablet ? 27.5 : 0),
                                fontWeight: (this.props.parentPage == 'ADDED TO LIST') ? 
                                    '900' : '700',
                            }}
                        >
                            ADDED TO LIST
                        </Text>
                    </TouchableOpacity>
                </View>
                <View key={'IN PROGRESS'}
                    style={[styles.centerContent, {
                        height: fullHeight*0.1,
                    }]}
                >
                    <TouchableOpacity
                        onPress={() => {
                            this.props.onClose(false)
                        }}
                        style={{flex: 1}}
                    >
                        <Text
                            style={{
                                fontFamily: 'Roboto',
                                color: (this.props.parentPage == 'IN PROGRESS') ? 
                                    '#fb1b2f' : 'black',
                                fontSize: (this.props.parentPage == 'IN PROGRESS' ? 25 : 21) + 
                                        (global.isTablet ? 27.5 : 0),
                                fontWeight: (this.props.parentPage == 'IN PROGRESS') ? 
                                    '900' : '700',
                            }}
                        >
                            IN PROGRESS
                        </Text>
                    </TouchableOpacity>
                </View>
                <View key={'COMPLETE'}
                    style={[styles.centerContent, {
                        height: fullHeight*0.1,
                    }]}
                >
                    <TouchableOpacity
                        onPress={() => {
                            this.props.onClose(false)
                        }}
                        style={{flex: 1}}
                    >
                        <Text
                            style={{
                                fontFamily: 'Roboto',
                                color: (this.props.parentPage == 'COMPLETE') ? 
                                    '#fb1b2f' : 'black',
                                fontSize: (this.props.parentPage == 'COMPLETE' ? 25 : 21) + 
                                        (global.isTablet ? 27.5 : 0),
                                fontWeight: (this.props.parentPage == 'COMPLETE') ? 
                                    '900' : '700',
                            }}
                        >
                            COMPLETE
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }


    menuNavigation() {
        if(this.props.menu == 'HOME') {
            return this.homeNav()
        } else if(this.props.menu == 'LESSONS') {
            return this.lessonNav()
        } else if(this.props.menu == 'PACKS') {
            return this.packNav()
        } else if(this.props.menu == 'MY LIST') {
            return this.myListNav()
        }
    }


    render = () => {
        return (
            <View key={'componentContainer'}
                style={[
                    styles.centerContent, {
                    height: fullHeight,
                    width: fullWidth,
                }]}
            >
                <BlurView
                    style={[
                        styles.centerContent, {
                        height: fullHeight,
                        width: fullWidth,
                    }]}
                    blurType={'xlight'}
                    blurAmount={20}
                >
                    <View style={{flex: 0.225, alignSelf: 'stretch'}}/>
                    <View key={'menuItems'} 
                        style={{alignSelf: 'stretch'}}
                    >
                        {this.menuNavigation()}
                    </View>
                    <View style={{flex: 0.55, alignSelf: 'stretch'}}/>
                    <View key={'buttonContainer'}
                        style={[
                            styles.buttonContainer,
                            styles.centerContent,
                        ]}
                    >
                        <View style={{flex: 1, alignSelf: 'stretch'}}/>
                        <View key={'closeButton'}
                            style={[
                                styles.centerContent,
                                styles.redButton,
                            ]}
                        >
                            <TouchableOpacity 
                                onPress={() => this.props.onClose(false)}
                                style={[styles.centerContent, styles.innerRedButton]}
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
                </BlurView>
            </View>
        )
    }
}

export default withNavigation(NavigationMenu);