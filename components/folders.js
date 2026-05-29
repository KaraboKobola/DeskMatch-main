// manages folder creation, grouping, ungrouping, and folder view operations
DesktopGame.prototype.setupFolderViewModal = function() 
{
    const closeBtn = document.getElementById('close-folder-btn');
    const modal = this.folderViewModal;
        
    closeBtn.addEventListener('click', () => 
    {
        this.closeFolderView();
    });
        
    modal.addEventListener('click', (e) => 
    {
        if (e.target === modal) {
            this.closeFolderView();
        }
    });
}

DesktopGame.prototype.createGroupButton = function() 
{

    this.groupButton = document.createElement('button');
    this.groupButton.id = 'group-btn';
    this.groupButton.textContent = 'Group';
    this.groupButton.style.cssText = `
        position: fixed;
        bottom: 40px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #d4af37 0%, #c9a030 100%);
        color: #1a1a2e;
        border: 1px solid rgba(212, 175, 55, 0.3);
        padding: 12px 28px;
        border-radius: 50px;
        font-size: 15px;
        font-weight: 500;
        letter-spacing: 0.3px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
        z-index: 100;
        display: none;
        font-family: 'Roboto Condensed', 'Inter', sans-serif;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    `;
        
    this.groupButton.addEventListener('mouseenter', () => 
    {
        this.groupButton.style.transform = 'translateX(-50%) translateY(-2px)';
        this.groupButton.style.boxShadow = '0 6px 20px rgba(212, 175, 55, 0.4)';
        this.groupButton.style.background = 'linear-gradient(135deg, #e5c158 0%, #d4af37 100%)';
    });
        
    this.groupButton.addEventListener('mouseleave', () => 
    {
        this.groupButton.style.transform = 'translateX(-50%)';
        this.groupButton.style.boxShadow = '0 4px 12px rgba(212, 175, 55, 0.3)';
        this.groupButton.style.background = 'linear-gradient(135deg, #d4af37 0%, #c9a030 100%)';
    });
        
    this.groupButton.addEventListener('click', () => 
    {
        this.groupSelectedItems();
    });
        
    document.body.appendChild(this.groupButton);
}

DesktopGame.prototype.createUngroupButton = function() 
{
    this.ungroupButton = document.createElement('button');
    this.ungroupButton.id = 'ungroup-btn';
    this.ungroupButton.textContent = 'Ungroup';
    this.ungroupButton.style.cssText = `
        position: fixed;
        bottom: 40px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #7c6f4d 0%, #5d5440 100%);
        color: #ffffff;
        border: 1px solid rgba(212, 175, 55, 0.25);
        padding: 12px 28px;
        border-radius: 50px;
        font-size: 15px;
        font-weight: 500;
        letter-spacing: 0.3px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(124, 111, 77, 0.3);
        z-index: 2001;
        display: none;
        font-family: 'Roboto Condensed', 'Inter', sans-serif;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    `;
        
    this.ungroupButton.addEventListener('mouseenter', () => 
    {
        this.ungroupButton.style.transform = 'translateX(-50%) translateY(-2px)';
        this.ungroupButton.style.boxShadow = '0 6px 20px rgba(124, 111, 77, 0.4)';
        this.ungroupButton.style.background = 'linear-gradient(135deg, #8d7f5a 0%, #7c6f4d 100%)';
    });
        
    this.ungroupButton.addEventListener('mouseleave', () => 
    {
        this.ungroupButton.style.transform = 'translateX(-50%)';
        this.ungroupButton.style.boxShadow = '0 4px 12px rgba(124, 111, 77, 0.3)';
        this.ungroupButton.style.background = 'linear-gradient(135deg, #7c6f4d 0%, #5d5440 100%)';
    });
        
    this.ungroupButton.addEventListener('click', () => 
    {
        this.ungroupSelectedFolderItems();
    });
        
    document.body.appendChild(this.ungroupButton);
}

DesktopGame.prototype.updateGroupButton = function() 
{
    if (this.selectedItems.length >= 2) 
    {
        this.groupButton.style.display = 'block';
        this.groupButton.textContent = `Group (${this.selectedItems.length} items)`;
    } 
    else 
    {
        this.groupButton.style.display = 'none';
    }
}

DesktopGame.prototype.updateUngroupButton = function() 
{
    if (this.currentOpenFolder && this.selectedFolderItems.length > 0) 
    {
        this.ungroupButton.style.display = 'block';
    } 
    else 
    {
        this.ungroupButton.style.display = 'none';
    }
}

