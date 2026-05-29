// handles keyboard shortcuts and arrow key navigation for items
DesktopGame.prototype.setupKeyboardShortcuts = function() {
    document.addEventListener('keydown', (e) => 
    {

        if (this.renameModal.style.display === 'block' || 
            this.currentEditingItem || 
            e.target.tagName === 'INPUT') 
        {
            return;
        }
        if (e.key === 'n' || e.key === 'N') 
        {
            if (this.createIconModal.style.display !== 'block' && 
                this.folderViewModal.style.display !== 'block') 
            {
                e.preventDefault();
                this.openCreateIconModal(0, 0);
            }
        }
        if (e.key === 'g' || e.key === 'G') 
        {
            if (this.selectedFolderItems.length > 0) 
            {
                e.preventDefault();
                this.ungroupSelectedFolderItems();
            } 
            else if (this.selectedItems.length >= 2) 
            {
                e.preventDefault();
                this.groupSelectedItems();
            }
        }
        if (e.key === 'r' || e.key === 'R') 
        {
            if (this.selectedItems.length === 1 && !this.moveMode) 
            {
                const item = this.selectedItems[0];

                const systemTypes = ['internet', 'printer', 'settings', 'trash'];
                if (!systemTypes.includes(item.dataset.icon)) {
                e.preventDefault();
                    this.startInlineEdit(item, item.querySelector('span'));
                } 
                else 
                {
                    this.showCannotRenameFeedback();
                }
            }
        }
        if (e.key === 'm' || e.key === 'M') 
        {
            if (this.selectedItems.length === 1 && !this.moveMode && !this.currentEditingItem) 
            {
                e.preventDefault();
                this.enterMoveMode();
            }
        }
        if (e.key === '?') 
        {
            e.preventDefault();
            this.toggleHelpPanel();
        }
        if (e.key === 'Escape') 
        {
            const helpPanel = document.getElementById('help-panel');
            if (helpPanel.style.display === 'block') 
            {
                e.preventDefault();
                this.hideHelpPanel();
            } 
            else if (this.createIconModal.style.display === 'block') 
            {
                e.preventDefault();
                this.closeCreateIconModal();
            } 
            else if (this.folderViewModal.style.display === 'block') 
            {
                e.preventDefault();
                this.closeFolderView();
            } 
            else if (this.moveMode) 
            {
                e.preventDefault();
                this.exitMoveMode();
            } 
            else if (this.currentEditingItem) 
            {
                e.preventDefault();
                this.cancelInlineEdit();
            } 
            else if (this.keyboardFocusedItem) 
            {
                e.preventDefault();
                this.clearKeyboardFocus();
            }
        }
        if (e.key === 'Enter') 
        {
            if (this.moveMode) 
            {
                e.preventDefault();
                this.exitMoveMode();
                return;
            }
                
            e.preventDefault();
                

            if (!this.keyboardFocusedItem) 
            {
                return;
            }
                

            if (e.shiftKey) 
            {
                this.addFocusedItemToSelection();
            }
            else 
            {
                this.selectFocusedItem();
            }
            return;
        }
        if (!this.moveMode && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) 
        {
            e.preventDefault();
                
            if (!this.keyboardFocusedItem) 
            {
                this.focusTopLeftItem();
            } 
            else 
            {
                this.navigateToAdjacentItem(e.key);
            }
            return;
        }
        if (this.moveMode && this.selectedItems.length === 1) 
        {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) 
            {
                e.preventDefault();
                this.moveItemWithArrows(e.key);
            }
        }
    });
}

DesktopGame.prototype.enterMoveMode = function() 
{
    this.moveMode = true;
    if (this.selectedItems.length === 1) 
    {

        const item = this.selectedItems[0];
        item.style.outline = '2px dashed orange';
        item.style.outlineOffset = '4px';
    }
}

DesktopGame.prototype.exitMoveMode = function() 
{
    this.moveMode = false;
    if (this.selectedItems.length === 1)
    {

        const item = this.selectedItems[0];
        item.style.outline = '';
        item.style.outlineOffset = '';
    }
}

