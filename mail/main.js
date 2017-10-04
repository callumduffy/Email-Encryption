InboxSDK.load('1.0', 'sdk_14315135_2d9300ddff').then(function(sdk){

  var myArr;
  //handler for the compase section of mail
  //used for encryption
  sdk.Compose.registerComposeViewHandler(function(composeView){

    var bits = 1024;
    var PassPhrase = "Hello";
    var RSAKey = cryptico.generateRSAKey(PassPhrase, bits);
    var PublicKeyString = cryptico.publicKeyString(RSAKey);
    console.log(PublicKeyString);

    //xmlhttp request to create array from reading json
    //json read from local host
    var xmlhttp = new XMLHttpRequest();
    var url = "http://localhost/keys.json";

    //check request is in correct state
    xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        //parse json file
        myArr = JSON.parse(this.responseText);
      }
    };
    //send request
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

    //Encrypt Button
    composeView.addButton({
      title: "Encrypt Message",
      iconUrl : 'https://image.freepik.com/free-icon/lock-button_318-36478.jpg',
      onClick: function(event) {
        //get email of recipient of email
        var recips = composeView.getToRecipients();
        var recip = recips[0].emailAddress;
        //query json for this recipient
        //console.log(myArr);

        if(recip === myArr.keys.email){
          //result from query for public key
         var content = composeView.getTextContent();
         var pass = myArr.keys.priv;
         var PublicKeyString = myArr.keys.pub;
         var RSAKey = cryptico.generateRSAKey(pass,bits);
         var encrypted = cryptico.encrypt(content,PublicKeyString,RSAKey);
         event.composeView.setBodyText(encrypted.cipher);
        }
        else{
            event.composeView.insertTextIntoBodyAtCursor("\n ***** Recipient has no public key***** \n");
        }
      }
    });
  });

    //handler to manage the threads, to view messages
    sdk.Conversations.registerThreadViewHandler(function(threadView){
      var bits = 1024;

      //getting email info for queries
      var mviews = threadView.getMessageViews();
      var contact = mviews[0].getSender();
      var email = contact.emailAddress;

      //get message text to decrypt
      //horrible scraping but it does the job
      var bodyEl = mviews[0].getBodyElement();
      var inner = bodyEl.innerHTML;
      var string = "";
      string = inner.replace(/\<wbr>/g,'');
      var index = string.indexOf("ltr")+5;
      string = string.slice(index);
      var end = string.indexOf("</div>");
      string = string.substring(0,end);

      //query priv key from db
      var pass;
      var message;
      var rkey;
      //query for the email in the json
      if(myArr.keys.email === email){
          pass = myArr.keys.priv;
          var RSAKey = cryptico.generateRSAKey(pass,bits);
          message = cryptico.decrypt(string,RSAKey).plaintext;
          message += "\nAnd the signature was: " + (cryptico.decrypt(string,RSAKey)).signature;
      }
      else{
          message = "Private key incorrect, cannot decrypt message";
      }

      //add text to the html element for decrypted message
		  var el = document.createElement("div");
	    el.innerHTML = message;

      //sidebar for the decrypted message to be displayed
		  threadView.addSidebarContentPanel({
			     title: 'Decrypted Message',
			        el: el
		  });

	});
});
