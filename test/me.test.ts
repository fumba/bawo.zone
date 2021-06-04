import me from "../src/js/me";

test("should load me - melonjs", () => {
  expect(me.version).toBe("8.0.1");
});
