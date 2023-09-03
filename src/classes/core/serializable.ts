export class Serializable {
  serialize(): JSONObject {
    throw new Error("Method not implemented.");
  }

  static deserialize<T extends typeof Serializable>(
    _json: JSONObject,
  ): InstanceType<T> {
    throw new Error("Method not implemented.");
  }
}
