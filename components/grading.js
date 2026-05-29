// calculates game results by comparing player layout with target layout and assigns grades
DesktopGame.prototype.calculateDetailedResults = function() 
{
    const desktop = document.getElementById('desktop');
    const allItems = Array.from(desktop.querySelectorAll('.desktop-item'));
        

    const targetLayout = this.selectedTargetLayout.grading;
        
    let correctCount = 0;
    let incorrectCount = 0;
    let totalScore = 0;
    const results = [];
        
        
    targetLayout.forEach((target, index) => 
    {
        const foundItem = allItems.find(item => 
        {
            const itemX = parseInt(item.style.left) || 0;
            const itemY = parseInt(item.style.top) || 0;
            const itemType = item.dataset.icon;
            const itemName = item.querySelector('span').textContent;
                
                
            const positionMatch = Math.abs(itemX - target.x) < 20 && Math.abs(itemY - target.y) < 20;
                
            const typeMatch = itemType === target.type;
                
            const nameMatch = itemName === target.name;
                
            return positionMatch && typeMatch && nameMatch;
        });
            
        if (foundItem) 
        {

            if (target.contents && target.type === 'folder') 
            {
                const folderContents = this.folders.get(foundItem.id) || [];
                const contentsMatch = this.checkFolderContents(folderContents, target.contents);
                    
                if (contentsMatch.isCorrect) 
                {
                    correctCount++;
                    totalScore += 1;
                    results.push
                    ({
                        type: 'correct',
                        icon: '✓',
                        name: target.name,
                        details: `Contains ${target.contents.length} items correctly`
                    });
                } 
                else 
                {
                    incorrectCount++;
                    results.push
                    ({
                        type: 'incorrect',
                        icon: '✗',
                        name: target.name,
                        details: contentsMatch.error
                    });
                }
            } 
            else
            {

                correctCount++;
                totalScore += 1;
                results.push
                ({
                    type: 'correct',
                    icon: '✓',
                    name: target.name,
                    details: ''
                });
            }
        } 
        else 
        {   
            incorrectCount++;
                
            const exactMatch = allItems.find(item => 
            {
                const itemName = item.querySelector('span').textContent;
                const itemType = item.dataset.icon;
                const itemX = parseInt(item.style.left) || 0;
                const itemY = parseInt(item.style.top) || 0;
                return itemName === target.name && itemType === target.type && Math.abs(itemX - target.x) < 20 && Math.abs(itemY - target.y) < 20;
            });
                
            const nameMatch = allItems.find(item => 
            {
                const itemName = item.querySelector('span').textContent;
                return itemName === target.name;
            });
                
            const typeMatch = allItems.find(item => 
            {
                const itemType = item.dataset.icon;
                return itemType === target.type;
            });
                
            const positionMatch = allItems.find(item => 
            {
                const itemX = parseInt(item.style.left) || 0;
                const itemY = parseInt(item.style.top) || 0;
                return Math.abs(itemX - target.x) < 20 && Math.abs(itemY - target.y) < 20;
            });
                
            console.log(`Checking ${target.name}: nameMatch=${!!nameMatch}, typeMatch=${!!typeMatch}, positionMatch=${!!positionMatch}`);
                
            let problemDetails = [];
            let errorType = 'incorrect';
                

            if (!nameMatch && !typeMatch && !positionMatch) 
            {
                problemDetails.push("This item was deleted");
                errorType = 'deleted';
            } 
            else 
            {

                const hasCorrectName = !!nameMatch;
                const hasCorrectType = !!typeMatch;
                const hasCorrectPosition = !!positionMatch;
                    

                const correctNameWrongPosition = allItems.find(item => 
                {
                    const itemName = item.querySelector('span').textContent;
                    const itemType = item.dataset.icon;
                    const itemX = parseInt(item.style.left) || 0;
                    const itemY = parseInt(item.style.top) || 0;
                    return itemName === target.name && (itemType !== target.type || Math.abs(itemX - target.x) >= 20 || Math.abs(itemY - target.y) >= 20);
                });
                    

                const correctTypeWrongName = allItems.find(item => 
                {
                    const itemName = item.querySelector('span').textContent;
                    const itemType = item.dataset.icon;
                    const itemX = parseInt(item.style.left) || 0;
                    const itemY = parseInt(item.style.top) || 0;
                    return itemType === target.type && (itemName !== target.name || Math.abs(itemX - target.x) >= 20 || Math.abs(itemY - target.y) >= 20);
                });
                    

                const correctPositionWrongName = allItems.find(item => 
                {
                    const itemName = item.querySelector('span').textContent;
                    const itemType = item.dataset.icon;
                    const itemX = parseInt(item.style.left) || 0;
                    const itemY = parseInt(item.style.top) || 0;
                    return Math.abs(itemX - target.x) < 20 && Math.abs(itemY - target.y) < 20 && (itemName !== target.name || itemType !== target.type);
                });
                    

                if (correctNameWrongPosition) 
                {
                    if (correctNameWrongPosition.dataset.icon !== target.type) 
                    {
                        problemDetails.push("The item name is correct but it's the wrong type of file");
                    }
                    if (Math.abs(parseInt(correctNameWrongPosition.style.left) - target.x) >= 20 || Math.abs(parseInt(correctNameWrongPosition.style.top) - target.y) >= 20) {
                        problemDetails.push("The item is not placed in the correct position");
                    }
                } 
                else if (correctTypeWrongName) 
                {
                    if (correctTypeWrongName.querySelector('span').textContent !== target.name) 
                    {
                        problemDetails.push("The item name is wrong");
                    }
                    if (Math.abs(parseInt(correctTypeWrongName.style.left) - target.x) >= 20 || Math.abs(parseInt(correctTypeWrongName.style.top) - target.y) >= 20) {
                        problemDetails.push("The item is not placed in the correct position");
                    }
                } 
                else if (correctPositionWrongName) 
                {
                    if (correctPositionWrongName.querySelector('span').textContent !== target.name) 
                    {
                        problemDetails.push("The item name is wrong");
                    }
                    if (correctPositionWrongName.dataset.icon !== target.type) 
                    {
                        problemDetails.push("The item was probably deleted");
                    }
                } 
                else 
                {
                    if (!hasCorrectName) 
                    {
                        problemDetails.push("The item name is wrong");
                    }
                    if (!hasCorrectPosition) 
                    {
                        problemDetails.push("The item is not placed in the correct position");
                    }
                    if (!hasCorrectType) 
                    {
                        problemDetails.push("The item was probably deleted");
                    }
                }
            }
                
            console.log(`Item: ${target.name}, Problems: ${problemDetails.join(", ")}`);
                
            results.push
            ({
                type: errorType,
                icon: errorType === 'deleted' ? '🗑️' : '✗',
                name: target.name,
                details: problemDetails.length > 0 ? problemDetails.join("; ") : "Unknown error"
            });
        }
    });
        
        
    const totalPossible = targetLayout.length;
    const percentage = Math.round((totalScore / totalPossible) * 100);
    const letterGrade = this.getLetterGrade(percentage);
        
    return {
        correct: correctCount,
        incorrect: incorrectCount,
        percentage: percentage,
        letterGrade: letterGrade,
        results: results,
        totalScore: totalScore,
        totalPossible: totalPossible
    };
}

