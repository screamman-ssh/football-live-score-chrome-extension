const moreButton = document.getElementById('more-button');
const arrowRight = document.getElementById('arrow-right');
const arrowLeft = document.getElementById('arrow-left');
var leaguePanel = document.getElementById('league-panel');
var offset = 20;

//chrome message passing object
const chromeMsg = {
    getChromeLocalData: async () => chrome.runtime.sendMessage({data: "get"}).then(res => res.data),
    refetchChromeLocalData: async () => await chrome.runtime.sendMessage({data: "refetch"}),
    popupOpened: () => chrome.runtime.sendMessage({popup: "open"})
}

//More button handler, increase data offset
moreButton.addEventListener('click', async function () {
    const getData = await chromeMsg.getChromeLocalData();
    leaguePanel.innerHTML += leagueBox(getData.data.slice(offset, offset + 10));
    offset += 10;
});

//date arrow selector
var date = new Date();
const dateSelector = (event, side) => {
    event.preventDefault()
    var strDate = "";
    var displayDate = document.getElementById('display-date');
    //verify which button is press and add or substract day using setDate -> auto set correct month and year
    if (side == "left"){
        date.setDate(date.getDate() - 1);
    } else if (side== "right"){
        date.setDate(date.getDate() + 1);
    }
    //check if date is today
    var today = new Date()
    today = today.toISOString().split("T")[0]
    strDate = (today == date.toISOString().split("T")[0]) ? "Today" : (date.toString().split(" ").slice(0, 3)).toString().replaceAll(",", " ");
    displayDate.innerText = strDate;
}
arrowLeft.addEventListener('click',  (event) => dateSelector(event, "left"));
arrowRight.addEventListener('click', (event) => dateSelector(event, "right"));

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
    const data = await chromeMsg.refetchChromeLocalData()
    console.log("refetch")
    leaguePanel.innerHTML = leagueBox(data.data)
}, 60000)
