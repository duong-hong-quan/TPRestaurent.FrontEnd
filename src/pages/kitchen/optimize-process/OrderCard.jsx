import React from "react";
import { Card, Typography } from "antd";

const { Text } = Typography;

const OrderCard = ({ order, index }) => (
  <Card
    style={{
      width: "fit-content",
      background: index % 2 === 0 ? "#f6ffed" : "#f0f2f5",
    }}
  >
    <div className="flex items-center">
      <img
        src="https://s3-alpha-sig.figma.com/img/c817/e458/5e24a4313f974e4003568eac783fb722?Expires=1728259200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=FpTXIzyP1-CCLe7~zWawnzhpkM0lVavAiY0kxVqDRxiHZi6zH7ckBAM37xxN2W~TYMoSulOb7WOZa0llcpk0Z08MnNUq96MDBh-esp-lH5-decgVFn5ue1roVC3~DhrUv7Lsvzqlp5jk3Buoghh2HaUj8f4OKVPROzqEdt1-rWar23WcFrkRLdT9dlCRZL0ZoVRpT7pejoaqcpwGD9CUoB-5plyhFYDNWOpv76JXbjxejOOMYeawjY1dXofQWvPBF7L-MrNCwAbdCNnBEW7D3nvYEvxbEL2Lc6BLaiTcsHSTawmdAGKe8oAEP3UsE7i-zf7iThlueurJaAleYOS3-g__"
        alt="Food"
        style={{
          width: 48,
          height: 48,
          borderRadius: 4,
          marginBottom: 8,
        }}
        className="object-cover"
      />
      <Text type="success" className="mx-1">
        {order}
      </Text>
    </div>
  </Card>
);

export default OrderCard;
