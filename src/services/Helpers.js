
export async function changeXP(num) {
    try {
        if (num !== '') {
            num = Number(num);
            if (num < 10000) {
                num = num.toString();
                return num;
            } else {
                num = (num / 1000).toFixed(1).toString();
                num = num + 'k';
                return num;
            }
        }
    } catch (error) {
        console.log('error changing xp: ', error);
        return new Error(error);
    }
};

export async function getDurationFoundations(newContent) {
    var data = 0;
    try {
        for (i in newContent.post.current_lesson.fields) {
            if (newContent.post.current_lesson.fields[i].key == 'video') {
                var data =
                    newContent.post.current_lesson.fields[i].value.fields;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].key == 'length_in_seconds') {
                        return data[i].value;
                    }
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
};

export async function getDuration(newContent) {
    if (newContent.post.fields[0].key == 'video') {
        return newContent.post.fields[0].value.fields[1].value;
    } else if (newContent.post.fields[1].key == 'video') {
        return newContent.post.fields[1].value.fields[1].value;
    } else if (newContent.post.fields[2].key == 'video') {
        return newContent.post.fields[2].value.fields[1].value;
    }
};
