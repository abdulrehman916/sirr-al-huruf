
// Add this to useKeyboardDiagnostic.js for container height tracking
const trackContainerHeights = () => {
  const root = document.getElementById('root');
  const body = document.body;
  const html = document.documentElement;
  
  return {
    root: {
      clientHeight: root?.clientHeight || 0,
      scrollHeight: root?.scrollHeight || 0,
      offsetHeight: root?.offsetHeight || 0,
      styleHeight: root?.style?.height || getComputedStyle(root || {}).height,
    },
    body: {
      clientHeight: body.clientHeight,
      scrollHeight: body.scrollHeight,
    },
    html: {
      clientHeight: html.clientHeight,
      scrollHeight: html.scrollHeight,
    },
    innerHeight: window.innerHeight,
    innerWidth: window.innerWidth,
    visualViewportHeight: window.visualViewport?.height || 0,
    visualViewportOffsetTop: window.visualViewport?.offsetTop || 0,
  };
};

console.log('CONTAINER_HEIGHTS_BEFORE:', trackContainerHeights());
// Call again after keyboard opens
setTimeout(() => {
  console.log('CONTAINER_HEIGHTS_AFTER:', trackContainerHeights());
}, 500);
