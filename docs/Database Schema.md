Taking a look inside `./packages/db/src/schema` we find something like this:

```
📦packages/db
 ┣ 📂node_modules 
 ┣ 📂src 
 ┃ ┗ 📂schema
 ┃	 ┣ 📜dietRestriction.ts
 ┃	 ┣ 📜dishes.ts
 ┃	 ┣ 📜enums.ts
 ┃	 ┣ 📜dishes.ts
 ┃	 ...
 ...
```

Each `.ts` file contains all information for a single table in the database. 
This is created using `DrizzleORM`.

The ER diagram can be found below:

```mermaid 
erDiagram
   push_tokens {
      token text
   }

   dishes_to_menus {
      menu_id text
      dish_id text
   }

   pins {
      user_id text
      dish_id text
      created_at timestamp
      updated_at timestamp
   }

   ratings {
      user_id text PK,FK
      dish_id text PK,FK
      rating smallint
      created_at timestamp
      updated_at timestamp
   }

   dishes {
      id text PK
      station_id text FK
      name text
      description text
      category text
      num_ratings intger
      total_rating integer
      created_at timestamp
      updated_at timestamp
   }

   users {
      id text PK
      name text
      created_at timestamp
      updated_at timestamp
   }

   menus {
      id text PK
      period_id text FK
      date date
      restaurant_id restaurant_id_enum
      price text
      created_at timestamp
      updated_at timestamp
   }

   diet_restrictions {
      dish_id text PK,FK
      contains_eggs boolean
      contains_fish boolean
      contains_milk boolean
      contains_peanuts boolean
      contains_sesame boolean
      contains_shellfish boolean
      contains_soy boolean
      contains_tree_nuts boolean
      contains_wheat boolean
      is_gluten_free boolean
      is_halal boolean
      is_kosher boolean
      is_locally_grown boolean
      is_organic boolean
      is_vegan boolean
      is_vegetarian boolean
      created_at timestamp
      updated_at timestamp
   }

   nutrition_infos {
      dish_id text PK,FK
      serving_size text
      serving_unit text
      calories text
      total_fat_g text
      trans_fat_g text
      saturated_fat_g text
      cholesterol_mg text
      sodium_mg text
      total_carbs_g text
      dietary_fiber_g text
      sugars_mg text
      protein_g text
      vitamin_a_iu text
      vitamin_c_iu text
      calcium_mg text
      iron_mg text
      created_at timestamp
      updated_at timestamp
   }

   stations {
      id text PK
      name text
      restaurant_id restaurant_id_enum
      created_at timestamp
      updated_at timestamp
   }

   events {
      title text PK
      restaurant_id restaurant_id_enum PK,FK
      short_description text
      long_description text
      start timestamp PK
      end timestamp
      created_at timestamp
      updated_at timestamp
   }

   periods {
      id text PK
      start time
      end time
      name text
      created_at timestamp
      updated_at timestamp
   }

   restaurants {
      id restaurant_id_enum PK
      name restaurant_name_enum
      created_at timestamp
      update_at timestamp
   }

   restaurant_id_enum

   restaurant_name_enum

   dishes_to_menus }o--|| menus : has
   dishes_to_menus }o--|| dishes : has

   pins }o--|| users : refers
   pins }o--|| dishes : refers

   ratings }o--|| users : refers
   ratings ||--|| dishes : refers

   dishes ||--|| diet_restrictions : refers
   dishes ||--|| nutrition_infos : refers
   dishes }o--|| stations : refers

   menus ||--|| periods : refers
   menus ||--|| restaurant_id_enum : has
   menus ||--|| restaurants : refers

   stations }o--|| restaurants : refers

   stations ||--|| restaurant_id_enum : refers

   events ||--|| restaurant : occurs
   events ||--|| restaurant_id_enum : refers
   
   restaurants ||--|| restaurant_id_enum : refers
   restaurants ||--|| restaurant_name_enum : refers
   
```