// core game functionality including intro screen, desktop item management, and game controls
DesktopGame.prototype.setupIntroScreen = function() 
{
    const startGameBtn = document.getElementById('start-game-btn');
    startGameBtn.addEventListener('click', () => {
        this.startGame();
    });
};

DesktopGame.prototype.startGame = function() 
{
    document.body.classList.remove('show-intro');
    
    const introScreen = document.getElementById('intro-screen');
    introScreen.style.display = 'none';
    
    const gameScreen = document.getElementById('game-screen');
    gameScreen.style.display = 'flex';
    
    this.startTimer();
};

DesktopGame.prototype.getIconData = function(type) 
{
    const iconMap = 
    {
        'folder': { src: 'assets/folder-icon.png', name: 'Folder' },
        'image': { src: 'assets/image-icon.png', name: 'Image' },
        'internet': { src: 'assets/internet-icon.png', name: 'Internet' },
        'mp4': { src: 'assets/mp4-icon.png', name: 'MP4' },
        'printer': { src: 'assets/printerapp-icon.png', name: 'Printer' },
        'settings': { src: 'assets/settings-icon.png', name: 'Settings' },
        'textdoc': { src: 'assets/textdoc-icon.png', name: 'Text Doc' },
        'zip': { src: 'assets/zip-icon.png', name: 'ZIP' }
    };
    
    return iconMap[type] || { src: 'assets/folder-icon.png', name: 'Unknown' };
};

DesktopGame.prototype.deleteItem = function(element) 
{
    if (element.dataset.icon === 'folder' && element.id) 
    {
        this.folders.delete(element.id);
    }
    
    element.style.transition = 'all 0.3s ease';
    element.style.transform = 'scale(0)';
    element.style.opacity = '0';
    
    setTimeout(() => 
    {
        element.remove();
    }, 300);
};

DesktopGame.prototype.setupTrashCan = function() 
{
    const trashItem = document.querySelector('.trash-item');
    if (trashItem) 
    {
        trashItem.addEventListener('dragover', (e) => 
        {
            e.preventDefault();
            trashItem.classList.add('drag-over');
        });
        
        trashItem.addEventListener('dragleave', (e) => 
        {
            if (!trashItem.contains(e.relatedTarget)) 
            {
                trashItem.classList.remove('drag-over');
            }
        });
        
        trashItem.addEventListener('mouseout', () => 
        {
            setTimeout(() => {
                if (!trashItem.matches(':hover')) {
                    trashItem.classList.remove('drag-over');
        }
            }, 50);
        });
    }
};

//DesktopGame.prototype.setupLongPress = function() {
//};

DesktopGame.prototype.setupGameControls = function() 
{
    const endBtn = document.getElementById('end-btn');
    endBtn.addEventListener('click', () => 
    {
        this.endGame();
    });

    const targetScreenshot = document.getElementById('target-screenshot');
    const screenshotModal = document.getElementById('screenshot-modal');
    const closeBtn = document.getElementById('close-screenshot');
    
    targetScreenshot.addEventListener('click', () => 
    {
        this.openScreenshotModal();
    });
    
    closeBtn.addEventListener('click', () => 
    {
        this.closeScreenshotModal();
    });
    
    screenshotModal.addEventListener('click', (e) => 
    {
        if (e.target === screenshotModal) {
            this.closeScreenshotModal();
        }
    });

    const summaryModal = document.getElementById('summary-modal');
    const playAgainBtn = document.getElementById('play-again-btn');
    
    playAgainBtn.addEventListener('click', () => {
        this.resetGame();
    });

    const showResultsBtn = document.getElementById('show-results-btn');
    
    showResultsBtn.addEventListener('click', () => 
    {
        this.hideTimeUpPopup();
    });
};

//DesktopGame.prototype.setupRenameModal = function() {
//};

