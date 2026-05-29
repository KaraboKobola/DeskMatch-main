// handles all drag and drop interactions for moving items around the desktop
DesktopGame.prototype.setupDragAndDrop = function() 
{
        
    document.addEventListener('dragstart', (e) => 
    {
        if (e.target.closest('.desktop-item')) 
        {
            this.handleDragStart(e);
        }
    });

    document.addEventListener('dragend', (e) =>
    {
        this.handleDragEnd(e);
    });

    document.addEventListener('dragover', (e) => 
    {
        e.preventDefault();
        this.handleDragOver(e);
    });

    document.addEventListener('drop', (e) => 
    {
        this.handleDrop(e);
    });

    const desktop = document.getElementById('desktop');
    desktop.addEventListener('click', (e) => 
    {
        if (e.target === desktop) 
        {
            if (this.moveMode) 
            {
                this.exitMoveMode();
            }
            this.deselectAll();
        }
    });
        
    desktop.addEventListener('dblclick', (e) => 
    {
        if (e.target === desktop) 
        {
            e.preventDefault();
            this.openCreateIconModal(e.clientX, e.clientY);
        }
    });
}

DesktopGame.prototype.makeDraggable = function(element, source) 
{
    element.draggable = true;
    element.addEventListener('dragstart', (e) => 
        {
        this.handleDragStart(e, source);
    });
        
    element.addEventListener('click', (e) => 
    {
        if (e.target.tagName === 'SPAN') 
        {
            this.handleTextClick(e);
        } 
        else 
        {
            this.handleItemClick(e);
        }
    });
        
    element.addEventListener('contextmenu', (e) => 
    {
        e.preventDefault();
        e.stopPropagation();
        this.handleItemRightClick(e);
    });
        
    element.addEventListener('dblclick', (e) => 
    {
        e.preventDefault();
        const itemType = element.dataset.icon;
        if (itemType === 'folder') 
        {
            this.openFolder(element);
        }
    });
}

DesktopGame.prototype.handleDragStart = function(e) 
{
    this.draggedElement = e.target.closest('.desktop-item');
    this.draggedElement.classList.add('dragging');
        
    const rect = this.draggedElement.getBoundingClientRect();
    this.dragOffset.x = rect.width / 2;
    this.dragOffset.y = rect.height / 2;
        
    const ghost = this.draggedElement.cloneNode(true);
    ghost.classList.add('drag-ghost');
    ghost.style.position = 'absolute';
    ghost.style.top = '-1000px';
    document.body.appendChild(ghost);
        
    e.dataTransfer.setDragImage(ghost, this.dragOffset.x, this.dragOffset.y);
    e.dataTransfer.effectAllowed = 'move';
        
        
    e.dataTransfer.setData('text/plain', JSON.stringify
    ({
        source: 'desktop',
        type: this.draggedElement.dataset.icon || 'unknown'
    }));

        
    this.draggedElement.style.outline = '2px dashed #ff0000';
    this.draggedElement.style.outlineOffset = '2px';
}

DesktopGame.prototype.handleDragEnd = function(e) 
{
    if (this.draggedElement) 
    {
        this.draggedElement.classList.remove('dragging');
        this.draggedElement.style.outline = '';
        this.draggedElement.style.outlineOffset = '';
        this.draggedElement.style.opacity = '1'; 
        this.draggedElement = null;
    }
        
    const trash = document.querySelector('.trash-item');
    if (trash) 
    {
        trash.classList.remove('drag-over');
    }
        
    const desktop = document.getElementById('desktop');
    desktop.style.background = '';
        
    const allItems = document.querySelectorAll('.desktop-item');
    allItems.forEach(item =>
    {
        item.classList.remove('folder-target');
    });
        
    const ghost = document.querySelector('.drag-ghost');
    if (ghost) {
        ghost.remove();
    }
}

