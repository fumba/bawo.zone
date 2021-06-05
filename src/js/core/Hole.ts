import MoveDirection from "./MoveDirection";
import Player from "./Player";

class Hole {
  // Number of seeds in hole
  public numSeeds: number;
  // The next hole
  public nextHole: Hole;
  // Previous hole
  public prevHole: Hole;
  // Holes unique ID
  public readonly id: number;
  // The player who is assigned this hole
  public readonly player: Player;
  // Whether the player is allowed to make moves on this hole.
  private moveStatus: MoveDirection;

  /**
   * Constructor
   *
   * @param player   The player to whom this hole is being assigned to
   * @param id       Unique hole ID (Ranging 0-16) -1 is used for the dummy
   *                 pointer to the first hole.
   * @param numSeeds Number of seeds to be initially added to the hole.
   * @param nextHole The hole that comes up next in clockwise fashion
   * @param prevHole The hole that is before this hole.
   */
  constructor(
    player: Player,
    id: number,
    numSeeds: number,
    nextHole: Hole,
    prevHole: Hole
  ) {
    this.player = player;
    this.id = id;
    this.numSeeds = numSeeds;
    this.nextHole = nextHole;
    this.prevHole = prevHole;

    // initialize move status as unauthorized
    this.moveStatus = MoveDirection.UnAuthorised;
  }

  public toString(): string {
    return `[${this.id}(${this.numSeeds})-${this.moveStatus}]`;
  }
}

export default Hole;
