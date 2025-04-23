import { _decorator, CCInteger, Component, Node, Vec3, screen, find, UITransform } from 'cc';
const { ccclass, property } = _decorator;


const random = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
}

@ccclass('Pipes')
export class Pipes extends Component {

    @property({
        type: Node,
        tooltip: 'this is pipe top',
    })
    public pipeTop: Node;

    @property({
        type: Node,
        tooltip: 'this is pipe bottom',
    })
    public pipeBottom: Node;

   public tempStartLocationUp: Vec3 = new Vec3;
   public tempStartLocationDown: Vec3 = new Vec3;
   public scene = screen.windowSize;

    public game; //speed from GameCtrl
    public pipeSpeed: number; //final speed of pipe
    public tempSpeed: number; //temp speed of pipe

    isPass: boolean = false; //if the pipe is passed by the bird +1 score

    onLoad(){
        this.game = find('GameCtrl').getComponent('GameCtrl');
        this.pipeSpeed = this.game.pipeSpeed;
        this.initPos();
        this.isPass = false;
    }

    initPos(){
        this.tempStartLocationUp.x = this.scene.width + this.pipeTop.getComponent(UITransform).width;
        this.tempStartLocationDown.x = this.scene.width + this.pipeBottom.getComponent(UITransform).width;

        let gap = random(90, 100);
        let topHeight = random(0, 450);
        let bottomHeight = topHeight - (gap*10);

        this.tempStartLocationUp.y = topHeight;
        this.tempStartLocationDown.y = bottomHeight;

        this.pipeBottom.setPosition(this.tempStartLocationDown);
        this.pipeTop.setPosition(this.tempStartLocationUp);
    }

    update(deltaTime: number) {

        this.tempSpeed = this.pipeSpeed * deltaTime;

        this.tempStartLocationDown = this.pipeBottom.position;
        this.tempStartLocationUp = this.pipeTop.position;


        this.tempStartLocationDown.x -= this.tempSpeed;
        this.tempStartLocationUp.x -= this.tempSpeed;

        this.pipeBottom.setPosition(this.tempStartLocationDown);
        this.pipeTop.setPosition(this.tempStartLocationUp);

        if(this.isPass == false && this.pipeTop.position.x <= 0){
            this.isPass = true;
            this.game.passPipe();
        }

        if(this.pipeTop.position.x <= -this.scene.width){
            this.game.createPipe();
            this.pipeBottom.destroy();
        }


    }
}


