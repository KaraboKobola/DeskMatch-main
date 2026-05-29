// main entry point that creates the desktop game instance and handles initialization
class DesktopGame 
{
    constructor() 
    {
        this.draggedElement = null;
        this.dragOffset = { x: 0, y: 0 };
        this.renameModal = document.getElementById('rename-modal');
        this.renameInput = document.getElementById('rename-input');
        this.renameConfirm = document.getElementById('rename-confirm');
        this.renameCancel = document.getElementById('rename-cancel');
        this.currentRenamingItem = null;
        this.selectedItems = [];
        this.currentEditingItem = null;
        this.timer = null;
        this.timeLeft = 90;
        this.moveMode = false;
        this.longPressTimer = null;
        this.longPressPosition = { x: 0, y: 0 };
        this.createIconModal = document.getElementById('create-icon-modal');
        this.folderViewModal = document.getElementById('folder-view-modal');
        this.folders = new Map();
        this.currentOpenFolder = null;
        this.iconCounter = 1;
        this.dragOverItem = null;
        this.groupButton = null;
        this.ungroupButton = null;
        this.selectedFolderItems = [];
        this.draggedFromFolder = null;
        this.recognition = null;
        this.isListening = false;
        this.voiceFeedback = null;
        this.selectedTargetLayout = null;
        this.keyboardFocusedItem = null;
        this.keyboardNavigationMode = false;
        
        this.init();
    }

    init() 
    {
        document.body.classList.add('show-intro');
        
        this.setupIntroScreen();
        this.setupDragAndDrop();
        this.setupRenameModal();
        this.setupTrashCan();
        this.setupGameControls();
        this.setupKeyboardShortcuts();
        this.setupLongPress();
        this.setupCreateIconModal();
        this.setupFolderViewModal();
        this.setupHelpPanel();
        this.setupVoiceControl();
        this.createGroupButton();
        this.createUngroupButton();
        this.createVoiceButton();
        this.selectRandomTargetLayout();
        this.createTargetScreenshot();
        this.createInitialDesktopItems();
        this.createTrashIcon();
    }
}

document.addEventListener('DOMContentLoaded', () => 
{
    new DesktopGame();
});

document.addEventListener('DOMContentLoaded', () => 
{
    document.addEventListener('mouseover', (e) => 
    {
        if (e.target.closest('.desktop-item')) 
        {
            e.target.closest('.desktop-item').style.transform = 'scale(1.05)';
        }
    });
    
    document.addEventListener('mouseout', (e) => 
    {
        if (e.target.closest('.desktop-item')) 
        {
            const item = e.target.closest('.desktop-item');
            if (!item.classList.contains('dragging')) 
            {
                item.style.transform = 'scale(1)';
            }
        }
    });
});