DesktopGame.prototype.groupSelectedItems = function() 
{
    if (this.selectedItems.length < 2) return;
        

    const firstItem = this.selectedItems[0];
    const folderX = parseInt(firstItem.style.left) || 0;
    const folderY = parseInt(firstItem.style.top) || 0;
        

    const itemsInfo = this.selectedItems.map(item => 
    ({
        type: item.dataset.icon,
        name: item.querySelector('span').textContent
    }));
        

    const desktop = document.getElementById('desktop');
    const newFolder = document.createElement('div');
    newFolder.className = 'desktop-item';
    newFolder.draggable = true;
    newFolder.dataset.icon = 'folder';
    newFolder.id = 'folder-' + Date.now();
        
    newFolder.innerHTML = `
        <img src="assets/folder-icon.png" alt="Folder">
        <span class="editable">Folder${this.iconCounter}</span>
        <div class="folder-badge">${itemsInfo.length}</div>
    `;
    this.iconCounter++;
        
    newFolder.style.position = 'absolute';
    newFolder.style.left = folderX + 'px';
    newFolder.style.top = folderY + 'px';
        
    this.makeDraggable(newFolder, 'desktop');
        

    this.folders.set(newFolder.id, itemsInfo);
        

    this.selectedItems.forEach(item => item.remove());
        

    this.selectedItems = [];
    this.updateGroupButton();
        

    desktop.appendChild(newFolder);
}

DesktopGame.prototype.ungroupSelectedFolderItems = function() 
{
    if (this.selectedFolderItems.length === 0) return;
        
    const desktop = document.getElementById('desktop');
    const folderElement = this.selectedFolderItems[0].folderElement;
    const folderContents = this.folders.get(folderElement.id) || [];
        

    const folderX = parseInt(folderElement.style.left) || 0;
    const folderY = parseInt(folderElement.style.top) || 0;
        

    const sortedSelected = [...this.selectedFolderItems].sort((a, b) => b.index - a.index);
        

    let offsetX = 150;
    sortedSelected.forEach(selectedItem => 
    {
        const itemInfo = selectedItem.itemInfo;
            

        folderContents.splice(selectedItem.index, 1);
            

        const newItem = document.createElement('div');
        newItem.className = 'desktop-item';
        newItem.draggable = true;
        newItem.dataset.icon = itemInfo.type;
        newItem.id = 'item-' + Date.now() + '-' + Math.random();
            
        const iconSrc = this.getIconData(itemInfo.type).src;
        newItem.innerHTML = `
            <img src="${iconSrc}" alt="${itemInfo.name}">
            <span class="editable">${itemInfo.name}</span>
        `;
            

        const nextPos = this.findNextAvailablePosition(folderX + offsetX, folderY);
        newItem.style.position = 'absolute';
        newItem.style.left = (nextPos ? nextPos.x : folderX + offsetX) + 'px';
        newItem.style.top = (nextPos ? nextPos.y : folderY) + 'px';
            
        this.makeDraggable(newItem, 'desktop');
        desktop.appendChild(newItem);
            
        offsetX += 150;
    });
        

    this.folders.set(folderElement.id, folderContents);
    this.updateFolderBadge(folderElement);
        

    this.selectedFolderItems = [];
    this.updateUngroupButton();
        

    this.closeFolderView();
    if (folderContents.length > 0) 
    {
        setTimeout(() => this.openFolder(folderElement), 100);
    }
}

DesktopGame.prototype.handleFolderCreation = function(draggedItem, targetItem) 
{
    const targetType = targetItem.dataset.icon;
        
    if (targetType === 'folder') 
    {

        this.addToFolder(draggedItem, targetItem);
    } 
    else 
    {
        this.transformToFolder(draggedItem, targetItem);
    }
}

DesktopGame.prototype.transformToFolder = function(draggedItem, targetItem)
{
    const draggedInfo = 
    {
        type: draggedItem.dataset.icon,
        name: draggedItem.querySelector('span').textContent
    };
    const targetInfo = 
    {
        type: targetItem.dataset.icon,
        name: targetItem.querySelector('span').textContent
    };

    if (!targetItem.id) 
    {
        targetItem.id = 'folder-' + Date.now();
    }
        

    targetItem.dataset.icon = 'folder';
        

    const img = targetItem.querySelector('img');
    img.src = 'assets/folder-icon.png';
    img.alt = 'Folder';
        


        

    const badge = document.createElement('div');
    badge.className = 'folder-badge';
    badge.textContent = '2';
    targetItem.appendChild(badge);
        

    this.folders.set(targetItem.id, [draggedInfo, targetInfo]);
        
    if (this.currentOpenFolder && this.currentOpenFolder.id === targetItem.id) 
    {
        this.openFolder(targetItem);
    }

    draggedItem.remove();
}

