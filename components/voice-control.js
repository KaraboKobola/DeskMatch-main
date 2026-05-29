// voice control functionality that processes voice commands to interact with desktop items
DesktopGame.prototype.setupVoiceControl = function() 
{
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
    if (!SpeechRecognition) 
    {
        console.log('Speech recognition not supported');
        return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US';

    this.recognition.onresult = (event) => 
    {
        const last = event.results.length - 1;
        const command = event.results[last][0].transcript.toLowerCase().trim();
            
        this.showVoiceFeedback(`Heard: "${command}"`);
        this.processVoiceCommand(command);
    };

    this.recognition.onerror = (event) => 
    {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'no-speech') 
        {
            this.showVoiceFeedback('No speech detected. Try again.', 'warning');
        } 
        else if (event.error === 'not-allowed') 
        {
            this.showVoiceFeedback('Microphone access denied', 'error');
            this.stopListening();
        }
    };

    this.recognition.onend = () => 
    {
        if (this.isListening) 
        {
            this.recognition.start();
        }
    };
}

DesktopGame.prototype.createVoiceButton = function() 
{
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const isSupported = !!SpeechRecognition;
        
    const voiceBtn = document.createElement('button');
    voiceBtn.id = 'voice-btn';
    voiceBtn.innerHTML = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
        <line x1="12" y1="19" x2="12" y2="23"></line>
        <line x1="8" y1="23" x2="16" y2="23"></line>
    </svg>`;
    voiceBtn.title = isSupported ? 'Click to start voice control' : 'Voice control not available in this browser';
        

    const bgGradient = isSupported 
        ? 'linear-gradient(135deg, #667eea 0%, #5568d3 100%)' 
        : 'linear-gradient(135deg, #999999 0%, #7a7a7a 100%)';
    const cursor = isSupported ? 'pointer' : 'not-allowed';
    const border = isSupported 
        ? '1px solid rgba(102, 126, 234, 0.3)' 
        : '1px solid rgba(153, 153, 153, 0.3)';
        
    voiceBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        width: 60px;
        height: 60px;
        background: ${bgGradient};
        color: white;
        border: ${border};
        border-radius: 50%;
        cursor: ${cursor};
        box-shadow: 0 4px 12px ${isSupported ? 'rgba(102, 126, 234, 0.3)' : 'rgba(0, 0, 0, 0.2)'};
        z-index: 100;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        font-family: 'Roboto Condensed', 'Inter', sans-serif;
        opacity: ${isSupported ? '1' : '0.6'};
        display: flex;
        align-items: center;
        justify-content: center;
    `;
        
    if (isSupported) 
    {
        voiceBtn.addEventListener('mouseenter', () => 
        {
            if (!this.isListening)
             {
                voiceBtn.style.transform = 'translateY(-2px) scale(1.05)';
                voiceBtn.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
                voiceBtn.style.background = 'linear-gradient(135deg, #7e8ff0 0%, #667eea 100%)';
            }
        });
            
        voiceBtn.addEventListener('mouseleave', () => 
        {
            if (!this.isListening) 
            {
                voiceBtn.style.transform = 'scale(1)';
                voiceBtn.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                voiceBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #5568d3 100%)';
            }
        });
            
        voiceBtn.addEventListener('click', () => 
        {
            this.toggleVoiceControl(voiceBtn);
        });
    } 
    else 
    {
        voiceBtn.addEventListener('click', () =>
        {
            this.showVoiceFeedback('Voice control not supported in this browser. Try Chrome or Safari.', 'error');
        });
    }
        
    document.body.appendChild(voiceBtn);
}

DesktopGame.prototype.toggleVoiceControl = function(button) 
{
    if (!this.recognition) 
    {
        this.showVoiceFeedback('Voice control not supported in this browser', 'error');
        return;
    }

    if (this.isListening)
    {
        this.stopListening(button);
    } 
    else 
    {
        this.startListening(button);
    }
}

DesktopGame.prototype.startListening = function(button) 
{
    try 
    {
        this.recognition.start();
        this.isListening = true;
        button.style.background = 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)';
        button.style.borderColor = 'rgba(231, 76, 60, 0.4)';
        button.style.animation = 'pulse 1s infinite';
        button.style.transform = 'scale(1.05)';
        button.style.boxShadow = '0 6px 20px rgba(231, 76, 60, 0.4)';
        this.showVoiceFeedback('Listening... Say a command', 'success');
    } 
    catch (error) 
    {
        console.error('Error starting recognition:', error);
        this.showVoiceFeedback(`Error: ${error.message}. Check browser permissions.`, 'error');
    }
}

