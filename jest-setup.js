// Jest setup for React Native Testing Library

// // Mock Expo Router
// jest.mock('expo-router', () => ({
//   router: {
//     push: jest.fn(),
//     replace: jest.fn(),
//     back: jest.fn(),
//   },
//   Link: ({ children, href, ...props }) => {
//     return React.createElement('a', { href, ...props }, children);
//   },
//   useRouter: () => ({
//     push: jest.fn(),
//     replace: jest.fn(),
//     back: jest.fn(),
//   }),
// }));

// // Mock React Native components properly
// const React = require('react');

// jest.mock('react-native', () => {
//   const mockComponent = (name) => {
//     const MockedComponent = React.forwardRef((props, ref) => {
//       return React.createElement(name, { ...props, ref });
//     });
//     MockedComponent.displayName = `Mocked${name}`;
//     return MockedComponent;
//   };

//   const mockTextComponent = React.forwardRef((props, ref) => {
//     return React.createElement('span', { ...props, ref }, props.children);
//   });
//   mockTextComponent.displayName = 'MockedText';

//   const mockViewComponent = React.forwardRef((props, ref) => {
//     return React.createElement('div', { ...props, ref }, props.children);
//   });
//   mockViewComponent.displayName = 'MockedView';

//   const mockTextInputComponent = React.forwardRef((props, ref) => {
//     return React.createElement('input', {
//       ...props,
//       ref,
//       type: props.secureTextEntry ? 'password' : 'text',
//       onChange: (e) => props.onChangeText && props.onChangeText(e.target.value),
//     });
//   });
//   mockTextInputComponent.displayName = 'MockedTextInput';

//   const mockTouchableOpacityComponent = React.forwardRef((props, ref) => {
//     return React.createElement('button', {
//       ...props,
//       ref,
//       onClick: props.onPress,
//     }, props.children);
//   });
//   mockTouchableOpacityComponent.displayName = 'MockedTouchableOpacity';

//   return {
//     View: mockViewComponent,
//     Text: mockTextComponent,
//     TextInput: mockTextInputComponent,
//     TouchableOpacity: mockTouchableOpacityComponent,
//     ScrollView: mockComponent('div'),
//     StyleSheet: {
//       create: (styles) => styles,
//     },
//     Alert: {
//       alert: jest.fn(),
//     },
//     Platform: {
//       OS: 'ios',
//       select: jest.fn((obj) => obj.ios),
//     },
//     Dimensions: {
//       get: jest.fn(() => ({ width: 375, height: 667 })),
//     }
//   };
// });

// Mock Expo Router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  Link: ({ children }) => children,
}));

// Mock React Native Alert
jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn(),
  },
  Platform: {
    OS: 'ios',
  },
}));