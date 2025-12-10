// auto-results.js - Run this on your computer to auto-update results
const fs = require('fs');
const axios = require('axios');

class ResultsUpdater {
    constructor() {
        this.resultsFile = 'results-database.json';
        this.predictionsFile = 'predictions-database.json';
        this.apiKey = 'YOUR_API_KEY'; // Get from football-data.org
    }
    
    async updateResults() {
        try {
            // 1. Load today's predictions
            const predictions = JSON.parse(fs.readFileSync(this.predictionsFile, 'utf8'));
            
            // 2. Fetch match results from API
            const completedMatches = await this.fetchCompletedMatches();
            
            // 3. Update predictions with results
            const updatedPredictions = this.matchResults(predictions, completedMatches);
            
            // 4. Save to results database
            this.saveResults(updatedPredictions);
            
            console.log('✅ Results updated successfully!');
            
        } catch (error) {
            console.error('❌ Error updating results:', error);
        }
    }
    
    async fetchCompletedMatches() {
        // This requires an API key from football-data.org
        const response = await axios.get('https://api.football-data.org/v4/matches', {
            headers: { 'X-Auth-Token': this.apiKey }
        });
        
        return response.data.matches.filter(match => 
            match.status === 'FINISHED' || match.status === 'AWARDED'
        );
    }
    
    matchResults(predictions, matches) {
        // Match predictions with actual results
        const updatedResults = [];
        
        predictions.predictions.today.forEach(prediction => {
            const match = matches.find(m => 
                this.cleanTeamName(m.homeTeam.name) === this.cleanTeamName(prediction.fixture.split('vs')[0].trim()) ||
                this.cleanTeamName(m.awayTeam.name) === this.cleanTeamName(prediction.fixture.split('vs')[1].trim())
            );
            
            if (match) {
                const result = {
                    fixture: prediction.fixture,
                    league: prediction.league,
                    betType: prediction.betType,
                    odds: prediction.odds,
                    result: `${match.score.fullTime.home} - ${match.score.fullTime.away}`,
                    outcome: this.calculateOutcome(prediction, match),
                    profit: this.calculateProfit(prediction, match),
                    analysis: 'Auto-updated from API'
                };
                
                updatedResults.push(result);
            }
        });
        
        return updatedResults;
    }
    
    cleanTeamName(name) {
        return name.toLowerCase().replace(/fc|cf|sc|afc/gi, '').trim();
    }
    
    calculateOutcome(prediction, match) {
        const [homeScore, awayScore] = [match.score.fullTime.home, match.score.fullTime.away];
        const betType = prediction.betType;
        
        // Simplified logic - you need to implement based on bet types
        if (betType.includes('1X') && homeScore >= awayScore) return 'won';
        if (betType.includes('BTTS Yes') && homeScore > 0 && awayScore > 0) return 'won';
        if (betType.includes('Over 2.5') && (homeScore + awayScore) > 2.5) return 'won';
        
        return 'lost';
    }
    
    calculateProfit(prediction, match) {
        const outcome = this.calculateOutcome(prediction, match);
        return outcome === 'won' ? `+${((prediction.odds - 1) * 100).toFixed(0)}%` : '-100%';
    }
    
    saveResults(results) {
        const existingResults = JSON.parse(fs.readFileSync(this.resultsFile, 'utf8'));
        
        // Add new results
        const today = new Date().toISOString().split('T')[0];
        existingResults.dailyResults.unshift({
            date: today,
            day: "Today",
            totalPredictions: results.length,
            wins: results.filter(r => r.outcome === 'won').length,
            losses: results.filter(r => r.outcome === 'lost').length,
            winRate: ((results.filter(r => r.outcome === 'won').length / results.length) * 100).toFixed(1) + '%',
            results: results
        });
        
        // Update total stats
        existingResults.totalStats.totalPredictions += results.length;
        existingResults.totalStats.totalWins += results.filter(r => r.outcome === 'won').length;
        existingResults.totalStats.totalLosses += results.filter(r => r.outcome === 'lost').length;
        existingResults.totalStats.winRate = 
            ((existingResults.totalStats.totalWins / existingResults.totalStats.totalPredictions) * 100).toFixed(1) + '%';
        
        // Save file
        fs.writeFileSync(this.resultsFile, JSON.stringify(existingResults, null, 2));
    }
}

// Run updater
const updater = new ResultsUpdater();
updater.updateResults();
