import {
  BannerAd as GoogleBannerAd,
  InterstitialAd,
  TestIds,
} from "react-native-google-mobile-ads";

// 테스트 광고 ID (개발 중 사용)
const TEST_BANNER_ID = TestIds.BANNER;
const TEST_INTERSTITIAL_ID = TestIds.INTERSTITIAL;

// 실제 광고 ID (배포 시 사용)
const BANNER_ID = __DEV__
  ? TEST_BANNER_ID
  : "ca-app-pub-9203710218960521/5746084379";
const INTERSTITIAL_ID = __DEV__
  ? TEST_INTERSTITIAL_ID
  : "ca-app-pub-9203710218960521/2569256699";

// 전면 광고 인스턴스 생성
const interstitial = InterstitialAd.createForAdRequest(INTERSTITIAL_ID, {
  requestNonPersonalizedAdsOnly: true,
  keywords: ["tarot", "oracle", "divination"],
});

export const showInterstitialAd = async () => {
  try {
    console.log("Loading interstitial ad...");
    await interstitial.load();
    await interstitial.show();
    console.log("Interstitial ad shown successfully");
  } catch (error) {
    console.log("Interstitial ad error:", error);
  }
};

export const BannerAd = () => (
  <GoogleBannerAd
    unitId={BANNER_ID}
    size="BANNER"
    requestOptions={{
      requestNonPersonalizedAdsOnly: true,
    }}
    onAdLoaded={() => console.log("Banner ad loaded successfully")}
    onAdFailedToLoad={(error) => console.log("Banner ad error:", error)}
  />
);
