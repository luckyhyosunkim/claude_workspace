// LocalStorage management module
const BucketStorage = {
    STORAGE_KEY: 'bucketList',

    /**
     * Load bucket list from LocalStorage
     * @returns {Array} bucket list array
     */
    load() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Data load failed:', error);
            return [];
        }
    },

    /**
     * Save bucket list to LocalStorage
     * @param {Array} bucketList - bucket list array to save
     * @returns {boolean} whether save was successful
     */
    save(bucketList) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(bucketList));
            return true;
        } catch (error) {
            console.error('Data save failed:', error);
            return false;
        }
    },

    /**
     * Add new bucket list item
     * @param {string} title - bucket list title
     * @returns {Object} added item
     */
    addItem(title) {
        const bucketList = this.load();
        const newItem = {
            id: Date.now().toString(),
            title: title.trim(),
            completed: false,
            createdAt: new Date().toISOString(),
            completedAt: null
        };
        bucketList.unshift(newItem); // Add latest item to the top
        this.save(bucketList);
        return newItem;
    },

    /**
     * Update bucket list item
     * @param {string} id - ID of item to update
     * @param {string} newTitle - new title
     * @returns {boolean} whether update was successful
     */
    updateItem(id, newTitle) {
        const bucketList = this.load();
        const index = bucketList.findIndex(item => item.id === id);

        if (index !== -1) {
            bucketList[index].title = newTitle.trim();
            this.save(bucketList);
            return true;
        }
        return false;
    },

    /**
     * Delete bucket list item
     * @param {string} id - ID of item to delete
     * @returns {boolean} whether deletion was successful
     */
    deleteItem(id) {
        const bucketList = this.load();
        const filteredList = bucketList.filter(item => item.id !== id);

        if (filteredList.length !== bucketList.length) {
            this.save(filteredList);
            return true;
        }
        return false;
    },

    /**
     * Toggle completion status
     * @param {string} id - ID of item to toggle
     * @returns {boolean} completion status after toggle
     */
    toggleComplete(id) {
        const bucketList = this.load();
        const index = bucketList.findIndex(item => item.id === id);

        if (index !== -1) {
            bucketList[index].completed = !bucketList[index].completed;
            bucketList[index].completedAt = bucketList[index].completed
                ? new Date().toISOString()
                : null;
            this.save(bucketList);
            return bucketList[index].completed;
        }
        return false;
    },

    /**
     * Get statistics information
     * @returns {Object} statistics object
     */
    getStats() {
        const bucketList = this.load();
        const total = bucketList.length;
        const completed = bucketList.filter(item => item.completed).length;
        const progress = total - completed;
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

        return {
            total,
            completed,
            progress,
            completionRate
        };
    },

    /**
     * Get filtered bucket list
     * @param {string} filter - filter type ('all', 'active', 'completed')
     * @returns {Array} filtered bucket list
     */
    getFilteredList(filter = 'all') {
        const bucketList = this.load();

        switch (filter) {
            case 'active':
                return bucketList.filter(item => !item.completed);
            case 'completed':
                return bucketList.filter(item => item.completed);
            default:
                return bucketList;
        }
    }
};
