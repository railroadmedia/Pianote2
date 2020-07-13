/**
 * SongCatalog
 */
import React from 'react';
import {
    View,
    Text,
    ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import { getContent } from '@musora/services';
import { ContentModel } from '@musora/models';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import NavMenuHeaders from 'Pianote2/src/components/NavMenuHeaders.js';
import NavigationMenu from 'Pianote2/src/components/NavigationMenu.js';
import VerticalVideoList from 'Pianote2/src/components/VerticalVideoList.js';
import HorizontalVideoList from 'Pianote2/src/components/HorizontalVideoList.js';

export default class SongCatalog extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            allSongs: [], // videos loaded
            progressSongs: [],
            outVideos: false, // if no more videos to load
            showChooseInstructors: false,
            showChooseYourLevel: false,
            page: 0, // current page
            isLoading: true,
            filtering: false,
            filters: null,
            currentSort: 'Relevance',
        }
    }


    componentDidMount = async () => {
        this.getProgressSongs()
        this.getAllSongs()
    }


    filterResults = async () => {
        this.props.navigation.navigate('FILTERS', {
            filters: this.state.filters,
            type: 'SONGS',
            onGoBack: (filters) => {
                this.setState({
                    allSongs: [],
                    filters: (
                        filters.instructors.length == 0 && 
                        filters.level.length == 0 && 
                        filters.progress.length == 0 && 
                        filters.topics.length == 0
                    ) ? null : filters, 
                }),
                this.getAllSongs(),
                this.forceUpdate()
            }
        })
    }


    getAllSongs = async () => {
        await this.setState({filtering: true})

        // see if importing filters
        try {
            var filters = this.state.filters
            if(
                filters.instructors.length !== 0 || 
                filters.level.length !== 0 || 
                filters.progress.length !== 0 || 
                filters.topics.length !== 0
            ) {
                // if has a filter then send filters to vertical list
                this.setState({filters})
            } else {
                // if no filters selected then null
                var filters = null
            }
        } catch (error) {
            var filters = null
        }

        if(this.state.outVideos == false) {
            const { response, error } = await getContent({
                brand: 'pianote',
                limit: '15',
                page: this.state.page,
                sort: '-created_on',
                statuses: ['published'],
                included_types: ['song'],
            });

            const newContent = await response.data.data.map((data) => {
                return new ContentModel(data)
            })
            
            items = []
            for(i in newContent) {
                if(newContent[i].getData('thumbnail_url') !== 'TBD') {
                    items.push({
                        title: newContent[i].getField('title'),
                        artist: newContent[i].getField('instructor').fields[0].value,
                        thumbnail: newContent[i].getData('thumbnail_url'),
                        type: newContent[i].post.type,
                        description: newContent[i].getData('description').replace(/(<([^>]+)>)/ig, ''),
                        xp: newContent[i].getField('xp'),
                        id: newContent[i].id,
                        likeCount: newContent[i].likeCount,
                    })
                }
            }

            await this.setState({
                allSongs: [...this.state.allSongs, ...items],
            })

        }

        await this.setState({
            filtering: false,
            isLoading: false,
        })
    }


    getProgressSongs = async () => {
        if(this.state.outVideos == false) {
            const { response, error } = await getContent({
                brand: 'pianote',
                limit: '15',
                page: this.state.page,
                sort: '-created_on',
                statuses: ['published'],
                //required_user_states: ['started'],
                included_types: ['song'],
            });

            const newContent = response.data.data.map((data) => {
                return new ContentModel(data)
            })

            items = []
            for(i in newContent) {
                if(newContent[i].getData('thumbnail_url') !== 'TBD') {
                    items.push({
                        title: newContent[i].getField('title'),
                        artist: newContent[i].getField('instructor').fields[0].value,
                        thumbnail: newContent[i].getData('thumbnail_url'),
                        type: newContent[i].post.type,
                        description: newContent[i].getData('description').replace(/(<([^>]+)>)/ig, ''),
                        xp: newContent[i].getField('xp'),
                        id: newContent[i].id,
                        likeCount: newContent[i].likeCount,
                    })
                }
            }

            this.setState({
                progressSongs: [...this.state.progressSongs, ...items],
            })
        }
    }

    

    render() {
        return (
            <View styles={styles.container}>
                <View key={'contentContainer'}
                    style={{
                        height: fullHeight*0.90625 - navHeight,
                        alignSelf: 'stretch'
                    }}
                >
                    <View
                        style={{
                            height: fullHeight*0.1,
                            width: fullWidth,
                            position: 'absolute',
                            zIndex: 2, 
                            elevation: 2,
                            alignSelf: 'stretch', 
                        }}
                    >
                        <NavMenuHeaders
                            currentPage={'LESSONS'}
                            parentPage={'SONGS'}
                        />
                    </View>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentInsetAdjustmentBehavior={'never'}
                        style={{flex: 1, backgroundColor: colors.mainBackground}}
                    >
                        <View key={'header'}
                            style={{
                                height: fullHeight*0.1,
                                backgroundColor: colors.thirdBackground,
                            }}
                        />
                        <View key={'backgroundColoring'}
                            style={{
                                backgroundColor: colors.thirdBackground,
                                position: 'absolute',
                                height: fullHeight,
                                top: -fullHeight,
                                left: 0,
                                right: 0,
                                zIndex: 10,
                                elevation: 10,
                            }}
                        >
                        </View>
                        <View style={{height: 20*factorVertical}}/>
                        <Text
                            style={{
                                paddingLeft: 12*factorHorizontal,
                                fontSize: 30*factorRatio,
                                color: 'white',
                                fontFamily: 'OpenSans-Regular',
                                fontWeight: (Platform.OS == 'ios') ? '900' : 'bold',
                            }}
                        >
                            Songs
                        </Text>
                        <View style={{height: 15*factorVertical}}/>
                        <View key={'continueCourses'}
                            style={{
                                minHeight: fullHeight*0.225,
                                paddingLeft: fullWidth*0.035,
                                backgroundColor: colors.mainBackground,
                            }}
                        >
                            <HorizontalVideoList
                                Title={'CONTINUE'}
                                Description={''}
                                seeAll={() => this.props.navigation.navigate('SEEALL', {title: 'Continue'})}
                                showArtist={true}
                                items={this.state.progressSongs}
                                itemWidth={isNotch ? fullHeight*0.175 : fullHeight*0.2}
                                itemHeight={isNotch ? fullHeight*0.175 : fullHeight*0.2}
                            />
                        </View>
                        <View style={{height: 15*factorVertical}}/>    
                        {!this.state.filtering && (
                        <VerticalVideoList
                            items={this.state.allSongs}
                            title={'ALL SONGS'} // title for see all page
                            renderType={'Mapped'} // map vs flatlist
                            type={'SONGS'} // the type of content on page
                            showFilter={true} // 
                            showType={false} // show course / song by artist name
                            showArtist={true} // show artist name
                            showLength={false}
                            showSort={true}
                            filters={this.state.filters} // show filter list
                            imageRadius={5*factorRatio} // radius of image shown
                            containerBorderWidth={0} // border of box
                            containerWidth={fullWidth} // width of list
                            currentSort={this.state.currentSort} // relevance sort
                            changeSort={(currentSort) => { 
                                this.setState({
                                    currentSort,
                                    allSongs: [],
                                }),
                                this.getAllSongs()
                            }} // change sort and reload videos
                            filterResults={() => this.filterResults()} // apply from filters page
                            containerHeight={(onTablet) ? fullHeight*0.15 : (Platform.OS == 'android') ?  fullHeight*0.115 : fullHeight*0.0925} // height per row
                            imageHeight={(onTablet) ? fullHeight*0.12 : (Platform.OS == 'android') ? fullHeight*0.085 :fullHeight*0.065} // image height
                            imageWidth={(onTablet) ? fullHeight*0.12 : (Platform.OS == 'android') ? fullHeight*0.085 :fullHeight*0.065} // image height
                            outVideos={this.state.outVideos} // if paging and out of videos
                            //getVideos={() => this.getContent()} // for paging
                        />
                        )}
                    </ScrollView>
                </View>                
                <NavigationBar
                    currentPage={''}
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