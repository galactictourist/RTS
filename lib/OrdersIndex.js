OrdersIndex = new EasySearch.Index({
  collection: Orders,
  fields: ['orderId', 'custName'],
  defaultSearchOptions:{limit:8},
  engine: new EasySearch.MongoDB()
});