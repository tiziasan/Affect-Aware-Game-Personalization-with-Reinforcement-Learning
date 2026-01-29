
class ActionHandlerForEmotion {

   popup = document.createElement("div");
 box = document.createElement("div");
 confirmBtn = document.createElement("button");
 

  constructor(game) {
    this.isNumberReceived = false;
    this.game = game;
   
    this.ws = new WebSocket('ws://localhost:8080');
    this.ws.onopen = () => {
      console.log('WebSocket connection opened');
    };
    this.ws.onmessage = (event) => {
      let parsedMessage = JSON.parse(event.data);
       if (parsedMessage.clientId !== PostHandler.clientId) {
        console.log('Received data from server:', parsedMessage.data);
      this.getAction(Number(parsedMessage.data));
        
      }
     
    };
    
    this.sendNotification = new NotificationManager();

    this.sound = new SoundManager(game);
    this.sound.Actionsound()  
  }

   async getAction(action_index){

      switch (action_index) {
          case this.Actions.Hard:
           this.game.notificationManager.setNotif('Game Difficulty Set to HARD')
           this.game.zombieManager.setDifficultyLevel("HARD")
     
           break;
          case this.Actions.Regular:
            this.game.notificationManager.setNotif('Game Difficulty Set to REGULAR')
            this.game.zombieManager.setDifficultyLevel("REGULAR")
            break;
          case this.Actions.Easy:
            this.game.notificationManager.setNotif('Game Difficulty Set to EASY')
          this.game.zombieManager.setDifficultyLevel("EASY")
           break;
         case this.Actions.Colorred:
           this.game.zombieManager.setKiled()
           this.game.zombieManager.changecolor(16711680); 
           break;
         case this.Actions.Colorgreen:
           this.game.zombieManager.setKiled()
           this.game.zombieManager.changecolor(0x6f9a8d);
           break;
        case this.Actions.Popuphidden:
          this.hidePopup()
          break;
        case this.Actions.PopupVisible:
           this.popups("Try to kill the zombies and level up!")
          break;
        case this.Actions.SoundNormal:
          this.sound.Horrorsound();        
          break;
        case this.Actions.SoundHorror:
          this.sound.Actionsound();
          break;
        case this.Actions.DoNothing:
          break;
      }
    
  
    }

 

    
 popups = (Msg) => {

  this.box.style.backgroundColor = "#fff";
  this.box.style.border = "1px solid #000";
  this.box.style.padding = "10px";
  this.box.style.display = "flex"; 
  this.box.style.flexDirection = "column"; 
  this.box.style.justifyContent = "center";
  this.box.style.alignItems = "center";

  this.box.textContent = Msg;

  this.confirmBtn.textContent = "Confirm"; 
  this.confirmBtn.style.marginTop = "10px"; 

  this.confirmBtn.addEventListener("click", () => {
    this.popup.style.display = "none"; 
  });

  this.box.appendChild(this.confirmBtn); 

  this.popup.appendChild(this.box);

  this.popup.style.backgroundColor = "rgba(0,0,0,0.5)";
  this.popup.style.position = "fixed";
  this.popup.style.left = "0";
  this.popup.style.top = "0";
  this.popup.style.width = "100%";
  this.popup.style.height = "100%";
  this.popup.style.display = "flex";
  this.popup.style.justifyContent = "center";
  this.popup.style.alignItems = "center";

  document.body.appendChild(this.popup);
};


 hidePopup = () => {

  this.popup.style.display = "none";

}

 Actions = {
  Hard: 0,
  Regular: 1,
  Easy: 2,
  Colorred: 3,
  Colorgreen: 4,
  Popuphidden: 5,
  PopupVisible: 6,
  SoundNormal: 7,
  SoundHorror: 8,
  DoNothing: 9
};

}




