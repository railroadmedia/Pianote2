/**
 * Filters
 */
import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

export default class Filters extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            type: 'Courses',
            level: 3,
            openProgress: false,
            openInstructors: false,
            all: false,
            filter1: false,
            filter2: false,
            filter3: false,
            filter4: false,
            filter5: false,
            filter6: false,
            filter7: false,
            filter8: false,
            kenny: false,
            lisa: false,
            cassi: false,
            jay: false,
            jordan: false, 
            jonny: false,
            brett: false,
            nate: false,
            progressAll: false,
            progressProgress: false,
            progressComplete: false,
            allLevels: false,

        }
    }

    componentDidMount() {
        let type = this.props.navigation.getParam('type')
        if(typeof(type) !== 'undefined') {
            this.setState({type})
        }
    }


    render() {
        return (
            <View 
                style={{
                    height: fullHeight - navHeight, 
                    alignSelf: 'stretch'
                }}
            >
                <View key={'contentContainer'}
                        style={{flex: 1}}
                    >
                        <View 
                            style={[
                                styles.centerContent, {
                                height: (Platform.OS == 'android') ?  fullHeight*0.1 : 
                                    (isNotch ? fullHeight*0.12 : fullHeight*0.055),
                                backgroundColor: colors.thirdBackground,
                            }]}
                        >
                            <View style={{flex: 1}}/>
                            <View 
                                style={[
                                    styles.centerContent, {
                                    flexDirection: 'row',
                                    backgroundColor: colors.thirdBackground,
                                }]}
                            >
                                <View style={{flex: 1, flexDirection: 'row'}}>
                                    <View style={{flex: 0.1}}/>
                                    <View>
                                        <View style={{flex: 1}}/>
                                        <TouchableOpacity
                                            onPress={() => this.props.navigation.goBack()}
                                            style={{
                                                paddingLeft: 10*factorRatio,
                                                paddingRight: 10*factorRatio,
                                            }}
                                        >
                                            <EntypoIcon
                                                name={'chevron-thin-left'}
                                                size={25*factorRatio}
                                                color={'white'}
                                            />
                                        </TouchableOpacity>
                                        <View style={{flex: 1}}/>
                                    </View>
                                </View>
                                <Text
                                    style={{
                                        fontSize: 22*factorRatio,
                                        fontWeight: 'bold',
                                        color: 'white',
                                        fontFamily: 'OpenSans-Regular',
                                    }}
                                >
                                    Filter {this.state.type}
                                </Text>
                                <View style={{flex: 1}}/>
                            </View>
                            <View style={{height: 20*factorVertical}}/>
                        </View>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentInsetAdjustmentBehavior={'never'}
                            style={{flex: 0.9, backgroundColor: colors.mainBackground}}
                        >
                            <View style={{height: 30*factorVertical}}/>
                            <Text key={'setYourSkill'}
                                style={{
                                    fontSize: 18*factorRatio,
                                    marginBottom: 5*factorVertical,
                                    textAlign: 'left', 
                                    fontFamily: 'RobotoCondensed-Bold',
                                    color: colors.secondBackground,
                                    paddingLeft: fullWidth*0.035,
                                }}
                            >
                                SET YOUR SKILL LEVEL
                            </Text>
                            <View key={'slider'}
                                style={[
                                    styles.centerContent, {
                                    paddingLeft: fullWidth*0.035,
                                    paddingRight: fullWidth*0.035,
                                }]}
                            >
                                <MultiSlider
                                    min={1}
                                    max={10}
                                    step={1}
                                    snapped={true}
                                    values={[this.state.level]}
                                    onValuesChangeFinish={(e) => {
                                        this.setState({level: e[0]})
                                    }}
                                    sliderLength={fullWidth*0.93}
                                    trackStyle={{
                                        height: 5*factorHorizontal,
                                        backgroundColor: colors.secondBackground,
                                    }}
                                    selectedStyle={{
                                        backgroundColor: colors.pianoteRed,
                                        height: 5*factorHorizontal,
                                    }}
                                    markerStyle={{
                                        height: (this.state.allLevels) ? 0 : 17.5*factorRatio,
                                        width: (this.state.allLevels) ? 0 : 17.5*factorRatio,
                                        marginBottom: 0,
                                        borderRadius: 40,
                                        backgroundColor: colors.pianoteRed,
                                        borderColor: colors.pianoteRed,
                                    }}
                                />
                            </View>
                            <View style={{height: 10*factorRatio}}/>
                            <Text 
                                style={{
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    fontSize: 24*factorRatio,
                                    fontFamily: 'OpenSans-Regular',
                                    color: 'white',
                                }}
                            >
                                {(this.state.allLevels) ? 'ALL LEVELS' : 'LEVEL ' + this.state.level}
                            </Text>
                            <View style={{height: 10*factorRatio}}/>
                            <Text
                                style={{
                                    textAlign: 'center',
                                    fontSize: 12*factorRatio,
                                    fontFamily: 'OpenSans-Regular',
                                    color: 'white',
                                    paddingLeft: fullWidth*0.1,
                                    paddingRight: fullWidth*0.1,
                                }}
                            >
                                Occasion endeavor of soon rank be most head time tore. Colonel or passage to ability. 
                            </Text>
                            <View style={{height: 10*factorRatio}}/>
                            <View key={'allLevels'}
                                style={{
                                    minHeight: 70*factorVertical,
                                    borderBottomWidth: 0.5*factorRatio,
                                    borderBottomColor: colors.secondBackground,
                                }}
                            >
                                <View style={{height: 10*factorRatio}}/>
                                <View
                                    style={{
                                        height: 30*factorVertical,
                                        justifyContent: 'space-around',
                                        alignContent: 'space-around',
                                        flexDirection: 'row',
                                    }}
                                >
                                    <View style={{flex: 1}}/>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({
                                                allLevels: !this.state.allLevels,
                                                level: 10,
                                            })
                                        }}
                                        style={[ 
                                            styles.centerContent, {
                                            height: 30*factorVertical,
                                            width: fullWidth*0.3,
                                            marginRight: fullWidth*0.01,
                                            marginLeft: fullWidth*0.01,
                                            borderWidth: 0.5*factorRatio,
                                            borderColor: (this.state.allLevels) ? 'transparent' : colors.secondBackground,
                                            backgroundColor: (this.state.allLevels) ? 'red' : 'transparent',
                                            borderRadius: 200,
                                        }]}
                                    >
                                        <Text
                                            style={{
                                                textAlign: 'center',
                                                fontWeight: 'bold',
                                                fontSize: 12*factorRatio,
                                                fontFamily: 'OpenSans-Regular',
                                                color: (this.state.allLevels) ? 'white' : colors.secondBackground,
                                            }}
                                        >
                                            ALL
                                        </Text>                                
                                    </TouchableOpacity>
                                    <View style={{flex: 1}}/>
                                </View>
                                <View style={{height: 40*factorRatio}}/>
                            </View>
                            <View style={{height: 30*factorVertical}}/>
                            <View key={'topics'}>
                                <Text
                                    style={{
                                        fontSize: 18*factorRatio,
                                        marginBottom: 5*factorVertical,
                                        textAlign: 'left', 
                                        fontFamily: 'RobotoCondensed-Bold',
                                        color: colors.secondBackground,
                                        paddingLeft: fullWidth*0.035,
                                    }}
                                >
                                    WHAT DO YOU WANT TO WORK ON?
                                </Text>
                                <View key={'levelsWanted'}
                                    style={{
                                        minHeight: 70*factorVertical,
                                    }}
                                >
                                    <View style={{height: 20*factorRatio}}/>
                                    <View
                                        style={{
                                            height: 30*factorVertical,
                                            justifyContent: 'space-around',
                                            alignContent: 'space-around',
                                            flexDirection: 'row',
                                        }}
                                    >
                                        <View style={{flex: 1}}/>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setState({
                                                    filter1: !this.state.filter1
                                                })
                                            }}
                                            style={[ 
                                                styles.centerContent, {
                                                height: 30*factorVertical,
                                                width: fullWidth*0.3,
                                                marginRight: fullWidth*0.01,
                                                marginLeft: fullWidth*0.01,
                                                borderWidth: 0.5*factorRatio,
                                                borderColor: (this.state.filter1) ? 'transparent' : colors.secondBackground,
                                                backgroundColor: (this.state.filter1) ? 'red' : 'transparent',
                                                borderRadius: 200,
                                            }]}
                                        >
                                            <Text
                                                style={{
                                                    textAlign: 'center',
                                                    fontWeight: 'bold',
                                                    fontSize: 12*factorRatio,
                                                    fontFamily: 'OpenSans-Regular',
                                                    color: (this.state.filter1) ? 'white' : colors.secondBackground,
                                                }}
                                            >
                                                ALL
                                            </Text>                                
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setState({
                                                    filter2: !this.state.filter2
                                                })
                                            }}
                                            style={[ 
                                                styles.centerContent, {
                                                height: 30*factorVertical,
                                                width: fullWidth*0.3,
                                                marginRight: fullWidth*0.01,
                                                marginLeft: fullWidth*0.01,
                                                borderWidth: 0.5*factorRatio,
                                                borderColor: (this.state.filter2) ? 'transparent' : colors.secondBackground,
                                                backgroundColor: (this.state.filter2) ? 'red' : 'transparent',
                                                borderRadius: 200,
                                            }]}
                                        >
                                            <Text
                                                style={{
                                                    textAlign: 'center',
                                                    fontWeight: 'bold',
                                                    fontSize: 12*factorRatio,
                                                    fontFamily: 'OpenSans-Regular',
                                                    color: (this.state.filter2) ? 'white' : colors.secondBackground,
                                                }}
                                            >
                                                TOPICS
                                            </Text>                                
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setState({
                                                    filter3: !this.state.filter3
                                                })
                                            }}
                                            style={[ 
                                                styles.centerContent, {
                                                height: 30*factorVertical,
                                                width: fullWidth*0.3,
                                                marginRight: fullWidth*0.01,
                                                marginLeft: fullWidth*0.01,
                                                borderWidth: 0.5*factorRatio,
                                                borderColor: (this.state.filter3) ? 'transparent' : colors.secondBackground,
                                                backgroundColor: (this.state.filter3) ? 'red' : 'transparent',
                                                borderRadius: 200,
                                            }]}
                                        >
                                            <Text
                                                style={{
                                                    textAlign: 'center',
                                                    fontWeight: 'bold',
                                                    fontSize: 12*factorRatio,
                                                    fontFamily: 'OpenSans-Regular',
                                                    color: (this.state.filter3) ? 'white' : colors.secondBackground,
                                                }}
                                            >
                                                FROM
                                            </Text>                                
                                        </TouchableOpacity>
                                        <View style={{flex: 1}}/>
                                    </View>
                                    <View style={{height: 10*factorRatio}}/>
                                    <View
                                        style={{
                                            height: 30*factorVertical,
                                            justifyContent: 'space-around',
                                            alignContent: 'space-around',
                                            flexDirection: 'row',
                                        }}
                                    >
                                        <View style={{flex: 1}}/>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setState({
                                                    filter4: !this.state.filter4
                                                })
                                            }}
                                            style={[ 
                                                styles.centerContent, {
                                                height: 30*factorVertical,
                                                width: fullWidth*0.3,
                                                marginRight: fullWidth*0.01,
                                                marginLeft: fullWidth*0.01,
                                                borderWidth: 0.5*factorRatio,
                                                borderColor: (this.state.filter4) ? 'transparent' : colors.secondBackground,
                                                backgroundColor: (this.state.filter4) ? 'red' : 'transparent',
                                                borderRadius: 200,
                                            }]}
                                        >
                                            <Text
                                                style={{
                                                    textAlign: 'center',
                                                    fontWeight: 'bold',
                                                    fontSize: 12*factorRatio,
                                                    fontFamily: 'OpenSans-Regular',
                                                    color: (this.state.filter4) ? 'white' : colors.secondBackground,
                                                }}
                                            >
                                                THIS
                                            </Text>                                
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setState({
                                                    filter5: !this.state.filter5
                                                })
                                            }}
                                            style={[ 
                                                styles.centerContent, {
                                                height: 30*factorVertical,
                                                width: fullWidth*0.3,
                                                marginRight: fullWidth*0.01,
                                                marginLeft: fullWidth*0.01,
                                                borderWidth: 0.5*factorRatio,
                                                borderColor: (this.state.filter5) ? 'transparent' : colors.secondBackground,
                                                backgroundColor: (this.state.filter5) ? 'red' : 'transparent',
                                                borderRadius: 200,
                                            }]}
                                        >
                                            <Text
                                                style={{
                                                    textAlign: 'center',
                                                    fontWeight: 'bold',
                                                    fontSize: 12*factorRatio,
                                                    fontFamily: 'OpenSans-Regular',
                                                    color: (this.state.filter5) ? 'white' : colors.secondBackground,
                                                }}
                                            >
                                                CONTENT
                                            </Text>                                
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setState({
                                                    filter6: !this.state.filter6
                                                })
                                            }}
                                            style={[ 
                                                styles.centerContent, {
                                                height: 30*factorVertical,
                                                width: fullWidth*0.3,
                                                marginRight: fullWidth*0.01,
                                                marginLeft: fullWidth*0.01,
                                                borderWidth: 0.5*factorRatio,
                                                borderColor: (this.state.filter6) ? 'transparent' : colors.secondBackground,
                                                backgroundColor: (this.state.filter6) ? 'red' : 'transparent',
                                                borderRadius: 200,
                                            }]}
                                        >
                                            <Text
                                                style={{
                                                    textAlign: 'center',
                                                    fontWeight: 'bold',
                                                    fontSize: 12*factorRatio,
                                                    fontFamily: 'OpenSans-Regular',
                                                    color: (this.state.filter6) ? 'white' : colors.secondBackground,
                                                }}
                                            >
                                                TYPE
                                            </Text>                                
                                        </TouchableOpacity>
                                        <View style={{flex: 1}}/>
                                    </View>
                                    <View style={{height: 10*factorRatio}}/>
                                    <View
                                        style={{
                                            height: 30*factorVertical,
                                            justifyContent: 'space-around',
                                            alignContent: 'space-around',
                                            flexDirection: 'row',
                                        }}
                                    >
                                        <View style={{flex: 1}}/>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setState({
                                                    filter7: !this.state.filter7
                                                })
                                            }}
                                            style={[ 
                                                styles.centerContent, {
                                                height: 30*factorVertical,
                                                width: fullWidth*0.3,
                                                marginRight: fullWidth*0.01,
                                                marginLeft: fullWidth*0.01,
                                                borderWidth: 0.5*factorRatio,
                                                borderColor: (this.state.filter7) ? 'transparent' : colors.secondBackground,
                                                backgroundColor: (this.state.filter7) ? 'red' : 'transparent',
                                                borderRadius: 200,
                                            }]}
                                        >
                                            <Text
                                                style={{
                                                    textAlign: 'center',
                                                    fontWeight: 'bold',
                                                    fontSize: 12*factorRatio,
                                                    fontFamily: 'OpenSans-Regular',
                                                    color: (this.state.filter7) ? 'white' : colors.secondBackground,
                                                }}
                                            >
                                                GO
                                            </Text>                                
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setState({
                                                    filter8: !this.state.filter8
                                                })
                                            }}
                                            style={[ 
                                                styles.centerContent, {
                                                height: 30*factorVertical,
                                                width: fullWidth*0.3,
                                                marginRight: fullWidth*0.01,
                                                marginLeft: fullWidth*0.01,
                                                borderWidth: 0.5*factorRatio,
                                                borderColor: (this.state.filter8) ? 'transparent' : colors.secondBackground,
                                                backgroundColor: (this.state.filter8) ? 'red' : 'transparent',
                                                borderRadius: 200,
                                            }]}
                                        >
                                            <Text
                                                style={{
                                                    textAlign: 'center',
                                                    fontWeight: 'bold',
                                                    fontSize: 12*factorRatio,
                                                    fontFamily: 'OpenSans-Regular',
                                                    color: (this.state.filter8) ? 'white' : colors.secondBackground,
                                                }}
                                            >
                                                HERE
                                            </Text>                                
                                        </TouchableOpacity>
                                        <View
                                            style={[ 
                                                styles.centerContent, {
                                                height: 30*factorVertical,
                                                width: fullWidth*0.3,
                                                marginRight: fullWidth*0.01,
                                                marginLeft: fullWidth*0.01,
                                                borderRadius: 200,
                                            }]}
                                        />
                                        <View style={{flex: 1}}/>
                                    </View>
                                </View>
                            </View>
                            <View style={{height: 30*factorVertical}}/>
                            <TouchableOpacity key={'chooseProgress'}
                                onPress={() => {
                                    this.setState({
                                        openProgress: !this.state.openProgress,
                                    })
                                }}
                                style={{
                                    height: fullHeight*0.1,
                                    flexDirection: 'row',
                                    paddingLeft: fullWidth*0.035,
                                    paddingRight: fullWidth*0.035, 
                                    borderTopColor: colors.secondBackground,
                                    borderTopWidth: 0.5*factorRatio,
                                    borderBottomColor: colors.secondBackground,
                                    borderBottomWidth: (this.state.openProgress) ? 0 : 0.25*factorRatio,
                                }}
                            >
                                <View>
                                    <View style={{flex: 1}}/>
                                    <Text
                                        style={{
                                            fontSize: 18*factorRatio,
                                            marginBottom: 5*factorVertical,
                                            textAlign: 'left', 
                                            fontFamily: 'RobotoCondensed-Bold',
                                            color: colors.secondBackground,
                                        }}
                                    >
                                        CHOOSE YOUR PROGRESS
                                    </Text>
                                    <View style={{flex: 1}}/>
                                </View>
                                <View style={{flex: 1}}/>
                                <View>
                                    <View style={{flex: 1}}/>
                                    <View
                                        style={{
                                            paddingLeft: 10*factorRatio,
                                            paddingRight: 10*factorRatio,
                                        }}
                                    >
                                        <EntypoIcon
                                            name={(this.state.openProgress) ? 'chevron-thin-up':'chevron-thin-down'}
                                            size={25*factorRatio}
                                            color={colors.secondBackground}
                                        />
                                    </View>
                                    <View style={{flex: 1}}/>
                                </View>
                            </TouchableOpacity>
                            {this.state.openProgress && (
                            <View key={'progressLevels'}
                                style={{
                                    borderBottomColor: colors.secondBackground,
                                    borderBottomWidth: 0.5*factorRatio,
                                }}
                            >
                                <View
                                    style={{
                                        height: 30*factorVertical,
                                        justifyContent: 'space-around',
                                        alignContent: 'space-around',
                                        flexDirection: 'row',
                                    }}
                                >
                                    <View style={{flex: 1}}/>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({
                                                progressAll: !this.state.progressAll,
                                            })
                                        }}
                                        style={[ 
                                            styles.centerContent, {
                                            height: 30*factorVertical,
                                            width: fullWidth*0.3,
                                            marginRight: fullWidth*0.01,
                                            marginLeft: fullWidth*0.01,
                                            borderWidth: 0.5*factorRatio,
                                            borderColor: (this.state.progressAll) ? null : colors.secondBackground,
                                            backgroundColor: (this.state.progressAll) ? colors.pianoteRed : colors.mainBackground,
                                            borderRadius: 200,
                                        }]}
                                    >
                                        <Text
                                            style={{
                                                textAlign: 'center',
                                                fontWeight: 'bold',
                                                fontSize: 12*factorRatio,
                                                fontFamily: 'OpenSans-Regular',
                                                color: (this.state.progressAll) ? 'white' : colors.secondBackground,
                                            }}
                                        >
                                            ALL
                                        </Text>                                
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({
                                                progressProgress: !this.state.progressProgress,
                                            })
                                        }}
                                        style={[ 
                                            styles.centerContent, {
                                                height: 30*factorVertical,
                                                width: fullWidth*0.3,
                                                marginRight: fullWidth*0.01,
                                                marginLeft: fullWidth*0.01,
                                                borderWidth: 0.5*factorRatio,
                                                borderColor: (this.state.progressProgress) ? null : colors.secondBackground,
                                                backgroundColor: (this.state.progressProgress) ? colors.pianoteRed : colors.mainBackground,
                                                borderRadius: 200,
                                        }]}
                                    >
                                        <Text
                                            style={{
                                                textAlign: 'center',
                                                fontWeight: 'bold',
                                                fontSize: 12*factorRatio,
                                                fontFamily: 'OpenSans-Regular',
                                                color: (this.state.progressProgress) ? 'white' : colors.secondBackground,
                                            }}
                                        >
                                            IN PROGRESS
                                        </Text>                                
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({
                                                progressComplete: !this.state.progressComplete,
                                            })
                                        }}
                                        style={[ 
                                            styles.centerContent, {
                                                height: 30*factorVertical,
                                                width: fullWidth*0.3,
                                                marginRight: fullWidth*0.01,
                                                marginLeft: fullWidth*0.01,
                                                borderWidth: 0.5*factorRatio,
                                                borderColor: (this.state.progressComplete) ? null : colors.secondBackground,
                                                backgroundColor: (this.state.progressComplete) ? colors.pianoteRed : colors.mainBackground,
                                                borderRadius: 200,
                                        }]}
                                    >
                                        <Text
                                            style={{
                                                textAlign: 'center',
                                                fontWeight: 'bold',
                                                fontSize: 12*factorRatio,
                                                fontFamily: 'OpenSans-Regular',
                                                color: (this.state.progressComplete) ? 'white' : colors.secondBackground,
                                            }}
                                        >
                                            COMPLETED
                                        </Text>                                
                                    </TouchableOpacity>
                                    <View style={{flex: 1}}/>
                                </View>   
                                <View style={{height: 40*factorVertical}}/>                          
                            </View>
                            )}
                            <TouchableOpacity key={'pianoInstructor'}
                                onPress={() => {
                                    this.setState({
                                        openInstructors: !this.state.openInstructors,
                                    })
                                }}
                                style={{
                                    height: fullHeight*0.1,
                                    flexDirection: 'row',
                                    paddingLeft: fullWidth*0.035,
                                    paddingRight: fullWidth*0.035, 
                                    borderTopColor: colors.secondBackground,
                                    borderBottomColor: colors.secondBackground,
                                    borderBottomWidth: (this.state.openInstructors) ? 0 : 0.5*factorRatio,
                                }}
                            >
                                <View>
                                    <View style={{flex: 1}}/>
                                    <Text
                                        style={{
                                            fontSize: 18*factorRatio,
                                            marginBottom: 5*factorVertical,
                                            textAlign: 'left', 
                                            fontFamily: 'RobotoCondensed-Bold',
                                            color: colors.secondBackground,
                                        }}
                                    >
                                        CHOOSE YOUR INSTRUCTOR
                                    </Text>
                                    <View style={{flex: 1}}/>
                                </View>
                                <View style={{flex: 1}}/>
                                <View>
                                    <View style={{flex: 1}}/>
                                    <View
                                        style={{
                                            paddingLeft: 10*factorRatio,
                                            paddingRight: 10*factorRatio,
                                        }}
                                    >
                                        <EntypoIcon
                                            name={(this.state.openInstructors) ? 'chevron-thin-up':'chevron-thin-down'}
                                            size={25*factorRatio}
                                            color={colors.secondBackground}
                                        />
                                    </View>
                                    <View style={{flex: 1}}/>
                                </View>
                            </TouchableOpacity>
                            {this.state.openInstructors && (
                            <View key={'instructors'}
                                style={{
                                    borderBottomColor: colors.secondBackground,
                                    borderBottomWidth: 0.5*factorRatio,
                                }}
                            >
                                <View style={{height: 20*factorVertical}}/>
                                <View key={'topRow'}
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-around',
                                        alignContent: 'space-around',
                                        alignSelf: 'stretch',
                                    }}
                                >
                                    <View key={'circle7'}
                                        style={{width: 70*factorRatio}}
                                    >
                                        <TouchableOpacity
                                            onPress={() => this.setState({kenny: !this.state.kenny})}
                                            style={{
                                                borderWidth: this.state.kenny ? 2*factorRatio : 0*factorRatio,
                                                borderColor: this.state.kenny ? '#fb1b2f' : 'black',
                                                height: 70*factorRatio,
                                                width: 70*factorRatio,
                                                borderRadius: 300,
                                                backgroundColor: 'white',
                                            }}
                                        >
                                            <FastImage
                                                style={{flex:1, borderRadius: 100}}
                                                source={require('Pianote2/src/assets/img/imgs/kenny-werner.jpg')}
                                                resizeMode={FastImage.resizeMode.stretch}
                                            />
                                        </TouchableOpacity>
                                        <Text
                                            style={{
                                                fontFamily: 'OpenSans-Regular',
                                                marginTop: 5*factorRatio,
                                                fontSize: 11*factorRatio,
                                                textAlign: 'center',
                                                fontWeight: 'bold',
                                                color: (this.state.kenny) ? 'white' : colors.secondBackground,
                                            }}
                                        >
                                            KENNY WERNER
                                        </Text>
                                    </View>
                                    <View key={'circle1'}
                                        style={{width: 70*factorRatio}}
                                    >
                                        <TouchableOpacity
                                            onPress={() => this.setState({lisa: !this.state.lisa})}
                                            style={{
                                                borderWidth: this.state.lisa ? 2*factorRatio : 0*factorRatio,
                                                borderColor: this.state.lisa ? '#fb1b2f' : 'black',
                                                height: 70*factorRatio,
                                                width: 70*factorRatio,
                                                borderRadius: 300,
                                                backgroundColor: 'white',
                                                zIndex: 10,
                                            }}
                                        >
                                            <FastImage
                                                style={{flex:1, borderRadius: 100}}
                                                source={require('Pianote2/src/assets/img/imgs/lisa-witt.jpg')}
                                                resizeMode={FastImage.resizeMode.stretch}
                                            />
                                        </TouchableOpacity>
                                        <Text
                                            style={{
                                                fontFamily: 'OpenSans-Regular',
                                                marginTop: 5*factorRatio,
                                                fontSize: 10*factorRatio,
                                                textAlign: 'center',
                                                fontWeight: 'bold',
                                                color: (this.state.lisa) ? 'white' : colors.secondBackground,
                                            }}
                                        >
                                            LISA WITT
                                        </Text>
                                    </View>
                                    <View key={'circle2'}
                                        style={{
                                            width: 70*factorRatio,
                                        }}
                                    >
                                        <TouchableOpacity
                                            onPress={() => this.setState({cassi: !this.state.cassi})}
                                            style={{
                                                borderWidth: this.state.cassi ? 2*factorRatio : 0*factorRatio,
                                                borderColor: this.state.cassi ? '#fb1b2f' : 'black',
                                                height: 70*factorRatio,
                                                width: 70*factorRatio,
                                                borderRadius: 300,
                                                backgroundColor: 'white',
                                            }}
                                        >  
                                            <FastImage
                                                style={{flex:1, borderRadius: 100}}
                                                source={require('Pianote2/src/assets/img/imgs/cassi-falk.jpg')}
                                                resizeMode={FastImage.resizeMode.stretch}
                                            />
                                        </TouchableOpacity>
                                        <Text
                                            style={{
                                                fontFamily: 'OpenSans-Regular',
                                                marginTop: 5*factorRatio,
                                                fontSize: 10*factorRatio,
                                                textAlign: 'center',
                                                fontWeight: 'bold',
                                                color: (this.state.cassi) ? 'white' : colors.secondBackground,
                                            }}
                                        >
                                            CASSI FALK
                                        </Text>
                                    </View>
                                    <View key={'circle3'}
                                        style={{width: 70*factorRatio}}
                                    >
                                        <TouchableOpacity
                                            onPress={() => this.setState({jordan: !this.state.jordan})}
                                            style={{
                                                borderWidth: this.state.jordan ? 2*factorRatio : 0*factorRatio,
                                                borderColor: this.state.jordan ? '#fb1b2f' : 'black',
                                                height: 70*factorRatio,
                                                width: 70*factorRatio,
                                                borderRadius: 300,
                                                backgroundColor: 'white',
                                            }}
                                        >
                                            <FastImage
                                                style={{flex:1, borderRadius: 100}}
                                                source={require('Pianote2/src/assets/img/imgs/jordan-leibel.jpg')}
                                                resizeMode={FastImage.resizeMode.stretch}
                                            />
                                        </TouchableOpacity>
                                        <Text
                                            style={{
                                                fontFamily: 'OpenSans-Regular',
                                                marginTop: 5*factorRatio,
                                                fontSize: 10*factorRatio,
                                                textAlign: 'center',
                                                fontWeight: 'bold',
                                                color: (this.state.jordan) ? 'white' : colors.secondBackground,
                                            }}
                                        >
                                            JORDAN LEIBEL
                                        </Text>
                                    </View>
                                </View>
                                <View style={{height: 20*factorVertical}}/>
                                <View key={'middleRow'}
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-around',
                                        alignContent: 'space-around',
                                        alignSelf: 'stretch'
                                    }}
                                >
                                    <View key={'circle4'}
                                        style={{width: 70*factorRatio}}
                                    >
                                        <TouchableOpacity
                                            onPress={() => this.setState({nate: !this.state.nate})}
                                            style={{
                                                borderWidth: this.state.nate ? 2*factorRatio : 0*factorRatio,
                                                borderColor: this.state.nate ? '#fb1b2f' : 'black',
                                                height: 70*factorRatio,
                                                width: 70*factorRatio,
                                                borderRadius: 300,
                                                backgroundColor: 'white',
                                            }}
                                        >
                                            <FastImage
                                                style={{flex:1, borderRadius: 100}}
                                                source={require('Pianote2/src/assets/img/imgs/nate-bosch.jpg')}
                                                resizeMode={FastImage.resizeMode.stretch}
                                            />
                                        </TouchableOpacity>
                                        <Text
                                            style={{
                                                fontFamily: 'OpenSans-Regular',
                                                marginTop: 5*factorRatio,
                                                fontSize: 11*factorRatio,
                                                textAlign: 'center',
                                                fontWeight: 'bold',
                                                color: (this.state.nate) ? 'white' : colors.secondBackground,
                                            }}
                                        >
                                            NATE BOSCH
                                        </Text>
                                    </View>
                                    <View key={'circle5'}
                                        style={{width: 70*factorRatio}}
                                    >
                                        <TouchableOpacity
                                            onPress={() => this.setState({brett: !this.state.brett})}
                                            style={{
                                                borderWidth: this.state.brett ? 2*factorRatio : 0*factorRatio,
                                                borderColor: this.state.brett ? '#fb1b2f' : 'black',
                                                height: 70*factorRatio,
                                                width: 70*factorRatio,
                                                borderRadius: 300,
                                                backgroundColor: 'white',
                                            }}
                                        >
                                            <FastImage
                                                style={{flex:1, borderRadius: 100}}
                                                source={require('Pianote2/src/assets/img/imgs/brett-ziegler.jpg')}
                                                resizeMode={FastImage.resizeMode.stretch}
                                            />
                                        </TouchableOpacity>
                                        <Text
                                            style={{
                                                fontFamily: 'OpenSans-Regular',
                                                marginTop: 5*factorRatio,
                                                fontSize: 10*factorRatio,
                                                textAlign: 'center',
                                                fontWeight: 'bold',
                                                color: (this.state.brett) ? 'white' : colors.secondBackground,
                                            }}
                                        >
                                            BRETT ZIEGLER
                                        </Text>
                                    </View>
                                    <View key={'circle6'}
                                        style={{
                                            width: 70*factorRatio,
                                        }}
                                    >
                                        <TouchableOpacity
                                            onPress={() => this.setState({jonny: !this.state.jonny})}
                                            style={{
                                                borderWidth: this.state.jonny ? 2*factorRatio : 0*factorRatio,
                                                borderColor: this.state.jonny ? '#fb1b2f' : 'black',
                                                height: 70*factorRatio,
                                                width: 70*factorRatio,
                                                borderRadius: 300,
                                                backgroundColor: 'white',
                                            }}
                                        >
                                            <FastImage
                                                style={{flex:1, borderRadius: 100}}
                                                source={require('Pianote2/src/assets/img/imgs/jonny-tobin.jpg')}
                                                resizeMode={FastImage.resizeMode.stretch}
                                            />
                                        </TouchableOpacity>
                                        <Text
                                            style={{
                                                fontFamily: 'OpenSans-Regular',
                                                marginTop: 5*factorRatio,
                                                fontSize: 11*factorRatio,
                                                textAlign: 'center',
                                                fontWeight: 'bold',
                                                color: (this.state.jonny) ? 'white' : colors.secondBackground,
                                            }}
                                        >
                                            JONNY TOBIN
                                        </Text>
                                    </View>
                                    <View key={'circle8'}
                                        style={{
                                            width: 70*factorRatio,
                                        }}
                                    >
                                        <TouchableOpacity
                                            onPress={() => this.setState({jay: !this.state.jay})}
                                            style={{
                                                borderWidth: this.state.jay ? 2*factorRatio : 0*factorRatio,
                                                borderColor: this.state.jay ? '#fb1b2f' : 'black',
                                                height: 70*factorRatio,
                                                width: 70*factorRatio,
                                                borderRadius: 300,
                                                backgroundColor: 'white',
                                            }}
                                        >
                                            <FastImage
                                                style={{flex:1, borderRadius: 100}}
                                                source={require('Pianote2/src/assets/img/imgs/jay-oliver.jpg')}
                                                resizeMode={FastImage.resizeMode.stretch}
                                            />
                                        </TouchableOpacity>
                                        <Text
                                            style={{
                                                fontFamily: 'OpenSans-Regular',
                                                marginTop: 5*factorRatio,
                                                fontSize: 10*factorRatio,
                                                textAlign: 'center',
                                                fontWeight: 'bold',
                                                color: (this.state.jay) ? 'white' : colors.secondBackground,
                                            }}
                                        >
                                            JAY OLIVER
                                        </Text>
                                    </View>
                                </View>
                                <View style={{height: 20*factorVertical}}/>
                            </View>
                            )}
                            <View style={{height: 50*factorVertical}}/>
                        </ScrollView>
                    </View>
                    <View key={'doneApply'}
                        style={{
                            posistion: 'absolute',
                            bottom: 0,
                            height: (isNotch) ? fullHeight*0.035 + 75*factorVertical : 75*factorVertical,
                            backgroundColor: colors.mainBackground,
                            zIndex: 3,
                        }}
                    >
                        <View
                            style={[
                                styles.centerContent, {
                                flex: 1,
                                flexDirection: 'row',
                            }]}
                        >
                            <View style={{flex: 1}}/>
                            <View style={styles.centerContent}>
                                <TouchableOpacity
                                    style={[
                                        styles.centerContent, {
                                        height: fullHeight*0.05,
                                        width: fullWidth*0.46,
                                        backgroundColor: colors.pianoteRed,
                                        borderRadius: 200,
                                    }]}
                                >
                                    <Text
                                        style={{
                                            color: 'white',
                                            fontFamily: 'RobotoCondensed-Bold',
                                            fontSize: 14*factorRatio,
                                        }}
                                    >
                                        DONE & APPLY
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{flex: 1}}/>
                            <View style={styles.centerContent}>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.setState({
                                            level: 3,
                                            openProgress: false,
                                            openInstructors: false,
                                            all: false,
                                            filter1: false,
                                            filter2: false,
                                            filter3: false,
                                            filter4: false,
                                            filter5: false,
                                            filter6: false,
                                            filter7: false,
                                            filter8: false,
                                            kenny: false,
                                            lisa: false,
                                            cassi: false,
                                            jay: false,
                                            jordan: false, 
                                            jonny: false,
                                            brett: false,
                                            nate: false,
                                            progressAll: false,
                                            progressProgress: false,
                                            progressComplete: false,
                                            allLevels: false,
                                        })
                                    }}
                                    style={[
                                        styles.centerContent, {
                                        height: fullHeight*0.05,
                                        width: fullWidth*0.46,
                                        borderColor: 'white',
                                        borderWidth: 1*factorRatio,
                                        borderRadius: 200,
                                    }]}
                                >
                                    <Text
                                        style={{
                                            color: 'white',
                                            fontFamily: 'RobotoCondensed-Bold',
                                            fontSize: 14*factorRatio,
                                        }}
                                    >
                                        RESET
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{flex: 1}}/>
                        </View>
                        <View style={{height: (isNotch) ? fullHeight*0.035 : 0}}/>
                    </View>
            </View>
        )
    }
}