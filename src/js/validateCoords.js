export const validateCoords = (coords) => {
  let check = [coords].join("").includes(",");

  if (!check) {
    alert("Не правилньо введены координаты!");
    return;
  }

  let userCoords_ = coords.split(",");
  let _userCoords = [];
  for (const coord of userCoords_) {
    let coord_ = coord.replaceAll(" ", "");
    let coord__ = coord_.replaceAll("[", "");
    let coord___ = coord__.replaceAll("]", "");
    _userCoords.push(coord___);
  }
  console.log(_userCoords);
  return _userCoords;
}; // валидация координат
