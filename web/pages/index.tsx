import React, { useMemo, useEffect, useState } from "react";
import NextLink from "next/link";
import { LinePath } from "@visx/shape";
import { useSession } from "next-auth/react";
import appleStock, { AppleStock } from "@visx/mock-data/lib/mocks/appleStock";
import { curveMonotoneX, curveLinear } from "@visx/curve";
import { scaleTime, scaleLinear } from "@visx/scale";
import { LinearGradient } from "@visx/gradient";
import { MarkerArrow } from "@visx/marker";
import { max, extent } from "d3-array";
import { Box, Button, Heading, HStack, Link } from "@chakra-ui/react";
import { ParentSize } from "@visx/responsive";

export const background = "#3b6978";
export const backgroundAlt = "#204051";
export const accent = "#edffea";
export const accentAlt = "#75daad";

// accessors
const getDate = (d: AppleStock) => new Date(d.date);
const getStockValue = (d: AppleStock) => d.close;

export type ChartProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
};

const Chart = ({ width, height }: { width: number; height: number }) => {
  const [stock, setStock] = useState(appleStock.slice(0, 100));
  const margin = { top: 0, right: 0, bottom: 0, left: 0 };

  // bounds
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  useEffect(() => {
    let offset = 0;
    const morph = setInterval(() => {
      if (offset + 100 >= appleStock.length) clearInterval(morph);
      offset += 1;
      setStock(appleStock.slice(offset, 100 + offset));
    }, 150);
    return () => clearTimeout(morph);
  }, []);

  // scales
  const dateScale = useMemo(
    () =>
      scaleTime({
        range: [margin.left, innerWidth + margin.left],
        domain: extent(stock, getDate) as [Date, Date],
      }),
    [innerWidth, margin.left, stock[0]]
  );
  const stockValueScale = useMemo(
    () =>
      scaleLinear({
        range: [innerHeight + margin.top, margin.top],
        domain: [0, (max(stock, getStockValue) || 0) + innerHeight / 3],
        nice: true,
      }),
    [margin.top, innerHeight]
  );

  return (
    <div>
      <svg width={(width * 6) / 7} height={height}>
        <MarkerArrow id="marker-arrow" fill="#fff" refX={2} size={6} />
        <rect
          x={0}
          y={0}
          width={(width * 6) / 7}
          height={height}
          fill="url(#area-background-gradient)"
          rx={0}
        />
        <LinePath<AppleStock>
          data={stock}
          x={(d) => dateScale(getDate(d)) ?? 0}
          y={(d) => stockValueScale(getStockValue(d)) ?? 0}
          // yScale={stockValueScale}
          strokeWidth={3}
          stroke="#0c59df"
          fill="url(#area-gradient)"
          curve={curveLinear}
          markerEnd={"url(#marker-arrow)"}
        />
      </svg>
    </div>
  );
};

const IndexPage = () => {
  const { data: session } = useSession();
  return (
    <Box w="full" h="full" position="relative">
      <img
        src="https://challengepost-s3-challengepost.netdna-ssl.com/photos/production/challenge_photos/000/772/121/datas/original.gif"
        style={{ position: "absolute", top: 50, right: 50, opacity: 0.7 }}
        width="120px"
      />
      <Box
        position="absolute"
        top={0}
        left={0}
        mixBlendMode="screen"
        color="gray.300"
        p={16}
      >
        <Heading fontSize={{ base: "5xl", xl: "7em" }} as="p" mb={4}>
          Comprefinsive
        </Heading>
        <Heading
          fontSize={{ base: "4xl", xl: "5xl" }}
          fontWeight="normal"
          as="p"
          mb={8}
        >
          The one-stop shop for all your investments.
        </Heading>
        <HStack spacing={8}>
          {session?.user != null ? (
            <>
              <NextLink href="/overview" passHref>
                <Button variant="outline" as="a" h={16} fontSize="2xl">
                  Overview
                </Button>
              </NextLink>
              <NextLink href="/account" passHref>
                <Button variant="outline" as="a" h={16} fontSize="2xl">
                  Account
                </Button>
              </NextLink>
            </>
          ) : (
            <>
              <NextLink href="/sign-in" passHref>
                <Button variant="outline" as="a" h={16} fontSize="2xl">
                  Sign In
                </Button>
              </NextLink>
              <NextLink href="/sign-in" passHref>
                <Button variant="outline" as="a" h={16} fontSize="2xl">
                  Sign Up
                </Button>
              </NextLink>
            </>
          )}
        </HStack>
      </Box>
      <ParentSize>
        {(parent) => {
          return <Chart width={parent.width} height={parent.height} />;
        }}
      </ParentSize>
    </Box>
  );
};

export default IndexPage;
