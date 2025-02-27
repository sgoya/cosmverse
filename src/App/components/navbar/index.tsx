import * as React from "react";
import { Link as ReactRouterLink } from "react-router-dom"
import {
  Box,
  Flex,
  Text,
  IconButton,
  Image,
  Button,
  Stack,
  Collapse,
  Link,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import {
  HamburgerIcon,
  CloseIcon,
} from '@chakra-ui/icons';
import { ColorModeSwitcher } from "../../ColorModeSwitcher";
import cosmverseLogo from "../../assets/logo.png";
import { AccountButton } from "../account-button";

export function Navbar(): JSX.Element {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Box>
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderBottomColor={useColorModeValue('pink.400', 'gray.300')}
        align={'center'}>
        <Flex
          flex={{ base: 0, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}>
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>
        <Flex flex={{ base: 1 }}>
          <Link
            as={ReactRouterLink}
            to="/"
            _hover={{
              textDecoration: 'none',
            }}>
             <Image src={cosmverseLogo} alt="cosmverse logo" height={6} />
          </Link>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={6}>
          <DesktopNav />
          <AccountButton />
          <ColorModeSwitcher display={{ base: 'none', md: 'inline-flex' }} />
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
}

const DesktopNav = () => {
  return (
    <Stack direction={'row'} spacing={6} display={{ base: 'none', md: 'inline-flex' }}>
      <Link
        as={ReactRouterLink}
        to="/gallery"
        p={1.5}
        fontSize={'sm'}
        fontFamily={'mono'}
        fontWeight={'semibold'}
        _hover={{
          color: useColorModeValue('pink.300', 'pink.400'),
        }}>
        Explore
      </Link>
      <Button
        as={ReactRouterLink}
        to="/create"
        verticalAlign={"middle"}
        height="var(--chakra-sizes-8)"
        fontSize={'sm'}
        fontWeight={500}
        borderRadius={'50px'}
        color={'white'}
        bg='pink.500'
        _hover={{
          bg: 'pink.700',
        }}>
        Create
      </Button>
    </Stack>
  );
};

const MobileNav = () => {
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      p={4}
      display={{ md: 'none' }}>
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, href }: NavItem) => {
  return (
    <Stack spacing={4}>
      <Flex
        py={2}
        as={ReactRouterLink}
        to={href}
        justify={'space-between'}
        align={'center'}
        _hover={{
          textDecoration: 'none',
        }}>
        <Text
          fontWeight={600}
          color={useColorModeValue('gray.600', 'gray.200')}>
          {label}
        </Text>
      </Flex>
    </Stack>
  );
};

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: 'Gallery',
    href: '/gallery',
  },
  {
    label: 'Create',
    href: '/create',
  },
];
