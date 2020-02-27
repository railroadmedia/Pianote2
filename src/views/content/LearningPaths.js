/**
 * LearningPaths
 */
import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    ScrollView, 
} from 'react-native';
import Modal from 'react-native-modal';
import { getContent } from '@musora/services';
import { ContentModel } from '@musora/models';
import FastImage from 'react-native-fast-image';
import StartIcon from 'Pianote2/src/components/StartIcon.js';
import Pianote from 'Pianote2/src/assets/img/svgs/pianote.svg';
import MoreInfoIcon from 'Pianote2/src/components/MoreInfoIcon.js';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import NavigationMenu from 'Pianote2/src/components/NavigationMenu.js';
import NavMenuHeaders from 'Pianote2/src/components/NavMenuHeaders.js';
import GradientFeature from 'Pianote2/src/components/GradientFeature.js';
import VerticalVideoList from 'Pianote2/src/components/VerticalVideoList.js';

export default class LearningPaths extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            outVideos: false,
            items: [],
            page: 0,
        }
    }


    componentDidMount() {
        this.getContent()
    }


    async getContent() {
        if(this.state.outVideos == false) {
            const { response, error } = await getContent({
                brand:'pianote',
                limit: '15',
                page: this.state.page,
                sort: '-created_on',
                statuses: ['published'],
                included_types:['song'],
            });

            if(error) {
                console.error(error);
            }

            console.log( 'response :', response, 'error : ', error)

            const newContent = response.data.data.map((data) => {
                return new ContentModel(data)
            })

            items = []
            for(i in newContent) {
                items.push({
                    title: newContent[i].getField('title'),
                    artist: newContent[i].getField('artist'),
                    thumbnail: newContent[i].getData('thumbnail_url'),
                    progress: (i > 700) ? 'check': ((i == 7) ? 'progress':'none')
                })
            }

            this.setState({
                items: [...this.state.items, ...items],
                page: this.state.page + 1,
                outVideos: (items.length == 0) ? true : false
            })

            console.log(this.state.items, ' - results')
        }
    }


    render() {
        return (
            <View styles={styles.container}>
                <View key={'contentContainer'}
                    style={{
                        height: fullHeight*0.90625,
                        width: fullWidth,
                        alignSelf: 'stretch',
                    }}
                >
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentInsetAdjustmentBehavior={'never'}
                        style={{flex: 1, backgroundColor: 'white'}}
                    >
                        <View key={'backgroundColoring'}
                            style={{
                                backgroundColor: 'black',
                                position: 'absolute',
                                height: fullHeight,
                                top: -fullHeight,
                                left: 0,
                                right: 0,
                                zIndex: 10,
                            }}
                        >
                        </View>
                        <View key={'image'}
                            style={[
                                styles.centerContent, {
                                height: fullHeight*0.595,
                            }]}
                        >
                            <GradientFeature
                                color={'red'}
                                opacity={1}
                                height={'50%'}
                                borderRadius={12.5*factorRatio}
                            />
                            <FastImage
                                style={{
                                    flex: 1, 
                                    alignSelf: 'stretch', 
                                    backgroundColor: 'black',
                                }}
                                source={require('Pianote2/src/assets/img/imgs/lisa-foundations.png')}
                                resizeMode={FastImage.resizeMode.cover}
                            />  
                            <NavMenuHeaders
                                pxFromTop={30*factorRatio}
                                leftHeader={'LESSONS'}
                                pressLeftHeader={() => {
                                    this.setState({
                                        parentPage: 'LESSONS',
                                        menu: 'HOME',
                                        showModalMenu: true,
                                    })
                                }}
                                pressRightHeader={() => {
                                    this.setState({
                                        parentPage: 'LEARNING PATHES',
                                        menu: 'LESSONS',
                                        showModalMenu: true,
                                    })
                                }}
                                rightHeader={'LEARNING PATHS'}
                                isHome={false}
                            />
                            <View key={'pianoteSVG'}
                                style={{
                                    position: 'absolute',
                                    bottom: fullHeight*0.175,
                                    zIndex: 2,
                                }}
                            >
                                <Pianote
                                    height={fullHeight*0.0325}
                                    width={fullWidth*0.35}
                                    fill={'#fb1b2f'}
                                />
                            </View>
                            <Text key={'foundations'}
                                style={{
                                    fontSize: 60*factorRatio,
                                    fontWeight:'700',
                                    color: 'white',
                                    fontFamily: 'RobotoCondensed-Regular',
                                    transform: [{ scaleX: 0.7}],
                                    position: 'absolute',
                                    bottom: fullHeight*0.09,
                                    zIndex: 2,
                                    textAlign: 'center',
                                }}
                            >
                                FOUNDATIONS
                            </Text>
                            <StartIcon
                                pxFromTop={(isTablet) ? fullHeight*0.445 : fullHeight*0.51}
                                buttonHeight={(isTablet) ? fullHeight*0.065 : fullHeight*0.053}
                                pxFromLeft={fullWidth*0.065}
                                buttonWidth={fullWidth*0.42}
                                pressed={() => this.props.navigation.navigate('VIDEOPLAYER')}
                            />
                            <MoreInfoIcon
                                pxFromTop={(isTablet) ? fullHeight*0.445 : fullHeight*0.51}
                                buttonHeight={(isTablet) ? fullHeight*0.065 : fullHeight*0.053}
                                pxFromRight={fullWidth*0.065}
                                buttonWidth={fullWidth*0.42}
                                pressed={() => this.props.navigation.navigate('PATHOVERVIEW')}
                            />   
                        </View>
                        <View style={{height: 10*factorVertical}}/>
                        <View key={'verticalVideoList'}
                            style={[
                                styles.centerContent, {
                                minHeight: fullHeight*0.29*0.90625,
                                justifyContent: 'space-around',
                                alignContent: 'space-around', 
                                flexDirection: 'row'
                            }]}
                        >
                            <VerticalVideoList
                                outVideos={this.state.outVideos}
                                fetchVideos={() => this.getContent()}
                                renderType={'Mapped'}
                                showNextVideo={false}
                                showLines={true}
                                showMultipleVideos={true}
                                items={this.state.items}
                                containerWidth={fullWidth}
                                containerHeight={(isTablet) ? fullHeight*0.155 : fullHeight*0.125}
                                containerBorderWidth={0}
                                imageHeight={(isTablet) ? fullHeight*0.125 : fullHeight*0.10}
                                imageWidth={fullWidth*0.35}
                                imageRadius={7*factorRatio}
                            />
                        </View>
                    </ScrollView>
                </View>
                <Modal key={'navMenu'}
                    isVisible={this.state.showModalMenu}
                    style={{
                        margin: 0, 
                        height: fullHeight,
                        width: fullWidth,
                    }}
                    animation={'slideInUp'}
                    animationInTiming={250}
                    animationOutTiming={250}
                    coverScreen={true}
                    hasBackdrop={false}
                >
                    <NavigationMenu
                        onClose={(e) => this.setState({showModalMenu: e})}
                        menu={this.state.menu}
                        parentPage={this.state.parentPage}
                    />
                </Modal>
                <NavigationBar
                    currentPage={'LessonsLearningPaths'}
                />
            </View>
        )
    }
}
                            