DesktopGame.prototype.handleDragOver = function(e) 
{
    e.preventDefault();
        

    const desktop = document.getElementById('desktop');
    if (this.draggedFromFolder && e.target.closest('#desktop')) 
    {
        desktop.style.background = 'rgba(76, 175, 80, 0.1)';
    } 
    else 
    {
        desktop.style.background = '';
    }
        

    if (this.dragOverItem && this.dragOverItem !== e.target.closest('.desktop-item')) 
    {
        this.dragOverItem.classList.remove('folder-target');
        this.dragOverItem = null;
    }
        
    const trashItem = e.target.closest('.trash-item');
    if (trashItem) 
    {
        trashItem.classList.add('drag-over');
        e.dataTransfer.dropEffect = 'move';
        return;
    } 
    else 
    {
        const trash = document.querySelector('.trash-item');
        if (trash) {
            trash.classList.remove('drag-over');
        }
    }
        
    const targetItem = e.target.closest('.desktop-item');
    if (targetItem && targetItem !== this.draggedElement && this.draggedElement) 
    {
        const draggedType = this.draggedElement.dataset.icon;
        const targetType = targetItem.dataset.icon;
        const systemTypes = ['internet', 'printer', 'settings', 'trash'];
            
        if (!systemTypes.includes(draggedType) && !systemTypes.includes(targetType)) 
        {
            targetItem.classList.add('folder-target');
            this.dragOverItem = targetItem;
            e.dataTransfer.dropEffect = 'copy';
        }
    }
}

DesktopGame.prototype.handleDrop = function(e) 
{
    e.preventDefault();
        
    const desktop = document.getElementById('desktop');
    desktop.style.background = '';
        
    if (this.dragOverItem) 
    {
        this.dragOverItem.classList.remove('folder-target');
    }
        
    const trash = document.querySelector('.trash-item');
    if (trash) 
    {
        trash.classList.remove('drag-over');
    }
    const trashItem = e.target.closest('.trash-item');
    if (trashItem) 
    {
        if (this.draggedElement) 
        {
        const itemType = this.draggedElement.dataset.icon;
        const deletableTypes = ['folder', 'image', 'textdoc', 'zip', 'mp4'];
            
        if (deletableTypes.includes(itemType)) 
        {
            this.deleteItem(this.draggedElement);
        } 
        else 
        {
            this.showCannotDeleteFeedback();
        }
        }

        if (trash) 
        {
            trash.classList.remove('drag-over');
        }
        this.dragOverItem = null;
        this.draggedFromFolder = null;
        return;
    }
    const targetItem = e.target.closest('.desktop-item');
    if (targetItem && targetItem !== this.draggedElement && this.draggedElement) 
    {
        const draggedType = this.draggedElement.dataset.icon;
        const targetType = targetItem.dataset.icon;
        const systemTypes = ['internet', 'printer', 'settings', 'trash'];
            
        if (!systemTypes.includes(draggedType) && !systemTypes.includes(targetType)) 
        {
            this.handleFolderCreation(this.draggedElement, targetItem);
            this.dragOverItem = null;
            return;
        }
    }
    if (desktop.contains(e.target) || e.target === desktop) 
    {
        this.handleDesktopDrop(e);
    }
        
    this.dragOverItem = null;
}

DesktopGame.prototype.handleDesktopDrop = function(e) 
{

    if (this.draggedFromFolder) 
    {
        this.dropItemFromFolder(this.draggedFromFolder, e.clientX, e.clientY);
        this.draggedFromFolder = null;
        return;
    }
        

    try
    {
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        if (data.source === 'folder') 
        {
            const folderElement = document.getElementById(data.folderElementId);
            if (folderElement) 
            {
                const folderContents = this.folders.get(folderElement.id) || [];
                const itemInfo = folderContents[data.itemIndex];
                if (itemInfo) 
                {
                    this.dropItemFromFolder
                    ({
                        folderElement: folderElement,
                        itemIndex: data.itemIndex,
                        itemInfo: itemInfo
                    }, e.clientX, e.clientY);
                }
            }
            return;
        }
    } 
    catch (err) 
    {

    }
        
    if (!this.draggedElement) return;
        
    this.moveToNearestGridPosition(e.clientX, e.clientY);
}

DesktopGame.prototype.dropItemFromFolder = function(dragData, x, y) 
{
    const folderElement = dragData.folderElement;
    const itemIndex = dragData.itemIndex;
        
    if (!folderElement) return;
        

    this.takeItemOutAtPosition(folderElement, itemIndex, x, y);
}