DesktopGame.prototype.shuffleArray = function(array) 
{
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) 
    {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

DesktopGame.prototype.hasGaps = function() 
{
    const desktop = document.getElementById('desktop');
    const allItems = Array.from(desktop.querySelectorAll('.desktop-item'));
    
    const systemItems = allItems.filter(item => 
    {
        const type = item.dataset.icon;
        return ['internet', 'printer', 'settings'].includes(type);
    });
    
    const userItems = allItems.filter(item => 
    {
        const type = item.dataset.icon;
        return !['internet', 'printer', 'settings'].includes(type);
    });
    
    if (userItems.length === 0) return false;
    
    const positions = userItems.map(item => ({
        x: parseInt(item.style.left) || 0,
        y: parseInt(item.style.top) || 0
    }));
    
    positions.sort((a, b) => 
    {
        if (a.y !== b.y) return a.y - b.y;
        return a.x - b.x;
    });
    
    const cellWidth = 150;
    const cellHeight = 150;
    const startX = 50;
    const startY = 200;
    
    if (positions.length < 2) return false;
    
    const firstPos = positions[0];
    const lastPos = positions[positions.length - 1];
    
    const expectedPositions = [];
    let currentRow = Math.round((firstPos.y - startY) / cellHeight);
    let currentCol = Math.round((firstPos.x - startX) / cellWidth);
    
    for (let i = 0; i < positions.length; i++) 
    {
        expectedPositions.push({
            x: startX + (currentCol * cellWidth),
            y: startY + (currentRow * cellHeight)
        });
        
        currentCol++;
        if (currentCol >= 4) {
            currentCol = 0;
            currentRow++;
        }
    }
    
    for (let i = 0; i < positions.length; i++) 
    {
        const actual = positions[i];
        const expected = expectedPositions[i];
        
        if (Math.abs(actual.x - expected.x) > 5 || Math.abs(actual.y - expected.y) > 5) {
            return true;
        }
    }
    
    return false;
};

DesktopGame.prototype.reorganizeDesktop = function() 
{
    const desktop = document.getElementById('desktop');
    const allItems = Array.from(desktop.querySelectorAll('.desktop-item'));
    
    const systemItems = allItems.filter(item => 
    {
        const type = item.dataset.icon;
        return ['internet', 'printer', 'settings'].includes(type);
    });
    
    const userItems = allItems.filter(item => 
    {
        const type = item.dataset.icon;
        return !['internet', 'printer', 'settings'].includes(type);
    });
    
    const systemPositions = [
        { x: 50, y: 50 },
        { x: 200, y: 50 },
        { x: 350, y: 50 }
    ];
    
    systemItems.forEach((item, index) => 
    {
        if (index < systemPositions.length) 
        {
            const pos = systemPositions[index];
            item.style.transition = 'all 0.5s ease';
            item.style.left = `${pos.x}px`;
            item.style.top = `${pos.y}px`;
        }
    });
    
    const userItemsCount = userItems.length;
    const cellWidth = 150;
    const cellHeight = 150;
    const startX = 50;
    const startY = 200;
    
    let bestCols = 1;
    let bestRows = userItemsCount;
    let bestScore = Math.abs(1 - userItemsCount);
    
    for (let cols = 1; cols <= userItemsCount; cols++) 
    {
        const rows = Math.ceil(userItemsCount / cols);
        const score = Math.abs(cols - rows);
        
        if (score < bestScore) 
        {
            bestScore = score;
            bestCols = cols;
            bestRows = rows;
        }
    }
    
    userItems.forEach((item, index) => 
    {
        const row = Math.floor(index / bestCols);
        const col = index % bestCols;
        
        const x = startX + (col * cellWidth);
        const y = startY + (row * cellHeight);
        
        item.style.transition = 'all 0.5s ease';
        item.style.left = `${x}px`;
        item.style.top = `${y}px`;
    });
};

DesktopGame.prototype.createInitialDesktopItems = function() 
{
    const desktop = document.getElementById('desktop');
    
    const userFiles = [
        { type: 'folder', name: 'Documents' },
        { type: 'folder', name: 'Pictures' },
        { type: 'image', name: 'Photo1.jpg' },
        { type: 'image', name: 'Photo2.jpg' },
        { type: 'textdoc', name: 'Notes.txt' },
        { type: 'textdoc', name: 'Report.txt' },
        { type: 'zip', name: 'Archive1.zip' },
        { type: 'zip', name: 'Backup.zip' },
        { type: 'mp4', name: 'Video.mp4' }
    ];
    
    const systemIcons = this.selectedTargetLayout.grading
        .filter(item => ['internet', 'printer', 'settings'].includes(item.type))
        .map(item => ({
            type: item.type,
            name: item.name,
            x: item.x,
            y: item.y
        }));
    
    const shuffledUserFiles = this.shuffleArray([...userFiles]);
    
    const userFilePositions = [
        { x: 500, y: 50 },
        { x: 50, y: 200 },
        { x: 200, y: 200 },
        { x: 350, y: 200 },
        { x: 500, y: 200 },
        { x: 50, y: 350 },
        { x: 200, y: 350 },
        { x: 350, y: 350 },
        { x: 500, y: 350 }
    ];
    
    const userFilesWithPositions = shuffledUserFiles.map((file, index) => 
    ({
        ...file,
        x: userFilePositions[index].x,
        y: userFilePositions[index].y
    }));
    
    const icons = [...systemIcons, ...userFilesWithPositions];
    
    icons.forEach(iconData => 
    {
        const item = document.createElement('div');
        item.className = 'desktop-item';
        item.draggable = true;
        item.dataset.icon = iconData.type;
        item.id = `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        const iconData_obj = this.getIconData(iconData.type);
        item.innerHTML = `
            <img src="${iconData_obj.src}" alt="${iconData_obj.name}">
            <span class="editable">${iconData.name}</span>
        `;
        
        item.style.position = 'absolute';
        item.style.left = `${iconData.x}px`;
        item.style.top = `${iconData.y}px`;
        
        this.makeDraggable(item, 'desktop');
        
        desktop.appendChild(item);
        
        if (iconData.type === 'folder') {
            this.folders.set(item.id, []);
        }
    });
};

DesktopGame.prototype.createTrashIcon = function() 
{
    const desktop = document.getElementById('desktop');
    
    const trashItem = document.createElement('div');
    trashItem.className = 'trash-item';
    trashItem.innerHTML = `
        <img src="assets/trash-icon.png" alt="Trash">
        <span>Trash</span>
    `;
    
    desktop.appendChild(trashItem);
};

