const menuService = require('../services/MenuService.ts');

import { MenuService } from './MenuService';

// Can be flaky, maybe use jest.mock

test('getMenuUrl', () => {
    const queries = [
        {
            location: 'brandywine',
            date: new Date(2023, 14, 1),
            mealPeriod: 'breakfast',
        },
    ];

    for (const query of queries) {
        const menuUrl = menuService.getCampusDishMenuUrl(query);

        expect(menuUrl).toBe(
            'https://uci.campusdish.com/api/menu/GetMenus?locationId=3314&date=12%3A00+AM&periodId=49',
        );
        console.log(menuUrl);
    }
});

test('getMenuFromCampusDish', async () => {
    const queries = [
        {
            location: 'brandywine',
            date: new Date(2023, 14, 1),
            mealPeriod: 'breakfast',
        },
    ];

    for (const query of queries) {
        const menu = await menuService.getMenuFromCampusDish(query);
        expect(menu.length).toBeGreaterThan(0);
    }
});

test('getMenuFromDB', async () => {
    const queries = [
        {
            location: 'brandywine',
            date: new Date(2023, 14, 1),
            mealPeriod: 'breakfast',
        },
    ];
});
