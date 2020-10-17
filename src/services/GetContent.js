import {getToken} from 'Pianote2/src/services/UserDataAuth.js';

export async function getNewContent(type) {
    try {
        if (type == '') {
            // if type not specified take almost all lesson types
            type = 'course&included_types[]=song&included_types[]=unit&included_types[]=quick-tips&included_types[]=question-and-answer&included_types[]=student-review&included_types[]=boot-camps&included_types[]=chords-and-scales&included_types[]=pack&included_types[]=podcasts';
        }
        let auth = await getToken();
        let response = await fetch(
            `http://app-staging.pianote.com/api/railcontent/content?brand=pianote&sort=newest&statuses[]=published&limit=40&page=1&included_types[]=${type}`,
            {
                method: 'GET',
                headers: {Authorization: `Bearer ${auth.token}`},
            },
        );
        return await response.json();
    } catch (error) {
        console.log('Error', error);
        return new Error(error);
    }
}

export async function getStartedContent(type) {
    try {
        if (type == '') {
            type =
                'unit&included_types[]=unit-part&included_types[]=course&included_types[]=song&included_types[]=quick-tips&included_types[]=question-and-answer&included_types[]=student-review&included_types[]=boot-camps&included_types[]=chord-and-scale&included_types[]=podcasts&included_types[]=pack-bundle-lesson';
        }

        let auth = await getToken();
        let response = await fetch(
            `http://app-staging.pianote.com/api/railcontent/content?brand=pianote&sort=newest&statuses[]=published&limit=40&page=1&included_types[]=${type}&required_user_states[]=started`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            },
        );
        return await response.json();
    } catch (error) {
        console.log('Error', error);
        return new Error(error);
    }
}

export async function getAllContent(type, sort, page, filtersDict) {
    let filters = ''; // instructor, topic, level
    let required_user_states = ''; // progress
    let included_types = '';

    if (type !== '') {
        // if has type then it is see all or
        if (filtersDict.topics.length > 0) {
            for (i in filtersDict.topics) {
                included_types = included_types + `&included_types[]=${filtersDict.topics[i]}`;
            }
        } else {
            included_types = included_types + '&included_types[]=' + type;
        }
    } else {
        for (i in filtersDict.topics) {
            filters = filters + `required_fields[]=${filtersDict.topics[i]}&`;
        }
        for (i in filtersDict.instructors) {
            filters =
                filters +
                `required_fields[]=instructor,${filtersDict.instructors[i]}&`;
        }
        for (i in filtersDict.level) {
            if (typeof filtersDict.level[i] == 'number') {
                filters =
                    filters +
                    `required_fields[]=difficulty,${filtersDict.level[i]}&`;
            }
        }
        for (i in filtersDict.progress) {
            required_user_states =
                required_user_states +
                `required_user_states[]=${filtersDict.progress[i]}`;
        }
    }

    try {
        let auth = await getToken();
        let url = `https://app-staging.pianote.com/api/railcontent/content?brand=pianote&sort=${sort}&statuses[]=published&limit=20&page=${page}&${included_types}` + filters + required_user_states;
        let response = await fetch(url, {
            method: 'GET',
            headers: {Authorization: `Bearer ${auth.token}`},
        });
        return await response.json();
    } catch (error) {
        console.log('Error: ', error);
        return new Error(error);
    }
}

export async function searchContent(term, page, filtersDict) {
    let included_types = ''; // types
    if (filtersDict.topics.length > 0) {
        for (i in filtersDict.topics) {
            included_types =
                included_types + `&included_types[]=${filtersDict.topics[i]}`;
        }
    } else {
        included_types =
            included_types +
            '&included_types[]=learning-path&included_types[]=unit&included_types[]=course&included_types[]=unit-part&included_types[]=course-part&included_types[]=song&included_types[]=quick-tips&included_types[]=question-and-answer&included_types[]=student-review&included_types[]=boot-camps&included_types[]=chord-and-scale&included_types[]=pack-bundle-lesson';
    }

    try {
        let auth = await getToken();
        let url =
            `https://app-staging.pianote.com/api/railcontent/search?brand=pianote&limit=20&statuses[]=published&sort=-score&term=${term}&page=${page}` +
            included_types;
        let response = await fetch(url, {
            method: 'GET',
            headers: {Authorization: `Bearer ${auth.token}`},
        });
        return await response.json();
    } catch (error) {
        console.log('Error: ', error);
        return new Error(error);
    }
}

export async function getMyListContent(page, filtersDict, progressState) {
    let included_types = ''; 
    let progress_types = ''; // completed || started

    if(progressState !== '') {progress_types = '&state=' + progressState}

    if (filtersDict.topics.length > 0) {
        for (i in filtersDict.topics) {
            included_types =
                included_types + `&included_types[]=${filtersDict.topics[i]}`;
        }
    } else {
        included_types =
            included_types +
            '&included_types[]=learning-path&included_types[]=unit&included_types[]=course&included_types[]=unit-part&included_types[]=course-part&included_types[]=song&included_types[]=quick-tips&included_types[]=question-and-answer&included_types[]=student-review&included_types[]=boot-camps&included_types[]=chord-and-scale&included_types[]=pack-bundle-lesson';
    }

    try {
        let auth = await getToken();
        var url = `https://${serverLocation}/api/railcontent/my-list?brand=pianote&limit=20&statuses[]=published&sort=newest&page=${page}` + included_types + progress_types;
        let response = await fetch(url, {
            method: 'GET',
            headers: {Authorization: `Bearer ${auth.token}`},
        });

        return await response.json()
    } catch (error) {
        console.log('Error: ', error);
        return new Error(error);
    }
}

export async function seeAllContent(contentType, type, page, filtersDict) {
    let url = `https://app-staging.pianote.com/api/railcontent/content?brand=pianote&limit=20&statuses[]=published&sort=newest&page=${page}`
    
    if(contentType == 'lessons') {
        // add types
        if (filtersDict.topics.length > 0) {
            // if user filtered for types
            for (i in filtersDict.topics) {
                url = url + `&included_types[]=${filtersDict.topics[i]}`;
            }
        } else {
            // if user did not filter for types use all types except 2 
            url = url + '&included_types[]=course&included_types[]=song&included_types[]=unit&included_types[]=quick-tips&included_types[]=question-and-answer&included_types[]=student-review&included_types[]=boot-camps&included_types[]=chords-and-scales&included_types[]=pack&included_types[]=podcasts';
        }
        // if user clicked see all on started videos
        if(type == 'continue') {url = url + `required_user_states[]=started`}
    } else if(contentType == 'courses') {
        // add types
        url = url + `&included_types[]=course`;

        //if (filtersDict.topics.length > 0) {
            // if user filtered for types
          //  for (i in filtersDict.topics) {
            //    url = url + `&included_types[]=${filtersDict.topics[i]}`;
           // }
        //}
        
    }

    try {
        let auth = await getToken();
        let response = await fetch(url, {
            method: 'GET',
            headers: {Authorization: `Bearer ${auth.token}`},
        });
        return await response.json();
    } catch (error) {
        console.log('Error: ', error);
        return new Error(error);
    }
}

export async function getContentById(contentID) {
    try {
        let auth = await getToken();
        let response = await fetch(
            `http://app-staging.pianote.com/railcontent/content/${contentID}`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            },
        );

        return await response.json();
    } catch (error) {
        console.log('Get content by ID error: ', error);
        return new Error(error);
    }
}
