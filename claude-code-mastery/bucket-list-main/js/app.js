// Main application logic
class BucketListApp {
    constructor() {
        this.currentFilter = 'all';
        this.editingId = null;
        this.init();
    }

    /**
     * Initialize app
     */
    init() {
        this.cacheElements();
        this.bindEvents();
        this.render();
    }

    /**
     * Cache DOM elements
     */
    cacheElements() {
        // Form elements
        this.bucketForm = document.getElementById('bucketForm');
        this.bucketInput = document.getElementById('bucketInput');

        // Statistics elements
        this.totalCount = document.getElementById('totalCount');
        this.completedCount = document.getElementById('completedCount');
        this.progressCount = document.getElementById('progressCount');
        this.completionRate = document.getElementById('completionRate');

        // List container
        this.bucketListContainer = document.getElementById('bucketListContainer');
        this.emptyState = document.getElementById('emptyState');

        // Filter buttons
        this.filterBtns = document.querySelectorAll('.filter-btn');

        // Modal elements
        this.editModal = document.getElementById('editModal');
        this.editForm = document.getElementById('editForm');
        this.editInput = document.getElementById('editInput');
        this.cancelEditBtn = document.getElementById('cancelEdit');
    }

    /**
     * Bind events
     */
    bindEvents() {
        // Form submit event
        this.bucketForm.addEventListener('submit', (e) => this.handleAdd(e));

        // Filter button click event
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilter(e));
        });

        // Modal events
        this.editForm.addEventListener('submit', (e) => this.handleEditSubmit(e));
        this.cancelEditBtn.addEventListener('click', () => this.closeEditModal());
        this.editModal.addEventListener('click', (e) => {
            if (e.target === this.editModal) {
                this.closeEditModal();
            }
        });
    }

    /**
     * Add new bucket list item
     */
    handleAdd(e) {
        e.preventDefault();

        const title = this.bucketInput.value.trim();

        if (!title) {
            alert('Please enter a goal!');
            return;
        }

        BucketStorage.addItem(title);
        this.bucketInput.value = '';
        this.bucketInput.focus();
        this.render();
    }

    /**
     * Handle filter change
     */
    handleFilter(e) {
        const filter = e.target.dataset.filter;
        this.currentFilter = filter;

        // Update filter button active state
        this.filterBtns.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        this.render();
    }

    /**
     * Toggle completion status
     */
    handleToggle(id) {
        BucketStorage.toggleComplete(id);
        this.render();
    }

    /**
     * Open edit modal
     */
    openEditModal(id, currentTitle) {
        this.editingId = id;
        this.editInput.value = currentTitle;
        this.editModal.classList.remove('hidden');
        this.editModal.classList.add('flex');
        this.editInput.focus();
    }

    /**
     * Close edit modal
     */
    closeEditModal() {
        this.editingId = null;
        this.editInput.value = '';
        this.editModal.classList.add('hidden');
        this.editModal.classList.remove('flex');
    }

    /**
     * Handle edit submit
     */
    handleEditSubmit(e) {
        e.preventDefault();

        const newTitle = this.editInput.value.trim();

        if (!newTitle) {
            alert('Please enter a goal!');
            return;
        }

        if (this.editingId) {
            BucketStorage.updateItem(this.editingId, newTitle);
            this.closeEditModal();
            this.render();
        }
    }

    /**
     * Delete item
     */
    handleDelete(id, title) {
        if (confirm(`Delete "${title}"?`)) {
            BucketStorage.deleteItem(id);
            this.render();
        }
    }

    /**
     * Update statistics
     */
    updateStats() {
        const stats = BucketStorage.getStats();

        this.totalCount.textContent = stats.total;
        this.completedCount.textContent = stats.completed;
        this.progressCount.textContent = stats.progress;
        this.completionRate.textContent = `${stats.completionRate}%`;
    }

    /**
     * Create bucket list item HTML
     */
    createBucketItemHTML(item) {
        const completedClass = item.completed ? 'line-through text-white/60' : 'text-white';
        const checkIcon = item.completed ? '✓' : '';
        const checkboxClass = item.completed
            ? 'bg-green-500 border-green-500 text-white'
            : 'border-white/50 text-white';

        return `
            <div class="bucket-item rounded-lg p-4 flex items-center gap-3">
                <!-- Checkbox -->
                <button
                    class="flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center ${checkboxClass} transition-all hover:scale-110 bg-white/10"
                    onclick="app.handleToggle('${item.id}')"
                >
                    <span class="text-sm font-bold">${checkIcon}</span>
                </button>

                <!-- Title -->
                <div class="flex-1">
                    <p class="text-lg ${completedClass} break-words">${this.escapeHtml(item.title)}</p>
                    <p class="text-xs text-white/50 mt-1">
                        Created ${new Date(item.createdAt).toLocaleDateString('en-US')}
                        ${item.completedAt ? ` · Completed ${new Date(item.completedAt).toLocaleDateString('en-US')}` : ''}
                    </p>
                </div>

                <!-- Buttons -->
                <div class="flex gap-2 flex-shrink-0">
                    <button
                        class="px-3 py-1 rounded text-sm font-medium text-white"
                        onclick="app.openEditModal('${item.id}', '${this.escapeHtml(item.title).replace(/'/g, "\\'")}')"
                    >
                        Edit
                    </button>
                    <button
                        class="px-3 py-1 rounded text-sm font-medium text-white"
                        onclick="app.handleDelete('${item.id}', '${this.escapeHtml(item.title).replace(/'/g, "\\'")}')"
                    >
                        Delete
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Escape HTML special characters
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Render the UI
     */
    render() {
        // Update statistics
        this.updateStats();

        // Get filtered list
        const bucketList = BucketStorage.getFilteredList(this.currentFilter);

        // Show empty state if list is empty
        if (bucketList.length === 0) {
            this.bucketListContainer.innerHTML = '';
            this.emptyState.classList.remove('hidden');
            return;
        }

        // Hide empty state
        this.emptyState.classList.add('hidden');

        // Render list
        const html = bucketList.map(item => this.createBucketItemHTML(item)).join('');
        this.bucketListContainer.innerHTML = html;
    }
}

// Create app instance
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new BucketListApp();
});
