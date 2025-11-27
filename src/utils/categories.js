// Subcategories configuration for expense tracking

export const CATEGORIES_WITH_SUBCATEGORIES = {
  Food: {
    icon: 'bi-cup-straw',
    color: '#FF6384',
    subcategories: [
      { value: 'Breakfast', label: 'Breakfast', icon: 'bi-sunrise' },
      { value: 'Lunch', label: 'Lunch', icon: 'bi-sun' },
      { value: 'Dinner', label: 'Dinner', icon: 'bi-moon-stars' },
      { value: 'Snacks', label: 'Snacks', icon: 'bi-cookie' },
      { value: 'Coffee/Tea', label: 'Coffee/Tea', icon: 'bi-cup-hot' },
      { value: 'Cake/Desserts', label: 'Cake/Desserts', icon: 'bi-cake2' },
      { value: 'Fast Food', label: 'Fast Food', icon: 'bi-bag' },
      { value: 'Groceries', label: 'Groceries', icon: 'bi-basket' },
      { value: 'Fruits/Vegetables', label: 'Fruits/Vegetables', icon: 'bi-apple' },
      { value: 'Dining Out', label: 'Dining Out', icon: 'bi-shop' },
      { value: 'Other Food', label: 'Other', icon: 'bi-three-dots' }
    ]
  },
  Transport: {
    icon: 'bi-bus-front',
    color: '#36A2EB',
    subcategories: [
      { value: 'Bus', label: 'Bus', icon: 'bi-bus-front' },
      { value: 'Train', label: 'Train', icon: 'bi-train-front' },
      { value: 'Auto/Rickshaw', label: 'Auto/Rickshaw', icon: 'bi-truck-front' },
      { value: 'Cab/Taxi', label: 'Cab/Taxi', icon: 'bi-taxi-front' },
      { value: 'Metro', label: 'Metro', icon: 'bi-train-freight-front' },
      { value: 'Fuel/Petrol', label: 'Fuel/Petrol', icon: 'bi-fuel-pump' },
      { value: 'Bike/Scooter', label: 'Bike/Scooter', icon: 'bi-bicycle' },
      { value: 'Flight', label: 'Flight', icon: 'bi-airplane' },
      { value: 'Parking', label: 'Parking', icon: 'bi-p-square' },
      { value: 'Vehicle Maintenance', label: 'Vehicle Maintenance', icon: 'bi-wrench' },
      { value: 'Other Transport', label: 'Other', icon: 'bi-three-dots' }
    ]
  },
  Shopping: {
    icon: 'bi-cart',
    color: '#FFCE56',
    subcategories: [
      { value: 'Clothing', label: 'Clothing', icon: 'bi-bag-check' },
      { value: 'Shoes', label: 'Shoes', icon: 'bi-shoe' },
      { value: 'Electronics', label: 'Electronics', icon: 'bi-laptop' },
      { value: 'Books', label: 'Books', icon: 'bi-book' },
      { value: 'Gifts', label: 'Gifts', icon: 'bi-gift' },
      { value: 'Accessories', label: 'Accessories', icon: 'bi-watch' },
      { value: 'Home Decor', label: 'Home Decor', icon: 'bi-house-heart' },
      { value: 'Furniture', label: 'Furniture', icon: 'bi-lamp' },
      { value: 'Beauty Products', label: 'Beauty Products', icon: 'bi-droplet' },
      { value: 'Sports Equipment', label: 'Sports Equipment', icon: 'bi-trophy' },
      { value: 'Other Shopping', label: 'Other', icon: 'bi-three-dots' }
    ]
  },
  Bills: {
    icon: 'bi-receipt',
    color: '#4BC0C0',
    subcategories: [
      { value: 'Electricity', label: 'Electricity', icon: 'bi-lightning-charge' },
      { value: 'Water', label: 'Water', icon: 'bi-droplet-half' },
      { value: 'Gas', label: 'Gas', icon: 'bi-fire' },
      { value: 'Internet', label: 'Internet', icon: 'bi-wifi' },
      { value: 'Mobile/Phone', label: 'Mobile/Phone', icon: 'bi-phone' },
      { value: 'Rent', label: 'Rent', icon: 'bi-house' },
      { value: 'Insurance', label: 'Insurance', icon: 'bi-shield-check' },
      { value: 'Credit Card', label: 'Credit Card', icon: 'bi-credit-card' },
      { value: 'Loan EMI', label: 'Loan EMI', icon: 'bi-bank' },
      { value: 'Subscriptions', label: 'Subscriptions', icon: 'bi-arrow-repeat' },
      { value: 'Other Bills', label: 'Other', icon: 'bi-three-dots' }
    ]
  },
  Entertainment: {
    icon: 'bi-controller',
    color: '#9966FF',
    subcategories: [
      { value: 'Movies', label: 'Movies', icon: 'bi-film' },
      { value: 'Concerts', label: 'Concerts', icon: 'bi-music-note-beamed' },
      { value: 'Games', label: 'Games', icon: 'bi-controller' },
      { value: 'Sports Events', label: 'Sports Events', icon: 'bi-trophy' },
      { value: 'Streaming Services', label: 'Streaming Services', icon: 'bi-play-circle' },
      { value: 'Hobbies', label: 'Hobbies', icon: 'bi-palette' },
      { value: 'Travel/Tourism', label: 'Travel/Tourism', icon: 'bi-airplane-engines' },
      { value: 'Club/Bar', label: 'Club/Bar', icon: 'bi-cup-straw' },
      { value: 'Theme Parks', label: 'Theme Parks', icon: 'bi-balloon' },
      { value: 'Photography', label: 'Photography', icon: 'bi-camera' },
      { value: 'Other Entertainment', label: 'Other', icon: 'bi-three-dots' }
    ]
  },
  Health: {
    icon: 'bi-heart-pulse',
    color: '#FF9F40',
    subcategories: [
      { value: 'Doctor Visit', label: 'Doctor Visit', icon: 'bi-hospital' },
      { value: 'Medicines', label: 'Medicines', icon: 'bi-capsule' },
      { value: 'Lab Tests', label: 'Lab Tests', icon: 'bi-clipboard2-pulse' },
      { value: 'Gym/Fitness', label: 'Gym/Fitness', icon: 'bi-activity' },
      { value: 'Dental', label: 'Dental', icon: 'bi-bandaid' },
      { value: 'Eye Care', label: 'Eye Care', icon: 'bi-eye' },
      { value: 'Supplements', label: 'Supplements', icon: 'bi-heart-pulse' },
      { value: 'Yoga/Meditation', label: 'Yoga/Meditation', icon: 'bi-person-arms-up' },
      { value: 'Physiotherapy', label: 'Physiotherapy', icon: 'bi-person-walking' },
      { value: 'Mental Health', label: 'Mental Health', icon: 'bi-emoji-smile' },
      { value: 'Other Health', label: 'Other', icon: 'bi-three-dots' }
    ]
  },
  Other: {
    icon: 'bi-three-dots',
    color: '#C9CBCF',
    subcategories: [
      { value: 'Education', label: 'Education', icon: 'bi-mortarboard' },
      { value: 'Charity/Donation', label: 'Charity/Donation', icon: 'bi-heart' },
      { value: 'Pets', label: 'Pets', icon: 'bi-piggy-bank' },
      { value: 'Childcare', label: 'Childcare', icon: 'bi-person' },
      { value: 'Legal', label: 'Legal', icon: 'bi-file-earmark-text' },
      { value: 'Taxes', label: 'Taxes', icon: 'bi-receipt-cutoff' },
      { value: 'Emergency', label: 'Emergency', icon: 'bi-exclamation-triangle' },
      { value: 'Miscellaneous', label: 'Miscellaneous', icon: 'bi-three-dots-vertical' }
    ]
  }
};

export const getSubcategories = (category) => {
  return CATEGORIES_WITH_SUBCATEGORIES[category]?.subcategories || [];
};

export const getSubcategoryIcon = (category, subcategory) => {
  const categoryData = CATEGORIES_WITH_SUBCATEGORIES[category];
  if (!categoryData) return 'bi-circle';
  
  const subcat = categoryData.subcategories.find(s => s.value === subcategory);
  return subcat?.icon || categoryData.icon;
};

export const getSubcategoryLabel = (category, subcategory) => {
  const categoryData = CATEGORIES_WITH_SUBCATEGORIES[category];
  if (!categoryData) return subcategory;
  
  const subcat = categoryData.subcategories.find(s => s.value === subcategory);
  return subcat?.label || subcategory;
};

export const getAllCategories = () => {
  return Object.keys(CATEGORIES_WITH_SUBCATEGORIES);
};
