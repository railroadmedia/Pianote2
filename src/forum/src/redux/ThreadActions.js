export const setDiscussionsThreads = threads => ({
  threads,
  type: 'SETDISCUSSIONS'
});

export const setAllThreads = threads => ({ threads, type: 'SETALL' });

export const setFollowedThreads = threads => ({ threads, type: 'SETFOLLOWED' });

export const updateThreads = thread => ({ thread, type: 'UPDATE' });

export const toggleSignShown = () => ({ type: 'TOGGLESIGN' });
