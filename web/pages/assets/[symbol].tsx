import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import axios from "axios";
import { getSession } from "next-auth/react";
import DataTable, { createTheme } from "react-data-table-component";
import { Box, Container } from "@chakra-ui/react";

type Transaction = {
  symbol: string;
  change: number;
  source: "robinhood" | "coinbase" | "wallet";
  timestamp: number;
};

createTheme(
  "custom",
  {
    text: {
      primary: "#ebebed",
      secondary: "#2aa198",
    },
    background: {
      default: "#000221",
    },
    context: {
      background: "#cb4b16",
      text: "#FFFFFF",
    },
    divider: {
      default: "#073642",
    },
    action: {
      button: "rgba(0,0,0,.54)",
      hover: "rgba(0,0,0,.08)",
      disabled: "rgba(0,0,0,.12)",
    },
  },
  "dark"
);

const customStyles = {
  rows: {
    highlightOnHoverStyle: {
      backgroundColor: "rgba(230, 244, 244, 0.2)",
    },
  },
};

const AssetPage = ({ transactions }: { transactions: Transaction[] }) => {
  const columns = [
    {
      id: 1,
      name: "Change",
      selector: (row: Transaction) => row.change,
      cell: (row: Transaction) => (
        <Box
          as="span"
          color={
            row.change == 0
              ? "inherit"
              : row.change > 0
              ? "green.500"
              : "red.500"
          }
          fontFamily="JetBrains Mono"
        >
          {row.change.toFixed(4)}
        </Box>
      ),
      sortable: true,
    },
    {
      id: 2,
      name: "Source",
      selector: (row: Transaction) => row.source,
      cell: (row: Transaction) => (
        <Box as="span" textTransform="capitalize">
          {row.source}
        </Box>
      ),
      sortable: true,
    },
    {
      id: 3,
      name: "Date",
      selector: (row: Transaction) => row.timestamp,
      cell: (row: Transaction) => (
        <span>{new Date(row.timestamp * 1000).toLocaleString()}</span>
      ),
      sortable: true,
    },
    {
      id: 4,
      name: "Total",
      cell: (row: Transaction) => (
        <Box fontFamily="JetBrains Mono">
          {transactions
            .reduce(
              (acc, t) => acc + (t.timestamp > row.timestamp ? 0 : t.change),
              0
            )
            .toFixed(4)}
        </Box>
      ),
      sortable: true,
    },
  ];

  const router = useRouter();
  const { symbol } = router.query;

  return (
    <Container fontSize="xl" maxW={1000}>
      <DataTable
        columns={columns}
        data={transactions}
        theme="custom"
        defaultSortFieldId={3}
        defaultSortAsc={false}
        highlightOnHover
        customStyles={customStyles}
      />
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const symbol = context.query.symbol;
  const session = await getSession(context);
  if (session?.user?.name == null) {
    return { props: { transactions: [] } };
  }
  try {
    const transactions = (
      await axios.get(
        `${process.env.API_URL}/${session.user.email}/transactions/${symbol}`
      )
    ).data;
    return { props: { transactions } };
  } catch (e) {
    console.log(e);
    return { props: { transactions: [] } };
  }
};

export default AssetPage;