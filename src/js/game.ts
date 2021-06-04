class Game {
  public data: any;
  public resources: any;

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
