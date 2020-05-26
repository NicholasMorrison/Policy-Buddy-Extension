chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    id: "policyMenu",
    title: "Policy Buddy",
    contexts: ["selection"]
  });

  chrome.contextMenus.create({
    id: "check_policy",
    title: "Check Policy",
    parentId: "policyMenu",
    contexts:["selection"]
  });

});

chrome.contextMenus.onClicked.addListener(function(info, tab){
  switch(info.menuItemId){
    case "check_policy":

      /* add url below for where to send the request */
      let url = info.linkUrl

      if(url == null){
        console.log('Not policy is selected')
        return
      }

      let response = fetch(url)
            .then(response => response.text())
            .then(data => {
              // We are receiving text
              // Transforming to html
              var parser = new DOMParser();
              var htmlDoc = parser.parseFromString(data, 'text/html');
              let pTags = htmlDoc.getElementsByTagName('p')
              let pList = []

              for(let p of pTags){
                pList.push(p.innerText)
              }

              return pList
            });

      /* Convert the legal document to an object */
      let request = {
        content: response
      }

      console.log(request)


      /* Send the legal document to the service */

      break;
  }
})
