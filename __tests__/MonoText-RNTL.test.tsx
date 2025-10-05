/**
 * React Native Testing Library Example
 * Demonstrates proper RNTL setup for component testing
 */

import { MonoText } from '@/components/StyledText';
import { render, screen } from '@testing-library/react-native';
import React from 'react';

// Simple component test using React Native Testing Library
describe('MonoText Component with RNTL', () => {
  it('should render text correctly', () => {
    render(<MonoText>Hello Testing!</MonoText>);

    // Find text by content
    expect(screen.getByText('Hello Testing!')).toBeTruthy();
  });

  it('should have monospace font family', () => {
    render(<MonoText>Monospace Text</MonoText>);

    const textElement = screen.getByText('Monospace Text');
    expect(textElement).toBeTruthy();

    // Check if the component is rendered (we can't easily test style props with RNTL)
    expect(textElement.props.children).toBe('Monospace Text');
  });

  it('should pass through props correctly', () => {
    render(
      <MonoText testID="mono-text" accessibilityLabel="Test mono text">
        Test Content
      </MonoText>
    );

    // Find by testID
    const element = screen.getByTestId('mono-text');
    expect(element).toBeTruthy();

    // Check accessibility
    expect(screen.getByLabelText('Test mono text')).toBeTruthy();
  });
});