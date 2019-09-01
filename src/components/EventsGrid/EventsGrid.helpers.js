export const getYForSpeed = (height, speed) => {
  const divisionHeight = height / 8;
  return height - speed * divisionHeight;
};
