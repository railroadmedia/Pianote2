/**
 * MyList
 */
import React from 'react';
import {
    View,
    Text,
    Animated,
    ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import { getContent } from '@musora/services';
import { ContentModel } from '@musora/models';
import FastImage from 'react-native-fast-image';
import List from 'Pianote2/src/assets/img/svgs/myList.svg';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import NavMenuHeaders from 'Pianote2/src/components/NavMenuHeaders.js';
import NavigationMenu from 'Pianote2/src/components/NavigationMenu.js';
import VerticalVideoList from 'Pianote2/src/components/VerticalVideoList.js';
import HorizontalVideoList from 'Pianote2/src/components/HorizontalVideoList.js';

export default class MyList extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            showModalMenu: false,
            outVideos: false, // if no more videos to load
            items: [], // videos loaded
            page: 0, // current page
            parentPageNav: 'MY LIST',
            menu: 'HOME',
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
            
            if(response.data.data.length == 0) {
                this.setState({outVideos: true})
            }

            const newContent = response.data.data.map((data) => {
                return new ContentModel(data)
            })

            console.log(newContent)

            items = []
            for(i in newContent) {
                items.push({
                    title: newContent[i].getField('title'),
                    artist: newContent[i].getField('artist'),
                    thumbnail: newContent[i].getData('thumbnail_url'),
                })
            }

            this.setState({
                items: [...this.state.items, ...items],
                page: this.state.page + 1,
            })

        }
    }


    pressFilters = async () => {
        await this.setState({
            filterClicked: !this.state.filterClicked
        })

        await Animated.timing(
            this.state.filterSize, {
                toValue: (this.state.filterClicked) ? 0.25 : 0,
                duration : 250,
            }
        ).start();
        
        await Animated.timing(
            this.state.listSize, {
            toValue: (this.state.filterClicked) ? 0.35 : 0.6,
            duration : 250,
            }
        ).start();
    }


    render() {
        return (
            <View styles={styles.container}>
                <View key={'contentContainer'}
                    style={{
                        height: fullHeight*0.90625,
                        alignSelf: 'stretch'
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
                        <View key={'header'}
                            style={{zIndex: 2}}
                        >
                            <NavMenuHeaders
                                pxFromTop={30*factorRatio}
                                leftHeader={'MY LIST'}
                                rightHeader={'ALL LESSONS'}
                                pressLeftHeader={() => {
                                    this.setState({
                                        showModalMenu: true,
                                        parentPage: 'MY LIST',
                                        menu: 'HOME',
                                    })
                                }}
                                pressRightHeader={() => {
                                    this.setState({
                                        showModalMenu: true,
                                        parentPage: 'ALL LESSONS',
                                        menu: 'MY LIST',
                                    })
                                }}
                                isHome={false}
                            />
                        </View>
                        <View key={'image'}
                            style={{
                                height: fullHeight*0.36,
                                width: fullWidth,
                            }}
                        >
                            <View key={'courses'}
                                style={[
                                    styles.centerContent, {
                                    position: 'absolute',
                                    top: 35*factorVertical,
                                    left: 0,
                                    zIndex: 2,
                                    height: '100%',
                                    width: '100%',
                                    
                                }]}
                            >
                                <List
                                    height={37.5*factorRatio}
                                    width={37.5*factorRatio}
                                    fill={'#fb1b2f'}
                                />
                                <Text
                                    style={{
                                        fontSize: 45*factorRatio,
                                        fontWeight: '700',
                                        color: 'white',
                                        fontFamily: 'RobotoCondensed-Regular',
                                    }}
                                >
                                    MY LIST
                                </Text>
                            </View>
                            <FastImage
                                style={{
                                    flex: 1,
                                    alignSelf: 'stretch',
                                    backgroundColor: 'black',
                                }}
                                source={require('Pianote2/src/assets/img/imgs/backgroundHands.png')}
                                resizeMode={FastImage.resizeMode.stretch}
                            />
                        </View>
                        <View style={{height: fullHeight*0.015}}/>
                        <View key={'addedList'}
                            style={{
                                height: fullHeight*0.225,
                                paddingLeft: fullWidth*0.035,
                            }}
                        >
                            <HorizontalVideoList
                                Title={'ADDED TO LIST'}
                                Description={''}
                                seeAll={() => {
                                    this.props.navigation.navigate(
                                        'SEEALL', {data: 'Added to List'}
                                    )
                                }}
                                showArtist={false}
                                items={this.state.items}
                                forceSquareThumbs={false}
                                itemWidth={fullWidth*0.42}
                                itemHeight={fullHeight*0.115}
                            />
                        </View>
                        <View key={'progressList'}
                            style={{
                                height: fullHeight*0.225,
                                paddingLeft: fullWidth*0.035,
                            }}
                        >
                            <HorizontalVideoList
                                Title={'IN PROGRESS'}
                                Description={''}
                                seeAll={() => {
                                    this.props.navigation.navigate(
                                        'SEEALL', {data: 'In Progress'}
                                    )
                                }}
                                showArtist={false}
                                items={this.state.items}
                                forceSquareThumbs={false}
                                itemWidth={fullWidth*0.42}
                                itemHeight={fullHeight*0.115}
                            />
                        </View>
                        <View key={'completedList'}
                            style={{
                                height: fullHeight*0.225,
                                paddingLeft: fullWidth*0.035,
                            }}
                        >
                            <HorizontalVideoList
                                Title={'COMPLETED'}
                                Description={''}
                                seeAll={() => {
                                    this.props.navigation.navigate(
                                        'SEEALL', {data: 'In Completed'}
                                    )
                                }}
                                showArtist={false}
                                items={this.state.items}
                                forceSquareThumbs={false}
                                itemWidth={fullWidth*0.42}
                                itemHeight={fullHeight*0.115}
                            />
                        </View>
                    </ScrollView>
                </View>                
                <NavigationBar
                    currentPage={'MyList'}
                />
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
            </View>
        )
    }
}