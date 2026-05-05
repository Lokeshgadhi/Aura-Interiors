(function () {
  if (typeof braze === 'undefined') return;

  braze.initialize("YOUR_WEB_SDK_API_KEY", {
    baseUrl: "sdk.fra-02.braze.eu",
    serviceWorkerLocation: "/service-worker.js",
    enableLogging: true
  });

  braze.openSession();

  braze.logCustomEvent("page_viewed", {
    page_name: window.BRAZE_PAGE_NAME || document.title,
    page_url: window.location.href
  });

  braze.requestPushPermission();
})();
