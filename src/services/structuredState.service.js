const structuredState = state => {
  return {
    all: state?.all?.data?.map(d => listItemStructure(d)),
    inProgress: state?.inProgress?.data?.map(d => listItemStructure(d))
  };
};

const listItemStructure = item => {
  let structure = new Structurer(item);
  return {
    artist: structure.artist,
    description: structure.description,
    id: item.id,
    isAddedToList: !!item.is_added_to_primary_playlist,
    isCompleted: !!item.completed,
    isLiked: !!item.is_liked_by_current_user,
    isStarted: !!item.started,
    like_count: item.like_count,
    lesson_count: item.lesson_count,
    progress_percent: item.progress_percent,
    publishedOn: item.published_on,
    thumbnail: structure.thumbnail,
    title: structure.title,
    type: item.type,
    xp: item.xp
  };
};

class Structurer {
  constructor(state) {
    this.state = state;
  }
  get artist() {
    return this.getByKey('fields', 'instructor', 'fields', 'name');
  }
  get description() {
    return this.getByKey('data', 'description')
      ?.replace(/(<([^>]+)>)/g, '')
      .replace(/&nbsp;/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&#039;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&gt;/g, '>')
      .replace(/&lt;/g, '<');
  }
  get thumbnail() {
    let thumb = this.getByKey('data', 'thumbnail_url');
    if (!thumb?.includes('http')) return thumb;
    return thumb
      ? `https://cdn.musora.com/image/fetch/w_750,ar_16:9,fl_lossy,q_auto:eco,c_fill,g_face/${thumb}`
      : 'https://dmmior4id2ysr.cloudfront.net/assets/images/pianote_fallback_thumb.jpg';
  }
  get title() {
    return this.getByKey('fields', 'title');
  }

  getByKey(location, key, nestedLocation, nestedKey) {
    let parentValue = this.state[location]?.find(l => l.key === key)?.value;
    if (nestedLocation)
      return parentValue[nestedLocation]?.find(nl => nl.key === nestedKey)
        ?.value;
    return parentValue;
  }
}
export default structuredState;
