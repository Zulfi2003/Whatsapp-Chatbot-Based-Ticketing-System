const wppconnect = require('@wppconnect-team/wppconnect');
const { sendEnglishResponse, handleEnglishOptions } = require('./english');
const { sendHindiResponse } = require('./hindi');
// const { handleVisitorSelection } = require('./no_of_visitor');

wppconnect.create({
  session: 'mySessionName',
  catchQR: (base64Qrimg) => {
    console.log('QR Code:', base64Qrimg);
  },
  statusFind: (status) => {
    console.log('Status:', status);
  },
  onLoadingScreen: (percent, message) => {
    console.log(`Loading: ${percent}% - ${message}`);
  },
  catchLinkCode: (code) => {
    console.log('Link Code:', code);
  },
  options: {
    headless: true,
    devtools: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
  }).then(client => {
  console.log('Client connected.');
  // Track the state for each user
  const userState = {};

  client.onMessage(async (message) => {
    console.log('Received message:', message);

    if (!message.isGroupMsg) {
      const userId = message.from;

      // Initialize user state if not present
      if (!userState[userId]) {
        userState[userId] = { step: 'language_selection' };
      }

      try {
        // Handle language selection
        if (userState[userId].step === 'language_selection' && message.body.toLowerCase() === 'hi') {
          await client.sendListMessage(
            message.from,
            {
              buttonText: 'Select a language',
              description: 'Welcome to the Museum Ticketing System! Please choose your preferred language:',
              sections: [
                {
                  title: 'Languages',
                  rows: [
                    { rowId: 'english', title: 'English', description: 'Select this for English' },
                    { rowId: 'hindi', title: 'Hindi', description: 'Select this for Hindi' },
                  ],
                },
              ],
              listType: 1
            }
          );
          userState[userId].step = 'waiting_for_language_selection';
        } else if (userState[userId].step === 'waiting_for_language_selection' && message.type === 'list_response') {
          const selectedLanguage = message.listResponse.singleSelectReply.selectedRowId;
          console.log('Selected language:', selectedLanguage);

          if (selectedLanguage === 'english') {
            console.log('English language selected');
            userState[userId].step = 'option_selection'; // Move to next step
            await sendEnglishResponse(client, message.from);
          } else if (selectedLanguage === 'hindi') {
            console.log('Hindi language selected');
            userState[userId].step = 'hindi_option_selection'; // Move to Hindi option selection
            await sendHindiResponse(client, message.from);
          } else {
            await client.sendText(message.from, 'Invalid option. Please say "hi" to start over.');
            userState[userId].step = 'language_selection';
          }
        } else if (userState[userId].step === 'option_selection' && message.type === 'list_response') {
          const selectedOption = message.listResponse.singleSelectReply.selectedRowId;
          console.log('Selected option:', selectedOption);
          await handleEnglishOptions(client, message.from, selectedOption);
        } else if (userState[userId].step === 'hindi_option_selection' && message.type === 'list_response') {
          const selectedOption = message.listResponse.singleSelectReply.selectedRowId;
          console.log('Selected option:', selectedOption);
          await handleHindiOptions(client, message.from, selectedOption);
        }
        
      } catch (error) {
        console.error('Error handling message:', error);
      }
    }
  });

}).catch(error => {
  console.error('Error initializing WPPConnect:', error);
});