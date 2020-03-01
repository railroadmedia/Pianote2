/**
 * Assignment
 */
import React from 'react';
import { 
    View, 
    Text, 
} from 'react-native';
import { withNavigation } from 'react-navigation';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { TouchableOpacity } from 'react-native-gesture-handler';

class Assignment extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
        }
    }


    render = () => {
        return (
            <View style={styles.container}>                 
                <View key={'contentContainer'}
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        height: (isTablet) ? fullHeight*0.6 : fullHeight*0.6975,
                        width: '100%',
                        backgroundColor: 'white',
                    }}
                >
                    <View style={{height: 25*factorVertical}}/>
                    <Text
                        style={{
                            fontFamily: 'Roboto',
                            fontSize: 16*factorRatio,
                            fontWeight: '700',
                            textAlign: 'center',
                            color: '#b9b9b9',
                        }}
                    >
                        ASSIGNMENT #{this.props.assignmentNumber}
                    </Text>
                    <View style={{height: 10*factorVertical}}/>
                    <Text
                        style={{
                            fontFamily: 'Roboto',
                            fontSize: 30*factorRatio,
                            fontWeight: '700',
                            textAlign: 'center',
                        }}
                    >
                        {this.props.assignment}
                    </Text>
                    <View
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            backgroundColor: 'red',
                            height: '30%',
                            alignSelf: 'stretch',
                            width: '100%',
                        }}
                    >

                    </View>
                </View>
            </View>
        )
    }
}


export default withNavigation(Assignment);