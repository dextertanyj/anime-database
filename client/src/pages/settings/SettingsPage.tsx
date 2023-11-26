import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";

import { HeaderPageLayout } from "src/layouts/HeaderPageLayout";

import { AniDBIntegrationTab } from "./tabs/AniDBIntegrationTab";
import { ConfigurationTab } from "./tabs/ConfigurationTab";

export const SettingsPage = () => {
  return (
    <HeaderPageLayout title="Settings">
      <Tabs>
        <TabList>
          {/* <Tab>Users</Tab> */}
          <Tab>Configuration</Tab>
          <Tab>AniDB Integration Settings</Tab>
        </TabList>
        <TabPanels>
          {/* <TabPanel>
            <UsersTab />
          </TabPanel> */}
          <TabPanel>
            <ConfigurationTab />
          </TabPanel>
          <TabPanel>
            <AniDBIntegrationTab />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </HeaderPageLayout>
  );
};
