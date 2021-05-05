const cardsReducer = (state = null, { type, card }) => {
  switch (type) {
    case 'toggleMyListCard': {
      let c = { ...card, isAddedToList: !card.isAddedToList };
      delete c.compact;
      return {
        ...state,
        [card.id]: c
      };
    }
    case 'toggleLike': {
      let c = {
        ...card,
        isLiked: !card.isLiked,
        like_count: card.like_count + (card.isLiked ? -1 : 1)
      };
      delete c.compact;
      return {
        ...state,
        [card.id]: c
      };
    }
    default:
      return state;
  }
};

export default { cards: cardsReducer };
