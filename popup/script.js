(function(){
  // LOGIN PART
  const loginContainer = document.getElementById("estaffingLoginContainer");
  const cidField = document.getElementById("cid");
  const useridField = document.getElementById("userid");
  const pwdField = document.getElementById("pwd");
  const saveButton = document.getElementById("save");
  const alertBoxLogin = document.getElementById("alertBoxLogin");

  // Working TIME PART
  const workingTimeContainer = document.getElementById("estaffingWorkingTimeContainer");
  const starthhField = document.getElementById("starthh");
  const startmmField = document.getElementById("startmm");
  const endhhField = document.getElementById("endhh");
  const endmmField = document.getElementById("endmm");
  const resthhField = document.getElementById("resthh");
  const restmmField = document.getElementById("restmm");
  const saveWorkingTimeButton = document.getElementById("saveWorkingTime");
  const alertBoxWorkingTime = document.getElementById("alertBoxWorkingTime");

  saveButton.disabled = true;
  saveWorkingTimeButton.disabled = true; 

  cidField.onkeyup = () => validationLoginInput();
  useridField.onkeyup = () => validationLoginInput();
  pwdField.onkeyup = () => validationLoginInput();

  starthhField.onkeyup = () => validationWorkingTimeInput();
  startmmField.onkeyup = () => validationWorkingTimeInput();
  endhhField.onkeyup = () => validationWorkingTimeInput();
  endmmField.onkeyup = () => validationWorkingTimeInput();
  resthhField.onkeyup = () => validationWorkingTimeInput();
  restmmField.onkeyup = () => validationWorkingTimeInput();

  saveWorkingTimeButton.addEventListener('click', function(ev) {
    const starthhValue = starthhField.value;
    const startmmValue = startmmField.value;
    const endhhValue = endhhField.value;
    const endmmValue = endmmField.value;
    const resthhValue = resthhField.value;
    const restmmValue = restmmField.value;
    chrome.storage.sync.set(
      {
        "working_time": {
          "starthh": starthhValue,
          "startmm": startmmValue,
          "endhh": endhhValue,
          "endmm": endmmValue,
          "resthh": resthhValue,
          "restmm": restmmValue, 
        }
      });
    ev.preventDefault();
  });

  saveButton.addEventListener('click', function(ev) {
    const cidValue = cidField.value;
    const useridValue = useridField.value;
    const pwdValue = pwdField.value;
    const updated = new Date();
    const lastLogin = null;
    chrome.storage.sync.set(
      {
        "login": {
          "cid": cidValue,
          "user_id": useridValue,
          "pwd": pwdValue,
          "updated": updated,
          "lastLogin": lastLogin 
        }
      });
    ev.preventDefault();
  });

  function valueChanged(newValue) {
    output.innerText = newValue;
    output.className="changed";
    window.setTimeout(function() {output.className="";}, 200);
    log("value myValue changed to "+newValue);
  }

  function validationWorkingTimeInput() {
    if (starthhField.value.length === 0 || startmmField.value.length === 0 || endhhField.value.length === 0 || endmmField.value.length === 0 || resthhField.value.length === 0 || restmmField.value.length === 0) {
          saveWorkingTimeButton.disabled = true;  
      } else {
        if (starthhField.value > 24 || startmmField.value > 60 || endhhField.value > 24 || endmmField.value > 60 || resthhField.value > 24 || restmmField.value > 60) {
          console.log(starthhField.value);
          saveWorkingTimeButton.disabled = true;
        } else {
          saveWorkingTimeButton.disabled = false;
        }
      }
    }


  function validationLoginInput() {
    if (cidField.value.length === 0 || useridField.value.length === 0 || pwdField.value.length === 0) {
      saveButton.disabled = true;  
    }else{
      saveButton.disabled = false;
    }
  }

  // For debugging purposes:
  function debugChanges(changes, namespace) {
    for (key in changes) {
      console.log('Storage change: key='+key+' value='+JSON.stringify(changes[key]));
    }
  }  

  chrome.storage.onChanged.addListener(function(changes, namespace) {
    if(changes.hasOwnProperty("login")){
      alertBoxLogin.classList.remove("hidden");
    }

    if (changes.hasOwnProperty("working_time")) {
      alertBoxWorkingTime.classList.remove("hidden");
    }
    //console.log(changes);
    //console.log(namespace);
  });

  chrome.storage.sync.get("login", function(results) {
    if(results.hasOwnProperty("login")){
      document.getElementById("information").classList.add("hidden");
      document.getElementById("note").classList.add("hidden");
      cidField.value = results.login.cid;
      useridField.value = results.login.user_id;
      pwdField.value = results.login.pwd;        
    }
  });

  chrome.storage.sync.get("working_time", function(results) {
    if(results.hasOwnProperty("working_time")){
      starthhField.value = results.working_time.starthh;
      startmmField.value = results.working_time.startmm;
      endhhField.value = results.working_time.endhh;
      endmmField.value = results.working_time.endmm;
      resthhField.value = results.working_time.resthh;
      restmmField.value = results.working_time.restmm;        
    }
  });     
})();