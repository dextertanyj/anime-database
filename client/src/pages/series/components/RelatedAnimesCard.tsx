import { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Collapse,
  Heading,
  HStack,
  IconButton,
  Link,
  List,
  ListIcon,
  ListItem,
} from "@chakra-ui/react";

import { BiCaretRight } from "react-icons/bi";
import { AccordionIcon } from "src/components/AccordionIcon";
import { SeriesQuery } from "src/generated/graphql";
import {
  RELATIONSHIPS,
  seriesRelationsToDisplayString,
} from "src/utilities/series-relations.utilities";

import { CardField } from "./CardField";

export const RelatedAnimesCard = ({ data }: { data: NonNullable<SeriesQuery["series"]> }) => {
  const [show, setShow] = useState<boolean>(false);
  return (
    <Card size={["sm", "md"]}>
      <CardHeader>
        <HStack justifyContent="space-between">
          <Heading fontSize="2xl" fontWeight="semibold">
            Related Animes
          </Heading>
          <IconButton
            aria-label="expand"
            colorScheme="gray"
            icon={<AccordionIcon isExpanded={show} fontSize="2xl" />}
            onClick={() => setShow((v) => !v)}
            variant="ghost"
          />
        </HStack>
      </CardHeader>
      <Collapse in={show}>
        <CardBody pt={0}>
          {RELATIONSHIPS.map(
            (relationship) =>
              data[relationship].length > 0 && (
                <CardField key={relationship} title={seriesRelationsToDisplayString(relationship)}>
                  <List spacing={2}>
                    {data[relationship].map(({ id, title }) => (
                      <ListItem display="flex" alignItems="center" key={id}>
                        <ListIcon as={BiCaretRight} fontSize="lg" fontWeight="medium" />
                        <Link fontSize="lg" fontWeight="medium" href={`/series/${id}`}>
                          {title}
                        </Link>
                      </ListItem>
                    ))}
                  </List>
                </CardField>
              ),
          )}
        </CardBody>
      </Collapse>
    </Card>
  );
};
