const express = require('express');
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

const cors = require('cors');
// const scrapeData = require('./scrape');
const path = require("path");
const app = express();
app.use(cors());

app.use(express.static(path.join(__dirname, "public")));
app.get("/get-data", async (req, res) => {
    puppeteer.launch({ headless: 'new' }).then(async browser => {
        const page = await browser.newPage();
        await page.goto('https://www.goal.com/en/fixtures/2023-05-05');
        // await page.screenshot({ path: 'testresult.png', fullPage: true })
        await page.waitForSelector('.competition_name__YEMb_')
        const data = await page.evaluate(()=>
                Array.from(document.querySelectorAll('.competition_competition__s2ULZ'), e => ({
                    league: e.querySelector('.competition_name__YEMb_').innerText.split(' - ')[1],
                    league_logo: e.querySelector('.competition_logo-wrapper__WNYqb .competition_logo__1QOg2').getAttribute('src'),
                    match: Array.from(e.querySelectorAll('.row_row__UQmGm'), e => ({
                        match_link: e.href,
                        time: e.querySelector('.start-date_start-date__ggx17')?.innerText,
                        home: e.querySelector('.team_team___lVK_.team_team-a__2YS_9 .name_name__YzgHa').innerText,
                        home_logo: e.querySelector('.team_team___lVK_.team_team-a__2YS_9 .crest_crest__CNBqh').getAttribute('src'),
                        home_score: e.querySelector('.result_score__Dh4zx .result_team-a__A4z1T')?.innerText,
                        away: e.querySelector('.team_team___lVK_.team_team-b__YaeU1 .name_name__YzgHa').innerText,
                        away_logo: e.querySelector('.team_team___lVK_.team_team-b__YaeU1 .crest_crest__CNBqh').getAttribute('src'),
                        away_score: e.querySelector('.result_score__Dh4zx .result_team-b__SPZhO')?.innerText,
                    }))
                }))
            )
        res.json(data)
        await browser.close();
    })
  });
app.listen(5000);