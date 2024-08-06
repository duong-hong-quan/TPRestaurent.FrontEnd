import React, { useState } from "react";
import {
  Card,
  List,
  ListItem,
  ListItemPrefix,
  Avatar,
  Typography,
  Input,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { ArrowLeftIcon, PhoneIcon } from "@heroicons/react/24/solid";

const Messenger = ({ selectedContact }) => {
  const mockMessages = [
    { id: 1, sender: "user", text: "Hey there!", timestamp: "10:00 AM" },
    { id: 2, sender: "other", text: "Hi! How are you?", timestamp: "10:01 AM" },
    {
      id: 3,
      sender: "user",
      text: "I'm doing great, thanks! How about you?",
      timestamp: "10:02 AM",
    },
    {
      id: 4,
      sender: "other",
      text: "I'm good too. What are your plans for today?",
      timestamp: "10:03 AM",
    },
    {
      id: 5,
      sender: "user",
      text: "Just working on some coding projects. You?",
      timestamp: "10:04 AM",
    },
  ];

  const [messages, setMessages] = useState(mockMessages);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: "user",
        text: inputMessage,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages([...messages, newMessage]);
      setInputMessage("");
    }
  };

  return (
    <Card className="w-full h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center">
          <IconButton variant="text" className="mr-2 lg:hidden">
            <ArrowLeftIcon className="h-5 w-5" />
          </IconButton>
          <Avatar
            src={selectedContact.avatar}
            alt={selectedContact.name}
            size="sm"
          />
          <div className="ml-3">
            <Typography variant="h6">{selectedContact.name}</Typography>
            <Typography variant="small" color="gray">
              {selectedContact.phone}
            </Typography>
          </div>
        </div>
        <IconButton variant="text">
          <PhoneIcon className="h-5 w-5" />
        </IconButton>
      </div>
      <div className="flex-grow overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`rounded-lg p-2 max-w-[70%] ${
                message.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              <Typography variant="small">{message.text}</Typography>
              <Typography variant="small" className="text-xs mt-1 opacity-70">
                {message.timestamp}
              </Typography>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t">
        <div className="flex items-center">
          <Input
            type="text"
            placeholder="Type a message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-grow"
          />
          <Button color="blue" className="ml-2" onClick={handleSendMessage}>
            Send
          </Button>
        </div>
      </div>
    </Card>
  );
};

const ContactList = ({ onSelectContact }) => {
  const mockContacts = [
    {
      id: 1,
      name: "John Doe",
      avatar: "https://via.placeholder.com/40",
      phone: "+1 234 567 890",
    },
    {
      id: 2,
      name: "Jane Smith",
      avatar: "https://via.placeholder.com/40",
      phone: "+1 987 654 321",
    },
    {
      id: 3,
      name: "Alice Johnson",
      avatar: "https://via.placeholder.com/40",
      phone: "+1 555 123 456",
    },
  ];

  return (
    <Card className="w-full h-full lg:w-96">
      <List>
        {mockContacts.map((contact) => (
          <ListItem key={contact.id} onClick={() => onSelectContact(contact)}>
            <ListItemPrefix>
              <Avatar src={contact.avatar} alt={contact.name} />
            </ListItemPrefix>
            <div>
              <Typography variant="h6">{contact.name}</Typography>
              <Typography variant="small" color="gray">
                {contact.phone}
              </Typography>
            </div>
          </ListItem>
        ))}
      </List>
    </Card>
  );
};

const MessengerApp = () => {
  const [selectedContact, setSelectedContact] = useState(null);

  return (
    <div className="flex flex-col lg:flex-row p-4 gap-4 h-screen">
      <div
        className={`w-full lg:w-96 ${selectedContact ? "hidden lg:block" : ""}`}
      >
        <ContactList onSelectContact={setSelectedContact} />
      </div>
      {selectedContact && (
        <div className="flex-grow">
          <Messenger selectedContact={selectedContact} />
        </div>
      )}
    </div>
  );
};

export default MessengerApp;
