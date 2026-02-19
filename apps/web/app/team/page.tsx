import {
  Box,
  Container,
  Heading,
  Text,
  Grid,
  VStack,
  Flex,
} from "@repo/ui/index";
import { FadeIn } from "../../components/dom/scroll-animations";

export const metadata = {
  title: "Team | Karsilo",
  description: "Meet the people behind Karsilo.",
};

interface TeamMember {
  name: string;
  role: string;
  bio?: string;
  avatar?: string;
}

const team: TeamMember[] = [
  {
    name: "Elliot Coiley",
    role: "Co-Founder",
  },
  {
    name: "Nicholas James",
    role: "Co-Founder",
  },
  {
    name: "Brad Owen",
    role: "Full Stack Software Developer",
  },
];

function getInitials(name: string) {
  const parts = name.split(" ");
  return (parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "");
}

function EmployeeCard({ member }: { member: TeamMember }) {
  return (
    <Box
      p={{ base: 6, md: 8 }}
      bg="white"
      borderRadius="2xl"
      boxShadow="sm"
      border="1px solid"
      borderColor="gray.100"
      transition="all 0.3s ease"
      _hover={{ boxShadow: "lg", transform: "translateY(-4px)" }}
    >
      <VStack gap={4}>
        {member.avatar ? (
          <img
            src={member.avatar}
            alt={member.name}
            width={80}
            height={80}
            style={{ borderRadius: "9999px", objectFit: "cover", width: "80px", height: "80px" }}
          />
        ) : (
          <Flex
            width="80px"
            height="80px"
            borderRadius="full"
            bg="gray.900"
            color="white"
            align="center"
            justify="center"
            fontSize="xl"
            fontWeight="bold"
          >
            {getInitials(member.name)}
          </Flex>
        )}
        <VStack gap={1}>
          <Heading as="h3" fontSize="lg" fontWeight="semibold" color="gray.900">
            {member.name}
          </Heading>
          <Text fontSize="sm" fontWeight="medium" color="brand.600">
            {member.role}
          </Text>
          {member.bio && (
            <Text fontSize="sm" color="gray.600" textAlign="center">
              {member.bio}
            </Text>
          )}
        </VStack>
      </VStack>
    </Box>
  );
}

export default function TeamPage() {
  return (
    <Box
      as="section"
      py={{ base: 16, md: 24 }}
      bg="gray.50"
      minH="100vh"
      position="relative"
      overflow="hidden"
    >
      {/* Dot grid overlay */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        opacity={0.4}
        backgroundImage="radial-gradient(circle at 2px 2px, #d1d5db 1px, transparent 0)"
        backgroundSize="32px 32px"
        pointerEvents="none"
      />

      {/* Decorative grey circles */}
      <Box
        position="absolute"
        top="-100px"
        right="-80px"
        width="350px"
        height="350px"
        bg="gray.200"
        opacity={0.3}
        borderRadius="full"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="-120px"
        left="-100px"
        width="300px"
        height="300px"
        bg="gray.200"
        opacity={0.25}
        borderRadius="full"
        pointerEvents="none"
      />

      <Container maxW="container.xl" position="relative" zIndex={1}>
        <FadeIn>
          <Flex direction="column" align="center" textAlign="center" mb={12}>
            <Box mb={4}>
              <Text
                fontSize="sm"
                fontWeight="semibold"
                color="brand.600"
                textTransform="uppercase"
                letterSpacing="wide"
              >
                Company
              </Text>
            </Box>
            <Heading
              as="h1"
              fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
              fontWeight="bold"
              color="gray.900"
              mb={4}
            >
              Meet the Team
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              The people building Karsilo — making Stripe management simple for
              businesses everywhere.
            </Text>
          </Flex>
        </FadeIn>

        <Grid
          templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
          gap={8}
          maxW="4xl"
          mx="auto"
        >
          {team.map((member, index) => (
            <FadeIn key={member.name} delay={0.1 + 0.1 * index} direction="up">
              <EmployeeCard member={member} />
            </FadeIn>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
