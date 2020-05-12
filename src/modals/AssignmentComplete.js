/**
 * AssignmentComplete
 */
import React from 'react';
import { 
    View, 
    Text,
    TouchableOpacity,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import { BlurView } from '@react-native-community/blur';
import IonIcon from 'react-native-vector-icons/Ionicons';

class AssignmentComplete extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    
    render = () => {
        return (         
            <View key={'container'}
                style={{
                    height: fullHeight, 
                    width: fullWidth, 
                }}
            >
                <BlurView
                    style={[
                        styles.centerContent, {
                        height: fullHeight,
                        width: fullWidth,
                        backgroundColor: 'transparent',
                    }]}
                    blurType={'xlight'}
                    blurAmount={7.5}
                >
                    <View style={{height: '32.5%', alignSelf: 'stretch'}}>
                        <TouchableOpacity
                            onPress={() => this.props.hideAssignmentComplete()}
                            style={{
                                alignSelf: 'stretch',
                                height: '100%',
                                width: '100%',
                            }}
                        >

                        </TouchableOpacity>
                    </View>
                    <View key={'content'}
                        style={{
                            height: '30%',
                            width: '100%',
                            flexDirection: 'row',
                        }}
                    >
                        <View key={'buffLeft'}
                            style={{
                                alignSelf: 'stretch',
                                width: '5%',
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => this.props.hideAssignmentComplete()}
                                style={{
                                    alignSelf: 'stretch',
                                    height: '100%',
                                    width: '100%',
                                }}
                            >

                            </TouchableOpacity>
                        </View>
                        <View key={'content'}
                            style={{
                                height: '100%',
                                width: '90%',
                                backgroundColor: 'white',
                                borderRadius: 10*factorRatio,
                            }}
                        >
                            <View key={'buffer'}
                                style={[
                                    styles.centerContent, {
                                    height: 25*factorRatio,
                                }]}
                            >
                                
                            </View>
                            <View key={'trophy'}
                                style={styles.centerContent}
                            >
                                <IonIcon
                                    name={'ios-trophy'}
                                    size={36*factorRatio}
                                    color={'#fb1b2f'}
                                />
                            </View>
                            <View key={'complete'}
                                style={[
                                    styles.centerContent, {
                                }]}
                            >
                                <Text
                                    style={{
                                        fontFamily: 'OpenSans-Regular',
                                        fontSize: 25*factorRatio,
                                        fontWeight: '700',
                                        textAlign: 'center',
                                    }}
                                >
                                    Assignment{"\n"}Complete
                                </Text>
                            </View>
                            <View style={{flex: 0.075}}/>
                            <View style={{height: 7.5*factorRatio}}/>
                            <View key={'lessonTitle'}>
                                <View style={{flex: 1}}/>
                                <Text
                                    style={{
                                        fontFamily: 'OpenSans-Regular',
                                        fontSize: 16*factorRatio,
                                        fontWeight: '300',
                                        textAlign: 'center',
                                    }}
                                >
                                    Congratulations! You completed
                                </Text>
                                <View style={{height: 5*factorRatio}}/>
                                <Text
                                    style={{
                                        fontFamily: 'OpenSans-Regular',
                                        fontSize: 16*factorRatio,
                                        fontWeight: '700',
                                        textAlign: 'center',
                                    }}
                                >
                                    The assignment title
                                </Text>
                                <View style={{height: 15*factorRatio}}/>
                                <Text
                                    style={{
                                        fontFamily: 'OpenSans-Regular',
                                        fontSize: 16*factorRatio,
                                        fontWeight: '800',
                                        textAlign: 'center',
                                        color: '#fb1b2f',
                                    }}
                                >
                                    YOU EARNED 275 XP!
                                </Text>
                                <View style={{flex: 1}}/>
                            </View>
                            <View style={{flex: 0.05}}/>
                        </View>
                        <View key={'buffRight'}
                            style={{width: '5%'}}
                        >
                            <TouchableOpacity
                                onPress={() => this.props.hideAssignmentComplete()}
                                style={{
                                    alignSelf: 'stretch',
                                    height: '100%',
                                    width: '100%',
                                }}
                            >

                            </TouchableOpacity>
                        </View>
                    </View>            
                    <View style={{height: '37.5%', alignSelf: 'stretch'}}>
                        <TouchableOpacity
                            onPress={() => this.props.hideAssignmentComplete()}
                            style={{
                                alignSelf: 'stretch',
                                height: '100%',
                                width: '100%',
                            }}
                        >

                        </TouchableOpacity>
                </View>
                </BlurView>
            </View>
        )
    }
}

export default withNavigation(AssignmentComplete);