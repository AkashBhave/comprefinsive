import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { useSession, signIn, signOut } from "next-auth/react";
import { Box, Container, Heading } from "@chakra-ui/react";

import AreaChart from "@/components/area-chart";
import PieChart from "@/components/pie-chart";

const HomePage: NextPage = () => {
  const { data: session } = useSession();
  return (
    <Container as="main" maxW={800}>
      <Box as="section" mb={12}>
        <Heading as="h2" fontSize="3xl" mb={6}>
          Performance
        </Heading>
        <AreaChart width={800} height={600} />
      </Box>
      <Box as="section">
        <Heading as="h2" fontSize="3xl" mb={6}>
          Breakdown
        </Heading>
        <PieChart width={800} height={600} />
      </Box>
    </Container>
  );
};

export default HomePage;
