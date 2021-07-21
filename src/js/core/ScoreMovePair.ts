import Move from "./Move";
class ScoreMovePair {
  public score: number;
  public move: Move;

  constructor(score: number, move: Move) {
    this.score = score;
    this.move = move;
  }
}
export default ScoreMovePair;
