import React, { useEffect } from "react";
import { Pie } from "@visx/shape";
import { Tooltip, defaultStyles } from "@visx/tooltip";
import { Group } from "@visx/group";
import { scaleOrdinal } from "@visx/scale";
import { letterFrequency } from "@visx/mock-data";
import { useState } from "react";

const letters = letterFrequency.slice(0, 4);
const frequency = (d: any) => d.frequency;
const quoteBalance = (asset: any) => asset.quoteBalance;
const symbol = (asset: any) => asset.symbol;

const colors = ["#0c59df", "#0e6cd8", "#137bd2", "#138bcb"];

function getColor(index: number) {
  return colors[index % colors.length];
}

const defaultMargin = { top: 20, right: 20, bottom: 20, left: 20 };

export type PieChartProps = {
  width: number;
  height: number;
  assets: any;
  margin?: typeof defaultMargin;
};

const PieChart = ({
  width,
  height,
  assets,
  margin = defaultMargin,
}: PieChartProps) => {
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const radius = Math.min(innerWidth, innerHeight) / 2;
  const centerY = innerHeight / 2;
  const centerX = innerWidth / 2;
  const top = centerY + margin.top;
  const left = centerX + margin.left;
  const pieSortValues = (a: number, b: number) => b - a;

  const [pieHover, setPieHover] = useState("");

  return (
    <div style={{ position: "relative" }}>
      <div>
        {/* <p style={{position: "absolute", fontSize: "30px", color: "ebebed", height: "100%", width: "100%", display: "flex", alignContent: "center", alignItems: "center", justifyContent: "center", zIndex: "1"}}>TESTING</p> */}
        <p
          style={{
            position: "absolute",
            fontSize: "30px",
            color: "ebebed",
            left: "170px",
            top: "175px",
          }}
        >
          {pieHover}
        </p>
      </div>
      <svg width={width} height={height} style={{ zIndex: "10" }}>
        <Group top={top} left={left}>
          <Pie
            data={assets}
            pieValue={quoteBalance}
            pieSortValues={pieSortValues}
            outerRadius={radius}
            innerRadius={(2 * radius) / 3}
            padAngle={0.015}
            cornerRadius={7}
          >
            {(pie) => {
              return pie.arcs.map((arc, index) => {
                const { letter } = arc.data;
                const [centroidX, centroidY] = pie.path.centroid(arc);
                const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.1;
                const arcPath = pie.path(arc);
                const arcFill = getColor(index);
                return (
                  <g key={`arc-${letter}-${index}`} style={{ zIndex: "10" }}>
                    <path
                      d={arcPath || undefined}
                      fill={arcFill}
                      className="arc"
                      onMouseEnter={() => {
                        setPieHover(arc.data.symbol);
                      }}
                      onMouseLeave={() => {
                        setPieHover("");
                      }}
                    />
                    {/* {hasSpaceForLabel && (
                      <text
                        x={centroidX}
                        y={centroidY}
                        dy=".33em"
                        fill="#ffffff"
                        fontSize={22}
                        textAnchor="middle"
                        pointerEvents="none"
                      >
                        {arc.data.letter}
                      </text>
                    )} */}
                  </g>
                );
              });
            }}
          </Pie>
        </Group>
      </svg>
    </div>
  );
};

export default PieChart;
