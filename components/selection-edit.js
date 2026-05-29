// handles item selection, multi-select, and inline text editing for renaming items
DesktopGame.prototype.handleItemClick = function(e) 
{
    e.preventDefault();
    const item = e.target.closest('.desktop-item');
    if (item && !this.currentEditingItem) 
    {
        this.clearKeyboardFocus();
        this.selectSingleItem(item);
        this.updateGroupButton();
    }
}

DesktopGame.prototype.handleItemRightClick = function(e) 
{
    const item = e.target.closest('.desktop-item');
    if (item && !this.currentEditingItem) 
    {
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
}

DesktopGame.prototype.handleTextClick = function(e) 
{
    e.preventDefault();
    e.stopPropagation();
    const item = e.target.closest('.desktop-item');
    if (item && !this.currentEditingItem) 
    {
        const systemTypes = ['internet', 'printer', 'settings', 'trash'];
        if (systemTypes.includes(item.dataset.icon)) 
        {
            this.showCannotRenameFeedback();
            return;
        }
        this.startInlineEdit(item, e.target);
    }
}

DesktopGame.prototype.selectSingleItem = function(item) 
{
    this.selectedItems.forEach(selectedItem => 
    {
        selectedItem.classList.remove('selected');
    });
    this.selectedItems = [item];
    item.classList.add('selected');
}

DesktopGame.prototype.toggleItemSelection = function(item) 
{
    const index = this.selectedItems.indexOf(item);
    if (index > -1) 
    {
        this.selectedItems.splice(index, 1);
        item.classList.remove('selected');
    } 
    else 
    {
        this.selectedItems.push(item);
        item.classList.add('selected');
    }
}

DesktopGame.prototype.deselectAll = function() 
{
    this.selectedItems.forEach(item => 
    {
        item.classList.remove('selected');
    });
    this.selectedItems = [];
    this.updateGroupButton();
}

DesktopGame.prototype.startInlineEdit = function(item, textElement) 
{
    if (this.currentEditingItem) 
    {
        this.saveInlineEdit();
    }
        
    this.currentEditingItem = item;
    this.deselectAll();
        
    const originalText = textElement.textContent;
    const extension = this.getFileExtension(originalText);
        
    textElement.classList.add('editing');
    textElement.contentEditable = true;
    textElement.focus();
        
    if (extension) 
    {
        const nameWithoutExt = originalText.replace(extension, '');
        textElement.textContent = nameWithoutExt;
        textElement.dataset.extension = extension;
        textElement.dataset.originalText = nameWithoutExt;
    } 
    else 
    {
        textElement.dataset.originalText = originalText;
    }
        
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(textElement);
    sel.removeAllRanges();
    sel.addRange(range);
        
    textElement.addEventListener('blur', () => this.saveInlineEdit());
    textElement.addEventListener('keydown', (e) => 
    {
        if (e.key === 'Enter') 
        {
            e.preventDefault();
            this.saveInlineEdit();
        } else if (e.key === 'Escape') 
        {
            e.preventDefault();
            this.cancelInlineEdit();
        }
    });
        
    item.addEventListener('click', this.handleIconClick.bind(this), true);
}

DesktopGame.prototype.handleIconClick = function(e) 
{
    if (e.target.tagName === 'IMG' && this.currentEditingItem) 
    {
        e.preventDefault();
        e.stopPropagation();
        this.saveInlineEdit();
    }
}

DesktopGame.prototype.getFileExtension = function(filename) 
{
    const lastDotIndex = filename.lastIndexOf('.');
    if (lastDotIndex > 0 && lastDotIndex < filename.length - 1) 
    {
        return filename.substring(lastDotIndex);
    }
    return '';
}

DesktopGame.prototype.saveInlineEdit = function() 
{
    if (!this.currentEditingItem) return;
        
    const textElement = this.currentEditingItem.querySelector('span.editing');
    if (textElement) 
    {
        let newText = textElement.textContent.trim();
        const extension = textElement.dataset.extension;
            
        if (extension && !newText.endsWith(extension)) 
        {
            newText += extension;
        }
            
        textElement.textContent = newText;
        textElement.contentEditable = false;
        textElement.classList.remove('editing');
        delete textElement.dataset.extension;
            
        this.currentEditingItem.removeEventListener('click', this.handleIconClick.bind(this), true);
        this.currentEditingItem = null;
    }
}

DesktopGame.prototype.cancelInlineEdit = function() 
{
    if (!this.currentEditingItem) return;
        
    const textElement = this.currentEditingItem.querySelector('span.editing');
    if (textElement) 
    {
        const extension = textElement.dataset.extension;
        const originalText = textElement.dataset.originalText || textElement.textContent;
            
        if (extension) 
        {
            textElement.textContent = originalText + extension;
            delete textElement.dataset.extension;
        }
            
        textElement.contentEditable = false;
        textElement.classList.remove('editing');
        delete textElement.dataset.originalText;
            
        this.currentEditingItem.removeEventListener('click', this.handleIconClick.bind(this), true);
        this.currentEditingItem = null;
    }
}

