import Logger from "../../helpers/Logger";
import me from "../me";

class PlayerEntity extends me.Entity {
  constructor(x: number, y: number, settings: unknown) {
    super(x, y, settings);

    Logger.info("show player", PlayerEntity.name);
  }

  update(dt: unknown): boolean {
    // apply physics to the body (this moves the entity)
    this.body.update(dt);

    // handle collisions against other shapes
    me.collision.check(this);

    // return true if we moved or if the renderable was updated
    return super.update(dt) || this.body.vel.x !== 0 || this.body.vel.y !== 0;
  }

  onCollision(response: unknown, other: unknown): boolean {
    // Make all other objects solid
    return true;
  }
}

export default PlayerEntity;
