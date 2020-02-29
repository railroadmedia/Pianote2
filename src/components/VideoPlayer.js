/**
 * VidPlayer
 * Gets invoked from assignments.js
 * Assignments.js invoked by subscriber
 */
import React from 'react';
import { 
    View, 
    StyleSheet, 
} from 'react-native';
import { withNavigation } from 'react-navigation';
import Video from 'react-native-video';

class VidPlayer extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            paused:true,
        }
    }

    render = () => {
        return (
            <View style={[
                styles.centerContent, {
                flex: 1, 
                backgroundColor: 'black'
            }]}>
                <Video
                    source={this.props.videoURI}
                    ref={(ref) => { this.player = ref }}
                    controls={true}
                    fullscreen={false}
                    minLoadRetryCount={5}
                    resizeMode={'contain'}
                    playWhenInactive={false}
                    progressUpdateInterval={500}
                    onError={(e) => console.log(e)}
                    paused={this.state.paused}
                    onLoad={(e) => this.setState({videoLength: e.duration})}
                    onEnd={() => this.setState({paused:true})}
                    style={{
                        height: this.props.height,
                        width: this.props.width,
                        position: 'absolute',
                        top: 0, 
                        left: 0,
                        backgroundColor: 'white',
                    }}
                />
            </View>
        )
    }
}

export default withNavigation(VidPlayer);