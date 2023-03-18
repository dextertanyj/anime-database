import { Heading, Stack } from "@chakra-ui/react";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";

import { ConfigurationTab } from "./tabs/ConfigurationTab";
import { UsersTab } from "./tabs/UsersTab";

export const SettingsPage = () => {
  return (
    <Stack h="full" w="full">
      <Heading>Settings</Heading>
      <Tabs>
        <TabList>
          <Tab>Users</Tab>
          <Tab>Configuration</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <UsersTab />
          </TabPanel>
          <TabPanel>
            <ConfigurationTab />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Stack>
  );
};
