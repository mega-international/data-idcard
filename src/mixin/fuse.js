import Fuse from 'fuse.js';

export default {
  data() {
    return {
      termsOptions: {
        minMatchCharLength: 3,
        findAllMatches: false,
        includeMatches: true,
        threshold: 0.3,
        location: 0,
        distance: 1000,
        useExtendedSearch: true,
        shouldSort: false,
        keys: [
          'id',
          'name',
          'comment',
          'applicationCode',
        ]
      }
    };
  },
  methods: {
    initTermSearch(list) {
      const index = Fuse.createIndex(this.termsOptions.keys, list);
      return new Fuse(list, this.termsOptions);
    }
  }
};
