// ui helper functions for target screenshots, modals, help panel, and game reset
DesktopGame.prototype.selectRandomTargetLayout = function() 
{
    const layout1 = 
    {
        visual: [
            { type: 'internet', name: 'Browser', x: 10, y: 10 },
            { type: 'printer', name: 'Printer', x: 40, y: 10 },
            { type: 'settings', name: 'Settings', x: 70, y: 10 },
            { type: 'folder', name: 'Documents', x: 10, y: 40 },
            { type: 'image', name: 'Photo1.jpg', x: 40, y: 40 },
            { type: 'textdoc', name: 'Notes.txt', x: 70, y: 40 },
            { type: 'zip', name: 'Archive1.zip', x: 10, y: 70 },
            { type: 'mp4', name: 'Video.mp4', x: 40, y: 70 }
        ],
        grading: [
            { type: 'internet', name: 'Browser', x: 50, y: 50 },
            { type: 'printer', name: 'Printer', x: 200, y: 50 },
            { type: 'settings', name: 'Settings', x: 350, y: 50 },
            { type: 'folder', name: 'Documents', x: 50, y: 200 },
            { type: 'image', name: 'Photo1.jpg', x: 200, y: 200 },
            { type: 'textdoc', name: 'Notes.txt', x: 350, y: 200 },
            { type: 'zip', name: 'Archive1.zip', x: 50, y: 350 },
            { type: 'mp4', name: 'Video.mp4', x: 200, y: 350 }
        ]
    };

    const layout2 = 
    {
        visual: [
            { type: 'settings', name: 'Settings', x: 10, y: 10 },
            { type: 'internet', name: 'Browser', x: 40, y: 10 },
            { type: 'printer', name: 'Printer', x: 70, y: 10 },
            { type: 'textdoc', name: 'Notes.txt', x: 10, y: 40 },
            { type: 'folder', name: 'Documents', x: 40, y: 40 },
            { type: 'mp4', name: 'Video.mp4', x: 70, y: 40 },
            { type: 'image', name: 'Photo1.jpg', x: 10, y: 70 },
            { type: 'zip', name: 'Archive1.zip', x: 40, y: 70 }
        ],
        grading: [
            { type: 'settings', name: 'Settings', x: 50, y: 50 },
            { type: 'internet', name: 'Browser', x: 200, y: 50 },
            { type: 'printer', name: 'Printer', x: 350, y: 50 },
            { type: 'textdoc', name: 'Notes.txt', x: 50, y: 200 },
            { type: 'folder', name: 'Documents', x: 200, y: 200 },
            { type: 'mp4', name: 'Video.mp4', x: 350, y: 200 },
            { type: 'image', name: 'Photo1.jpg', x: 50, y: 350 },
            { type: 'zip', name: 'Archive1.zip', x: 200, y: 350 }
        ]
    };

    const layout3 = 
    {
        visual: [
            { type: 'internet', name: 'Browser', x: 10, y: 10 },
            { type: 'printer', name: 'Printer', x: 40, y: 10 },
            { type: 'settings', name: 'Settings', x: 70, y: 10 },
            { type: 'folder', name: 'Media Files', x: 10, y: 40, badge: '3' },
            { type: 'textdoc', name: 'Notes.txt', x: 40, y: 40 },
            { type: 'zip', name: 'Archive1.zip', x: 70, y: 40 }
        ],
        grading: [
            { type: 'internet', name: 'Browser', x: 50, y: 50 },
            { type: 'printer', name: 'Printer', x: 200, y: 50 },
            { type: 'settings', name: 'Settings', x: 350, y: 50 },
            { 
                type: 'folder', 
                name: 'Media Files', 
                x: 50, 
                y: 200,
                contents: [
                    { type: 'image', name: 'Photo1.jpg' },
                    { type: 'mp4', name: 'Video.mp4' },
                    { type: 'folder', name: 'Documents' }
                ]
            },
            { type: 'textdoc', name: 'Notes.txt', x: 200, y: 200 },
            { type: 'zip', name: 'Archive1.zip', x: 350, y: 200 }
        ]
    };
    const layouts = [layout1, layout2, layout3];
    const randomIndex = Math.floor(Math.random() * 3);
    this.selectedTargetLayout = layouts[randomIndex];
}

