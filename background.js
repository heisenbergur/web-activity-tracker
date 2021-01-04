function getHostName(url){
  return url.split('/')[2];
}

let notification5m = {
  type: "basic",
  iconUrl: "icon48.png",
  title: "Site is BlacListed",
  message: "5 min left !!!",
};

let notification1m = {
  type: "basic",
  iconUrl: "icon48.png",
  title: "Site is BlackListed",
  message: "1 min left !!!",
};


setInterval(()=>{
  chrome.windows.getLastFocused({ populate: true }, function(currentWindow) {
    if (currentWindow.focused) {
      let activeTab = currentWindow.tabs.find(t => t.active === true);
      
      chrome.storage.local.get({tabs:[]},(result)=>{
        let arr = result.tabs;
        let tab = arr.find(t=> t.url === getHostName(activeTab.url));

      
        if(tab){
          if(tab.limit > 0){
            tab.limit--;
          }
          if(tab.limit === 300){
            chrome.notifications.create('limit',notification5m);
          }
          if(tab.limit === 60){
            chrome.notifications.create('limit',notification1m);
          }
          tab.counter++;
          if(tab.blacklist === true && tab.limit !== -1 && tab.limit === 0){
            
            var blockUrl = chrome.runtime.getURL("block.html") + '?url=' + tab.url;
            chrome.tabs.query({ currentWindow: true, active: true }, function(tab) {
            chrome.tabs.update(tab.id, { url: blockUrl });
            });
          }
          else{
            chrome.storage.local.set({tabs:arr},()=>{
            console.log("url saved");
            })
          }
          console.log(tab.url);
        }else{
          let tb = new Tab(getHostName(activeTab.url),activeTab.favIconUrl,0);
          arr.push(tb);
          chrome.storage.local.set({tabs:arr},()=>{
            console.log("url saved");
          })            
        }
      })
    }
  });
},1000);

