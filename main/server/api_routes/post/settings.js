const axios = require("axios")

const selectPremiumCache = db.prepare('SELECT * FROM premium_cache LIMIT 1');
const updatePremiumCache = db.prepare(`INSERT OR REPLACE INTO premium_cache (value, date) VALUES (?, ?)`);

async function updatePremiumRank(){
    let isPremium = false
    let api_key = settings.api_key

    if(api_key){
        try {
            let data = (await axios.get("https://www.bloxxy.net/api/patreon", {
                headers: {
                    Cookie: `connect.sid=${api_key}`
                }
            })).data
    
            if(data.id >= 0 && data.subscription >= 10){
                isPremium = true
                updatePremiumCache.run("true", Date.now());
            } else {
                updatePremiumCache.run("false", Date.now());
            }
        } catch (err){
            console.error(err)
            const cacheData = selectPremiumCache.get();

            if (cacheData) {
                if((cacheData.date + (1000 * 60 * 60 * 24 * 3)) >= Date.now() && cacheData.value == "true"){
                    isPremium = true;
                }
            } 
        }
    }

    global.premium = isPremium;
}

setTimeout(updatePremiumRank, 1000 * 60 * 15)
updatePremiumRank()

let lastKey = settings.api_key

global.premiumOnlyTitle = "This feature requires you to be a patreon subscriber"
global.premiumText = 
`you must be a subscriber on our <a style="color: #3498db; text-decoration: none; cursor: pointer; background-color: none; font-size: 1em;" href="">Patreon</a>.
After doing so, follow the "Full feature access" instructions in the settings tab.`

module.exports = async (req, res) => {
    settings = req.body
    settings.api_key = settings.api_key.trim()

    if(lastKey !== settings.api_key){
        lastKey = settings.api_key
        updatePremiumRank()
    }

    if(!global.premium){
        if(settings.concurrency > 3){
            await MessageUser({
                title: premiumOnlyTitle,
                text: `To be able to have more than 3 concurrect workers, \n${premiumText}`,
    
                button1text: "OK",
    
                secondButton: false,
            })
    
            settings.concurrency = 3;
        } 

        if(settings.auto_skip_ads == false){
            await MessageUser({
                title: premiumOnlyTitle,
                text: `To be able to watch the ads, \n${premiumText}`,
    
                button1text: "OK",
    
                secondButton: false,
            })
    
            settings.auto_skip_ads = true;
        }
    }
    db.prepare('UPDATE options SET data = ? WHERE id = 1').run(JSON.stringify(settings))
    res.sendStatus(201)

    io.emit("settings", settings)
}