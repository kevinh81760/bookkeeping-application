# iPhone 16 Optimization Guidelines

## Device Specifications
- **Target Device**: iPhone 16 (393×852px)
- **Design Language**: Hybrid iOS × Swiss modernism
- **Max Width**: 393px with centered layout for larger screens

## Layout Guidelines
- Use `max-w-[393px] mx-auto` for main containers
- Maintain 4/8pt grid system for spacing consistency
- Ensure 44pt minimum touch targets for interactive elements
- Use 12px border radius for buttons and cards

## Typography System
- **Headers**: SF Pro Bold, all caps, increased letter spacing (0.1em)
- **Body**: SF Pro Medium, sentence case, #1A1A1A
- **Labels/Links**: SF Pro Medium, accent orange (#E85C3C), uppercase, smaller sizes

## Color Palette
- **Accent**: #E85C3C (burnt orange for interactive elements)
- **Neutrals**: #1A1A1A (text), #F9F9F9 (background), #FFFFFF (cards), #F2F2F7 (secondary)
- **Status Colors**: Success #34C759, Warning #FF9F0A, Error #FF3B30
- **Dividers**: #E5E5EA

## Responsive Behavior
- Optimized for iPhone 16's 6.1" display
- Touch-friendly interactions with proper gesture handling
- Smooth animations using 200-250ms transitions
- Proper safe area handling for notch and home indicator