DesktopGame.prototype.addToFolder = function(draggedItem, folderItem) 
{

    const folderContents = this.folders.get(folderItem.id) || [];
        

    const newItem = {
        type: draggedItem.dataset.icon,
        name: draggedItem.querySelector('span').textContent
    };
        
    folderContents.push(newItem);
    this.folders.set(folderItem.id, folderContents);
        

    let badge = folderItem.querySelector('.folder-badge');
    if (!badge) 
    {
        badge = document.createElement('div');
        badge.className = 'folder-badge';
        folderItem.appendChild(badge);
    }
    badge.textContent = folderContents.length;
        
    if (this.currentOpenFolder && this.currentOpenFolder.id === folderItem.id) 
    {
        this.openFolder(folderItem);
    }

    draggedItem.remove();
}

DesktopGame.prototype.updateFolderBadge = function(folder) 
{
    const contents = this.folders.get(folder.id) || [];
    let badge = folder.querySelector('.folder-badge');
        
    if (contents.length > 0) 
    {
        if (!badge) 
        {
            badge = document.createElement('div');
            badge.className = 'folder-badge';
            folder.appendChild(badge);
        }
        badge.textContent = contents.length;
    } 
    else if (badge) 
    {
        badge.remove();
    }
}

DesktopGame.prototype.openFolder = function(folderElement) 
{

    const folderContents = this.folders.get(folderElement.id) || [];
        

    this.currentOpenFolder = folderElement;
        

    const modal = this.folderViewModal;
    const modalContent = modal.querySelector('.folder-view-content');
    const title = document.getElementById('folder-title');
    const container = document.getElementById('folder-items');
        

    title.textContent = folderElement.querySelector('span').textContent;
        

    container.innerHTML = '';
    
    let ungroupButtonContainer = document.getElementById('ungroup-button-container');
    if (!ungroupButtonContainer) 
    {
        ungroupButtonContainer = document.createElement('div');
        ungroupButtonContainer.id = 'ungroup-button-container';
        ungroupButtonContainer.style.cssText = `
            display: flex;
            justify-content: center;
            padding: 16px 0 0 0;
            margin-top: 16px;
            border-top: 2px solid rgba(212, 175, 55, 0.15);
        `;
        modalContent.appendChild(ungroupButtonContainer);
        
        if (this.ungroupButton.parentNode) 
        {
            this.ungroupButton.parentNode.removeChild(this.ungroupButton);
        }
        ungroupButtonContainer.appendChild(this.ungroupButton);
        
        this.ungroupButton.style.cssText = `
            position: relative;
            bottom: auto;
            left: auto;
            transform: none;
            background: linear-gradient(135deg, #7c6f4d 0%, #5d5440 100%);
            color: #ffffff;
            border: 1px solid rgba(212, 175, 55, 0.25);
            padding: 12px 28px;
            border-radius: 50px;
            font-size: 15px;
            font-weight: 500;
            letter-spacing: 0.3px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(124, 111, 77, 0.3);
            display: none;
            font-family: 'Roboto Condensed', 'Inter', sans-serif;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        `;
        
        this.ungroupButton.addEventListener('mouseenter', () => 
        {
            this.ungroupButton.style.transform = 'translateY(-2px)';
            this.ungroupButton.style.boxShadow = '0 6px 20px rgba(124, 111, 77, 0.4)';
            this.ungroupButton.style.background = 'linear-gradient(135deg, #8d7f5a 0%, #7c6f4d 100%)';
        });
        
        this.ungroupButton.addEventListener('mouseleave', () => 
        {
            this.ungroupButton.style.transform = 'none';
            this.ungroupButton.style.boxShadow = '0 4px 12px rgba(124, 111, 77, 0.3)';
            this.ungroupButton.style.background = 'linear-gradient(135deg, #7c6f4d 0%, #5d5440 100%)';
        });
    }
    
    if (folderContents.length === 0) 
    {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999; padding: 40px;">This folder is empty</p>';
    } 
    else 
    {
        let rows, columns;
        if (folderContents.length <= 4)
        {
            rows = 1;
            columns = folderContents.length;
        } 
        else 
        {
            rows = 2;
            columns = Math.ceil(folderContents.length / 2);
        }
        
        const itemHeight = 130;
        const gap = 16;
        const padding = 48;
        const calculatedHeight = (rows * itemHeight) + ((rows - 1) * gap) + padding;
        
        container.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
        container.style.height = calculatedHeight + 'px';
        container.style.minHeight = 'auto';
        container.style.maxHeight = 'none';
        
        folderContents.forEach((itemInfo, index) => 
        {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'folder-item';
            itemDiv.draggable = true;
            itemDiv.dataset.itemIndex = index;
            itemDiv.dataset.itemType = itemInfo.type;
            itemDiv.dataset.itemName = itemInfo.name;
                

            const iconSrc = this.getIconData(itemInfo.type).src;
                
            itemDiv.innerHTML = `
                <img src="${iconSrc}" alt="${itemInfo.name}">
                <span>${itemInfo.name}</span>
            `;
                

            itemDiv.addEventListener('click', (e) => {
                e.preventDefault();

                if (itemDiv.classList.contains('folder-item-selected')) 
                {
                    itemDiv.classList.remove('folder-item-selected');

                    const idx = this.selectedFolderItems.findIndex(item => item.index === index);
                    if (idx > -1) 
                    {
                        this.selectedFolderItems.splice(idx, 1);
                    }
                } 
                else 
                {
                    itemDiv.classList.add('folder-item-selected');

                    this.selectedFolderItems.push({
                        folderElement: folderElement,
                        index: index,
                        itemInfo: itemInfo,
                        element: itemDiv
                    });
                }
                this.updateUngroupButton();
            });
                

            itemDiv.addEventListener('dragstart', (e) => 
            {
                e.stopPropagation();
                this.draggedFromFolder = 
                {
                    folderElement: folderElement,
                    itemIndex: index,
                    itemInfo: itemInfo
                };
                    
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', JSON.stringify
                ({
                    source: 'folder',
                    folderElementId: folderElement.id,
                    itemIndex: index
                }));
                itemDiv.style.opacity = '0.5';
                itemDiv.classList.add('dragging-from-folder');
            });
                
            itemDiv.addEventListener('dragend', (e) => 
            {
                itemDiv.style.opacity = '1';
                itemDiv.classList.remove('dragging-from-folder');
                this.draggedFromFolder = null;
            });
                
            container.appendChild(itemDiv);
        });
    }
        
    modal.style.display = 'block';
}

