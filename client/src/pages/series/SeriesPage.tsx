import { useState } from "react";
import { Button, Collapse, Heading, HStack, IconButton, Stack } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";

import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { series } from "src/hooks/operations/useSeries";

import { RelatedAnimesCard } from "./components/RelatedAnimesCard";
import { SeriesInformationCard } from "./components/SeriesInformationCard";

export const SeriesPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showAlternativeTitles, setShowAlternativeTitles] = useState<boolean>(false);
  const { data } = series.useGet({ id: id ?? "" });

  if (!id) {
    navigate(-1);
    return null;
  }

  if (!data?.series) {
    return null;
  }

  return (
    <Stack w="full" maxW="950px" spacing={4}>
      <Stack spacing={0}>
        <HStack justifyContent="space-between">
          <HStack alignItems="center">
            <Heading size="xl">{data.series.title}</Heading>
            <IconButton
              icon={showAlternativeTitles ? <BiChevronUp size={20} /> : <BiChevronDown size={20} />}
              colorScheme="gray"
              variant="ghost"
              borderRadius="20px"
              size="sm"
              aria-label="alternative-titles"
              onClick={() => setShowAlternativeTitles((v) => !v)}
            />
          </HStack>
          <HStack spacing={2}>
            <Button
              colorScheme="green"
              variant="outline"
              onClick={() => {
                navigate("edit");
              }}
            >
              Edit
            </Button>
            <Button colorScheme="red" variant="outline">
              Delete
            </Button>
          </HStack>
        </HStack>
        <Collapse in={showAlternativeTitles}>
          {data.series.alternativeTitles.map((title, index) => (
            <div key={index}>{title}</div>
          ))}
        </Collapse>
      </Stack>
      <SeriesInformationCard data={data.series} />
      <RelatedAnimesCard data={data.series} />
    </Stack>
  );
};
