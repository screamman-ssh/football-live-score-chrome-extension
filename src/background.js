// import scrapeData from "./scrape"
// console.log(scrapeData)
var leaguePanel = document.getElementById('league-panel')
const fecthData = async () => {
    const data = await fetch('http://localhost:5000/get-data').then((res) => res.json())
    window.localStorage.setItem('data', JSON.stringify(data))
    console.log(data)
}

const leagueBox = (data) => {
    return data.map((d) => {
        return `
        <div class="league-box" style="padding: 8px; margin-top:0.5em; background-color: rgb(29, 29, 29); border-radius: 4px;">
            <a class="label" href="https://www.goal.com/en/premier-league/fixtures-results/2kwbbcootiqqgmrzs6o5inle5" target="_blank" rel="noopener noreferrer" style="color:white; font-size: 1.3em; margin: 0;">${d.league}</a>
            ${d.match.map((m) => {
                return `
                <div class="match-box">
                    <table style="width: 100%;">
                        <tr>
                            <td style="width: 38%; text-align: center;">
                                <img src="${m.home_logo}" style="width: 40%;">
                                <a class="label">${m.home}</a>
                            </td>
                            <td style="width: 24%; text-align: center;">
                                <a class="label" style="margin-bottom: 0; margin-top: 0.8em;font-size: 1.5em;">${m.home_score + " - " + m.away_score}</a>
                                <p class="label" style="margin: 0; color: forestgreen;">45'</p>
                            </td>
                            <td style="width: 38%; text-align: center;">
                            <img src="${m.away_logo}" style="width: 40%;">
                            <a class="label">${m.away}</a>
                            </td>
                        </tr>
                    </table>
                </div>
                `
            })}
        </div>
        `
    }).join(" ")
}

window.onload = async function () {
    const data = JSON.parse(window.localStorage.getItem('data'))
    console.log(data)
    leaguePanel.innerHTML = leagueBox(data)
    // await fecthData()
}
