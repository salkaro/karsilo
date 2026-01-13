'use client';

import { useState } from 'react';
import { Box, Flex, HStack, Stack, Container, Button, IconButton, Link, MenuRoot, MenuTrigger, MenuContent, MenuItem } from '@repo/ui/index';

interface NavLink {
    label: string;
    href: string;
}

interface NavDropdown {
    label: string;
    items: NavLink[];
}

interface NavbarProps {
    logo?: React.ReactNode;
    links?: (NavLink | NavDropdown)[];
    ctaButtons?: {
        primary?: { label: string; href: string };
        secondary?: { label: string; href: string };
    };
}

const defaultLinks: (NavLink | NavDropdown)[] = [
    { label: 'Plans', href: '/plans' },
    { label: 'Resources', href: '/resources' },
    { label: 'Solutions', href: '/solutions' },
    { label: 'Blog', href: '/blog' },
    { label: 'Help', href: '/help' },
];

const isDropdown = (
    link: NavLink | NavDropdown
): link is NavDropdown => {
    return 'items' in link;
};


export function Navbar({
    logo,
    links = defaultLinks,
    ctaButtons = {
        primary: { label: 'Get Started', href: '/sign-up' },
        secondary: { label: 'Sign In', href: '/login' },
    },
}: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Box
            as="nav"
            bg="rgba(255, 255, 255, 0.8)"
            backdropFilter="blur(10px)"
            borderBottom="1px"
            borderColor="gray.100"
            position="sticky"
            top={0}
            zIndex={1000}
        >
            <Container maxW="container.xl">
                <Flex h={16} alignItems="center" justifyContent="space-between">
                    {/* Logo */}
                    <Flex alignItems="center">
                        <Link href="/" textDecoration="none">
                            {logo || (
                                <Box fontSize="xl" fontWeight="bold" color="gray.800">
                                    Karsilo
                                </Box>
                            )}
                        </Link>
                    </Flex>

                    {/* Desktop Navigation */}
                    <HStack as="nav" gap={1} className='md:flex gap-4'>
                        {links.map((link, index) => {
                            if (isDropdown(link)) {
                                return (
                                    <MenuRoot key={index}>
                                        <MenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                fontSize="sm"
                                                color="gray.700"
                                            >
                                                {link.label}
                                            </Button>
                                        </MenuTrigger>
                                        <MenuContent>
                                            {link.items.map((item, itemIndex) => (
                                                <MenuItem
                                                    key={itemIndex}
                                                    value={item.href}
                                                    asChild
                                                >
                                                    <Link
                                                        href={item.href}
                                                        fontSize="sm"
                                                        textDecoration="none"
                                                    >
                                                        {item.label}
                                                    </Link>
                                                </MenuItem>
                                            ))}
                                        </MenuContent>
                                    </MenuRoot>
                                );
                            }

                            return (
                                <Button
                                    key={index}
                                    asChild
                                    variant="ghost"
                                    fontSize="sm"
                                    color="gray.700"
                                >
                                    <Link href={link.href} textDecoration="none">
                                        {link.label}
                                    </Link>
                                </Button>
                            );
                        })}
                    </HStack>

                    {/* CTA Buttons - Desktop */}
                    <HStack gap={2} display={{ base: 'none', md: 'flex' }}>
                        {ctaButtons.secondary && (
                            <Link href={ctaButtons.secondary.href} textDecoration="none">
                                <Button
                                    variant="outline"
                                    size="md"
                                    fontWeight="normal"
                                >
                                    {ctaButtons.secondary.label}
                                </Button>
                            </Link>
                        )}
                        {ctaButtons.primary && (
                            <Link href={ctaButtons.primary.href} textDecoration="none">
                                <Button
                                    size="md"
                                >
                                    {ctaButtons.primary.label}
                                </Button>
                            </Link>
                        )}
                    </HStack>

                    {/* Mobile Menu Button */}
                    <IconButton
                        display={{ base: 'flex', md: 'none' }}
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle Navigation"
                        variant="ghost"
                        size="sm"
                    >
                        {isOpen ? '✕' : '☰'}
                    </IconButton>
                </Flex>

                {/* Mobile Navigation */}
                {isOpen && (
                    <Box pb={4} display={{ md: 'none' }}>
                        <Stack as="nav" gap={1}>
                            {links.map((link, index) => {
                                if (isDropdown(link)) {
                                    return (
                                        <Box key={index}>
                                            <Box
                                                px={3}
                                                py={2}
                                                fontWeight="semibold"
                                                fontSize="sm"
                                                color="gray.800"
                                            >
                                                {link.label}
                                            </Box>
                                            <Stack pl={4} gap={0}>
                                                {link.items.map((item, itemIndex) => (
                                                    <Link
                                                        key={itemIndex}
                                                        href={item.href}
                                                        px={3}
                                                        py={2}
                                                        fontSize="sm"
                                                        color="gray.600"
                                                        textDecoration="none"
                                                        borderRadius="md"
                                                        _hover={{ bg: 'gray.50' }}
                                                    >
                                                        {item.label}
                                                    </Link>
                                                ))}
                                            </Stack>
                                        </Box>
                                    );
                                }

                                return (
                                    <Link
                                        key={index}
                                        href={link.href}
                                        px={3}
                                        py={2}
                                        fontSize="sm"
                                        color="gray.700"
                                        textDecoration="none"
                                        borderRadius="md"
                                        _hover={{ bg: 'gray.50' }}
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}

                            {/* CTA Buttons - Mobile */}
                            <Stack pt={4} gap={2}>
                                {ctaButtons.secondary && (
                                    <Link href={ctaButtons.secondary.href} textDecoration="none">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            width="full"
                                        >
                                            {ctaButtons.secondary.label}
                                        </Button>
                                    </Link>
                                )}
                                {ctaButtons.primary && (
                                    <Link href={ctaButtons.primary.href} textDecoration="none">
                                        <Button
                                            variant="solid"
                                            size="sm"
                                            width="full"
                                            bg="brand.600"
                                            color="white"
                                            _hover={{ bg: 'brand.700' }}
                                        >
                                            {ctaButtons.primary.label}
                                        </Button>
                                    </Link>
                                )}
                            </Stack>
                        </Stack>
                    </Box>
                )}
            </Container>
        </Box>
    );
}
