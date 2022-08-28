export const getDeletingFundIds = (
  listFundIds: string[],
  ids: string[]
): string[] => {
  return ids.filter((e) => !listFundIds.includes(e));
};
