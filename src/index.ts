import './style/index.less';

interface Position {
  x: number;
  y: number;
}

enum Direction { Up = 'up', Down = 'down', Left = 'left', Right = 'right'};

// 左37 上38  右39 下40
const KeyCodeMap: any  = {
  37: Direction.Left,
  38: Direction.Up,
  39: Direction.Right,
  40: Direction.Down,
}

//定义食物类
class Food{
  // 食物元素
  foodDiv: HTMLElement = document.getElementById('food') as HTMLElement;
  // 食物位置
  position:Position = { x:0, y:0 };
  // 构造函数中初始化食物
  
  // 获取食物x轴坐标
  getX(){
    return this.position.x;
  }
  // 获取食物y轴坐标
  getY(){
    return this.position.y;
  }
  // 修改事物的位置 => 位置随机 => 最小最大 => 单位为10
  foodPosition(){
    let x = Math.round(Math.random() * 30) * 10;
    let y = Math.round(Math.random() * 30) * 10;
    this.position = { x, y }
    console.log('position',this.position);
    this.paintFood(this.position);
  }
  // 绘制
  paintFood(position: Position){
    const { x, y } = position;
    this.foodDiv.style.left = String(x)+'px';
    this.foodDiv.style.top = String(y)+'px';
  }
}

// 定义记分牌类
class panelScore{
  score: number = 0;
  level: number = 0;
  scoreDiv: HTMLElement =  document.getElementById('score') as HTMLElement;
  levelDiv: HTMLElement = document.getElementById('level') as HTMLElement;
  //定义对应dom
  constructor(){
    
  }

  //写入对应dom内容
  paint(type: any){
    let dom: HTMLElement = type === 'score' ? this.scoreDiv : this.levelDiv;
    let text: number = type === 'score' ? this.score : this.level;
    let content: string = String(text);
    dom.innerHTML= content;
  }

  //设置加分方法
  addScore(){
    this.score += 20;
    this.paint('score');
    console.log('score',this.score);

  }
  //提升等级方法
  levelUp(){
    this.level += 20;
    this.paint('level');
  }
  //设置变量限制等级


}

// 定义🐍
class Snake{
  snakeDiv: HTMLElement = document.getElementById('snake') as HTMLElement;
  // 头位置
  position: Position = { x: 0, y: 0 };
  // 方向
  direction: string = Direction.Right;
  // 移速
  speed: number = 10;
  // 计时器
  timer: any = null;
  // 当前食物
  food: Food;

  constructor(food: Food){
    this.food = food;
  }

  // 获取🐍头x轴坐标
  getX(){
    return this.position.x;
  }
  // 获取🐍头y轴坐标
  getY(){
    return this.position.y;
  }
  // 设置位置
  setPosition(position: Position){
    this.position = position;
    const { x, y } = position;
    this.snakeDiv.style.left = String(x )+'px';
    this.snakeDiv.style.top = String(y)+'px';
  }
  // 移动: 默认向右，速度每秒10个单位[1单位为10px] 
  move(direction:Direction = Direction.Right, speed:number = 0.05){
    // 调整方向会重新生成定时器，清除上一次的定时器。
    if(this.direction !== direction && this.timer){
      clearInterval(this.timer);
      // this.timer = null
    };

    this.direction = direction;
    let { x, y } = this.position;
    let distance: number = speed * 10;
    // 开run
    this.timer = setInterval(()=> {
      // 是否撞墙?
      if(x >= 300 || y >= 300 || x <= 0 || y <= 0){
        console.log("撞墙！！！")
        console.log('clearInterval',this.timer)
        clearInterval(this.timer);
        this.timer = null;
      }
      // 是否捕获?
      if(this.isCaptured()){
        this.growUp();
        this.food.foodPosition();
      }
      // 随方向移动 CSS坐标系原因，右下为正方向、
      console.log('direction',this.direction, 'x: ' + x + ' y: ' + y,'this.timer',this.timer)
      switch (this.direction) {
        case Direction.Right:
          x += distance;
          break;
        case Direction.Down:
          y += distance;
          break;
        case Direction.Up:
          y -= distance;
          break;
        case Direction.Left:
          x -= distance;
          break;
        default:
          break;
      };
      // 布局
      this.setPosition({x, y})
    },16.67)
  }
  // 是否捕获?
  isCaptured(){
    const x1 = this.food.getX();
    const y1 = this.food.getY();  
    const x2 = this.getX();
    const y2 = this.getY();      
    if(Math.abs(x1 - x2) < 2 && Math.abs(y1 - y2) < 2){
      alert('找到食物了！找到食物了！找到食物了！');
      return true;
    }
  }
  // 快快长大
  growUp(){
    debugger; 
    const snakeWidth = parseInt(window.getComputedStyle(this.snakeDiv).width)
    this.snakeDiv.style.width = snakeWidth + 10 + 'px';
    console.log(' this.snakeDiv.style.width', this.snakeDiv.style.width);
  }
  // 撞墙检测: 
  bounceDetector(){
    const { x, y } = this.position;
    console.log('position',x, y);
    if(x >= 300 || y >= 300 || x < 0 || y < 0){
      alert('撞墙！！！'); 
      // 停止移动？
      clearInterval(this.timer);
      this.timer = null;
    }
  }
  // 头身碰撞检测：
  bodyBounceDetector(){
    
  }
}

// 定义手柄
class Handlebar{
  snake: Snake; 
  constructor(snake: Snake,){
    this.snake = snake;
  }
  // 监听键盘方向事件 左37 上38  右39 下40
  keyDownListener(){
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      console.log(e,e.keyCode);
      const { keyCode } = e;
      let direction: Direction = KeyCodeMap[keyCode];
      this.snake.move(direction);
    });
  }

}

const food = new Food();
const snake = new Snake(food);
const scorePanel = new panelScore();
const handlebar = new Handlebar(snake);
handlebar.keyDownListener();

setTimeout(() => {
  scorePanel.addScore();
  scorePanel.levelUp();
  food.foodPosition();
}, 0);

// for(let i=0; i< 100;i++){ 
// }

