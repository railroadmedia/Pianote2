import { setCardsCache } from '../services/catalogue.service';

const cardsReducer = (state = null, { type, card }) => {
  switch (type) {
    case 'toggleMyListCard': {
      let myListCard = {
        ...card,
        is_added_to_primary_playlist: !card.is_added_to_primary_playlist
      };
      setCardsCache(myListCard);
      return {
        ...state,
        [card.id]: myListCard
      };
    }
    case 'toggleLike': {
      let likeCard = {
        ...card,
        is_liked_by_current_user: !card.is_liked_by_current_user,
        like_count: card.like_count + (card.is_liked_by_current_user ? -1 : 1)
      };
      setCardsCache(likeCard);
      return {
        ...state,
        [card.id]: likeCard
      };
    }
    default:
      return state;
  }
};

export default { cards: cardsReducer };
