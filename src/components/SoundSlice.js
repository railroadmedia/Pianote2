/**
 * SoundSlice
 */
import React from 'react';
import { 
    View, 
    Text, 
} from 'react-native';
import { withNavigation } from 'react-navigation';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { TouchableOpacity } from 'react-native-gesture-handler';

class SoundSlice extends React.Component {
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
                        height: '100%',
                        width: '100%',
                        backgroundColor: 'white',
                    }}
                >
                    <View style={{height: '20%'}}>
                        <View 
                            style={{
                                position: 'absolute',
                                top: 50*factorRatio,
                                left: 20*factorRatio,
                                zIndex: 10,
                            }}
                        >
                            <View style={{flex: 1}}/>
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.hideSoundSlice()
                                }}
                                style={{
                                    height: '100%',
                                    width: '100%',
                                    zIndex: 10,
                                }}
                            >
                                <FeatherIcon
                                    size={40*factorRatio}
                                    name={'x'}
                                    color={'black'}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{flex: 1}}/>
                        <View style={{flex: 1}}>
                            <Text
                                style={{
                                    fontFamily: 'OpenSans-Regular',
                                    fontSize: 16*factorRatio,
                                    fontWeight: '700',
                                    textAlign: 'center',
                                    color: '#b9b9b9',
                                }}
                            >
                                ASSIGNMENT #1
                            </Text>
                            <View style={{height: 10*factorVertical}}/>
                            <Text
                                style={{
                                    fontFamily: 'OpenSans-Regular',
                                    fontSize: 30*factorRatio,
                                    fontWeight: '700',
                                    textAlign: 'center',
                                }}
                            >
                                Learn The Song
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}


export default withNavigation(SoundSlice);