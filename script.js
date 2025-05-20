document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const nameInput = document.getElementById('nameInput');
    const teamCountInput = document.getElementById('teamCount');
    const teamNamesInput = document.getElementById('teamNames');
    const generateBtn = document.getElementById('generateBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const teamsContainer = document.getElementById('teamsContainer');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    // Initialize with sample data
    nameInput.value = "John, Jane, Mike, Sarah, David, Emily";
    
    // Event Listeners
    generateBtn.addEventListener('click', generateTeams);
    clearBtn.addEventListener('click', clearAll);
    copyBtn.addEventListener('click', copyTeams);
    
    // Generate Teams Function
    function generateTeams() {
        // Get and validate input
        const input = nameInput.value.trim();
        if (!input) {
            showError("Please enter some names!");
            return;
        }
        
        const teamCount = parseInt(teamCountInput.value) || 2;
        if (teamCount < 2) {
            showError("Minimum 2 teams required");
            return;
        }
        
        // Process team names
        let teamNames = [];
        if (teamNamesInput.value.trim()) {
            teamNames = teamNamesInput.value.split(',')
                .map(name => name.trim())
                .filter(name => name);
        }
        
        // Fill remaining team names if needed
        while (teamNames.length < teamCount) {
            teamNames.push(`Team ${teamNames.length + 1}`);
        }
        
        // Process participant names
        const names = input.split(/[\n,]+/)
            .map(name => name.trim())
            .filter(name => name);
        
        if (names.length < teamCount) {
            showError(`Need at least ${teamCount} names`);
            return;
        }
        
        // Shuffle and distribute names
        const shuffled = shuffleArray([...names]);
        const teams = Array.from({length: teamCount}, (_, i) => ({
            name: teamNames[i],
            members: []
        }));
        
        shuffled.forEach((name, i) => {
            teams[i % teamCount].members.push(name);
        });
        
        // Display teams
        displayTeams(teams);
    }
    
    // Helper Functions
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    function displayTeams(teams) {
        teamsContainer.innerHTML = '';
        
        if (teams.length === 0) {
            teamsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-users-slash"></i>
                    <h3>No teams generated</h3>
                    <p>Try generating teams again</p>
                </div>
            `;
            return;
        }
        
        teams.forEach(team => {
            const card = document.createElement('div');
            card.className = 'team-card';
            
            card.innerHTML = `
                <div class="team-header">
                    <div class="team-title">${team.name}</div>
                    <div class="team-count">${team.members.length}</div>
                </div>
                <div class="team-members"></div>
            `;
            
            const membersContainer = card.querySelector('.team-members');
            team.members.forEach(member => {
                const memberDiv = document.createElement('div');
                memberDiv.className = 'member';
                memberDiv.innerHTML = `
                    <div class="member-avatar">${member.charAt(0).toUpperCase()}</div>
                    <div>${member}</div>
                `;
                membersContainer.appendChild(memberDiv);
            });
            
            teamsContainer.appendChild(card);
        });
    }
    
    function clearAll() {
        nameInput.value = '';
        teamCountInput.value = '2';
        teamNamesInput.value = '';
        teamsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-users-slash"></i>
                <h3>No teams yet</h3>
                <p>Enter names and generate teams</p>
            </div>
        `;
    }
    
    function copyTeams() {
        const teams = Array.from(document.querySelectorAll('.team-card'));
        if (!teams.length) {
            showError("No teams to copy");
            return;
        }
        
        let text = "Generated Teams:\n\n";
        teams.forEach(team => {
            const name = team.querySelector('.team-title').textContent;
            const members = Array.from(team.querySelectorAll('.member div:last-child'))
                .map(el => el.textContent)
                .join(', ');
            text += `${name}: ${members}\n`;
        });
        
        navigator.clipboard.writeText(text).then(() => {
            showToast("Teams copied!");
        }).catch(err => {
            showError("Failed to copy");
            console.error(err);
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
            toast.classList.remove('show', 'error');
        }, 3000);
    }
    
    // Initial generation
    generateTeams();
});