DesktopGame.prototype.createDesktopItem = function(type, x, y) 
{
    const desktop = document.getElementById('desktop');
    const rect = desktop.getBoundingClientRect();
        
    const item = document.createElement('div');
    item.className = 'desktop-item';
    item.draggable = true;
    item.dataset.icon = type;
        
        
    const iconData = this.getIconData(type);
        
    item.innerHTML = `
        <img src="${iconData.src}" alt="${iconData.name}">
        <span class="editable">${iconData.name}</span>
    `;
        

    const relativeX = x - rect.left;
    const relativeY = y - rect.top;
    item.style.position = 'absolute';
    item.style.left = `${relativeX - 50}px`;
    item.style.top = `${relativeY - 50}px`;
        
        
    this.makeDraggable(item, 'desktop');
        
        
        
    desktop.appendChild(item);
}

DesktopGame.prototype.moveDesktopItem = function(x, y) 
{
    if (!this.draggedElement) return;
        
    const desktop = document.getElementById('desktop');
    const rect = desktop.getBoundingClientRect();
        

    const relativeX = x - rect.left - this.dragOffset.x;
    const relativeY = y - rect.top - this.dragOffset.y;
        
    this.draggedElement.style.position = 'absolute';
    this.draggedElement.style.left = `${relativeX}px`;
    this.draggedElement.style.top = `${relativeY}px`;
}

DesktopGame.prototype.moveToNearestGridPosition = function(x, y) 
{
    if (!this.draggedElement) return;
        
    const desktop = document.getElementById('desktop');
    const rect = desktop.getBoundingClientRect();
        

    const relativeX = x - rect.left - this.dragOffset.x;
    const relativeY = y - rect.top - this.dragOffset.y;
        
        
    const cellWidth = 150;
    const cellHeight = 150;
    const startX = 50;
    const startY = 50;
        
        
    const gridCol = Math.round((relativeX - startX) / cellWidth);
    const gridRow = Math.round((relativeY - startY) / cellHeight);
        
        
    const finalCol = Math.max(0, gridCol);
    const finalRow = Math.max(0, gridRow);
        
        
    const finalX = startX + (finalCol * cellWidth);
    const finalY = startY + (finalRow * cellHeight);
        
        
    if (this.isPositionOccupied(finalX, finalY)) 
    {
            
        const availablePosition = this.findNextAvailablePosition(finalX, finalY);
        if (availablePosition) {
            this.draggedElement.style.position = 'absolute';
            this.draggedElement.style.left = `${availablePosition.x}px`;
            this.draggedElement.style.top = `${availablePosition.y}px`;
            this.draggedElement.style.transition = 'all 0.3s ease';
        }
    } 
    else 
    {
            
        this.draggedElement.style.position = 'absolute';
        this.draggedElement.style.left = `${finalX}px`;
        this.draggedElement.style.top = `${finalY}px`;
        this.draggedElement.style.transition = 'all 0.3s ease';
    }
}

DesktopGame.prototype.isPositionOccupied = function(x, y) 
{
    const desktop = document.getElementById('desktop');
    const allItems = Array.from(desktop.querySelectorAll('.desktop-item'));
        
        
    return allItems.some(item => 
    {
        if (item === this.draggedElement) return false;
            
        const itemX = parseInt(item.style.left) || 0;
        const itemY = parseInt(item.style.top) || 0;
            
        return Math.abs(itemX - x) < 10 && Math.abs(itemY - y) < 10;
    });
}

DesktopGame.prototype.findNextAvailablePosition = function(startX, startY) 
{
    const cellWidth = 150;
    const cellHeight = 150;
    const startGridX = 50;
    const startGridY = 50;
    const maxCols = 4;
    const maxRows = 10; 
        
        
    const startCol = Math.round((startX - startGridX) / cellWidth);
    const startRow = Math.round((startY - startGridY) / cellHeight);
        
    for (let radius = 0; radius < Math.max(maxCols, maxRows); radius++) 
    {
        for (let col = Math.max(0, startCol - radius); col <= Math.min(maxCols - 1, startCol + radius); col++) 
        {
            for (let row = Math.max(0, startRow - radius); row <= Math.min(maxRows - 1, startRow + radius); row++) 
            {
                    
                if (Math.abs(col - startCol) !== radius && Math.abs(row - startRow) !== radius) 
                {
                    continue;
                }
                    
                const x = startGridX + (col * cellWidth);
                const y = startGridY + (row * cellHeight);
                    
                if (!this.isPositionOccupied(x, y)) 
                {
                    return { x, y };
                }
            }
        }
    }
        
    return null; 
}

