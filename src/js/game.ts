class Game {
  public data: Record<string, unknown>;
  public resources: Array<Record<string, unknown>>;

  constructor() {
    this.data = {
      score: 0,
    };

    this.resources = [
      { name: "background", type: "image", src: "data/img/background.jpeg" },
      { name: "background", type: "tmx", src: "data/map/background.tmx" },
    ];
  }
}

export default new Game();
