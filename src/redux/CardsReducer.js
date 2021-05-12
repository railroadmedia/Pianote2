import RNFetchBlob from 'rn-fetch-blob';

const cardsReducer = (state = null, { type, card }) => {
  switch (type) {
    case 'toggleMyListCard': {
      return {
        ...state,
        [card.id]: {
          ...card,
          is_added_to_primary_playlist: !card.is_added_to_primary_playlist
        }
      };
    }
    case 'toggleLike': {
      return {
        ...state,
        [card.id]: {
          ...card,
          is_liked_by_current_user: !card.is_liked_by_current_user,
          like_count: card.like_count + (card.is_liked_by_current_user ? -1 : 1)
        }
      };
    }
    default:
      return state;
  }
};

export default { cards: cardsReducer };
