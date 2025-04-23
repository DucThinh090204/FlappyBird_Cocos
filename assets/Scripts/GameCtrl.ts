import { _decorator, CCInteger, Component, Contact2DType, Collider2D, director, EventKeyboard, IPhysics2DContact, Input, input, KeyCode, Node } from 'cc';
const { ccclass, property } = _decorator;

import { Ground } from './Ground';
import { Result } from './Result';
import { Bird } from './Bird';
import { PipePool } from './PipePool';
import { BirdAudio } from './BirdAudio';


@ccclass('GameCtrl')
export class GameCtrl extends Component {

    @property({
        type: Ground,
        tooltip: 'this is ground',
    })
    public ground: Ground

    @property({
        type: PipePool,
        tooltip: 'this is pipe pool',
    })
    public pipeQueue: PipePool

    @property({
        type: Result,
        tooltip: 'this is result',
    })
    public result: Result

    @property({
        type: Bird,
        tooltip: 'this is bird',
    })
    public bird: Bird

    @property({
        type: BirdAudio,
        tooltip: 'this is bird audio',
    })
    public birdAudio: BirdAudio

    @property({
        type: CCInteger,
        tooltip: 'this is game speed',
    })
    public speed: number = 300;

    @property({
        type: CCInteger,
        tooltip: 'this is pipe speed',
    })
    public pipeSpeed: number = 200;

    public isOver: boolean;

    onLoad() {
        this.initListeners();
        this.result.resetScore();
        this.isOver = true;
        director.pause();

    }

    initListeners() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        this.node.on(Input.EventType.TOUCH_START, () => {
            if(this.isOver == true){
                this.resetGame();
                this.bird.resetBird();
                this.startGame();
            }

            if(this.isOver == false){
                this.bird.fly();
                this.birdAudio.onAudioQueue(0);
            }
        });
    }

    //Testing in development
    onKeyDown(event: EventKeyboard) {
        switch(event.keyCode) {
            case KeyCode.KEY_A:
                this.gameOver();
                break;
            case KeyCode.KEY_P:
                this.result.addScore();
                break;
            case KeyCode.KEY_Q:
                this.resetGame();
                this.bird.resetBird();
       }
    }

    gameOver(){
        this.birdAudio.onAudioQueue(3);
        this.result.showResults();
        this.isOver = true;
        director.pause();
    }

    resetGame() {
        this.result.resetScore();
        this.pipeQueue.reset();
        this.isOver = false;
        this.startGame();
    }

    startGame() {
        this.result.hideResults();
        director.resume();
    }

    passPipe() {
        this.result.addScore();
        this.birdAudio.onAudioQueue(1);
    }

    createPipe(){
        this.pipeQueue.addpool();
    }
    
    contractGroundPipe() {
        let collider = this.bird.getComponent(Collider2D);
        if(collider){
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact |null) {
        this.bird.hitSomething = true;
        this.birdAudio.onAudioQueue(2);
    }

    birdStruck(){
        this.contractGroundPipe();

        if(this.bird.hitSomething == true){
            this.gameOver();
        }
    }

    update() {
        if(this.isOver == false){
            this.birdStruck();
        }
    }
}


