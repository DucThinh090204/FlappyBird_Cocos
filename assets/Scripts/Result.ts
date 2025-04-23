import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Result')
export class Result extends Component {

    @property({
        type: Label,
        tooltip: 'this is score label',
    })
    public scoreLabel: Label;

    @property({
        type: Label,
        tooltip: 'this is high score label',
    })
    public highScoreLabel: Label;

    @property({
        type: Label,
        tooltip: 'this is result label',
    })
    public resultEnd: Label;

    maxScore: number = 0;
    currentScore: number;

    updateScore(num: number) {
        this.currentScore = num;

        this.scoreLabel.string = this.currentScore.toString();
    }

    resetScore() {
        this.updateScore(0);
        this.hideResults();
    }

    addScore() {
        this.updateScore(this.currentScore + 1);
    }

    showResults() {
        this.maxScore = Math.max(this.currentScore, this.maxScore);
        this.highScoreLabel.string = 'High Score: ' + this.maxScore.toString();
        this.resultEnd.node.active = true;
        this.highScoreLabel.node.active = true;
    }

    hideResults() {
        this.resultEnd.node.active = false;
        this.highScoreLabel.node.active = false;
    }
}


