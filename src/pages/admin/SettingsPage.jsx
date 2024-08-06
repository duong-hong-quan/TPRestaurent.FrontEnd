import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Input,
  Switch,
  Button,
  Radio,
  Select,
  Option,
} from "@material-tailwind/react";

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    fullName: "John Doe",
    email: "johndoe@example.com",
    language: "english",
    darkMode: false,
    emailNotifications: true,
    pushNotifications: false,
    theme: "default",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name) => {
    setSettings((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleRadioChange = (name, value) => {
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveSettings = () => {
    // Here you would typically send the settings to your backend
    console.log("Saving settings:", settings);
    // Show a success message to the user
    alert("Settings saved successfully!");
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-[52rem] mx-auto">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-8 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="blue-gray">
                Settings
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Manage your account settings and set preferences
              </Typography>
            </div>
          </div>
        </CardHeader>
        <CardBody className="px-0 pt-0 pb-2">
          <form className="mt-8 mb-2 w-full max-w-screen-lg mx-auto">
            <div className="mb-4 flex flex-col gap-6">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Account Information
              </Typography>
              <Input
                size="lg"
                label="Full Name"
                name="fullName"
                value={settings.fullName}
                onChange={handleInputChange}
              />
              <Input
                size="lg"
                label="Email"
                name="email"
                value={settings.email}
                onChange={handleInputChange}
              />
              <Select
                label="Language"
                value={settings.language}
                onChange={(value) => handleSelectChange("language", value)}
              >
                <Option value="english">English</Option>
                <Option value="spanish">Spanish</Option>
                <Option value="french">French</Option>
              </Select>
            </div>

            <div className="mb-4 flex flex-col gap-6">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Appearance
              </Typography>
              <div className="flex items-center gap-4">
                <Switch
                  label="Dark Mode"
                  checked={settings.darkMode}
                  onChange={() => handleSwitchChange("darkMode")}
                />
              </div>
              <div>
                <Typography color="gray" className="mb-2">
                  Theme
                </Typography>
                <div className="flex gap-4">
                  <Radio
                    name="theme"
                    label="Default"
                    checked={settings.theme === "default"}
                    onChange={() => handleRadioChange("theme", "default")}
                  />
                  <Radio
                    name="theme"
                    label="Modern"
                    checked={settings.theme === "modern"}
                    onChange={() => handleRadioChange("theme", "modern")}
                  />
                  <Radio
                    name="theme"
                    label="Minimal"
                    checked={settings.theme === "minimal"}
                    onChange={() => handleRadioChange("theme", "minimal")}
                  />
                </div>
              </div>
            </div>

            <div className="mb-4 flex flex-col gap-6">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Notifications
              </Typography>
              <div className="flex items-center gap-4">
                <Switch
                  label="Email Notifications"
                  checked={settings.emailNotifications}
                  onChange={() => handleSwitchChange("emailNotifications")}
                />
              </div>
              <div className="flex items-center gap-4">
                <Switch
                  label="Push Notifications"
                  checked={settings.pushNotifications}
                  onChange={() => handleSwitchChange("pushNotifications")}
                />
              </div>
            </div>

            <Button onClick={handleSaveSettings} fullWidth>
              Save Settings
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default SettingsPage;
