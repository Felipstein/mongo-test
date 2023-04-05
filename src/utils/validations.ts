export function someIsNullish(...values: any[] | any) {
  const nullish = [undefined, null];

  if(nullish.includes(values)) {
    return true;
  }

  return values.some((value: any) => nullish.includes(value));
}

export function someIsNull(...values: any[] | any) {
  if(values === null) {
    return true;
  }

  return values.some((value: any) => value === null);
}