DesktopGame.prototype.createTargetScreenshot = function() 
{
    const targetDesktop = document.querySelector('.target-desktop');
        

    const targetLayout = this.selectedTargetLayout.visual;
        
    targetLayout.forEach((iconData, index) => 
    {
        const icon = document.createElement('div');
        icon.className = 'target-icon';
            
        const iconData_obj = this.getIconData(iconData.type);
            
        const gradingItem = this.selectedTargetLayout.grading.find(g => 
            g.type === iconData.type && g.name === iconData.name
        );

        let badgeHTML = '';
        if (iconData.badge) 
        {
            badgeHTML = `<div class="folder-badge">${iconData.badge}</div>`;
        } 
        else if (gradingItem && gradingItem.contents && gradingItem.contents.length > 0) 
        {
            badgeHTML = `<div class="folder-badge">${gradingItem.contents.length}</div>`;
        }
            
        icon.innerHTML = `
            <img src="${iconData_obj.src}" alt="${iconData_obj.name}">
            <span>${iconData.name}</span>
            ${badgeHTML}
        `;
            
        icon.style.left = `${iconData.x}px`;
        icon.style.top = `${iconData.y}px`;
            
        if (gradingItem && gradingItem.contents) 
        {
            icon.style.cursor = 'pointer';
            icon.title = 'Click to see folder contents';
            icon.addEventListener('click', (e) => 
            {
                e.stopPropagation();
                this.showTargetFolderContents(gradingItem);
            });
        }
            
        targetDesktop.appendChild(icon);
    });
}

DesktopGame.prototype.openScreenshotModal = function() 
{
    const modal = document.getElementById('screenshot-modal');
    const modalDesktop = document.getElementById('screenshot-modal-desktop');
        
        
    modalDesktop.innerHTML = '';
        

    const targetLayout = this.selectedTargetLayout.grading;
        
    targetLayout.forEach(item => 
    {
        const icon = document.createElement('div');
        icon.className = 'screenshot-modal-icon';
            
        const iconData_obj = this.getIconData(item.type);
            

        let badgeHTML = '';
        if (item.contents && item.contents.length > 0) 
        {
            badgeHTML = `<div class="folder-badge-large">${item.contents.length}</div>`;
        }
            
        icon.innerHTML = `
            <img src="${iconData_obj.src}" alt="${iconData_obj.name}">
            <span>${item.name}</span>
            ${badgeHTML}
        `;
            
        icon.style.left = `${item.x * 0.8}px`;
        icon.style.top = `${item.y * 0.8}px`;
            

        if (item.contents) 
        {
            icon.style.cursor = 'pointer';
            icon.title = 'Click to see folder contents';
            icon.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showTargetFolderContents(item);
            });
        }
            
        modalDesktop.appendChild(icon);
    });
        
    modal.style.display = 'block';
}

