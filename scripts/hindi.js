const { sendVisitorSelection } = require('./no_of_visitor');
const { handleCustomerSupport } = require('./c_s');

const sendHindiResponse = async (client, to) => {
  try {
    console.log('sendHindiResponse called with:', { to });

    const sections = [
      {
        title: 'विकल्प',
        rows: [
          { rowId: 'book_ticket', title: 'टिकट बुक करें', description: '🎫 अपनी अगली यात्रा के लिए टिकट सुरक्षित करने के लिए तैयार हैं? 🗓️' },
          { rowId: 'exhibitions_events', title: 'प्रदर्शनियाँ और कार्यक्रम', description: '🎨 हमारे रोमांचक प्रदर्शनियों और विशेष कार्यक्रमों के साथ बने रहें। जानें कि आपके पास क्या हो रहा है! 📅' },
          { rowId: 'customer_support', title: 'ग्राहक सहायता', description: '🤝 प्रश्न हैं या मदद चाहिए? हम आपकी सहायता के लिए एक संदेश दूर हैं! 💬' }
        ]
      }
    ];

    const listMessage = {
      buttonText: 'एक विकल्प चुनें',
      description: `🎟️✨ संग्रहालय में आपका स्वागत है! ✨🎟️
आपकी यात्रा यहाँ से शुरू होती है! 🌟
भाषा चुनने के लिए धन्यवाद। आइए आपके अनुभव को यादगार बनाते हैं! 🎉

👇 कृपया नीचे दिए गए विकल्पों में से चुनें:`,
      sections: sections,
      listType: 1
    };

    await client.sendListMessage(to, listMessage);
  } catch (error) {
    console.error('Error in sendHindiResponse:', error);
  }
};

const handleHindiOption = async (client, to, selectedOption) => {
  try {
    console.log('handleHindiOption called with:', { to, selectedOption });
    switch (selectedOption) {
      case 'book_ticket':
        await sendVisitorSelection(client, to);
        break;
      case 'exhibitions_events':
        await client.sendText(to, '🎨 हमारे रोमांचक प्रदर्शनियों और विशेष कार्यक्रमों के साथ बने रहें। जानें कि आपके पास क्या हो रहा है! 📅');
        break;
      case 'customer_support':
        await client.sendText(to, '🤝 प्रश्न हैं या मदद चाहिए? हम आपकी सहायता के लिए एक संदेश दूर हैं! 💬');
        break;
      default:
        await client.sendText(to, 'अमान्य विकल्प। कृपया सूची से चुनें।');
    }
  } catch (error) {
    console.error('Error in handleHindiOption:', error);
  }
};

module.exports = { sendHindiResponse, handleHindiOption };