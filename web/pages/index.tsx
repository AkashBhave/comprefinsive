import React, { useMemo, useEffect, useState } from "react";
import NextLink from "next/link";
import { AreaClosed } from "@visx/shape";
import appleStock, { AppleStock } from "@visx/mock-data/lib/mocks/appleStock";
import { curveMonotoneX } from "@visx/curve";
import { GridRows, GridColumns } from "@visx/grid";
import { scaleTime, scaleLinear } from "@visx/scale";
import { LinearGradient } from "@visx/gradient";
import { ParentSize } from "@visx/responsive";
import { max, extent } from "d3-array";
import { Box, Button, Heading, HStack, Link } from "@chakra-ui/react";

import { AreaProps } from "@/components/area-chart";

export const background = "#3b6978";
export const backgroundAlt = "#204051";
export const accentColor = "#edffea";
export const accentColorDark = "#75daad";

// accessors
const getDate = (d: AppleStock) => new Date(d.date);
const getStockValue = (d: AppleStock) => d.close;

export type ChartProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
};

const Chart = ({
  width,
  height,
  margin = { top: 0, right: 0, bottom: 0, left: 0 },
}: AreaProps) => {
  const [stock, setStock] = useState(appleStock.slice(0, 100));

  // bounds
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  useEffect(() => {
    let offset = 0;
    const morph = setInterval(() => {
      if (offset + 100 >= appleStock.length) clearInterval(morph);
      offset += 1;
      setStock(appleStock.slice(offset, 100 + offset));
      console.log(offset, 100 + offset);
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
      <svg width={width} height={height}>
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill="url(#area-background-gradient)"
          rx={0}
        />
        <LinearGradient
          id="area-background-gradient"
          from={background}
          to={backgroundAlt}
        />
        <LinearGradient
          id="area-gradient"
          from={accentColor}
          to={accentColor}
          fromOpacity={0.5}
          toOpacity={0.1}
        />
        <GridRows
          left={margin.left}
          scale={stockValueScale}
          width={innerWidth}
          strokeDasharray="1,3"
          stroke={accentColor}
          strokeOpacity={0.2}
          pointerEvents="none"
        />
        <GridColumns
          top={margin.top}
          scale={dateScale}
          height={innerHeight}
          strokeDasharray="1,3"
          stroke={accentColor}
          strokeOpacity={0.2}
          pointerEvents="none"
        />
        <AreaClosed<AppleStock>
          data={stock}
          x={(d) => dateScale(getDate(d)) ?? 0}
          y={(d) => stockValueScale(getStockValue(d)) ?? 0}
          yScale={stockValueScale}
          strokeWidth={4}
          stroke="#8960a3"
          fill="url(#area-gradient)"
          curve={curveMonotoneX}
        />
      </svg>
    </div>
  );
};

const IndexPage = () => {
  return (
    <Box w="full" h="full" position="relative">
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
          fontSize={{ base: "4xl", xl: "6xl" }}
          fontWeight="normal"
          as="p"
          mb={8}
        >
          The one-stop shop for your investments.
        </Heading>
        <HStack spacing={8} color="gray.800">
          <NextLink href="/sign-in" passHref>
            <Link
              as={Button}
              fontSize="2xl"
              h={16}
              _hover={{ textDecoration: "none" }}
            >
              Sign In
            </Link>
          </NextLink>
          <NextLink href="/sign-up" passHref>
            <Link
              as={Button}
              fontSize="2xl"
              h={16}
              _hover={{ textDecoration: "none" }}
            >
              Sign Up
            </Link>
          </NextLink>
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