DesktopGame.prototype.showTargetFolderContents = function(folderItem) 
{
    const existingModal = document.getElementById('target-folder-contents-modal');
    if (existingModal) 
    {
        existingModal.remove();
    }
        
    const modal = document.createElement('div');
    modal.id = 'target-folder-contents-modal';
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.style.zIndex = '3000';
        
    const contentsList = folderItem.contents.map(item => 
    {
        const iconData = this.getIconData(item.type);
        return `
            <div class="folder-content-item">
                <img src="${iconData.src}" alt="${item.name}" style="width: 32px; height: 32px;">
                <span>${item.name}</span>
                <span class="item-type">(${item.type})</span>
            </div>
        `;
    }).join('');
        
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 400px;">
            <h3>📁 ${folderItem.name}</h3>
            <p style="margin: 10px 0; color: #666;">This folder should contain these ${folderItem.contents.length} items:</p>
            <div class="folder-contents-list">
                ${contentsList}
            </div>
            <div class="modal-buttons">
                <button id="close-folder-contents">Got it!</button>
            </div>
        </div>
    `;
        
    document.body.appendChild(modal);
        

    document.getElementById('close-folder-contents').addEventListener('click', () => 
    {
        modal.remove();
    });
        

    modal.addEventListener('click', (e) => 
    {
        if (e.target === modal) 
        {
            modal.remove();
        }
    });
}

DesktopGame.prototype.closeScreenshotModal = function() 
{
    const modal = document.getElementById('screenshot-modal');
    modal.style.display = 'none';
}

DesktopGame.prototype.showSummaryModal = function(results) 
{
    const modal = document.getElementById('summary-modal');
        
        
    document.getElementById('grade-number').textContent = results.percentage;
    document.getElementById('grade-letter').textContent = results.letterGrade;
        
        
    const gradeNumber = document.querySelector('.grade-number');
    const gradeLetter = document.querySelector('.grade-letter');
        
    if (results.percentage >= 80) 
    {
        gradeNumber.style.color = '#4CAF50';
        gradeLetter.style.color = '#4CAF50';
    } 
    else if (results.percentage >= 60) 
    {
        gradeNumber.style.color = '#FF9800';
        gradeLetter.style.color = '#FF9800';
    } 
    else 
    {
        gradeNumber.style.color = '#f44336';
        gradeLetter.style.color = '#f44336';
    }
        
        
    const correctCountElement = document.getElementById('correct-count');
    const incorrectCountElement = document.getElementById('incorrect-count');
        
    correctCountElement.textContent = results.correct;
    correctCountElement.className = 'stat-count correct';
        
    incorrectCountElement.textContent = results.incorrect;
    incorrectCountElement.className = 'stat-count incorrect';
        
        
    const resultsList = document.getElementById('results-list');
    resultsList.innerHTML = '';
        
    results.results.forEach(result => 
    {
        const resultItem = document.createElement('div');
        resultItem.className = `result-item ${result.type}`;
        resultItem.innerHTML = `
            <span class="result-icon">${result.icon}</span>
            <div class="result-text">
                <div class="item-name">${result.name}</div>
                <div class="details">${result.details}</div>
            </div>
        `;
        resultsList.appendChild(resultItem);
    });
        
        
    modal.style.display = 'block';
}

DesktopGame.prototype.closeSummaryModal = function() 
{
    const modal = document.getElementById('summary-modal');
    modal.style.display = 'none';
}

DesktopGame.prototype.resetGame = function() 
{
    this.closeSummaryModal();
    this.closeTimeUpPopup(); 

    document.body.classList.add('show-intro');
        
    const introScreen = document.getElementById('intro-screen');
    const gameScreen = document.getElementById('game-screen');
        
    introScreen.style.display = 'flex';
    gameScreen.style.display = 'none';
        

    this.timeLeft = 90;
    this.updateTimerDisplay();
        

    this.selectRandomTargetLayout();
    this.createTargetScreenshot();
        

    const desktop = document.getElementById('desktop');
    const existingItems = desktop.querySelectorAll('.desktop-item');
    existingItems.forEach(item => item.remove());
        
    this.createInitialDesktopItems();
    this.createTrashIcon();
        

}

DesktopGame.prototype.showCannotDeleteFeedback = function()
 {
    const feedback = document.createElement('div');
    feedback.textContent = 'This item cannot be deleted';
    feedback.style.position = 'fixed';
    feedback.style.top = '50%';
    feedback.style.left = '50%';
    feedback.style.transform = 'translate(-50%, -50%)';
    feedback.style.background = 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)';
    feedback.style.color = 'white';
    feedback.style.padding = '16px 28px';
    feedback.style.borderRadius = '12px';
    feedback.style.fontSize = '15px';
    feedback.style.fontWeight = '500';
    feedback.style.zIndex = '10000';
    feedback.style.boxShadow = '0 6px 20px rgba(231, 76, 60, 0.4)';
    feedback.style.fontFamily = 'Roboto Condensed, sans-serif';
    feedback.style.letterSpacing = '0.2px';
    feedback.style.border = '1px solid rgba(255, 255, 255, 0.2)';
        
    document.body.appendChild(feedback);
        
    setTimeout(() => 
    {
        feedback.remove();
    }, 2000);
}

DesktopGame.prototype.showCannotRenameFeedback = function() 
{
    const feedback = document.createElement('div');
    feedback.textContent = 'System items cannot be renamed';
    feedback.style.position = 'fixed';
    feedback.style.top = '50%';
    feedback.style.left = '50%';
    feedback.style.transform = 'translate(-50%, -50%)';
    feedback.style.background = 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)';
    feedback.style.color = 'white';
    feedback.style.padding = '16px 28px';
    feedback.style.borderRadius = '12px';
    feedback.style.fontSize = '15px';
    feedback.style.fontWeight = '500';
    feedback.style.zIndex = '10000';
    feedback.style.boxShadow = '0 6px 20px rgba(255, 152, 0, 0.4)';
    feedback.style.fontFamily = 'Roboto Condensed, sans-serif';
    feedback.style.letterSpacing = '0.2px';
    feedback.style.border = '1px solid rgba(255, 255, 255, 0.2)';
        
    document.body.appendChild(feedback);
        
    setTimeout(() => 
    {
        feedback.remove();
    }, 2000);
}

DesktopGame.prototype.setupCreateIconModal = function() 
{
    const modal = this.createIconModal;
    const cancelBtn = document.getElementById('create-icon-cancel');
    const iconTypeGrid = document.getElementById('icon-type-grid');
        

    const iconTypes = [
        { type: 'folder', name: 'Folder' },
        { type: 'image', name: 'Image' },
        { type: 'textdoc', name: 'Text Doc' },
        { type: 'zip', name: 'ZIP' },
        { type: 'mp4', name: 'Video' }
    ];
        
    iconTypes.forEach(iconType => 
    {
        const option = document.createElement('div');
        option.className = 'icon-type-option';
        const iconData = this.getIconData(iconType.type);
        option.innerHTML = `
            <img src="${iconData.src}" alt="${iconType.name}">
            <span>${iconType.name}</span>
        `;
        option.addEventListener('click', () => 
        {
            this.createNewIcon(iconType.type);
            this.closeCreateIconModal();
        });
        iconTypeGrid.appendChild(option);
    });
        
    cancelBtn.addEventListener('click', () => 
    {
        this.closeCreateIconModal();
    });
        
    modal.addEventListener('click', (e) => 
    {
        if (e.target === modal) {
            this.closeCreateIconModal();
        }
    });
}

DesktopGame.prototype.openCreateIconModal = function(x, y) 
{
    this.longPressPosition = { x, y };
    this.createIconModal.style.display = 'block';
}

DesktopGame.prototype.closeCreateIconModal = function() 
{
    this.createIconModal.style.display = 'none';
}

DesktopGame.prototype.createNewIcon = function(type) 
{
    const desktop = document.getElementById('desktop');
    const rect = desktop.getBoundingClientRect();
        

    let x, y;
    if (this.longPressPosition.x && this.longPressPosition.y) 
    {
        x = this.longPressPosition.x;
        y = this.longPressPosition.y;
    } 
    else 
    {
        const position = this.findNextAvailablePosition(50, 200);
        if (position) {
            x = position.x + rect.left;
            y = position.y + rect.top;
        } 
        else 
        {
            x = rect.left + 50;
            y = rect.top + 200;
        }
    }
        
    const item = document.createElement('div');
    item.className = 'desktop-item';
    item.draggable = true;
    item.dataset.icon = type;
    item.id = `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
    const iconData = this.getIconData(type);
    let defaultName = `${iconData.name}${this.iconCounter}`;
        
    if (type === 'image') defaultName = `Photo${this.iconCounter}.jpg`;
    else if (type === 'textdoc') defaultName = `Document${this.iconCounter}.txt`;
    else if (type === 'zip') defaultName = `Archive${this.iconCounter}.zip`;
    else if (type === 'mp4') defaultName = `Video${this.iconCounter}.mp4`;
    else if (type === 'folder') defaultName = `Folder${this.iconCounter}`;
        
    this.iconCounter++;
        
    item.innerHTML = `
        <img src="${iconData.src}" alt="${defaultName}">
        <span class="editable">${defaultName}</span>
    `;
        
    const relativeX = x - rect.left;
    const relativeY = y - rect.top;
    item.style.position = 'absolute';
    item.style.left = `${relativeX}px`;
    item.style.top = `${relativeY}px`;
        
    this.makeDraggable(item, 'desktop');
    desktop.appendChild(item);
        

    this.draggedElement = item;
    this.moveToNearestGridPosition(x, y);
    this.draggedElement = null;
        

    if (type === 'folder') 
    {
        this.folders.set(item.id, []);
    }
}

