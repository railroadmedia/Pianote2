/**
 * VideoPlayerSong
 */
import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';
import FastImage from 'react-native-fast-image';
import SoundSlice from '../../components/SoundSlice.js';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import AssignmentComplete from '../../modals/AssignmentComplete.js';
import QualitySettings from '../../modals/QualitySettings.js';
import VideoPlayerOptions from '../../modals/VideoPlayerOptions.js';
import { ScrollView } from 'react-native-gesture-handler';

export default class VideoPlayerSong extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            showSoundSlice: false,
            showVideoPlayerOptions: false,
            showQualitySettings: false,
            showAssignmentComplete: false, 
            showLessonComplete: false, 
        }
    }


    render() {
        return (
            <View styles={styles.container}>
                <View key={'container'}
                    style={{
                        height: fullHeight, 
                        alignSelf: 'stretch',
                    }}
                >
                    <View key={'video'}
                        style={{
                            height: (onTablet) ? fullHeight*0.4 : fullHeight*0.3025,
                            backgroundColor: 'black'
                        }}
                    >
                        <FastImage
                            style={{flex: 1}}
                            source={{uri: 'https://facebook.github.io/react-native/img/tiny_logo.png'}}
                            resizeMode={FastImage.resizeMode.cover}
                        />
                    </View>
                    <View key={'goBackIcon'}
                        style={[
                            styles.centerContent, {
                            position: 'absolute',
                            left: 10*factorHorizontal,
                            top: (isNotch) ? 40*factorVertical : 30*factorVertical,
                            height: 50*factorRatio,
                            width: 50*factorRatio,
                            zIndex: 10,
                        }]}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                this.props.navigation.goBack()
                            }}
                            style={{
                                height: '100%',
                                width: '100%',
                            }}
                        >
                            <EntypoIcon
                                name={'chevron-thin-left'}
                                size={25*factorRatio}
                                color={'white'}
                            />
                        </TouchableOpacity>
                    </View>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentInsetAdjustmentBehavior={'never'}
                        style={{
                            height: (onTablet) ? fullHeight*0.6 : fullHeight*0.6975,
                            backgroundColor: 'white',
                        }}
                    >
                        <View style={{height: 25*factorVertical}}/>
                        <Text key={'assignmentNumber'}
                            style={{
                                fontFamily: 'OpenSans-Regular',
                                fontSize: 16*factorRatio,
                                fontWeight: '700',
                                textAlign: 'center',
                                color: '#b9b9b9',
                            }}
                        >
                            ASSIGNMENT #{this.props.navigation.state.params.assignmentNum}
                        </Text>
                        <View style={{height: 10*factorVertical}}/>
                        <Text key={'assignmentName'}
                            style={{
                                fontFamily: 'OpenSans-Regular',
                                fontSize: 28*factorRatio,
                                fontWeight: '700',
                                textAlign: 'center',
                            }}
                        >
                            {this.props.navigation.state.params.assignmentName}
                        </Text>
                        <View style={{height: 10*factorVertical}}/>
                        <View key={'skipTo'}
                            style={[
                                styles.centerContent, {
                                height: fullHeight*0.025,
                                width: '100%',
                                flexDirection: 'row',
                            }]}
                        >
                            <View style={{flex: 1}}/>
                            <View
                                style={[
                                    styles.centerContent, {
                                    width: '40%',
                                    height: '100%',
                                    borderRadius: 30*factorRatio,
                                    backgroundColor: '#ececec',
                                }]}
                            >
                                <TouchableOpacity
                                    onPress={() => {}}
                                    style={[
                                        styles.centerContent, {
                                        height: '100%',
                                        width: '100%',
                                    }]}
                                >
                                    <Text
                                        style={{
                                            fontFamily: 'OpenSans-Regular',
                                            fontWeight: '700',
                                            color: 'grey',
                                            fontSize: 12*factorRatio,
                                        }}
                                    >
                                        SKIP VIDEO TO 2:01
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{flex: 1}}/>
                        </View>
                        <View style={{
                                height: 25*factorVertical,
                                borderBottomColor: '#ececec',
                                borderBottomWidth: 1*factorRatio,
                            }}
                        >
                        </View>
                        <View key={'blurb'}
                            style={{width: '100%'}}
                        >
                            <Text
                                style={{
                                    paddingTop: '5%',
                                    paddingBottom: '5%',
                                    paddingLeft: '5%',
                                    paddingRight: '5%',
                                    fontSize: 16*factorRatio, 
                                    fontFamily: 'OpenSans-Regular',

                                }}
                            >
                                Lorem ipsum dolor sit smart cosaf adlsafdd. elit, Prascent quie eros magna. Etrian tincidunt
                                Lorem ipsum dolor sit smart cosaf adlsafdd. elit.
                            </Text>
                        </View>
                        <View
                            style={{
                                height: fullHeight*0.5,
                                width: '100%',
                                backgroundColor: 'red',
                            }}
                        >

                        </View>
                        <View key={'dots'}
                            style={{
                                height: fullHeight*0.1,
                                width: '100%',
                            }}
                        >
                            <View style={{flex: 1}}/>
                            <View
                                style={[
                                    styles.centerContent, {
                                    flexDirection: 'row',
                                }]}
                            >
                                <View
                                    style={{
                                        height: 10*factorRatio,
                                        width: 10*factorRatio,
                                        borderRadius: 15*factorRatio,
                                        backgroundColor: '#fb1b2f',
                                    }}
                                >

                                </View>
                                <View style={{width: 7.5*factorHorizontal}}/>
                                <View
                                    style={{
                                        height: 10*factorRatio,
                                        width: 10*factorRatio,
                                        borderRadius: 15*factorRatio,
                                        backgroundColor: '#ececec',
                                    }}
                                >

                                </View>
                                <View style={{width: 7.5*factorHorizontal}}/>
                                <View
                                    style={{
                                        height: 10*factorRatio,
                                        width: 10*factorRatio,
                                        borderRadius: 15*factorRatio,
                                        backgroundColor: '#ececec',
                                    }}
                                >

                                </View>
                            </View>
                            <View style={{flex: 1}}/>
                        </View>
                        <View key={'buff'}
                            style={[
                                styles.centerContent, {
                                height: fullHeight*0.2,
                                width: '100%',
                                backgroundColor: 'white',
                            }]}
                        >
                        </View>
                    </ScrollView>
                    <View key={'buttons'}
                        style={{
                            position: 'absolute',
                            height: fullHeight*0.195,
                            backgroundColor: 'white',
                            width: '100%',
                            bottom: 0,
                        }}
                    >
                        <View key={'practice'}
                            style={[
                                styles.centerContent, {
                                alignSelf: 'stretch',
                                flex: 1,
                            }]}
                        >
                            <View 
                                style={{
                                    height: '85%',
                                    width: '90%',
                                    backgroundColor: 'white',
                                    borderColor: '#fb1b2f',
                                    borderWidth: 2.5*factorRatio,
                                    borderRadius: 100*factorRatio,
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        this.setState({showSoundSlice: true})
                                    }}
                                    style={[
                                        styles.centerContent, {
                                        height: '100%',
                                        width: '100%',
                                    }]}
                                >
                                    <Text
                                        style={{
                                            fontSize: 16*factorRatio,
                                            fontFamily: 'OpenSans-Regular',
                                            fontWeight: '800',
                                            color: '#fb1b2f',
                                        }}
                                    >
                                        PRACTICE
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View key={'completeAssignment'}
                            style={[
                                styles.centerContent, {
                                alignSelf: 'stretch',
                                flex: 1,
                            }]}
                        >
                            <View 
                                style={{
                                    height: '85%',
                                    width: '90%',
                                    backgroundColor: '#fb1b2f',
                                    borderRadius: 100*factorRatio,
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        this.setState({showAssignmentComplete: true})
                                    }}
                                    style={[
                                        styles.centerContent, {
                                        height: '100%',
                                        width: '100%',
                                    }]}
                                >
                                    <Text
                                        style={{
                                            fontSize: 16*factorRatio,
                                            fontFamily: 'OpenSans-Regular',
                                            fontWeight: '800',
                                            color: 'white',
                                        }}
                                    >
                                        COMPLETE ASSIGNMENT
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{height: 40*factorVertical}}/>
                    </View>
                
                </View>
                <Modal key={'VideoPlayerOptions'}
                    isVisible={this.state.showVideoPlayerOptions}
                    style={[
                        styles.centerContent, {
                        margin: 0,
                        height: fullHeight,
                        width: fullWidth,
                    }]}
                    animation={'slideInUp'}
                    animationInTiming={350}
                    animationOutTiming={350}
                    coverScreen={true}
                    hasBackdrop={true}
                >
                    <VideoPlayerOptions
                        hideVideoPlayerOptions={() => {
                            this.setState({
                                showVideoPlayerOptions: false
                            })
                        }}
                    />
                </Modal>
                <Modal key={'QualitySettings'}
                    isVisible={this.state.showQualitySettings}
                    style={[
                        styles.centerContent, {
                        margin: 0,
                        height: fullHeight,
                        width: fullWidth,
                    }]}
                    animation={'slideInUp'}
                    animationInTiming={350}
                    animationOutTiming={350}
                    coverScreen={true}
                    hasBackdrop={true}
                >
                    <QualitySettings
                        hideQualitySettings={() => {
                            this.setState({
                                showQualitySettings: false
                            })
                        }}
                    />
                </Modal>
                <Modal key={'soundSlice'}
                    isVisible={this.state.showSoundSlice}
                    style={[
                        styles.centerContent, {
                        margin: 0,
                        height: fullHeight,
                        width: fullWidth,
                    }]}
                    animation={'slideInUp'}
                    animationInTiming={350}
                    animationOutTiming={350}
                    coverScreen={true}
                    hasBackdrop={true}
                >
                    <SoundSlice
                        hideSoundSlice={() => {
                            this.setState({
                                showSoundSlice: false
                            })
                        }}
                        slug={this.props.navigation.state.params.slug}
                    />
                </Modal>                
                <Modal key={'assignmentComplete'}
                    isVisible={this.state.showAssignmentComplete}
                    style={[
                        styles.centerContent, {
                        margin: 0,
                        height: fullHeight,
                        width: fullWidth,
                    }]}
                    animation={'slideInUp'}
                    animationInTiming={250}
                    animationOutTiming={250}
                    coverScreen={false}
                    hasBackdrop={false}
                >
                    <AssignmentComplete
                        hideAssignmentComplete={() => {
                            this.setState({showAssignmentComplete: false})
                        }}
                    />
                </Modal>                                 
                
            </View>
        )
    }
}