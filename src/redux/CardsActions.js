export const toggleMyList = card => {
  return { card, type: 'toggleMyListCard' };
};

export const toggleLike = card => {
  return { card, type: 'toggleLike' };
};
