import React, { useState, useRef, useEffect } from "react";
import { Button, Card, CardBody, Typography } from "@material-tailwind/react";

const DualScreenPOS = () => {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [mediaStream, setMediaStream] = useState(null);
  const customerScreenRef = useRef(null);

  const addItem = (name, price) => {
    setItems([...items, { name, price }]);
    setTotal(total + price);
  };

  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      setMediaStream(stream);
    } catch (err) {
      console.error("Failed to share screen:", err);
    }
  };

  useEffect(() => {
    if (customerScreenRef.current && mediaStream) {
      customerScreenRef.current.srcObject = mediaStream;
    }
  }, [mediaStream]);

  const StaffScreen = () => (
    <Card className="w-full max-w-[400px] mx-auto mb-4">
      <CardBody>
        <Typography variant="h5" color="blue-gray" className="mb-4">
          Staff Screen
        </Typography>
        <Button onClick={() => addItem("Item 1", 5.99)} className="mr-2">
          Add Item 1 ($5.99)
        </Button>
        <Button onClick={() => addItem("Item 2", 3.99)}>
          Add Item 2 ($3.99)
        </Button>
        <Typography className="mt-4">Total Items: {items.length}</Typography>
        <Typography>Total: ${total.toFixed(2)}</Typography>
        <Button onClick={startScreenShare} className="mt-4">
          Start Customer Screen Share
        </Button>
      </CardBody>
    </Card>
  );

  const CustomerScreen = () => (
    <Card className="w-full max-w-[400px] mx-auto">
      <CardBody>
        <Typography variant="h5" color="blue-gray" className="mb-4">
          Customer Screen
        </Typography>
        {items.map((item, index) => (
          <Typography key={index}>
            {item.name}: ${item.price.toFixed(2)}
          </Typography>
        ))}
        <Typography className="mt-4 font-bold">
          Total: ${total.toFixed(2)}
        </Typography>
        <video
          ref={customerScreenRef}
          autoPlay
          muted
          className="w-full h-auto mt-4"
        />
      </CardBody>
    </Card>
  );

  return (
    <div>
      <StaffScreen />
      <CustomerScreen />
    </div>
  );
};

export default DualScreenPOS;
