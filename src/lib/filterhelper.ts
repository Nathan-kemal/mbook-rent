export default function SearchHandler(params: any) {
  const filters = JSON.parse(params.filters);
  const sorting = JSON.parse(params.sorting);

  const orderByClause =
    sorting.length > 0 && sorting[0].id
      ? { [sorting[0].id]: sorting[0].desc ? "desc" : "asc" }
      : undefined;

  const whereConditions: any[] = [];
  console.log(sorting);
  if (params.globalFilter) {
    whereConditions.push({
      OR: [
        { bookName: { contains: params.globalFilter } },
        { author: { contains: params.globalFilter } },
        { category: { contains: params.globalFilter } },
        { status: { contains: params.globalFilter } },
        {
          User: {
            OR: [
              { firstName: { contains: params.globalFilter } },
              { lastName: { contains: params.globalFilter } },
            ],
          },
        },
      ],
    });
  }

  filters.forEach((filter: any) => {
    switch (filter.id) {
      case "bookName":
        whereConditions.push({ bookName: { contains: filter.value } });
        break;
      case "author":
        whereConditions.push({ author: { contains: filter.value } });
        break;
      case "owner":
        whereConditions.push({
          User: {
            OR: [
              { firstName: { contains: filter.value } },
              { lastName: { contains: filter.value } },
            ],
          },
        });
        break;
      case "category":
        whereConditions.push({ category: { contains: filter.value } });
        break;
      case "status":
        whereConditions.push({ status: { contains: filter.value } });
        break;
    }
  });

  return { whereConditions, orderByClause };
}
