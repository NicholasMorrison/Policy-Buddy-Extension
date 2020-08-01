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

chrome.contextMenus.onClicked.addListener(async function(info, tab){

  switch(info.menuItemId){
    case "check_policy":

      /* add url below for where to send the request */
      const url = info.linkUrl

      /* add url below for where the tos will be sent */
      const baseUrl = 'http://localhost:5000/';
      const tagUrl = `${baseUrl}/tags/common`

      if(url == null){
        console.log('Not policy is selected')
        return
      }

      /* We are only collecting paragraph tags */
      /* Need to think about a better solution for finding content in tos */
      const response = fetch(url)
            .then(response => response.text())
            .then(data => {
              // We are receiving text
              // Transforming to html
              var parser = new DOMParser();
              var htmlDoc = parser.parseFromString(data, 'text/html');
              console.log(htmlDoc);
              let pTags = htmlDoc.getElementsByTagName('p')
              let pList = []

              for(let p of pTags){
                pList.push(p.innerText)
              }

              console.log(pList) //Console log used for debugging
              return pList
            });


      /* Send the legal document to the service */
      /* Start by preparing the headers & body */
      let headers = {'Content-Type': 'application/json', 'Origin': 'http://localhost:5000'}
      let body = {content: await response}

      /* Need to setup debug logger to prevent pii info from spilling */
      console.log("headers: " + JSON.stringify(headers))
      console.log("body: " + JSON.stringify(body))

      /* Send the content from tos to service */
      fetch(tagUrl, {method: 'POST', headers: headers, body: JSON.stringify(body)})
            .then(response => console.log(response));

      break;
  }
})
