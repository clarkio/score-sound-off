module.exports = {
    people: getPeople(),
    nflGames: getNFLGames()
};

function getPeople() {
    return [
        {id: 1, firstName: 'John', lastName: 'Papa', age: 25, location: 'Florida'},
        {id: 2, firstName: 'Ward', lastName: 'Bell', age: 31, location: 'California'},
        {id: 3, firstName: 'Colleen', lastName: 'Jones', age: 21, location: 'New York'},
        {id: 4, firstName: 'Madelyn', lastName: 'Green', age: 18, location: 'North Dakota'},
        {id: 5, firstName: 'Ella', lastName: 'Jobs', age: 18, location: 'South Dakota'},
        {id: 6, firstName: 'Landon', lastName: 'Gates', age: 11, location: 'South Carolina'},
        {id: 7, firstName: 'Haley', lastName: 'Guthrie', age: 35, location: 'Wyoming'},
        {id: 8, firstName: 'Aaron', lastName: 'Jinglehiemer', age: 22, location: 'Utah'}
    ];
}

function getNFLGames() {
    return [
        {id: 1, homeTeamName: 'Team1', awayTeamName: 'Team16', homeTeamScore: 25, awayTeamScore: 7, active: true},
        {id: 2, homeTeamName: 'Team2', awayTeamName: 'Team17', homeTeamScore: 25, awayTeamScore: 7, active: false},
        {id: 3, homeTeamName: 'Team3', awayTeamName: 'Team18', homeTeamScore: 25, awayTeamScore: 7, active: false},
        {id: 4, homeTeamName: 'Team4', awayTeamName: 'Team19', homeTeamScore: 25, awayTeamScore: 7, active: false},
        {id: 6, homeTeamName: 'Team5', awayTeamName: 'Team20', homeTeamScore: 25, awayTeamScore: 7, active: false},
        {id: 7, homeTeamName: 'Team6', awayTeamName: 'Team21', homeTeamScore: 25, awayTeamScore: 7, active: false},
        {id: 8, homeTeamName: 'Team7', awayTeamName: 'Team22', homeTeamScore: 25, awayTeamScore: 7, active: false},
        {id: 9, homeTeamName: 'Team8', awayTeamName: 'Team23', homeTeamScore: 25, awayTeamScore: 7, active: false},
        {id: 10, homeTeamName: 'Team9', awayTeamName: 'Team24', homeTeamScore: 25, awayTeamScore: 7, active: false},
        {id: 11, homeTeamName: 'Team10', awayTeamName: 'Team25', homeTeamScore: 25, awayTeamScore: 7, active: false},
        {id: 12, homeTeamName: 'Team11', awayTeamName: 'Team26', homeTeamScore: 25, awayTeamScore: 7, active: false},
        {id: 13, homeTeamName: 'Team12', awayTeamName: 'Team27', homeTeamScore: 25, awayTeamScore: 7, active: false},
        {id: 14, homeTeamName: 'Team13', awayTeamName: 'Team28', homeTeamScore: 25, awayTeamScore: 7, active: false},
        {id: 15, homeTeamName: 'Team14', awayTeamName: 'Team29', homeTeamScore: 25, awayTeamScore: 7, active: false},
        {id: 16, homeTeamName: 'Team15', awayTeamName: 'Team30', homeTeamScore: 25, awayTeamScore: 7, active: false}
    ]
}
