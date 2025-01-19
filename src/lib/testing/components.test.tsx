/**
 * Component Tests
 * Tests for React components
 */
import { describe, test, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorMessage } from '../../components/ErrorMessage';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

describe('Components', () => {
  describe('ErrorMessage', () => {
    test('should render error message', () => {
      const message = 'Test error message';
      render(<ErrorMessage message={message} />);
      expect(screen.getByText(message)).toBeDefined();
    });

    test('should handle retry', () => {
      const onRetry = vi.fn();
      render(<ErrorMessage message="Error" onRetry={onRetry} />);
      fireEvent.click(screen.getByText('Try Again'));
      expect(onRetry).toHaveBeenCalled();
    });
  });

  describe('Button', () => {
    test('should render different variants', () => {
      const { rerender } = render(<Button variant="primary">Test</Button>);
      expect(screen.getByText('Test')).toHaveClass('gradient-border');

      rerender(<Button variant="outline">Test</Button>);
      expect(screen.getByText('Test')).toHaveClass('border-2');
    });

    test('should handle click events', () => {
      const onClick = vi.fn();
      render(<Button onClick={onClick}>Click Me</Button>);
      fireEvent.click(screen.getByText('Click Me'));
      expect(onClick).toHaveBeenCalled();
    });
  });

  describe('Card', () => {
    test('should render with custom className', () => {
      render(<Card className="test-class">Content</Card>);
      expect(screen.getByText('Content').parentElement).toHaveClass('test-class');
    });
  });
});