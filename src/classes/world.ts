import { Environment } from "./environment";
import { Projectile } from "./projectile";

export class World {
  static tick(env: Environment, proj: Projectile) {
    const position = proj.position.add(proj.velocity);
    const velocity = proj.velocity.add(env.gravity).add(env.wind);

    return new Projectile(position, velocity);
  }
}
