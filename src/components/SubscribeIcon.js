/**
 * SubscribeIcon
*/
import React from 'react';
import { 
    View, 
    Text,  
    TouchableOpacity 
} from 'react-native';
import { withNavigation } from 'react-navigation';
import Subscribe from 'Pianote2/src/assets/img/svgs/subscribe.svg';

class SubscribeIcon extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    
    render = () => {
        return (
            <View 
                style={[
                    styles.centerContent, {
                    position: 'absolute',
                    top: this.props.pxFromTop,
                    left: this.props.pxFromLeft,
                    borderRadius: fullWidth*0.1,
                    width: this.props.buttonWidth,
                    height: this.props.buttonHeight,
                    backgroundColor: '#fb1b2f',
                    flexDirection: 'row',
                    elevation: 5,
                }]}
            >
                <TouchableOpacity 
                    onPress={() => this.props.pressed()}
                    style={[
                        styles.centerContent, {
                        flex: 1, 
                        flexDirection: 'row',
                    }]}
                >
                    <View style={{flex: 1}}/>
                    <Subscribe
                        height={18*factorRatio}
                        width={18*factorRatio}
                        fill={'white'}
                    />
                    <View style={{flex: 0.2}}/>
                    <Text
                        style={{
                            color: 'white',
                            fontSize: 14*factorRatio,
                            fontFamily: 'RobotoCondensed-Bold',
                        }}
                    >
                        SUBSCRIBE
                    </Text>
                    <View style={{flex: 1}}/>
                </TouchableOpacity>
            </View>
        )
    }
}


export default withNavigation(SubscribeIcon);