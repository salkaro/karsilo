# Karsilo Design Rules

A comprehensive design system guide to maintain consistency across the Karsilo website.

---

## Table of Contents

1. [Color System](#color-system)
2. [Typography](#typography)
3. [Spacing & Layout](#spacing--layout)
4. [Borders & Border Radius](#borders--border-radius)
5. [Shadows](#shadows)
6. [Buttons](#buttons)
7. [Form Inputs](#form-inputs)
8. [Cards & Containers](#cards--containers)
9. [Background Patterns](#background-patterns)
10. [Animations](#animations)
11. [Component Patterns](#component-patterns)
12. [Responsive Design](#responsive-design)
13. [Dashboard (Logged In)](#dashboard-logged-in)

---

## Color System

### Brand Purple (Primary)

| Token     | Hex     | Usage                                  |
| --------- | ------- | -------------------------------------- |
| brand.50  | #f5f3ff | Lightest backgrounds, tints            |
| brand.100 | #ede9fe | Light backgrounds, subtle accents      |
| brand.200 | #ddd6fe | Hover backgrounds, decorative elements |
| brand.300 | #c4b5fd | Medium-light accents                   |
| brand.400 | #a78bfa | Accent bars, icons, secondary actions  |
| brand.500 | #8b5cf6 | Primary brand color                    |
| brand.600 | #7c3aed | Primary buttons, CTAs                  |
| brand.700 | #6d28d9 | Button hover states                    |

### Gray Scale (Neutral)

| Token    | Hex     | Usage                             |
| -------- | ------- | --------------------------------- |
| gray.50  | #f9fafb | Light page backgrounds            |
| gray.100 | #f3f4f6 | Card borders, dividers            |
| gray.200 | #e5e7eb | Decorative circles, input borders |
| gray.300 | #d1d5db | Grid lines, dot patterns          |
| gray.400 | #9ca3af | Muted icons, placeholder text     |
| gray.500 | #6b7280 | Secondary/muted text              |
| gray.600 | #475467 | Body text                         |
| gray.700 | #374151 | Medium emphasis text              |
| gray.800 | #1f2937 | High emphasis text, dark cards    |
| gray.900 | #101828 | Primary text, dark backgrounds    |

### Semantic Colors

| Color         | Usage                                      |
| ------------- | ------------------------------------------ |
| green.400/500 | Positive indicators, growth, success       |
| red.400       | Negative indicators, errors, decline       |
| white         | Text on dark backgrounds, card backgrounds |

### Gradient Patterns

```tsx
// Primary button gradient
background: "linear-gradient(to right, #7c3aed, #a78bfa)"

// Background gradient (light)
linearGradient: "#f5f3ff → #ede9fe → #ddd6fe"

// Decorative purple overlay
bg="brand.500" opacity={0.1-0.3}
```

---

## Typography

### Font Family

- **Primary Font**: Inter (Google Font)
- **CSS Variable**: `--font-inter`
- **Fallback**: System sans-serif

### Heading Hierarchy

| Level | Size (Mobile → Desktop) | Weight   | Line Height | Color    |
| ----- | ----------------------- | -------- | ----------- | -------- |
| h1    | 4xl → 5xl → 6xl         | bold     | 1.1         | gray.900 |
| h2    | 3xl → 4xl → 5xl         | bold     | 1.2         | gray.900 |
| h3    | lg → xl                 | bold     | default     | gray.900 |
| h4    | md → lg                 | semibold | default     | gray.900 |

```tsx
// Example h1
<Heading
  as="h1"
  fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
  fontWeight="bold"
  color="gray.900"
  lineHeight="1.1"
/>

// Example h2
<Heading
  as="h2"
  fontSize={{ base: "3xl", md: "4xl" }}
  fontWeight="bold"
  color="gray.900"
  mb={4}
/>
```

### Body Text

| Type         | Size    | Weight | Color    | Line Height |
| ------------ | ------- | ------ | -------- | ----------- |
| Large body   | lg → xl | normal | gray.600 | 1.7         |
| Regular body | md      | normal | gray.600 | default     |
| Small text   | sm      | normal | gray.500 | default     |
| Caption      | xs      | normal | gray.500 | default     |

### Section Labels

```tsx
<Text
  fontSize="sm"
  fontWeight="semibold"
  color="brand.600"
  textTransform="uppercase"
  letterSpacing="wide"
>
  Section Label
</Text>
```

### Text on Dark Backgrounds

| Type    | Color     |
| ------- | --------- |
| Heading | white     |
| Body    | gray.300  |
| Muted   | gray.400  |
| Accent  | brand.400 |

---

## Spacing & Layout

### Page Section Padding

```tsx
// Standard section
py={{ base: 16, md: 24 }}

// Container max width
maxW="container.xl"
```

### Spacing Scale

| Value | Pixels | Usage                              |
| ----- | ------ | ---------------------------------- |
| 1     | 4px    | Tight spacing                      |
| 2     | 8px    | Icon gaps, small margins           |
| 3     | 12px   | Small gaps                         |
| 4     | 16px   | Standard gaps, mb for labels       |
| 5     | 20px   | Medium spacing                     |
| 6     | 24px   | Card padding (mobile)              |
| 8     | 32px   | Card padding (desktop), section mb |
| 10    | 40px   | Large spacing                      |
| 12    | 48px   | Section spacing (mobile)           |
| 16    | 64px   | Section spacing (desktop)          |

### Common Patterns

```tsx
// Section margin bottom
mb={{ base: 12, md: 16 }}

// Card padding
p={{ base: 6, md: 8 }}

// Component gaps
gap={{ base: 4, md: 6 }}

// Small gaps
gap={2} or gap={3}
```

---

## Borders & Border Radius

### Border Radius Scale

| Token | Pixels | Usage                            |
| ----- | ------ | -------------------------------- |
| full  | 9999px | Circular elements, badges, pills |
| 2xl   | 16px   | Large cards, containers, modals  |
| xl    | 12px   | Medium cards, icon backgrounds   |
| lg    | 8px    | Buttons, inputs, small cards     |
| md    | 6px    | Small elements                   |
| sm    | 4px    | Minimal rounding                 |

### Border Patterns

```tsx
// Standard card border
border="1px solid"
borderColor="gray.100"

// Active/selected border
border="2px solid"
borderColor="brand.500"

// Input focus border
border="2px solid"
borderColor="brand.500"

// Dark container border
borderColor="gray.700" or "gray.800"
```

---

## Shadows

### Shadow Scale

| Token | Usage                                    |
| ----- | ---------------------------------------- |
| sm    | Default cards, subtle elevation          |
| md    | Buttons, slight elevation                |
| lg    | Hover states, elevated cards             |
| xl    | Featured cards, popular badges, floating |
| 2xl   | Maximum elevation, main mockups          |

### Usage Patterns

```tsx
// Default card
boxShadow="sm"

// Hover state
_hover={{ boxShadow: "lg" }}

// Featured/popular element
boxShadow="xl"

// Main dashboard mockup
boxShadow="2xl"
```

---

## Buttons

### Primary Button

```tsx
<Button
  size="lg"
  bg="brand.600"
  color="white"
  borderRadius="lg"
  _hover={{
    bg: "brand.700",
    transform: "translateY(-2px)",
  }}
  transition="all 0.2s"
>
  Get Started
</Button>
```

### Secondary/Outline Button

```tsx
<Button
  size="lg"
  variant="outline"
  borderColor="gray.300"
  color="gray.700"
  _hover={{
    bg: "gray.50",
    borderColor: "gray.400",
  }}
>
  Learn More
</Button>
```

### White Button (on colored background)

```tsx
<Button
  size="lg"
  bg="white"
  color="brand.600"
  _hover={{
    bg: "gray.100",
    transform: "translateY(-2px)",
  }}
>
  Get Started
</Button>
```

### Outline on Dark Background

```tsx
<Button
  variant="outline"
  borderColor="white"
  borderWidth="2px"
  color="white"
  _hover={{ bg: "whiteAlpha.200" }}
>
  Watch Demo
</Button>
```

### Ghost Button (Navbar)

```tsx
<Button
  variant="ghost"
  color="gray.700"
  fontWeight="medium"
  _hover={{ bg: "gray.100" }}
>
  Nav Link
</Button>
```

---

## Form Inputs

### Standard Input

```tsx
<Input
  size="lg"
  bg="white"
  border="1px solid"
  borderColor="gray.200"
  borderRadius="lg"
  _focus={{
    border: "2px solid",
    borderColor: "brand.500",
    boxShadow: "none",
    outline: "none",
  }}
  _placeholder={{ color: "gray.400" }}
/>
```

### Input Labels

```tsx
<Text fontSize="sm" fontWeight="medium" color="gray.700" mb={1}>
  Email Address
</Text>
```

### Input with Icon

```tsx
<Box position="relative">
  <Box
    position="absolute"
    left={4}
    top="50%"
    transform="translateY(-50%)"
    color="gray.400"
  >
    <Icon />
  </Box>
  <Input pl={12} />
</Box>
```

---

## Cards & Containers

### Standard Card

```tsx
<Box
  p={{ base: 6, md: 8 }}
  bg="white"
  borderRadius="2xl"
  boxShadow="sm"
  border="1px solid"
  borderColor="gray.100"
  transition="all 0.3s ease"
  _hover={{
    boxShadow: "lg",
    borderColor: "brand.200",
    transform: "translateY(-4px)",
  }}
  height="full"
>
  {children}
</Box>
```

### Feature Card with Accent

```tsx
<Box
  position="relative"
  overflow="hidden"
  // ... standard card styles
>
  {/* Gradient corner */}
  <Box
    position="absolute"
    top={-50}
    right={-50}
    width="150px"
    height="150px"
    bgGradient="radial(brand.100, transparent 70%)"
    borderRadius="full"
  />

  {/* Accent bar */}
  <Box
    position="absolute"
    bottom={0}
    left={8}
    width="40px"
    height="3px"
    bg="brand.400"
    borderRadius="full"
  />

  {children}
</Box>
```

### Dark Card

```tsx
<Box
  bg="gray.900"
  borderRadius="2xl"
  p={{ base: 6, md: 8 }}
  position="relative"
  overflow="hidden"
>
  {/* Decorative circle */}
  <Box
    position="absolute"
    top={0}
    right={0}
    width="200px"
    height="200px"
    bg="brand.500"
    opacity={0.1}
    borderRadius="full"
    transform="translate(30%, -30%)"
  />

  {/* Icon background */}
  <Box p={3} bg="whiteAlpha.100" borderRadius="xl" width="fit-content">
    <Icon color="brand.400" />
  </Box>

  <Text color="white">Heading</Text>
  <Text color="gray.300">Body text</Text>
</Box>
```

---

## Background Patterns

### Light Variant (White + Grey Circles)

```tsx
<Box position="relative" bg="white" overflow="hidden">
  <Box
    position="absolute"
    top={-100}
    right={-100}
    width="250px"
    height="250px"
    bg="gray.100"
    opacity={0.5}
    borderRadius="full"
  />
  <Box
    position="absolute"
    bottom={-50}
    left={-50}
    width="150px"
    height="150px"
    bg="gray.200"
    opacity={0.3}
    borderRadius="full"
  />
  {/* Content */}
</Box>
```

### Dark Variant (Gray.900 + Purple Accents)

```tsx
<Box position="relative" bg="gray.900" overflow="hidden">
  <Box
    position="absolute"
    top={0}
    right={0}
    width="300px"
    height="300px"
    bg="brand.500"
    opacity={0.1}
    borderRadius="full"
    transform="translate(30%, -30%)"
  />
  {/* Content with white/gray.300 text */}
</Box>
```

### Dot Grid Pattern

```tsx
<Box
  position="absolute"
  top={0}
  left={0}
  right={0}
  bottom={0}
  opacity={0.3}
  backgroundImage="radial-gradient(circle at 2px 2px, #d1d5db 1px, transparent 0)"
  backgroundSize="32px 32px"
  pointerEvents="none"
/>
```

### SVG Grid Lines

```tsx
<Box
  position="absolute"
  opacity={0.4}
  backgroundImage="linear-gradient(to right, #d0d5dd 1px, transparent 1px), linear-gradient(to bottom, #d0d5dd 1px, transparent 1px)"
  backgroundSize="80px 80px"
/>
```

---

## Animations

### FadeIn (Scroll Triggered)

```tsx
// Usage
<FadeIn direction="up" delay={0.1}>
  <Content />
</FadeIn>

// Directions: up, down, left, right, none
// Default offset: 20px
// Duration: 0.4s
// Easing: cubic-bezier(0.4, 0, 0.2, 1)
```

### Hover Transitions

```tsx
// Standard hover
transition="all 0.3s ease"
_hover={{
  transform: "translateY(-4px)",
  boxShadow: "lg",
}}

// Quick hover
transition="all 0.2s"
_hover={{
  transform: "translateY(-2px)",
}}
```

### 3D Tilt Effect

```tsx
// Default state
transform = "perspective(1000px) rotateX(2deg) rotateY(-3deg)";

// Hover state
transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";

transition = "all 0.4s ease-out";
transformStyle = "preserve-3d";
```

### Pulse Animation

```css
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Usage */
animation: "pulse 2s infinite";
```

### Slide In Animation

```css
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Usage */
animation: "slideIn 0.3s ease-out";
```

### Rolling Number Animation

```tsx
// Duration: 400ms
// Steps: 20
// Easing: ease-out cubic (1 - (1-progress)^3)
// Glow effect during animation:
textShadow: isAnimating ? "0 0 15px rgba(139, 92, 246, 0.5)" : "none";
```

---

## Component Patterns

### Section Header

```tsx
<Flex
  direction="column"
  align="center"
  textAlign="center"
  mb={{ base: 12, md: 16 }}
>
  <Box mb={4}>
    <Text
      fontSize="sm"
      fontWeight="semibold"
      color="brand.600"
      textTransform="uppercase"
      letterSpacing="wide"
    >
      Section Label
    </Text>
  </Box>
  <Heading
    as="h2"
    fontSize={{ base: "3xl", md: "4xl" }}
    fontWeight="bold"
    color="gray.900"
    mb={4}
  >
    Main Heading
  </Heading>
  <Text fontSize="lg" color="gray.600" maxW="2xl">
    Description text that explains the section.
  </Text>
</Flex>
```

### Badge/Pill

```tsx
<Box
  display="inline-flex"
  alignItems="center"
  gap={2}
  px={4}
  py={2}
  bg="brand.100"
  borderRadius="full"
  width="fit-content"
>
  <Box
    w={2}
    h={2}
    borderRadius="full"
    bg="brand.500"
    style={{ animation: "pulse 2s infinite" }}
  />
  <Text fontSize="sm" fontWeight="medium" color="brand.700">
    Badge Text
  </Text>
</Box>
```

### Feature List Item

```tsx
<HStack gap={3} align="flex-start">
  <Box p={0.5} bg="brand.100" borderRadius="full" color="brand.600">
    <CheckIcon size={12} />
  </Box>
  <Text fontSize="sm" color="gray.700">
    Feature description text
  </Text>
</HStack>
```

### Trust Indicators

```tsx
<HStack gap={6} pt={6} flexWrap="wrap">
  <HStack gap={2}>
    <Icon color="brand.500" />
    <Text fontSize="sm" color="gray.600">
      Benefit text
    </Text>
  </HStack>
  {/* Repeat for other benefits */}
</HStack>
```

### Icon Container

```tsx
// Light background
<Box
  p={3}
  bg="brand.50"
  borderRadius="xl"
  color="brand.600"
  width="fit-content"
>
  <Icon size={24} />
</Box>

// Dark background
<Box
  p={3}
  bg="whiteAlpha.100"
  borderRadius="xl"
  color="brand.400"
  width="fit-content"
>
  <Icon size={24} />
</Box>
```

---

## Responsive Design

### Breakpoints

| Token | Width  | Description      |
| ----- | ------ | ---------------- |
| base  | 0px    | Mobile (default) |
| sm    | 480px  | Large mobile     |
| md    | 768px  | Tablet           |
| lg    | 1024px | Desktop          |
| xl    | 1280px | Large desktop    |

### Grid Patterns

```tsx
// Two column on tablet+
templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}

// Three column on desktop
templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}

// Asymmetric grid
templateColumns={{ base: "1fr", lg: "1fr 1.3fr" }}
```

### Responsive Spacing

```tsx
// Padding
p={{ base: 6, md: 8 }}

// Margin
mb={{ base: 12, md: 16 }}

// Gap
gap={{ base: 4, md: 6 }}

// Font size
fontSize={{ base: "lg", md: "xl" }}
```

### Mobile Visibility

```tsx
// Hide on mobile
display={{ base: "none", md: "block" }}

// Show only on mobile
display={{ base: "block", md: "none" }}
```

---

## Dashboard (Logged In)

### Color Scheme (Dark Theme)

| Element         | Color                         |
| --------------- | ----------------------------- |
| Background      | gray.900                      |
| Card background | gray.800                      |
| Border          | gray.700                      |
| Primary text    | white                         |
| Secondary text  | gray.300, gray.400            |
| Accent          | brand.400, brand.500          |
| Positive values | brand.400 (purple, not green) |
| Negative values | red.400                       |

### Dashboard Card

```tsx
<Box
  bg="gray.800"
  borderRadius="lg"
  p={3}
  border="1px solid"
  borderColor="gray.700"
>
  {children}
</Box>
```

### Stats Display

```tsx
<Box>
  <Text fontSize="sm" color="gray.400" mb={1}>
    Label
  </Text>
  <Text fontSize="3xl" fontWeight="bold" color="white">
    $52,400
  </Text>
</Box>
```

### Growth Badge (Dashboard)

```tsx
<Box
  px={3}
  py={1}
  borderRadius="full"
  style={{
    background: "linear-gradient(to right, #7c3aed, #a78bfa)",
  }}
>
  <Text fontSize="sm" fontWeight="semibold" color="white">
    +28% this month
  </Text>
</Box>
```

### Progress Bar

```tsx
<Box
  position="relative"
  height="8px"
  bg="gray.800"
  borderRadius="full"
  overflow="hidden"
>
  <Box
    position="absolute"
    left={0}
    top={0}
    bottom={0}
    borderRadius="full"
    style={{
      width: `${percentage}%`,
      background: "linear-gradient(to right, #7c3aed, #8b5cf6)",
      transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
    }}
  />
</Box>
```

### Live Indicator

```tsx
<Box
  width="8px"
  height="8px"
  borderRadius="full"
  bg="brand.400"
  style={{
    animation: "pulse 2s infinite",
    boxShadow: "0 0 8px rgba(139, 92, 246, 0.6)",
  }}
/>
```

### Notification Item

```tsx
<Box
  bg="gray.800"
  borderRadius="lg"
  p={3}
  border="1px solid"
  borderColor={isNew ? "brand.500" : "gray.700"}
  style={{
    animation: isNew ? "slideIn 0.3s ease-out" : "none",
    opacity: 1 - index * 0.15,
  }}
>
  <Flex justify="space-between" align="center">
    <HStack gap={3}>
      <Box
        width="10px"
        height="10px"
        borderRadius="full"
        bg={isNew ? "brand.400" : "brand.600"}
      />
      <Box>
        <Text fontSize="sm" color="white" fontWeight="medium">
          Product Name
        </Text>
        <Text fontSize="xs" color="gray.500">
          Just now
        </Text>
      </Box>
    </HStack>
    <Text fontSize="md" fontWeight="bold" color="brand.400">
      +$99
    </Text>
  </Flex>
</Box>
```

---

## Design Principles

1. **Hierarchy**: Use size, color, and spacing to create clear visual hierarchy
2. **Consistency**: Apply the same patterns across all pages
3. **Whitespace**: Use generous spacing for visual breathing room
4. **Color Restraint**: Brand purple for accents, grays for structure
5. **Micro-interactions**: Smooth, purposeful transitions (0.2-0.4s)
6. **Mobile-First**: Design for mobile, enhance for larger screens
7. **Performance**: Use hardware-accelerated transforms
8. **Accessibility**: Maintain contrast ratios, use semantic HTML

---

## Quick Reference

### Most Common Values

```tsx
// Card
p={{ base: 6, md: 8 }}
borderRadius="2xl"
boxShadow="sm"
border="1px solid"
borderColor="gray.100"

// Section spacing
py={{ base: 16, md: 24 }}
mb={{ base: 12, md: 16 }}

// Button
bg="brand.600"
_hover={{ bg: "brand.700", transform: "translateY(-2px)" }}
transition="all 0.2s"

// Text
color="gray.900"  // headings
color="gray.600"  // body
color="brand.600" // accent/label

// Animation
transition="all 0.3s ease"
```
