/*
 * https://github.com/morethanwords/tweb
 * Copyright (C) 2019-2021 Eduard Kuzmenko
 * https://github.com/morethanwords/tweb/blob/master/LICENSE
 */

export function nextRandomInt(maxValue: number) {
  return Math.floor(Math.random() * maxValue);
}

export function randomLong() {
  return '' + nextRandomInt(0xFFFFFFFF) + nextRandomInt(0xFFFFFF);
  //return '' + parseInt(nextRandomInt(0xFFFFFFFF).toString(16) + nextRandomInt(0xFFFFFFFF).toString(16), 16);
}