DesktopGame.prototype.moveItemWithArrows = function(key) 
{
    if (this.selectedItems.length !== 1) return;

    const selectedItem = this.selectedItems[0];
    const cellWidth = 150;
    const cellHeight = 150;
        
    const currentX = parseInt(selectedItem.style.left) || 0;
    const currentY = parseInt(selectedItem.style.top) || 0;
        
    let newX = currentX;
    let newY = currentY;

    switch (key) 
    {
        case 'ArrowUp':
            newY = Math.max(50, currentY - cellHeight);
            break;
        case 'ArrowDown':
            newY = currentY + cellHeight;
            break;
        case 'ArrowLeft':
            newX = Math.max(50, currentX - cellWidth);
            break;
        case 'ArrowRight':
            newX = currentX + cellWidth;
            break;
    }
    if (!this.isPositionOccupiedByOther(newX, newY, selectedItem)) 
    {
        selectedItem.style.left = `${newX}px`;
        selectedItem.style.top = `${newY}px`;
        selectedItem.style.transition = 'all 0.2s ease';
    }
}

DesktopGame.prototype.isPositionOccupiedByOther = function(x, y, excludeItem) 
{
    const desktop = document.getElementById('desktop');
    const allItems = Array.from(desktop.querySelectorAll('.desktop-item'));
        
    return allItems.some(item => 
    {
        if (item === excludeItem) return false;
            
        const itemX = parseInt(item.style.left) || 0;
        const itemY = parseInt(item.style.top) || 0;
            
        return Math.abs(itemX - x) < 10 && Math.abs(itemY - y) < 10;
    });
}

DesktopGame.prototype.focusTopLeftItem = function() 
{
    const desktop = document.getElementById('desktop');
    const allItems = Array.from(desktop.querySelectorAll('.desktop-item:not(.trash-item)'));
        
    if (allItems.length === 0) return;
        

    let topLeftItem = allItems[0];
    let minY = parseInt(topLeftItem.style.top) || 0;
    let minX = parseInt(topLeftItem.style.left) || 0;
        
    allItems.forEach(item => {
        const itemY = parseInt(item.style.top) || 0;
        const itemX = parseInt(item.style.left) || 0;
            
        if (itemY < minY || (itemY === minY && itemX < minX)) 
        {
            minY = itemY;
            minX = itemX;
            topLeftItem = item;
        }
    });
        
    this.setKeyboardFocus(topLeftItem);
}

DesktopGame.prototype.navigateToAdjacentItem = function(direction) 
{
    if (!this.keyboardFocusedItem) return;
        
    const desktop = document.getElementById('desktop');
    const allItems = Array.from(desktop.querySelectorAll('.desktop-item:not(.trash-item)'));
        
    const refX = parseInt(this.keyboardFocusedItem.style.left) || 0;
    const refY = parseInt(this.keyboardFocusedItem.style.top) || 0;
    const cellWidth = 150;
    const cellHeight = 150;
        
    let candidates = [];
        

    allItems.forEach(item => 
    {
        if (item === this.keyboardFocusedItem) return;
            
        const itemX = parseInt(item.style.left) || 0;
        const itemY = parseInt(item.style.top) || 0;
            
        let isInDirection = false;
        let distance = 0;
            
        switch (direction) 
        {
            case 'ArrowUp':
                if (itemY < refY && Math.abs(itemX - refX) < cellWidth / 2) 
                {
                    isInDirection = true;
                    distance = refY - itemY;
                }
                break;
            case 'ArrowDown':
                if (itemY > refY && Math.abs(itemX - refX) < cellWidth / 2) 
                {
                    isInDirection = true;
                    distance = itemY - refY;
                }
                break;
            case 'ArrowLeft':
                if (itemX < refX && Math.abs(itemY - refY) < cellHeight / 2) 
                {
                    isInDirection = true;
                    distance = refX - itemX;
                }
                break;
            case 'ArrowRight':
                if (itemX > refX && Math.abs(itemY - refY) < cellHeight / 2) 
                {
                    isInDirection = true;
                    distance = itemX - refX;
                }
                break;
        }
            
        if (isInDirection) 
        {
            candidates.push({ item, distance });
        }
    });
        

    if (candidates.length > 0) 
    {
        candidates.sort((a, b) => a.distance - b.distance);
        this.setKeyboardFocus(candidates[0].item);
    }
}

