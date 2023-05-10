import { dateSelector } from "./dateSelector.js";
const dateSel = new dateSelector()

const moreButton = document.getElementById('more-button');
const arrowRight = document.getElementById('arrow-right');
const arrowLeft = document.getElementById('arrow-left');
var leaguePanel = document.getElementById('league-panel');
var offset = 20;

//chrome message passing object
const chromeMsg = {
    getChromeLocalData: async () => chrome.runtime.sendMessage({data: "get"}).then(res => res.data),
    refetchChromeLocalData: async () => await chrome.runtime.sendMessage({data: "refetch"}),
    fetchWithDate: async (targetDate) => chrome.runtime.sendMessage({data: "fatch-date", date: targetDate}).then(res => res[targetDate]),
    popupOpened: () => chrome.runtime.sendMessage({popup: "open"})
}

//More button handler, increase data offset
moreButton.addEventListener('click', async function () {
    if(dateSel.getDateStr() == "Today"){
        const getData = await chromeMsg.getChromeLocalData();
        leaguePanel.innerHTML += leagueBox(getData.data.slice(offset, offset + 10));
    }
    else{
        var targetDate = dateSel.getDateISO()
        const dataOnTargetDate = await chromeMsg.fetchWithDate(targetDate);
        leaguePanel.innerHTML = leagueBox(dataOnTargetDate.slice(offset, offset + 10))
    }
    offset += 10;
});

//date arrow date selector
const handleDateSelector = async (event, side) => {
    event.preventDefault()
    if(side == "left")
        dateSel.backDate();
    else if(side == "right")
        dateSel.nextDate();

    //set maximum matchday to fetch, avoiding web blocking and session storage's space full
    if(dateSel.getDateDif() >= 3 || dateSel.getDateDif() <= -3){
        console.log("maximum");
        window.open(`https://www.goal.com/en/fixtures/${dateSel.getDateISO()}`)
        return
    }

    var displayDate = document.getElementById('display-date');
    displayDate.innerText = dateSel.getDateStr();
    if(dateSel.getDateStr() == "Today"){
        const data = await chromeMsg.getChromeLocalData()
        leaguePanel.innerHTML = leagueBox(data.data.slice(0, offset))
    }
    else{
        var targetDate = dateSel.getDateISO()
        leaguePanel.innerHTML = loadingLabel()
        const dataOnTargetDate = await chromeMsg.fetchWithDate(targetDate);
        leaguePanel.innerHTML = leagueBox(dataOnTargetDate.slice(0, offset))
    }
}
arrowLeft.addEventListener('click',  (event) => handleDateSelector(event, "left"));
arrowRight.addEventListener('click', (event) => handleDateSelector(event, "right"));

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

const loadingLabel = () => {
    return `
    <div style="text-align:center;">
        <h3 class="label">Loading...</h3>
    </div>
    `
}

window.onload = async function () {
    // var d = new Date()
    // console.log(new Date(d.setDate(d.getDate() - 12)))
    chromeMsg.popupOpened();
    const dataObj = await chromeMsg.getChromeLocalData();
    if (dataObj) {
        leaguePanel.innerHTML = leagueBox(dataObj.data.slice(0, offset));
        //refetch data if the last fetch data are older than 30 second
        if ((new Date() - new Date(dataObj.timestamp)) > 30000)
            leaguePanel.innerHTML = leagueBox((await chromeMsg.refetchChromeLocalData()).data.slice(0, offset));
    } else {
        //if there data before, start new fetch with loading screen
        console.log('new fetch')
        leaguePanel.innerHTML = loadingLabel()
        var newData = await chromeMsg.refetchChromeLocalData()
        leaguePanel.innerHTML = leagueBox(newData.data.slice(0, offset))
    }
}

//refetch data every 1 minute
setInterval(async function () {
    if(dateSel.getDateStr() == "Today"){
        const data = await chromeMsg.refetchChromeLocalData()
        console.log("refetch")
        leaguePanel.innerHTML = leagueBox(data.data.slice(0, offset))
    }
}, 60000)
