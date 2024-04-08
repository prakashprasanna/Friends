import {svg} from '../assets/svg';

const payments = [
  {
    id: 1,
    type: 'Visa',
    number: ' **** 4864',
    icon: 'https://george-fx.github.io/kastelli/payments/01.png',
  },
  {
    id: 2,
    type: 'Mastercard',
    number: ' **** 3597',
    icon: 'https://george-fx.github.io/kastelli/payments/02.png',
  },
  {
    id: 3,
    type: 'Apple Pay',
    icon: 'https://george-fx.github.io/kastelli/payments/03.png',
  },
];

const onboardingData = [
  {
    id: 1,
    title: 'Welcome to\nBeloni!',
    description:
      'Labore sunt culpa excepteur culpa ipsum.\nLabore occaecat ex nisi mollit.',
    image: 'https://george-fx.github.io/beloni/onboarding/01.jpg',
  },
  {
    id: 2,
    title: 'Easy Track\nOrder!',
    description:
      'Labore sunt culpa excepteur culpa ipsum.\nLabore occaecat ex nisi mollit.',
    image: 'https://george-fx.github.io/beloni/onboarding/02.jpg',
  },
  {
    id: 3,
    title: 'Door to Door\nDelivery!',
    description:
      'Labore sunt culpa excepteur culpa ipsum.\nLabore occaecat ex nisi mollit.',
    image: 'https://george-fx.github.io/beloni/onboarding/03.jpg',
  },
];

const tabs = [
  {
    name: 'Home',
    icon: svg.HomeTabSvg,
  },
  {
    name: 'Search',
    icon: svg.SearchTabSvg,
  },
  {
    name: 'Cart',
    icon: svg.BasketTabSvg,
  },
  {
    name: 'Wishlist',
    icon: svg.WishlistTabSvg,
  },
  {
    name: 'Profile',
    icon: svg.UserTabSvg,
  },
];

const categories = [
  {
    id: 1,
    title: 'Dresses',
    image: 'https://george-fx.github.io/kastelli/categories/01.jpg',
    quantity: 36,
  },
  {
    id: 2,
    title: 'Pants',
    image: 'https://george-fx.github.io/kastelli/categories/02.jpg',
    quantity: 621,
  },
  {
    id: 3,
    title: 'Accessories',
    image: 'https://george-fx.github.io/kastelli/categories/03.jpg',
    quantity: 150,
  },
  {
    id: 4,
    title: 'Shoes',
    image: 'https://george-fx.github.io/kastelli/categories/04.jpg',
    quantity: 54,
  },
  {
    id: 5,
    title: 'T - shirts',
    image: 'https://george-fx.github.io/kastelli/categories/05.jpg',
    quantity: 112,
  },
  {
    id: 6,
    title: 'Suits',
    image: 'https://george-fx.github.io/kastelli/categories/06.jpg',
    quantity: 98,
  },
];

const paymentMethods = [
  {
    id: 1,
    type: 'visa',
    number: ' **** 4864',
    edit: true,
    icon: 'https://george-fx.github.io/cuppies/resources/payments/01.png',
  },
  {
    id: 2,
    type: 'mastercard',
    number: ' **** 3597',
    edit: true,
    icon: 'https://george-fx.github.io/cuppies/resources/payments/02.png',
  },
  {
    id: 3,
    type: 'google-pay',
    plus: true,
    icon: 'https://george-fx.github.io/cuppies/resources/payments/03.png',
  },
  {
    id: 4,
    type: 'apple-pay',
    edit: true,
    icon: 'https://george-fx.github.io/cuppies/resources/payments/04.png',
  },
  {
    id: 5,
    type: 'paypal',
    plus: true,
    icon: 'https://george-fx.github.io/cuppies/resources/payments/05.png',
  },
];

const addresses = [
  {
    id: '1',
    type: 'Home',
    address: '8000 S Kirkland Ave, Chicago, IL 6065...',
    icon: svg.HomeAddressSvg,
  },
  {
    id: '2',
    type: 'Work',
    address: '8000 S Kirkland Ave, Chicago, IL 6066...',
    icon: svg.HomeAddressSvg,
  },
  {
    id: '3',
    type: 'Other',
    address: '8000 S Kirkland Ave, Chicago, IL 6067...',
    icon: svg.HomeAddressSvg,
  },
];

const cards = [
  {
    id: 1,
    image: 'https://george-fx.github.io/beloni/cards/01.png',
  },
  {
    id: 2,
    image: 'https://george-fx.github.io/beloni/cards/02.png',
  },
  {
    id: 3,
    image: 'https://george-fx.github.io/beloni/cards/03.png',
  },
];

const history = [
  {
    id: 1,
    number: 648752,
    date: 'Feb 25, 2023 at 8:32 PM',
    total: 281.85,
    status: 'Shipping',
    delivery: 15,
    discount: 29.65,
    products: [
      {
        id: 1,
        name: 'Long sleeve shirt ',
        quantity: 1,
        price: 6.93,
      },
      {
        id: 2,
        name: 'Black sneakers',
        quantity: 1,
        price: 42.89,
      },
      {
        id: 3,
        name: 'Warm hat',
        quantity: 1,
        price: 30.0,
      },
    ],
  },
  {
    id: 2,
    number: 648752,
    date: 'Feb 25, 2023 at 8:32 PM',
    total: 281.85,
    status: 'Delivered',
    delivery: 15,
    discount: 29.65,
    products: [
      {
        id: 1,
        name: 'Long sleeve shirt ',
        quantity: 1,
        price: 6.93,
      },
      {
        id: 2,
        name: 'Black sneakers',
        quantity: 1,
        price: 42.89,
      },
      {
        id: 3,
        name: 'Warm hat',
        quantity: 1,
        price: 30.0,
      },
    ],
  },
  {
    id: 3,
    number: 648752,
    date: 'Feb 25, 2023 at 8:32 PM',
    total: 281.85,
    status: 'Canceled',
    delivery: 15,
    discount: 29.65,
    products: [
      {
        id: 1,
        name: 'Long sleeve shirt ',
        quantity: 1,
        price: 6.93,
      },
      {
        id: 2,
        name: 'Black sneakers',
        quantity: 1,
        price: 42.89,
      },
      {
        id: 3,
        name: 'Warm hat',
        quantity: 1,
        price: 30.0,
      },
    ],
  },
];

const promocodes = [
  {
    id: 1,
    name: 'Acme Co.',
    code: 'Discount21',
    discount: 50,
    valid_till: 'Expire Dec 31, 2023',
  },
  {
    id: 2,
    name: 'Barone LLC.',
    code: 'Discount22',
    discount: 15,
    valid_till: 'Valid until Jan 30, 2023',
  },
  {
    id: 3,
    name: 'Abstergo Ltd.',
    code: 'Discount23',
    discount: 10,
    valid_till: 'Valid until Jan 30, 2023',
  },
];

const frequentlyQuestions = [
  {
    id: '1',
    question: "What's included with a free plan ?",
    answer:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
  {
    id: '2',
    question: 'What content will my app have ?',
    answer:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
  {
    id: '3',
    question: 'Can I change my icon ?',
    answer:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
  {
    id: '4',
    question: 'What is a hybrid app ?',
    answer:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
  {
    id: '5',
    question: 'How do Push Alerts work ?',
    answer:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
  {
    id: '6',
    question: 'Why can’t the app upload files ?',
    answer:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
];

export {
  payments,
  onboardingData,
  tabs,
  categories,
  paymentMethods,
  cards,
  addresses,
  history,
  promocodes,
  frequentlyQuestions,
};
