document.addEventListener('DOMContentLoaded', function() {
    const nameInput = document.getElementById('nameInput');
    const teamCountInput = document.getElementById('teamCount');
    const teamNamesInput = document.getElementById('teamNames');
    const generateBtn = document.getElementById('generateBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const teamsContainer = document.getElementById('teamsContainer');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    // Initialize with sample data for testing
    nameInput.value = "John, Jane, Mike, Sarah, David, Emily, Robert, Lisa, James, Emma";
    
    generateBtn.addEventListener('click', generateTeams);
    clearBtn.addEventListener('click', clearAll);
    copyBtn.addEventListener('click', copyTeams);
    
    function generateTeams() {
        console.log("Generate button clicked"); // Debug log
        
        // Get input and split into array
        let input = nameInput.value.trim();
        
        if (!input) {
            showError("Please enter some names first!");
            return;
        }
        
        // Get number of teams
        const teamCount = parseInt(teamCountInput.value) || 2;
        if (teamCount < 2) {
            showError("Please enter at least 2 teams");
            return;
        }
        
        // Get custom team names if provided
        let teamNames = [];
        if (teamNamesInput.value.trim()) {
            teamNames = teamNamesInput.value.split(',').map(name => name.trim());
            // If not enough team names, fill the rest with "Team X"
            while (teamNames.length < teamCount) {
                teamNames.push(`Team ${teamNames.length + 1}`);
            }
        } else {
            // Default team names
            for (let i = 1; i <= teamCount; i++) {
                teamNames.push(`Team ${i}`);
            }
        }
        
        // Split by new lines or commas
        let names = input.split(/[\n,]+/);
        
        // Trim each name and filter out empty strings
        names = names.map(name => name.trim()).filter(name => name.length > 0);
        
        if (names.length < teamCount) {
            showError(`You need at least ${teamCount} names for ${teamCount} teams`);
            return;
        }
        
        // Shuffle the names array
        const shuffledNames = shuffleArray([...names]);
        console.log("Shuffled names:", shuffledNames); // Debug log
        
        // Create teams
        const teams = [];
        for (let i = 0; i < teamCount; i++) {
            teams.push({
                name: teamNames[i] || `Team ${i+1}`,
                members: []
            });
        }
        
        // Distribute names to teams
        shuffledNames.forEach((name, index) => {
            teams[index % teamCount].members.push(name);
        });
        
        console.log("Generated teams:", teams); // Debug log
        
        // Display teams
        displayTeams(teams);
    }
    
    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
    
    function displayTeams(teams) {
        console.log("Displaying teams:", teams); // Debug log
        teamsContainer.innerHTML = '';
        
        if (teams.length === 0) {
            teamsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-users-slash"></i>
                    <h3>No teams generated</h3>
                    <p>Try entering more names or reducing the number of teams</p>
                </div>
            `;
            return;
        }
        
        teams.forEach((team, index) => {
            const teamCard = document.createElement('div');
            teamCard.className = 'team-card';
            
            const teamHeader = document.createElement('div');
            teamHeader.className = 'team-header';
            
            const teamTitle = document.createElement('div');
            teamTitle.className = 'team-title';
            teamTitle.textContent = team.name;
            
            const teamCount = document.createElement('div');
            teamCount.className = 'team-count';
            teamCount.textContent = team.members.length;
            
            teamHeader.appendChild(teamTitle);
            teamHeader.appendChild(teamCount);
            
            const teamMembers = document.createElement('div');
            teamMembers.className = 'team-members';
            
            team.members.forEach((member, memberIndex) => {
                const memberDiv = document.createElement('div');
                memberDiv.className = 'member';
                
                const memberAvatar = document.createElement('div');
                memberAvatar.className = 'member-avatar';
                memberAvatar.textContent = member.charAt(0).toUpperCase();
                
                const memberName = document.createElement('div');
                memberName.textContent = member;
                
                memberDiv.appendChild(memberAvatar);
                memberDiv.appendChild(memberName);
                teamMembers.appendChild(memberDiv);
            });
            
            teamCard.appendChild(teamHeader);
            teamCard.appendChild(teamMembers);
            teamsContainer.appendChild(teamCard);
        });
    }
    
    function clearAll() {
        nameInput.value = '';
        teamCountInput.value = '2';
        teamNamesInput.value = '';
        teamsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-users-slash"></i>
                <h3>No teams generated yet</h3>
                <p>Enter names and click "Generate Teams" to create random teams</p>
            </div>
        `;
    }
    
    function copyTeams() {
        const teams = Array.from(document.querySelectorAll('.team-card'));
        if (teams.length === 0) {
            showError("No teams to copy");
            return;
        }
        
        let textToCopy = "Generated Teams:\n\n";
        
        teams.forEach(team => {
            const teamName = team.querySelector('.team-title').textContent;
            const members = Array.from(team.querySelectorAll('.member div:last-child'))
                .map(member => member.textContent)
                .join(', ');
            
            textToCopy += `${teamName}: ${members}\n`;
        });
        
        navigator.clipboard.writeText(textToCopy).then(() => {
            showToast("Teams copied to clipboard!");
        }).catch(err => {
            showError("Failed to copy teams");
            console.error('Failed to copy: ', err);
        });
    }
    
    function showToast(message) {
        toastMessage.textContent = message;
        toast.classList.remove('error');
        toast.querySelector('i').className = 'fas fa-check-circle';
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    
    function showError(message) {
        toastMessage.textContent = message;
        toast.classList.add('error');
        toast.querySelector('i').className = 'fas fa-exclamation-circle';
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.classList.remove('error');
                toast.querySelector('i').className = 'fas fa-check-circle';
            }, 300);
        }, 3000);
    }
    
    // Test the generate function immediately
    generateTeams();
});
