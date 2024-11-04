"use client";

import React, { FC } from "react";
import { Flex, Text } from "../styles";
import EmptyBoxIcon from "../icons/empty-box-icon";

const EmptyBox: FC<{ title: string }> = ({ title }) => {
  return (
    <Flex
      direction={"column"}
      justify={"center"}
      align={"center"}
      css={{
        mt: "$8",
        gap: "$4",
        px: "$10",
        py: "$10",
        width: "100%",
        boxShadow: "$lg",
        borderRadius: "$lg",
        backgroundColor: "$accents0",
      }}
    >
      <EmptyBoxIcon />

      <Text
        h2
        css={{
          textAlign: "center",
          mb: 0,
        }}
      >
        {title}
      </Text>
    </Flex>
  );
};

export default EmptyBox;
