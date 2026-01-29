class SoundManager{

 constructor(game){
  this.game = game
 }   

  sound = null;

 Horrorsound = () => {
   if (this.Sound) {
     this.Sound.pause(); 
   }
   this.Sound = new Audio('../js/game/Sounds/fear.mp3');
   this.Sound.loop = true;
   this.Sound.play();
 };
 
 Actionsound = () => {
   if (this.Sound) {
     this.Sound.pause(); 
   }
   this.Sound = new Audio('../js/game/Sounds/normal.mp3');
   this.Sound.loop = true;
   this.Sound.play();
 };
 


}