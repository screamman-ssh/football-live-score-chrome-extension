const moreButton = document.getElementById('more-button');
var leaguePanel = document.getElementById('league-panel');
var offset = 20;

const fecthData = async () => {
    var data = await fetch('http://localhost:5000/get-data').then((res) => res.json());
    const preload = {data: data, timestamp: new Date()}
    window.localStorage.setItem('data', JSON.stringify(preload));
    return data;
}

moreButton.addEventListener('click', function() {
    const data = JSON.parse(window.localStorage.getItem('data')).data;
    leaguePanel.innerHTML += leagueBox(data.slice(offset, offset + 10));
    offset += 10;
});

const leagueBox = (data) => {
    return data.map((d) => {
        return `
        <div class="league-box" style="padding: 8px; margin-top:0.5em; background-color: rgb(29, 29, 29); border-radius: 4px;">
            <a class="label" href="${d.league_link}" target="_blank" rel="noopener noreferrer" style="color:white; font-size: 1.3em; margin: 0;"><img src="${d.league_logo}" style="width: 1em;"> ${d.league.split(' - ')[1]}</a>
            ${d.match.map((m) => {
                return `
                <div class="match-box">
                    <table style="width: 100%;">
                        <tr>
                            <td style="width: 38%; text-align: center;">
                                <img src="${m.home_logo}" style="width: 40%;">
                                <a class="label" style="font-size: 10px;">${m.home}</a>
                            </td>
                            <td style="width: 24%; text-align: center;">
                                <a class="label" href="${m.match_link}"  target="_blank" rel="noopener noreferrer" style="margin-bottom: 0; margin-top: 0.8em;font-size: 1.5em;">${m.home_score + " - " + m.away_score}</a>
                                <p class="label" style="margin: 0; color: forestgreen;">${m.time}</p>
                            </td>
                            <td style="width: 38%; text-align: center;">
                            <img src="${m.away_logo}" style="width: 40%;">
                            <a class="label" style="font-size: 10px;">${m.away}</a>
                            </td>
                        </tr>
                    </table>
                </div>
                `
            })}
        </div>
        `
    }).join('').replaceAll("                ,", "")
}

const loadingLabel = () =>{
    return `
    <div style="text-align:center;">
        <h3 class="label">Loading...</h3>
    </div>
    `
}

window.onload = async function () {
    const d = new Date();
    if(window.localStorage.getItem('data')){
        const dataObj = JSON.parse(window.localStorage.getItem('data'));
        leaguePanel.innerHTML = leagueBox(dataObj.data.slice(0, offset));
        //refetch data if the last fetch data are older than 30 second
        if((new Date() - new Date(dataObj.timestamp)) > 30000)
            leaguePanel.innerHTML =  leagueBox((await fecthData()).slice(0, offset));
    }else{
        leaguePanel.innerHTML = loadingLabel()
        var newData = await fecthData()
        leaguePanel.innerHTML = leagueBox(newData.slice(0, offset))
    }
    
}

setInterval(async function(){
    const data = await fecthData()
    leaguePanel.innerHTML = leagueBox(data)
}, 60000)