DesktopGame.prototype.setupHelpPanel = function() 
{
    const helpPanel = document.getElementById('help-panel');
    const helpToggleBtn = document.getElementById('help-toggle-btn');
    const closeHelpBtn = document.getElementById('close-help-btn');
        

    helpToggleBtn.addEventListener('click', () => 
    {
        this.toggleHelpPanel();
    });
        
    closeHelpBtn.addEventListener('click', () => 
    {
        this.hideHelpPanel();
    });
}

DesktopGame.prototype.toggleHelpPanel = function() 
{
    const helpPanel = document.getElementById('help-panel');
        
    if (helpPanel.style.display === 'block') 
    {
        helpPanel.style.display = 'none';
    } 
    else 
    {
        helpPanel.style.display = 'block';
    }
}

DesktopGame.prototype.hideHelpPanel = function() 
{
    const helpPanel = document.getElementById('help-panel');
    helpPanel.style.display = 'none';
}

DesktopGame.prototype.openRenameModal = function(item) 
{
    this.currentRenamingItem = item;
    const currentName = item.querySelector('span').textContent;
    this.renameInput.value = currentName;
    this.renameInput.select();
    this.renameModal.style.display = 'block';
    this.renameInput.focus();
}

DesktopGame.prototype.closeRenameModal = function() 
{
    this.renameModal.style.display = 'none';
    this.currentRenamingItem = null;
    this.renameInput.value = '';
}

DesktopGame.prototype.confirmRename = function() 
{
    if (this.currentRenamingItem && this.renameInput.value.trim()) 
    {
        const span = this.currentRenamingItem.querySelector('span');
        span.textContent = this.renameInput.value.trim();
        this.closeRenameModal();
    }
}

