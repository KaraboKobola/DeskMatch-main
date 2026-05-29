// manages the game timer and handles game ending when time runs out
DesktopGame.prototype.startTimer = function()
{
    this.timer = setInterval(() =>
    {
        this.timeLeft--;
        this.updateTimerDisplay();
            
        if (this.timeLeft <= 0) 
        {
            this.endGame();
        }
    }, 1000);
}

DesktopGame.prototype.updateTimerDisplay = function() 
{
    const timerElement = document.getElementById('timer');
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
    timerElement.textContent = timeString;
        
        
    timerElement.style.animation = 'none';
    timerElement.offsetHeight; 
    timerElement.style.animation = 'timerPulse 1s ease-in-out';
        
        

    timerElement.classList.remove('warning', 'danger');
    if (this.timeLeft <= 30) 
    {

        timerElement.classList.add('danger');
    } 
    else if (this.timeLeft <= 60) 
    {
        timerElement.classList.add('warning');
    }

}

DesktopGame.prototype.endGame = function() 
{
    if (this.timer) 
    {
        clearInterval(this.timer);
        this.timer = null;
    }
        
        
    if (this.timeLeft <= 0) 
    {
        this.showTimeUpPopup();
    } 
    else 
    {     
        const results = this.calculateDetailedResults();
        this.showSummaryModal(results);
    }
}

DesktopGame.prototype.showTimeUpPopup = function() 
{
    const timeUpModal = document.getElementById('timeup-modal');
    timeUpModal.style.display = 'block';
}

DesktopGame.prototype.hideTimeUpPopup = function() 
{
    const timeUpModal = document.getElementById('timeup-modal');
    timeUpModal.style.display = 'none';
        
        
    const results = this.calculateDetailedResults();
    this.showSummaryModal(results);
}

DesktopGame.prototype.closeTimeUpPopup = function() 
{
    const timeUpModal = document.getElementById('timeup-modal');
    timeUpModal.style.display = 'none';
}