DesktopGame.prototype.setKeyboardFocus = function(item) 
{

    this.clearKeyboardFocus();
        
    this.keyboardFocusedItem = item;
    this.keyboardNavigationMode = true;
    item.classList.add('keyboard-focused');
        

    item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

DesktopGame.prototype.clearKeyboardFocus = function() 
{
    if (this.keyboardFocusedItem) 
    {
        this.keyboardFocusedItem.classList.remove('keyboard-focused');
        this.keyboardFocusedItem = null;
        this.keyboardNavigationMode = false;
    }
}

DesktopGame.prototype.selectFocusedItem = function() 
{
    if (!this.keyboardFocusedItem) return;
        
    const item = this.keyboardFocusedItem;

    this.selectSingleItem(item);
    this.updateGroupButton();

    this.setKeyboardFocus(item);
}

DesktopGame.prototype.addFocusedItemToSelection = function() 
{
    if (!this.keyboardFocusedItem) return;
        
    const item = this.keyboardFocusedItem;
        

    if (!this.selectedItems.includes(item)) 
    {
        this.selectedItems.push(item);
        item.classList.add('selected');
    } 
    else 
    {
        const index = this.selectedItems.indexOf(item);
        this.selectedItems.splice(index, 1);
        item.classList.remove('selected');
    }
    this.updateGroupButton();
}

DesktopGame.prototype.selectAdjacentItem = function(direction) 
{

    const referenceItem = this.selectedItems[this.selectedItems.length - 1];
    if (!referenceItem) return;

    const desktop = document.getElementById('desktop');
    const allItems = Array.from(desktop.querySelectorAll('.desktop-item:not(.trash-item)'));
        

    const systemTypes = ['internet', 'printer', 'settings', 'trash'];
        
    const refX = parseInt(referenceItem.style.left) || 0;
    const refY = parseInt(referenceItem.style.top) || 0;
    const cellWidth = 150;
    const cellHeight = 150;
        
    let candidates = [];
        

    allItems.forEach(item => 
    {
        if (item === referenceItem || this.selectedItems.includes(item)) return;
        if (systemTypes.includes(item.dataset.icon)) return;
            
        const itemX = parseInt(item.style.left) || 0;
        const itemY = parseInt(item.style.top) || 0;
            
        let isInDirection = false;
        let distance = 0;
            
        switch (direction) 
        {
            case 'ArrowUp':
                if (itemY < refY && Math.abs(itemX - refX) < cellWidth / 2)
                 {
                    isInDirection = true;
                    distance = refY - itemY;
                }
                break;
            case 'ArrowDown':
                if (itemY > refY && Math.abs(itemX - refX) < cellWidth / 2) 
                {
                    isInDirection = true;
                    distance = itemY - refY;
                }
                break;
            case 'ArrowLeft':
                if (itemX < refX && Math.abs(itemY - refY) < cellHeight / 2) 
                {
                    isInDirection = true;
                    distance = refX - itemX;
                }
                break;
            case 'ArrowRight':
                if (itemX > refX && Math.abs(itemY - refY) < cellHeight / 2) 
                {
                    isInDirection = true;
                    distance = itemX - refX;
                }
                break;
        }
            
        if (isInDirection) 
        {
            candidates.push({ item, distance });
        }
    });
        

    if (candidates.length > 0) 
    {
        candidates.sort((a, b) => a.distance - b.distance);
        const nearestItem = candidates[0].item;
            
        if (!this.selectedItems.includes(nearestItem)) 
        {
            this.selectedItems.push(nearestItem);
            nearestItem.classList.add('selected');
            this.updateGroupButton();
        }
    }
}

