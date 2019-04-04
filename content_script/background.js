const estaffingHome = 'https://timecard2.e-staffing.ne.jp/000_002.cfm';
const estaffingRedirect = 'https://timecard2.e-staffing.ne.jp/staff/001_003.cfm';
const estaffingWorkingTime = 'https://timecard2.e-staffing.ne.jp/staff/001_004.cfm';

function checkEstaffingPage(requestDetails) {
  if(requestDetails.url == estaffingHome){
    browser.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
      if (tab.status == "complete" && tab.active && requestDetails.tabId == tabId) {
        login(tabId);
      }
    });
  }
  
  if(requestDetails.url == estaffingWorkingTime){
    browser.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
      if (tab.status == "complete" && tab.active && requestDetails.tabId == tabId) { 
        workingTime(tabId);
      }
    });
  }
}


function login(tabId){
  chrome.storage.sync.get("login", function(results) {
    if (results.hasOwnProperty("login")) {
     if (results.login.cid.length != 0 && results.login.user_id.length != 0 && results.login.pwd.length != 0) {
        chrome.tabs.executeScript(tabId, {
        code: `
          if (document.querySelector(".spSpanColorAccountMsg") != null) {
            var getErrorMsg = document.querySelector(".spSpanColorAccountMsg").parentElement.textContent.trim().substr(0, 47);
          }
            var errorMsg = "Company ID, User ID or the password is invalid."; 
          if (getErrorMsg == errorMsg){ alert("The Company ID, User ID or the password save in the e-staffing addon is wrong. Please make sure your account is valid and try again."); } else { document.querySelector("form")[0].value = '${results.login.cid}';document.querySelector("form")[1].value = '${results.login.user_id}';document.querySelector("form")[2].value = '${results.login.pwd}'; document.main_form.lang_hidden.value = 2;document.main_form.action = "function/loginchk.cfm";document.main_form.submit();}`
        });

        chrome.storage.sync.set({
          "info": {
            "lastLogin": new Date(), 
          }
        });
      }
    }
  });
}

function workingTime(tabId){
  chrome.storage.sync.get("working_time", function(results) {
    if (results.hasOwnProperty("working_time")) {
      chrome.tabs.executeScript(tabId, {
        code: `
        const allStarthhInputs = document.querySelectorAll("input[name^='starthh']");
        const allStartmmInputs = document.querySelectorAll("input[name^='startmm']");
        const allEndhhInputs = document.querySelectorAll("input[name^='endhh']");
        const allEndmmInputs = document.querySelectorAll("input[name^='endmm']");
        const allResthhInputs = document.querySelectorAll("input[name^='resthh']");
        const allRestmmInputs = document.querySelectorAll("input[name^='restmm']");
        for (i = 0; i < allStarthhInputs.length; i++) {
          allStarthhInputs[i].value = '${results.working_time.starthh}';
          allStartmmInputs[i].value = '${results.working_time.startmm}';
          allEndhhInputs[i].value = '${results.working_time.endhh}';
          allEndmmInputs[i].value = '${results.working_time.endmm}';
          allResthhInputs[i].value = '${results.working_time.resthh}';
          allRestmmInputs[i].value = '${results.working_time.restmm}';
        }`
      });
    }
  });
}

browser.webRequest.onBeforeRequest.addListener(
  checkEstaffingPage,
  {urls: ["<all_urls>"]}
);