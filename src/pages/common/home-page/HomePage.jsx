import IntroHome from "../../../components/intro-home/IntroHome";
import TopVoucher from "../../../components/top-voucher/TopVoucher";

export const HomePage = () => {
  return (
    <div className="container mx-auto">
      <img
        src="https://s3-alpha-sig.figma.com/img/5a55/e81b/de4b1ef5cb07d9dc42e6beb03e6ff950?Expires=1721001600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Twh7rATLlmg7jAg6C9Y86TSs-A9lZGgf0YYiKTlZ1p05oxE~wAc1UAB3iKUR9aOsTCTQRJNCYXUaDq6sLT0gGFD~14MEAZhVld2uzlFkl0gQa~8BxIMl4PRHhLJXcF6PciNRjxRcZHcf-rxulGOL40ncFxQv7BjX-rh5j3G-AgaEeb7eo431GwWLOyi7Dr9WZL8nKHP5CF17~yaTaSXYXymop7gUDOallM7Rl9qa52AR6hPjo3K~LvskTB~HfdqpQa-pY7a06UP9pzP2Fb8ZT8CIjwOeS801AUPxPb0P2LiqBsDvRxPnIFfGiagOcdLuGLVg2vi6lY3H0V62k-pEGA__"
        alt=""
        className="w-full my-10"
      />
      <TopVoucher />
      <IntroHome />
    </div>
  );
};
