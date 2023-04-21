import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  HStack,
  Link,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { format } from "date-fns";

import { TextCardField } from "src/components/Card/CardField";
import { SeriesQuery } from "src/generated/graphql";
import { renderSeason } from "src/utilities/season.utilities";
import { renderSeriesStatus } from "src/utilities/series-status.utilties";

export const SeriesInformationCard = ({ data }: { data: NonNullable<SeriesQuery["series"]> }) => {
  return (
    <Card size={["sm", "md"]}>
      <CardHeader pb={0}>
        <Heading fontSize="2xl" fontWeight="semibold">
          Information
        </Heading>
      </CardHeader>
      <CardBody>
        <Stack spacing={4}>
          <SimpleGrid columns={{ base: 1, lg: data.type.singular ? 3 : 4 }} spacing={4}>
            <TextCardField title="Type" content={data.type.type} />
            <TextCardField title="Status" content={renderSeriesStatus(data.status)} />
            <TextCardField
              title="Release Date"
              content={
                data.releaseSeason && data.releaseYear
                  ? `${renderSeason(data.releaseSeason)} ${data.releaseYear}`
                  : data.releaseYear
                  ? data.releaseYear
                  : "Unknown"
              }
            />
            {data.type.singular || (
              <TextCardField title="No. Of Episodes" content={data.episodes.length || "Unknown"} />
            )}
          </SimpleGrid>
          {data.remarks && <TextCardField title="Remarks" content={data.remarks} />}
        </Stack>
      </CardBody>
      <CardFooter>
        <Stack w="full" justifyContent="space-between" direction="row-reverse" spacing={8}>
          <Text alignSelf="end" as="i" fontSize="sm">
            Last updated: {format(new Date(data.updatedAt), "yyyy-MM-dd hh:mm a")}
          </Text>
          <HStack spacing={2}>
            {data.references.length > 0 && <Text fontSize="sm">Resources:</Text>}
            {data.references.map((reference) => (
              <Link
                key={reference.id}
                href={reference.link}
                isExternal
                rel="noreferrer noopener"
                fontSize="sm"
              >
                {reference.source}
              </Link>
            ))}
          </HStack>
        </Stack>
      </CardFooter>
    </Card>
  );
};