DesktopGame.prototype.takeItemOut = function(folderElement, itemIndex) 
{

    const folderContents = this.folders.get(folderElement.id) || [];
        
    if (itemIndex < 0 || itemIndex >= folderContents.length) return;
        

    const itemInfo = folderContents[itemIndex];
        

    folderContents.splice(itemIndex, 1);
    this.folders.set(folderElement.id, folderContents);
        

    const desktop = document.getElementById('desktop');
    const folderX = parseInt(folderElement.style.left) || 0;
    const folderY = parseInt(folderElement.style.top) || 0;
        
    const newItem = document.createElement('div');
    newItem.className = 'desktop-item';
    newItem.draggable = true;
    newItem.dataset.icon = itemInfo.type;
    newItem.id = 'item-' + Date.now();
        
    const iconSrc = this.getIconData(itemInfo.type).src;
    newItem.innerHTML = `
        <img src="${iconSrc}" alt="${itemInfo.name}">
        <span class="editable">${itemInfo.name}</span>
    `;
        

    const nextPos = this.findNextAvailablePosition(folderX + 150, folderY);
    newItem.style.position = 'absolute';
    newItem.style.left = (nextPos ? nextPos.x : folderX + 150) + 'px';
    newItem.style.top = (nextPos ? nextPos.y : folderY) + 'px';
        
    this.makeDraggable(newItem, 'desktop');
    desktop.appendChild(newItem);
        

    this.updateFolderBadge(folderElement);
        

    this.openFolder(folderElement);
}

DesktopGame.prototype.takeItemOutAtPosition = function(folderElement, itemIndex, x, y) 
{

    const folderContents = this.folders.get(folderElement.id) || [];
        
    if (itemIndex < 0 || itemIndex >= folderContents.length) return;
        

    const itemInfo = folderContents[itemIndex];
        

    folderContents.splice(itemIndex, 1);
    this.folders.set(folderElement.id, folderContents);
        

    const desktop = document.getElementById('desktop');
    desktop.style.background = '';
    const rect = desktop.getBoundingClientRect();
        
    const newItem = document.createElement('div');
    newItem.className = 'desktop-item';
    newItem.draggable = true;
    newItem.dataset.icon = itemInfo.type;
    newItem.id = 'item-' + Date.now();
        
    const iconSrc = this.getIconData(itemInfo.type).src;
    newItem.innerHTML = `
        <img src="${iconSrc}" alt="${itemInfo.name}">
        <span class="editable">${itemInfo.name}</span>
    `;
        

    const relativeX = x - rect.left;
    const relativeY = y - rect.top;
    newItem.style.position = 'absolute';
    newItem.style.left = relativeX + 'px';
    newItem.style.top = relativeY + 'px';
        
    this.makeDraggable(newItem, 'desktop');
    desktop.appendChild(newItem);
        

    this.draggedElement = newItem;
    this.moveToNearestGridPosition(x, y);
    this.draggedElement = null;
        

    this.updateFolderBadge(folderElement);
        

    if (this.currentOpenFolder === folderElement) 
    {
        this.closeFolderView();
        setTimeout(() => this.openFolder(folderElement), 100);
    }
}

DesktopGame.prototype.closeFolderView = function()
{
    this.folderViewModal.style.display = 'none';
    this.currentOpenFolder = null;

    this.selectedFolderItems = [];
    this.updateUngroupButton();
}

