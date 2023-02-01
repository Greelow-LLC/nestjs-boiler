//Deletes selected keys from an object
export const exclude = <T extends object | void = void>(
  item: T,
  ...keys: Array<keyof T>
) => {
  for (const key of keys) {
    delete item[key];
  }

  return item;
};
