
class ZombieManager {
  constructor(game) {
    this.initMembers(game)
    this.initZombies()
    this.initDOMs()
    this.color = 0x6f9a8d
  }
 
  initMembers = game => {
    this.game = game
    this.level = 0
    this.ZombiesKilled = 0
    this.zombieCount = 0
    this.zombies = new Map()
  }

  initZombies = () => {
    this.setDifficultyLevel("REGULAR")
    this.setupLevel()

  }
  initDOMs = () => {
    this.updateDOMS()
  }

  getKilledZombies(){
    return this.ZombiesKilled
  }

  getLevel(){
   return this.level;
  }

  update = delta => {
    this.zombies.forEach(zombie => {
      zombie.update(delta)
    })

  }
  updateDOMS = () => {
    this.updateLvlDOM()
    this.updateZBDOM()
  }
  updateLvlDOM = () => setLvlDOM(this.level)
  updateZBDOM = () => {
    setZBDOM(this.zombieCount)
  }

  changecolor = (test) => {
    this.color = test;
    this.zombies.forEach(zombie => {
      if(zombie.isAlive){
        zombie.drawColor(test)
      }
    })
  }
  setKiled = () => {
    this.zombies.forEach(zombie => {
      if(zombie.isAlive){
        zombie.testtokill()
      }
    })
   
  }
  testKiled = async() => {
    this.zombies.forEach(zombie => {
        zombie.kill()    
    })
    this.level--
  }

  setDifficultyLevel = (diff) =>{
    localStorage.setItem('gamemode', diff)
  }


  

  setupLevel = () => {
      this.level++
      const count = getZombieCount(this.level)

    for (let i = 0; i < count; i++) {
      const { x, y } = this.game.world.getRandomSpawner()

      const newZombie = new Zombie(this.game, x, y)
      this.zombies.set(newZombie.id, newZombie)
    }
    this.zombieCount = count
  
    this.updateZBDOM()
    this.updateLvlDOM()
  }
  setDead = zombie => {
    this.ZombiesKilled++
    this.zombieCount--
    this.updateZBDOM()
    if (this.zombieCount <= 0) {
      this.game.regenPodManager.genPod(zombie.x, zombie.y)
       const difficulty = getDifficulty()
       this.setupLevel(difficulty)
       
       if(this.color!=undefined){
         this.game.zombieManager.setKiled()
         this.game.zombieManager.changecolor(this.color);
       }
    }
  }
}
