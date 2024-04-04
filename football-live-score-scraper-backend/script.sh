docker build -t football-ext/scraper-api .
docker run --name scraper-api --restart always -e NODE_ENV=production -d -p 4231:4231 stormbooster/scraper-api
