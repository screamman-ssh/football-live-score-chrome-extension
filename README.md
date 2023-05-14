# Football Live Score (Chrome Extension)
<div align="center">
  <image width="650" src="https://github.com/Stormbooster-sudo/football-live-score-chrome-extension/assets/77887797/329a6613-df99-489a-8fb0-7406282abb10">
</div>

Football Live Score is a Chrome extension that reports football match fixtures, match results, match stats and live scores. The extension is made by Manifest V3 and uses the data scrapped from <a href="https://www.goal.com" target="_blank">goal.com</a>
, which contains more than 100  football leagues, using Puppeteer and delivers the data by Node.js and Express.
## How to install
### 1. Clone the respository
Using command line:
```
# Clone this repository
git clone https://github.com/Stormbooster-sudo/football-live-score-chrome-extension
```
### 2. Import the project to your Chrome extension
The chrome extenion is the folder *"football-live-score-chrome-extenion"*. To import extension, follow these steps.
1. Go to your Extensions menu on your Chrome browser and click to *"Manage extensions"*.
2. Click select "Deverloper mode".
3. Click *"Load unpacked"* and select the folder name *"football-live-score-chrome-extenion"*.
4. Click *"Select folder"*.

Or following this video https://www.youtube.com/watch?v=hIRX1dpfqHc
### 3. Run backend on local
The backend is the folder name *"football-live-score-scraper-backend"* and will be run in the container using Docker. If you have Docker on your machine you can run the bash script to run the container, using command line:
 ```
 # Make sure you working in "football-live-score-scraper-backend" directory 
 bash script.sh
 ```
**Suggestion: Set your Docker to run on start-up, if you don't want to run it by manual.** <br/>
 If you didn't have Docker on your machine, you can run it using command:
 ```
# Install dependencies
npm install

# Run the backend
npm start
 ```
 Done!, The extension should work properly.
