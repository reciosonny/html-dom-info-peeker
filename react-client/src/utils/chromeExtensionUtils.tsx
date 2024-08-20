

const onMessageEvent = (fn: any) => {
  
  console.log('injecting chrome onMessage event');
  
  /**
   * Sample function: function (msg, sender, sendResponse) { }
   */
   // @ts-ignore
  chrome.runtime.onMessage.addListener(fn);
}



export {
  onMessageEvent
}