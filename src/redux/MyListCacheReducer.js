const myListCacheReducer = (state = null, { type, myList }) => {
  switch (type) {
    case 'MYLIST':
      return myList;
    default:
      return state;
  }
};

export default { myListCache: myListCacheReducer };