DesktopGame.prototype.stopListening = function(button) 
{
    if (button) 
    {
        this.recognition.stop();
        this.isListening = false;
        button.style.background = 'linear-gradient(135deg, #667eea 0%, #5568d3 100%)';
        button.style.borderColor = 'rgba(102, 126, 234, 0.4)';
        button.style.animation = 'none';
        button.style.transform = 'scale(1)';
        button.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
        this.showVoiceFeedback('Voice control stopped', 'info');
    }
}

DesktopGame.prototype.showVoiceFeedback = function(message, type = 'info') 
{
    if (this.voiceFeedback) 
    {
        this.voiceFeedback.remove();
    }

    const feedback = document.createElement('div');
    feedback.textContent = message;
        
    let bgColor = 'rgba(33, 150, 243, 0.9)';
    if (type === 'success') bgColor = 'rgba(76, 175, 80, 0.9)';
    if (type === 'error') bgColor = 'rgba(244, 67, 54, 0.9)';
    if (type === 'warning') bgColor = 'rgba(255, 152, 0, 0.9)';
        
    feedback.style.cssText = `
        position: fixed;
        bottom: 160px;
        left: 20px;
        background: ${bgColor};
        color: white;
        padding: 12px 18px;
        border-radius: 10px;
        font-size: 13px;
        font-weight: 500;
        z-index: 10000;
        box-shadow: 0 4px 16px rgba(0,0,0,0.25);
        font-family: 'Roboto Condensed', 'Inter', sans-serif;
        max-width: 280px;
        word-wrap: break-word;
        letter-spacing: 0.2px;
        border: 1px solid rgba(255, 255, 255, 0.2);
    `;
        
    this.voiceFeedback = feedback;
    document.body.appendChild(feedback);
        
    setTimeout(() => 
    {
        if (this.voiceFeedback === feedback) 
        {
            feedback.remove();
            this.voiceFeedback = null;
        }
    }, 3000);
}

