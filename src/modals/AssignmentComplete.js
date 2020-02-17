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
                    backgroundColor: 'black',
                }}
            >
                <View key={'buffTop'}
                    style={{
                        height: '35%',
                    }}
                >
                    <TouchableOpacity
                        onPress={() => this.props.hideAssignmentComplete()}
                        style={{
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
                        style={{width: '5%'}}
                    >
                        <TouchableOpacity
                            onPress={() => this.props.hideAssignmentComplete()}
                            style={{
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
                                    fontFamily: 'Roboto',
                                    fontSize: 25*factorRatio,
                                    fontWeight: '700',
                                    textAlign: 'center',
                                }}
                            >
                                Assignment{"\n"}Complete
                            </Text>
                        </View>
                        <View style={{flex: 0.075}}></View>
                        <View style={{height: 7.5*factorRatio}}></View>
                        <View key={'lessonTitle'}>
                            <View style={{flex: 1}}></View>
                            <Text
                                style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 16*factorRatio,
                                    fontWeight: '300',
                                    textAlign: 'center',
                                }}
                            >
                                Congratulations! You completed
                            </Text>
                            <View style={{height: 5*factorRatio}}></View>
                            <Text
                                style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 16*factorRatio,
                                    fontWeight: '700',
                                    textAlign: 'center',
                                }}
                            >
                                The assignment title
                            </Text>
                            <View style={{height: 15*factorRatio}}></View>
                            <Text
                                style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 16*factorRatio,
                                    fontWeight: '700',
                                    textAlign: 'center',
                                    color: '#fb1b2f',
                                }}
                            >
                                YOU EARNED 275 XP!
                            </Text>
                            <View style={{flex: 1}}></View>
                        </View>
                        <View style={{flex: 0.05}}></View>
                    </View>
                    <View key={'buffRight'}
                        style={{width: '5%'}}
                    >
                        <TouchableOpacity
                            onPress={() => this.props.hideAssignmentComplete()}
                            style={{
                                height: '100%',
                                width: '100%',
                            }}
                        >

                        </TouchableOpacity>
                    </View>
                </View>            
                <View key={'buffBottom'}
                    style={{height: '35.5%'}}
                >
                    <TouchableOpacity
                        onPress={() => this.props.hideAssignmentComplete()}
                        style={{
                            height: '100%',
                            width: '100%',
                        }}
                    >

                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

export default withNavigation(AssignmentComplete);