DesktopGame.prototype.getLetterGrade = function(percentage) 
{
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C+';
    if (percentage >= 40) return 'C';
    if (percentage >= 30) return 'D+';
    if (percentage >= 20) return 'D';
    return 'F';
}

DesktopGame.prototype.checkFolderContents = function(actualContents, expectedContents) 
{

    if (actualContents.length !== expectedContents.length)
    {
        return {
            isCorrect: false,
            error: `Folder should contain ${expectedContents.length} items, but contains ${actualContents.length}`
        };
    }
    const missingItems = [];
    const wrongItems = [];

    for (const expected of expectedContents) 
    {
        const found = actualContents.find(actual => 
            actual.type === expected.type && actual.name === expected.name
        );
            
        if (!found) {
            missingItems.push(expected.name);
        }
    }
    for (const actual of actualContents) 
    {
        const shouldExist = expectedContents.find(expected => 
            expected.type === actual.type && expected.name === actual.name
        );
            
        if (!shouldExist) {
            wrongItems.push(actual.name);
        }
    }

    if (missingItems.length > 0 || wrongItems.length > 0) 
    {
        let errorMsg = '';
        if (missingItems.length > 0) 
        {
            errorMsg += `Missing: ${missingItems.join(', ')}`;
        }
        if (wrongItems.length > 0) 
        {
            if (errorMsg) errorMsg += '; ';
            errorMsg += `Should not contain: ${wrongItems.join(', ')}`;
        }
        return  {
            isCorrect: false,
            error: errorMsg
        };
    }

    return {
        isCorrect: true,
        error: ''
    };
}

