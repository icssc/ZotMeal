// import MenuService from './MenuService';

// // Can be flaky, maybe use jest.mock

// test('getMenuFromCampusDish', async () => {
//   const queries = [
//     {
//       location: 'brandywine',
//       date: new Date(2023, 14, 1),
//       mealPeriod: 'breakfast',
//     },
//   ];

//   for (const query of queries) {
//     const menu = await MenuService.getMenuFromCampusDish(query);
//     expect(menu.length).toBeGreaterThan(0);
//   }
// });

// test('getMenuFromDB', async () => {
//   const queries = [
//     {
//       location: 'brandywine',
//       date: new Date(2023, 14, 1),
//       mealPeriod: 'breakfast',
//     },
//   ];
// });

test('getMenu', async () => {
  it('happy case', () => {
    throw new Error('unimplemented test');
  });

  it('invalid params', () => {
    throw new Error('unimplemented test');
  });

  it('cache miss', () => {
    throw new Error('unimplemented test');
  });

  it('cache hit', () => {
    throw new Error('unimplemented test');
  });
});
