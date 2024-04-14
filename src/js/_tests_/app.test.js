import { validateCoords } from "../validateCoords";
test("validate coords", () => {
  let coords = "  [  -  1  2  3  .  4  5  6  ,     -  7  8  9  .  1  2  3  ]  ";
  let result = validateCoords(coords);
  expect(result).toStrictEqual(["-123.456", "-789.123"]);
});
