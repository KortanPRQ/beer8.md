import pool from './connection';
import bcrypt from 'bcryptjs';

export const seedDatabase = async () => {
  try {
    console.log('🌱 Seeding initial data...\n');

    // Seed admin roles
    await seedAdminRoles();
    
    // Seed default admin user
    await seedAdminUser();
    
    // Seed menu categories
    await seedMenuCategories();
    
    // Seed menu items with translations
    await seedMenuItems();
    
    // Seed reservation zones
    await seedReservationZones();
    
    // Seed gallery categories
    await seedGalleryCategories();
    
    // Seed blog categories
    await seedBlogCategories();
    
    // Seed site settings
    await seedSiteSettings();

    console.log('✅ All seed data inserted successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
};

const seedAdminRoles = async () => {
  console.log('  📝 Seeding admin roles...');
  
  const roles = [
    { role_name: 'owner', description: 'Full access to everything' },
    { role_name: 'administrator', description: 'All except financial reports and owner settings' },
    { role_name: 'manager', description: 'Menu, reservations, gallery, basic reports' }
  ];

  for (const role of roles) {
    await pool.query(
      'INSERT INTO admin_roles (role_name, description) VALUES (?, ?) ON DUPLICATE KEY UPDATE description = ?',
      [role.role_name, role.description, role.description]
    );
  }
};

const seedAdminUser = async () => {
  console.log('  👤 Seeding admin user...');
  
  const password = await bcrypt.hash('admin123', 12);
  
  await pool.query(`
    INSERT INTO users (email, password_hash, first_name, last_name, role, email_verified, account_status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)
  `, ['admin@beer8.md', password, 'Admin', 'Beer8', 'owner', true, 'active']);
};

const seedMenuCategories = async () => {
  console.log('  📚 Seeding menu categories...');
  
  const categories = [
    { name_key: 'cold_appetizers', display_order: 1, icon: 'appetizer' },
    { name_key: 'fried_with_hoppy', display_order: 2, icon: 'fried' },
    { name_key: 'beer_companions', display_order: 3, icon: 'snack' },
    { name_key: 'salads', display_order: 4, icon: 'salad' },
    { name_key: 'gifts_of_ocean', display_order: 5, icon: 'seafood' },
    { name_key: 'burgers', display_order: 6, icon: 'burger' },
    { name_key: 'cauldron_of_flavors', display_order: 7, icon: 'pot' },
    { name_key: 'saute', display_order: 8, icon: 'pan' },
    { name_key: 'hosper', display_order: 9, icon: 'grill' },
    { name_key: 'steaks', display_order: 10, icon: 'steak' },
    { name_key: 'meat_from_steppes', display_order: 11, icon: 'meat' },
    { name_key: 'fried_for_soul', display_order: 12, icon: 'comfort' },
    { name_key: 'sauces', display_order: 13, icon: 'sauce' },
    { name_key: 'desserts', display_order: 14, icon: 'dessert' },
    { name_key: 'draft_beer', display_order: 15, icon: 'beer_tap' },
    { name_key: 'bottled_beer', display_order: 16, icon: 'beer_bottle' },
    { name_key: 'alcohol', display_order: 17, icon: 'drinks' },
    { name_key: 'drinks', display_order: 18, icon: 'beverage' }
  ];

  for (const category of categories) {
    await pool.query(
      'INSERT INTO menu_categories (name_key, display_order, icon) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE display_order = VALUES(display_order)',
      [category.name_key, category.display_order, category.icon]
    );
  }
};

const seedMenuItems = async () => {
  console.log('  🍽️  Seeding menu items...');
  
  const menuItems = [
    // Cold Appetizers
    { category: 'cold_appetizers', name_ru: 'Сырная тарелка', name_ro: 'Platou de brânzeturi', name_en: 'Cheese Plate', desc_ru: 'Ассорти из местных и импортных сыров', desc_ro: 'Sortiment de brânzeturi locale și importate', desc_en: 'Assortment of local and imported cheeses', price: 180 },
    { category: 'cold_appetizers', name_ru: 'Мясная нарезка', name_ro: 'Platou de mezeluri', name_en: 'Meat Platter', desc_ru: 'Домашние колбаски, хамон, салями', desc_ro: 'Cârnați de casă, jamón, salam', desc_en: 'Homemade sausages, jamón, salami', price: 220 },
    { category: 'cold_appetizers', name_ru: 'Хумус классический', name_ro: 'Hummus clasic', name_en: 'Classic Hummus', desc_ru: 'С оливковым маслом и зеленью', desc_ro: 'Cu ulei de măsline și verdeață', desc_en: 'With olive oil and herbs', price: 85 },
    { category: 'cold_appetizers', name_ru: 'Маринованные овощи', name_ro: 'Legume murate', name_en: 'Pickled Vegetables', desc_ru: 'Огурцы, помидоры, капуста', desc_ro: 'Castraveți, roșii, varză', desc_en: 'Cucumbers, tomatoes, cabbage', price: 65 },

    // Fried with Hoppy
    { category: 'fried_with_hoppy', name_ru: 'Куриные крылышки BBQ', name_ro: 'Aripioare de pui BBQ', name_en: 'BBQ Chicken Wings', desc_ru: 'Хрустящие крылышки в соусе барбекю', desc_ro: 'Aripioare crocante în sos BBQ', desc_en: 'Crispy wings in BBQ sauce', price: 145 },
    { category: 'fried_with_hoppy', name_ru: 'Луковые кольца', name_ro: 'Inele de ceapă', name_en: 'Onion Rings', desc_ru: 'В пивном кляре с соусом', desc_ro: 'În aluat de bere cu sos', desc_en: 'In beer batter with sauce', price: 75 },
    { category: 'fried_with_hoppy', name_ru: 'Картофель фри', name_ro: 'Cartofi prăjiți', name_en: 'French Fries', desc_ru: 'Хрустящий картофель с специями', desc_ro: 'Cartofi crocanti cu condimente', desc_en: 'Crispy potatoes with spices', price: 60 },
    { category: 'fried_with_hoppy', name_ru: 'Кальмары в кляре', name_ro: 'Calmar în aluat', name_en: 'Fried Calamari', desc_ru: 'С лимоном и чесночным соусом', desc_ro: 'Cu lămâie și sos de usturoi', desc_en: 'With lemon and garlic sauce', price: 165 },

    // Beer Companions
    { category: 'beer_companions', name_ru: 'Сухарики чесночные', name_ro: 'Crutoane cu usturoi', name_en: 'Garlic Croutons', desc_ru: 'Домашние сухарики с чесноком', desc_ro: 'Crutoane de casă cu usturoi', desc_en: 'Homemade garlic croutons', price: 45 },
    { category: 'beer_companions', name_ru: 'Фисташки жареные', name_ro: 'Fistic prăjit', name_en: 'Roasted Pistachios', desc_ru: 'Соленые фисташки', desc_ro: 'Fistic sărat', desc_en: 'Salted pistachios', price: 95 },
    { category: 'beer_companions', name_ru: 'Сырные палочки', name_ro: 'Bețișoare cu brânză', name_en: 'Cheese Sticks', desc_ru: 'Хрустящие сырные палочки', desc_ro: 'Bețișoare crocante cu brânză', desc_en: 'Crispy cheese sticks', price: 85 },
    { category: 'beer_companions', name_ru: 'Арахис жареный', name_ro: 'Alune prăjite', name_en: 'Roasted Peanuts', desc_ru: 'Соленый арахис', desc_ro: 'Arahide sărate', desc_en: 'Salted peanuts', price: 55 },

    // Salads
    { category: 'salads', name_ru: 'Цезарь с курицей', name_ro: 'Cezar cu pui', name_en: 'Caesar Salad with Chicken', desc_ru: 'Классический салат Цезарь', desc_ro: 'Salată Cezar clasică', desc_en: 'Classic Caesar salad', price: 135 },
    { category: 'salads', name_ru: 'Греческий салат', name_ro: 'Salată grecească', name_en: 'Greek Salad', desc_ru: 'С фетой и оливками', desc_ro: 'Cu feta și măsline', desc_en: 'With feta and olives', price: 120 },
    { category: 'salads', name_ru: 'Овощной салат', name_ro: 'Salată de legume', name_en: 'Vegetable Salad', desc_ru: 'Свежие овощи с оливковым маслом', desc_ro: 'Legume proaspete cu ulei de măsline', desc_en: 'Fresh vegetables with olive oil', price: 95 },
    { category: 'salads', name_ru: 'Салат с тунцом', name_ro: 'Salată cu ton', name_en: 'Tuna Salad', desc_ru: 'Тунец, яйца, оливки', desc_ro: 'Ton, ouă, măsline', desc_en: 'Tuna, eggs, olives', price: 145 },

    // Gifts of the Ocean
    { category: 'gifts_of_ocean', name_ru: 'Лосось на гриле', name_ro: 'Somon la grătar', name_en: 'Grilled Salmon', desc_ru: 'С овощами гриль', desc_ro: 'Cu legume la grătar', desc_en: 'With grilled vegetables', price: 285 },
    { category: 'gifts_of_ocean', name_ru: 'Креветки в чесноке', name_ro: 'Creveți cu usturoi', name_en: 'Garlic Shrimp', desc_ru: 'Королевские креветки', desc_ro: 'Creveți regali', desc_en: 'King prawns', price: 320 },
    { category: 'gifts_of_ocean', name_ru: 'Мидии в белом вине', name_ro: 'Midii în vin alb', name_en: 'Mussels in White Wine', desc_ru: 'С зеленью и чесноком', desc_ro: 'Cu verdeață și usturoi', desc_en: 'With herbs and garlic', price: 195 },
    { category: 'gifts_of_ocean', name_ru: 'Рыба и чипсы', name_ro: 'Pește și chipsuri', name_en: 'Fish and Chips', desc_ru: 'Треска в пивном кляре', desc_ro: 'Cod în aluat de bere', desc_en: 'Cod in beer batter', price: 175 },

    // Burgers
    { category: 'burgers', name_ru: 'Классический бургер', name_ro: 'Burger clasic', name_en: 'Classic Burger', desc_ru: 'Говядина, сыр, овощи', desc_ro: 'Vită, brânză, legume', desc_en: 'Beef, cheese, vegetables', price: 145 },
    { category: 'burgers', name_ru: 'BBQ бургер', name_ro: 'Burger BBQ', name_en: 'BBQ Burger', desc_ru: 'С соусом барбекю и беконом', desc_ro: 'Cu sos BBQ și bacon', desc_en: 'With BBQ sauce and bacon', price: 165 },
    { category: 'burgers', name_ru: 'Чикен бургер', name_ro: 'Burger de pui', name_en: 'Chicken Burger', desc_ru: 'Куриная котлета, салат, соус', desc_ro: 'Cotlet de pui, salată, sos', desc_en: 'Chicken patty, lettuce, sauce', price: 135 },
    { category: 'burgers', name_ru: 'Двойной бургер', name_ro: 'Burger dublu', name_en: 'Double Burger', desc_ru: 'Две котлеты, двойной сыр', desc_ro: 'Două cotlete, brânză dublă', desc_en: 'Two patties, double cheese', price: 195 },

    // Cauldron of Flavors
    { category: 'cauldron_of_flavors', name_ru: 'Борщ украинский', name_ro: 'Borș ucrainean', name_en: 'Ukrainian Borscht', desc_ru: 'Со сметаной и пампушками', desc_ro: 'Cu smântână și pâine', desc_en: 'With sour cream and bread', price: 95 },
    { category: 'cauldron_of_flavors', name_ru: 'Солянка мясная', name_ro: 'Soliancă de carne', name_en: 'Meat Solyanka', desc_ru: 'Острый мясной суп', desc_ro: 'Supă de carne picantă', desc_en: 'Spicy meat soup', price: 105 },
    { category: 'cauldron_of_flavors', name_ru: 'Крем-суп грибной', name_ro: 'Supă cremă de ciuperci', name_en: 'Mushroom Cream Soup', desc_ru: 'С гренками', desc_ro: 'Cu crutoane', desc_en: 'With croutons', price: 85 },
    { category: 'cauldron_of_flavors', name_ru: 'Уха рыбацкая', name_ro: 'Supă de pește', name_en: 'Fish Soup', desc_ru: 'Из свежей рыбы', desc_ro: 'Din pește proaspăt', desc_en: 'From fresh fish', price: 115 },

    // Sauté
    { category: 'saute', name_ru: 'Овощи на сковороде', name_ro: 'Legume la tigaie', name_en: 'Pan-Fried Vegetables', desc_ru: 'С травами и чесноком', desc_ro: 'Cu ierburi și usturoi', desc_en: 'With herbs and garlic', price: 75 },
    { category: 'saute', name_ru: 'Картофель по-деревенски', name_ro: 'Cartofi țărănești', name_en: 'Country Style Potatoes', desc_ru: 'С луком и специями', desc_ro: 'Cu ceapă și condimente', desc_en: 'With onions and spices', price: 65 },
    { category: 'saute', name_ru: 'Грибы жареные', name_ro: 'Ciuperci prăjite', name_en: 'Fried Mushrooms', desc_ru: 'С луком и сметаной', desc_ro: 'Cu ceapă și smântână', desc_en: 'With onions and sour cream', price: 95 },
    { category: 'saute', name_ru: 'Печень по-строгановски', name_ro: 'Ficat Stroganoff', name_en: 'Liver Stroganoff', desc_ru: 'В сметанном соусе', desc_ro: 'În sos de smântână', desc_en: 'In sour cream sauce', price: 125 },

    // Hosper (Grilled)
    { category: 'hosper', name_ru: 'Шашлык из свинины', name_ro: 'Șașlic de porc', name_en: 'Pork Shashlik', desc_ru: 'Маринованная свинина на углях', desc_ro: 'Porc marinat la cărbuni', desc_en: 'Marinated pork on charcoal', price: 165 },
    { category: 'hosper', name_ru: 'Шашлык из курицы', name_ro: 'Șașlic de pui', name_en: 'Chicken Shashlik', desc_ru: 'Куриное филе на мангале', desc_ro: 'Piept de pui la grătar', desc_en: 'Grilled chicken breast', price: 145 },
    { category: 'hosper', name_ru: 'Ребрышки BBQ', name_ro: 'Coaste BBQ', name_en: 'BBQ Ribs', desc_ru: 'Свиные ребра в соусе', desc_ro: 'Coaste de porc în sos', desc_en: 'Pork ribs in sauce', price: 185 },
    { category: 'hosper', name_ru: 'Овощи на гриле', name_ro: 'Legume la grătar', name_en: 'Grilled Vegetables', desc_ru: 'Ассорти овощей', desc_ro: 'Sortiment de legume', desc_en: 'Vegetable assortment', price: 85 },

    // Steaks
    { category: 'steaks', name_ru: 'Стейк Рибай', name_ro: 'Ribeye Steak', name_en: 'Ribeye Steak', desc_ru: 'Мраморная говядина 300г', desc_ro: 'Vită marmorată 300g', desc_en: 'Marbled beef 300g', price: 385 },
    { category: 'steaks', name_ru: 'Стейк Филе-миньон', name_ro: 'Fillet Mignon', name_en: 'Fillet Mignon', desc_ru: 'Нежная вырезка 250г', desc_ro: 'Mușchi fraged 250g', desc_en: 'Tender fillet 250g', price: 420 },
    { category: 'steaks', name_ru: 'Стейк Нью-Йорк', name_ro: 'New York Steak', name_en: 'New York Steak', desc_ru: 'Классический стейк 350г', desc_ro: 'Steak clasic 350g', desc_en: 'Classic steak 350g', price: 395 },
    { category: 'steaks', name_ru: 'Стейк из курицы', name_ro: 'Steak de pui', name_en: 'Chicken Steak', desc_ru: 'Куриное филе 200г', desc_ro: 'Piept de pui 200g', desc_en: 'Chicken breast 200g', price: 145 },

    // Meat from the Steppes
    { category: 'meat_from_steppes', name_ru: 'Плацинда с мясом', name_ro: 'Plăcintă cu carne', name_en: 'Meat Placinta', desc_ru: 'Традиционное молдавское блюдо', desc_ro: 'Mâncare tradițională moldovenească', desc_en: 'Traditional Moldovan dish', price: 75 },
    { category: 'meat_from_steppes', name_ru: 'Мамалыга с мясом', name_ro: 'Mămăligă cu carne', name_en: 'Polenta with Meat', desc_ru: 'С брынзой и сметаной', desc_ro: 'Cu brânză și smântână', desc_en: 'With cheese and sour cream', price: 115 },
    { category: 'meat_from_steppes', name_ru: 'Сармале молдавские', name_ro: 'Sarmale moldovenești', name_en: 'Moldovan Sarmale', desc_ru: 'Голубцы по-молдавски', desc_ro: 'Sarmale tradiționale', desc_en: 'Traditional stuffed cabbage', price: 125 },
    { category: 'meat_from_steppes', name_ru: 'Мититеи', name_ro: 'Mici', name_en: 'Mititei', desc_ru: 'Румынские колбаски', desc_ro: 'Mici românești', desc_en: 'Romanian sausages', price: 95 },

    // Fried for the Soul
    { category: 'fried_for_soul', name_ru: 'Шницель', name_ro: 'Șnițel', name_en: 'Schnitzel', desc_ru: 'Свиной шницель с картофелем', desc_ro: 'Șnițel de porc cu cartofi', desc_en: 'Pork schnitzel with potatoes', price: 145 },
    { category: 'fried_for_soul', name_ru: 'Котлета по-киевски', name_ro: 'Cotlet Kiev', name_en: 'Chicken Kiev', desc_ru: 'С маслом и зеленью', desc_ro: 'Cu unt și verdeață', desc_en: 'With butter and herbs', price: 155 },
    { category: 'fried_for_soul', name_ru: 'Жареная рыба', name_ro: 'Pește prăjit', name_en: 'Fried Fish', desc_ru: 'С лимоном и соусом тартар', desc_ro: 'Cu lămâie și sos tartar', desc_en: 'With lemon and tartar sauce', price: 165 },
    { category: 'fried_for_soul', name_ru: 'Драники картофельные', name_ro: 'Plăcințele de cartofi', name_en: 'Potato Pancakes', desc_ru: 'Со сметаной', desc_ro: 'Cu smântână', desc_en: 'With sour cream', price: 85 },

    // Sauces
    { category: 'sauces', name_ru: 'Соус тартар', name_ro: 'Sos tartar', name_en: 'Tartar Sauce', desc_ru: '', desc_ro: '', desc_en: '', price: 25 },
    { category: 'sauces', name_ru: 'Соус BBQ', name_ro: 'Sos BBQ', name_en: 'BBQ Sauce', desc_ru: '', desc_ro: '', desc_en: '', price: 25 },
    { category: 'sauces', name_ru: 'Чесночный соус', name_ro: 'Sos de usturoi', name_en: 'Garlic Sauce', desc_ru: '', desc_ro: '', desc_en: '', price: 25 },
    { category: 'sauces', name_ru: 'Сырный соус', name_ro: 'Sos de brânză', name_en: 'Cheese Sauce', desc_ru: '', desc_ro: '', desc_en: '', price: 30 },

    // Desserts
    { category: 'desserts', name_ru: 'Тирамису', name_ro: 'Tiramisu', name_en: 'Tiramisu', desc_ru: 'Классический итальянский десерт', desc_ro: 'Desert italian clasic', desc_en: 'Classic Italian dessert', price: 95 },
    { category: 'desserts', name_ru: 'Чизкейк', name_ro: 'Cheesecake', name_en: 'Cheesecake', desc_ru: 'Нью-Йорк чизкейк', desc_ro: 'Cheesecake New York', desc_en: 'New York cheesecake', price: 85 },
    { category: 'desserts', name_ru: 'Панна котта', name_ro: 'Panna cotta', name_en: 'Panna Cotta', desc_ru: 'С ягодным соусом', desc_ro: 'Cu sos de fructe de pădure', desc_en: 'With berry sauce', price: 75 },
    { category: 'desserts', name_ru: 'Мороженое', name_ro: 'Înghețată', name_en: 'Ice Cream', desc_ru: 'Три шарика на выбор', desc_ro: 'Trei bile la alegere', desc_en: 'Three scoops of choice', price: 65 },

    // Draft Beer
    { category: 'draft_beer', name_ru: 'Светлое нефильтрованное', name_ro: 'Blondă nefiltrat', name_en: 'Light Unfiltered', desc_ru: '0.5л', desc_ro: '0.5l', desc_en: '0.5l', price: 55 },
    { category: 'draft_beer', name_ru: 'Темное нефильтрованное', name_ro: 'Neagră nefiltrat', name_en: 'Dark Unfiltered', desc_ru: '0.5л', desc_ro: '0.5l', desc_en: '0.5l', price: 60 },
    { category: 'draft_beer', name_ru: 'Пшеничное', name_ro: 'Bere de grâu', name_en: 'Wheat Beer', desc_ru: '0.5л', desc_ro: '0.5l', desc_en: '0.5l', price: 65 },
    { category: 'draft_beer', name_ru: 'IPA', name_ro: 'IPA', name_en: 'IPA', desc_ru: '0.5л', desc_ro: '0.5l', desc_en: '0.5l', price: 70 },
    { category: 'draft_beer', name_ru: 'Портер', name_ro: 'Porter', name_en: 'Porter', desc_ru: '0.5л', desc_ro: '0.5l', desc_en: '0.5l', price: 70 },

    // Bottled Beer
    { category: 'bottled_beer', name_ru: 'Stella Artois', name_ro: 'Stella Artois', name_en: 'Stella Artois', desc_ru: '0.33л', desc_ro: '0.33l', desc_en: '0.33l', price: 50 },
    { category: 'bottled_beer', name_ru: 'Corona Extra', name_ro: 'Corona Extra', name_en: 'Corona Extra', desc_ru: '0.33л', desc_ro: '0.33l', desc_en: '0.33l', price: 65 },
    { category: 'bottled_beer', name_ru: 'Hoegaarden', name_ro: 'Hoegaarden', name_en: 'Hoegaarden', desc_ru: '0.33л', desc_ro: '0.33l', desc_en: '0.33l', price: 60 },
    { category: 'bottled_beer', name_ru: 'Guinness', name_ro: 'Guinness', name_en: 'Guinness', desc_ru: '0.33л', desc_ro: '0.33l', desc_en: '0.33l', price: 75 },

    // Alcohol
    { category: 'alcohol', name_ru: 'Водка', name_ro: 'Vodcă', name_en: 'Vodka', desc_ru: '50мл', desc_ro: '50ml', desc_en: '50ml', price: 45 },
    { category: 'alcohol', name_ru: 'Виски', name_ro: 'Whisky', name_en: 'Whiskey', desc_ru: '50мл', desc_ro: '50ml', desc_en: '50ml', price: 85 },
    { category: 'alcohol', name_ru: 'Коньяк', name_ro: 'Coniac', name_en: 'Cognac', desc_ru: '50мл', desc_ro: '50ml', desc_en: '50ml', price: 95 },
    { category: 'alcohol', name_ru: 'Текила', name_ro: 'Tequila', name_en: 'Tequila', desc_ru: '50мл', desc_ro: '50ml', desc_en: '50ml', price: 65 },
    { category: 'alcohol', name_ru: 'Ром', name_ro: 'Rom', name_en: 'Rum', desc_ru: '50мл', desc_ro: '50ml', desc_en: '50ml', price: 70 },

    // Drinks
    { category: 'drinks', name_ru: 'Кола', name_ro: 'Cola', name_en: 'Cola', desc_ru: '0.33л', desc_ro: '0.33l', desc_en: '0.33l', price: 30 },
    { category: 'drinks', name_ru: 'Спрайт', name_ro: 'Sprite', name_en: 'Sprite', desc_ru: '0.33л', desc_ro: '0.33l', desc_en: '0.33l', price: 30 },
    { category: 'drinks', name_ru: 'Сок апельсиновый', name_ro: 'Suc de portocale', name_en: 'Orange Juice', desc_ru: '0.25л', desc_ro: '0.25l', desc_en: '0.25l', price: 35 },
    { category: 'drinks', name_ru: 'Вода минеральная', name_ro: 'Apă minerală', name_en: 'Mineral Water', desc_ru: '0.5л', desc_ro: '0.5l', desc_en: '0.5l', price: 25 },
    { category: 'drinks', name_ru: 'Кофе эспрессо', name_ro: 'Cafea espresso', name_en: 'Espresso Coffee', desc_ru: '', desc_ro: '', desc_en: '', price: 35 },
    { category: 'drinks', name_ru: 'Чай черный', name_ro: 'Ceai negru', name_en: 'Black Tea', desc_ru: '', desc_ro: '', desc_en: '', price: 25 }
  ];

  // Get category IDs
  const [categories] = await pool.query('SELECT id, name_key FROM menu_categories');
  const categoryMap = new Map();
  (categories as any[]).forEach((cat: any) => {
    categoryMap.set(cat.name_key, cat.id);
  });

  for (const item of menuItems) {
    const categoryId = categoryMap.get(item.category);
    if (!categoryId) continue;

    const nameKey = item.name_en.toLowerCase().replace(/\s+/g, '_');
    
    // Insert menu item
    const [result] = await pool.query(
      'INSERT INTO menu_items (category_id, name_key, price, is_available, is_popular) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE price = VALUES(price)',
      [categoryId, nameKey, item.price, true, false]
    );
    
    const itemId = (result as any).insertId;

    // Insert translations
    await pool.query(
      'INSERT INTO menu_item_translations (item_id, language, name, description) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description)',
      [itemId, 'ru', item.name_ru, item.desc_ru]
    );
    await pool.query(
      'INSERT INTO menu_item_translations (item_id, language, name, description) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description)',
      [itemId, 'ro', item.name_ro, item.desc_ro]
    );
    await pool.query(
      'INSERT INTO menu_item_translations (item_id, language, name, description) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description)',
      [itemId, 'en', item.name_en, item.desc_en]
    );
  }
};

const seedReservationZones = async () => {
  console.log('  🪑  Seeding reservation zones...');
  
  const zones = [
    { name_key: 'bar', capacity: 15, display_order: 1 },
    { name_key: 'main_hall', capacity: 50, display_order: 2 },
    { name_key: 'terrace', capacity: 30, display_order: 3 }
  ];

  for (const zone of zones) {
    await pool.query(
      'INSERT INTO reservation_zones (name_key, capacity, is_active, display_order) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE capacity = VALUES(capacity)',
      [zone.name_key, zone.capacity, true, zone.display_order]
    );
  }
};

const seedGalleryCategories = async () => {
  console.log('  🖼️  Seeding gallery categories...');
  
  const categories = [
    { name_key: 'interior', display_order: 1 },
    { name_key: 'food', display_order: 2 },
    { name_key: 'events', display_order: 3 },
    { name_key: 'team', display_order: 4 }
  ];

  for (const category of categories) {
    await pool.query(
      'INSERT INTO gallery_categories (name_key, display_order) VALUES (?, ?) ON DUPLICATE KEY UPDATE display_order = VALUES(display_order)',
      [category.name_key, category.display_order]
    );
  }
};

const seedBlogCategories = async () => {
  console.log('  📰 Seeding blog categories...');
  
  const categories = [
    { name_key: 'news', slug: 'news', display_order: 1 },
    { name_key: 'events', slug: 'events', display_order: 2 },
    { name_key: 'recipes', slug: 'recipes', display_order: 3 },
    { name_key: 'beer_culture', slug: 'beer-culture', display_order: 4 }
  ];

  for (const category of categories) {
    await pool.query(
      'INSERT INTO blog_categories (name_key, slug, display_order) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE slug = VALUES(slug)',
      [category.name_key, category.slug, category.display_order]
    );
  }
};

const seedSiteSettings = async () => {
  console.log('  ⚙️  Seeding site settings...');
  
  const settings = [
    { key: 'restaurant_name', value: 'Beer8', type: 'string' },
    { key: 'restaurant_address', value: 'Strada Conev 34, Bălți MD-3100, Moldova', type: 'string' },
    { key: 'restaurant_phone', value: '+373 612 88 880', type: 'string' },
    { key: 'restaurant_email', value: 'info@beer8.md', type: 'string' },
    { key: 'working_hours', value: 'Mon–Sun 12:00–01:00', type: 'string' },
    { key: 'facebook_url', value: 'https://facebook.com/beer8md', type: 'string' },
    { key: 'instagram_url', value: 'https://instagram.com/beer8md', type: 'string' },
    { key: 'maintenance_mode', value: 'false', type: 'boolean' }
  ];

  for (const setting of settings) {
    await pool.query(
      'INSERT INTO site_settings (setting_key, setting_value, setting_type) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)',
      [setting.key, setting.value, setting.type]
    );
  }
};

// Run if called directly
if (require.main === module) {
  seedDatabase().then(() => {
    console.log('Seeding complete!');
    process.exit(0);
  }).catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  });
}
