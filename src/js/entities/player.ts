import me from '../me';

class PlayerEntity extends me.Entity {

    constructor(x: Number, y: Number, settings: any) {
        super(x, y, settings);

        console.log('show player');
    }

    update(dt: any) {
        // apply physics to the body (this moves the entity)
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);

        // return true if we moved or if the renderable was updated
        return super.update(dt) || this.body.vel.x !== 0 || this.body.vel.y !== 0;
    }

    onCollision(response: any, other: any) {
        // Make all other objects solid
        return true;
    }
}

export default PlayerEntity;