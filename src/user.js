//class for each user
class user {
      constructor(){
        this.id = null;
        this.bankPW = null
        this.emailPW = null
        this.shopPW = null
        this.bankAns = null
        this.emailAns = null
        this.shopAns = null
        this.logs = []
        this.attempts = 3
        this.getUserID() 
      }

      //gets the user information from the server
      getUserID(){
        fetch('/id') //fetch request allows information to be used
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            this.id = data
          });
      }
      

      //creates a log and collects the data
      createLog(passwrd, action, reaction){
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+ ' ' + time;

        //add new log file to total
        this.logs.push([dateTime, this.id, passwrd, "imagePswd","imagePswd_"+ passwrd, action, reaction])
      }

      //modifes the buttons to change their state when pressed
      modifybuttons(curr, next){
        document.getElementById(next).className = "button";
        document.getElementById(next).disabled = false;

        document.getElementById(curr).className = "completeButton";
        document.getElementById(curr).disabled = true;
      }



      async handleTest(val){
        if (val == "e"){
            this.createLog("email", "enter", "start")

            let success = await this.emailPW.testUser(this.emailAns)

            if (success == true){ 
              this.createLog("email", "enter", "goodLogin")
              this.createLog("email", "login", "success")

              this.modifybuttons("testE", "testB") 
              this.attempts = 3
            
            }else{
              this.attempts --
              this.createLog("email", "enter", "badLogin")

              if (this.attempts == 0){
                this.createLog("email", "login", "failure")

                this.modifybuttons("testE", "testB") 
                this.attempts = 3
              }
            }


        } else if (val == "b"){
          this.createLog("bank", "enter", "start")

            let success = await this.bankPW.testUser(this.bankAns)

            if (success == true){ 
              this.createLog("bank", "enter", "goodLogin")
              this.createLog("bank", "login", "success")

              this.modifybuttons("testB", "testS") 
              this.attempts = 3
            
            }else{
              this.attempts --
              this.createLog("bank", "enter", "badLogin")

              if (this.attempts == 0){
                this.createLog("bank", "login", "failure")

                this.modifybuttons("testB", "testS") 
                this.attempts = 3
              }
            }
    
        } else {
          this.createLog("shop", "enter", "start")
          let success = await this.shopPW.testUser(this.shopAns)

          if (success == true){ 
              this.createLog("shop", "enter", "goodLogin")
              this.createLog("shop", "login", "success")

              this.modifybuttons("testS", "finalB") 
              this.attempts = 3
            
            }else{
              this.attempts --
              this.createLog("shop", "enter", "badLogin")

              if (this.attempts == 0){
                this.createLog("shop", "login", "failure")

                this.modifybuttons("testS", "finalB") 
                this.attempts = 3
              }
            }

        }
      }

      //posts the data to the server for it to save to a file
      handleFinish(){
        $.post("/finish", {"logs": JSON.stringify(this.logs)} ,function(data,status){
            alert("thank you for your input, you many now leave the page");
        });
      }
      

      async handleCreate(val){
        //alexi's function
        if (val == "e"){
          this.createLog("email", "create", "start" )

          this.emailPW = new PassWindow()
          this.emailAns = await this.emailPW.getKey()
          this.modifybuttons("createE", "createS")

          this.createLog("email", "create", "success" )

        } else if (val == "b"){
          this.createLog("bank", "create", "start" )

          this.bankPW = new PassWindow()
          this.bankAns = await this.bankPW.getKey()
          this.modifybuttons("createB", "createE")
		  
          this.createLog("bank", "create", "success" )

        } else {
          this.createLog("shop", "create", "start" )

          this.shopPW = new PassWindow()
		      this.shopAns = await this.shopPW.getKey()
          this.modifybuttons("createS", "testE")

          this.createLog("shop", "create", "success" )
        }
      };
}

class PassWindow {
	
	/*opens new window, waits until it is closed, and captures the answer key.*/
	makeWindow() {
		
		var windowObj = window.open('/pass_window.html') //opens new window
		
		return new Promise(resolve => {
			
			windowObj.onbeforeunload = function(){ //captures callback for when pass_window is closed
				
				setTimeout(() => {
				  resolve(windowObj.answerKey);
				}, 10);
			}
		});
	}
	
	makeTestWindow(key) {
		
		let paramKey = ''
		for (let i = 0; i < 5; i++) {
			paramKey += key[i]
			if (i !=4)
			  paramKey += "_"
		}
				
		var windowObj = window.open("/pass_window_tester.html?num=" + encodeURI(paramKey)) //opens new window and passes answer key
		
		return new Promise(resolve => {
			
			windowObj.onbeforeunload = function(){ //captures callback for when pass_window is closed
				
				setTimeout(() => {
				  resolve(windowObj.success);
				}, 10);
			}
		});
	}
	
	async getKey() {
		return await this.makeWindow()
	}
	
	async testUser(key) {
		return await this.makeTestWindow(key)
	}
	
}

function main(){
    newUser = new user()
}