DesktopGame.prototype.processVoiceCommand = function(command) 
{
    const desktop = document.getElementById('desktop');
    const allItems = Array.from(desktop.querySelectorAll('.desktop-item:not(.trash-item)'));
    if (command.includes('shift select') || command.includes('shift-select')) 
    {
        const itemName = command.replace(/shift[- ]?select/gi, '').trim();
        const item = this.findItemByName(itemName, allItems);
        if (item) 
        {
            if (!this.selectedItems.includes(item))
            {
                this.selectedItems.push(item);
                item.classList.add('selected');
                this.updateGroupButton();
                this.showVoiceFeedback(`Added ${item.querySelector('span').textContent} to selection`, 'success');
            } 
            else 
            {
                this.showVoiceFeedback(`${item.querySelector('span').textContent} already selected`, 'info');
            }
        } 
        else 
        {
            this.showVoiceFeedback(`Item "${itemName}" not found`, 'error');
        }
        return;
    }
    if (command.includes('select')) 
    {
        const itemName = command.replace('select', '').trim();
        const item = this.findItemByName(itemName, allItems);
        if (item) 
        {
            this.selectSingleItem(item);
            this.showVoiceFeedback(`Selected ${item.querySelector('span').textContent}`, 'success');
        } 
        else 
        {
            this.showVoiceFeedback(`Item "${itemName}" not found`, 'error');
        }
        return;
    }
    if (command.includes('delete') || command.includes('remove')) 
    {
        if (this.selectedItems.length > 0) 
        {
            const item = this.selectedItems[0];
            const itemType = item.dataset.icon;
            const deletableTypes = ['folder', 'image', 'textdoc', 'zip', 'mp4'];
                
            if (deletableTypes.includes(itemType)) 
            {
                this.deleteItem(item);
                this.showVoiceFeedback('Item deleted', 'success');
            } 
            else 
            {
                this.showVoiceFeedback('Cannot delete system items', 'error');
            }
        } 
        else 
        {
            this.showVoiceFeedback('No item selected', 'warning');
        }
        return;
    }
    if (command.includes('group') || command.includes('create folder')) 
    {
        if (this.selectedItems.length >= 2) 
        {
            this.groupSelectedItems();
            this.showVoiceFeedback('Folder created', 'success');
        } 
        else 
        {
            this.showVoiceFeedback('Select 2 or more items first', 'warning');
        }
        return;
    }
    if (command.includes('rename to')) 
    {
        const newName = command.split('rename to')[1].trim();
        if (this.selectedItems.length === 1 && newName) 
        {
            const item = this.selectedItems[0];
            const systemTypes = ['internet', 'printer', 'settings', 'trash'];
            if (!systemTypes.includes(item.dataset.icon)) {
                item.querySelector('span').textContent = newName;
                this.showVoiceFeedback(`Renamed to ${newName}`, 'success');
            } 
            else 
            {
                this.showVoiceFeedback('Cannot rename system items', 'error');
            }
        } 
        else 
        {
            this.showVoiceFeedback('Select one item first', 'warning');
        }
        return;
    }
    if (command.includes('move up') || command.includes('move down') || 
        command.includes('move left') || command.includes('move right')) 
    {
        if (this.selectedItems.length === 1) 
        {
            const item = this.selectedItems[0];
            const currentX = parseInt(item.style.left) || 0;
            const currentY = parseInt(item.style.top) || 0;
            const cellWidth = 150;
            const cellHeight = 150;

            if (command.includes('move up')) 
            {
                item.style.top = Math.max(50, currentY - cellHeight) + 'px';
            }
            else if (command.includes('move down')) 
            {
                item.style.top = (currentY + cellHeight) + 'px';
            } 
            else if (command.includes('move left'))
            {
                item.style.left = Math.max(50, currentX - cellWidth) + 'px';
            } 
            else if (command.includes('move right')) 
            {
                item.style.left = (currentX + cellWidth) + 'px';
            }
            this.showVoiceFeedback('Item moved', 'success');
        } 
        else 
        {
            this.showVoiceFeedback('Select one item first', 'warning');
        }
        return;
    }
    if (command.includes('create') && !command.includes('folder')) 
    {
        const types = ['image', 'text', 'zip', 'video', 'folder'];
        const foundType = types.find(type => command.includes(type));
            
        if (foundType) 
        {
            let iconType = foundType;
            if (foundType === 'text') iconType = 'textdoc';
            if (foundType === 'video') iconType = 'mp4';
                
            this.createNewIcon(iconType);
            this.showVoiceFeedback(`Created ${foundType}`, 'success');
        } 
        else 
        {
            this.showVoiceFeedback('Unknown item type', 'warning');
        }
        return;
    }
    if (command.includes('help') || command.includes('commands')) 
    {
        this.toggleHelpPanel();
        this.showVoiceFeedback('Showing help', 'info');
        return;
    }
    if (command.includes('deselect') || command.includes('clear selection')) 
    {
        this.deselectAll();
        this.showVoiceFeedback('Selection cleared', 'success');
        return;
    }
    this.showVoiceFeedback('Command not recognized. Say "help" for available commands.', 'warning');
}

DesktopGame.prototype.convertNumberWordsToDigits = function(text)
{
    const numberWords = 
    {
        'zero': '0', 'one': '1', 'two': '2', 'three': '3', 'four': '4',
        'five': '5', 'six': '6', 'seven': '7', 'eight': '8', 'nine': '9',
        'ten': '10', 'eleven': '11', 'twelve': '12', 'thirteen': '13',
        'fourteen': '14', 'fifteen': '15', 'sixteen': '16', 'seventeen': '17',
        'eighteen': '18', 'nineteen': '19', 'twenty': '20'
    };
        
    let converted = text.toLowerCase();

    for (const [word, digit] of Object.entries(numberWords)) 
    {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        converted = converted.replace(regex, digit);
    }
    return converted;
}

DesktopGame.prototype.normalizeForMatching = function(text) 
{
    let normalized = text.toLowerCase().replace(/\.(jpg|jpeg|png|gif|txt|doc|zip|rar|mp4|mov|avi)$/gi, '');

    normalized = this.convertNumberWordsToDigits(normalized);

    normalized = normalized.replace(/\s+/g, '').replace(/[^a-z0-9]/gi, '');
    return normalized;
}

DesktopGame.prototype.findItemByName = function(name, items) 
{
    const normalizedSearch = this.normalizeForMatching(name);
        
    return items.find(item => 
    {
        const itemName = item.querySelector('span').textContent;

        const normalizedItemName = this.normalizeForMatching(itemName);
            

        return normalizedItemName.includes(normalizedSearch) || 
               normalizedSearch.includes(normalizedItemName) ||
               normalizedItemName === normalizedSearch;
    });
}

