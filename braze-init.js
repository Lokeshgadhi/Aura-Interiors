(function () {
  if (typeof braze === 'undefined') return;

  braze.initialize("98219d01-43d8-4704-bac4-d4f2fe2e2c60", {
    baseUrl: "sdk.fra-02.braze.eu",
    serviceWorkerLocation: "/service-worker.js",
    enableLogging: window.location.hostname === 'localhost'
  });

  braze.openSession();

  braze.logCustomEvent("page_viewed", {
    page_name: window.BRAZE_PAGE_NAME || document.title,
    page_url: window.location.href
  });

  braze.requestPushPermission();
})();
