export const TYPE_PARENT = 0;
export const TYPE_VOLUNTEER = 1;
export const TYPE_ORGANIZATION = 2;
export const POSITIONS = [
  { label: "Admin", value: "admin" },
  { label: "Junior", value: "junior" },
  { label: "Scout", value: "scout" },
];

export const getPositionByIndex = (position) => {
  let index = 0;
  return POSITIONS.map((p) => ({ ...p, id: index++ })).filter(
    (f) => f.value === position
  )[0];
};

export const DATE_FORMAT_DISPLAY = "ddd - MMM D, YYYY";
export const DATE_FORMAT_PICKER = "YYYY/MM/DD HH:mm";
export const TIME_FORMAT_DISPLAY = "hh:mm a";
export const TIME_FORMAT_PICKER = "HH:mm";

export const POSITION_L1 = "scout";

export const logo = require("../assets/unilogo.png");
