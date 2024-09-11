const { handleVisitorSelection } = require('./no_of_visitor');
// Call handleVisitorSelection(client, to, messageBody) when handling user messages
const { handleUserMessage } = require('./c_s');

const sendEnglishResponse = async (client, to) => {
  const sections = [
    {
      title: 'Options',
      rows: [
        { rowId: 'book_ticket', title: 'Book a Ticket', description: '🎫 Ready to secure your spot? Let\'s get those tickets for your next adventure! 🗓️' },
        { rowId: 'exhibitions_events', title: 'Exhibitions and Events', description: '🎨 Stay in the loop with our exciting exhibitions and special events. Discover what\'s happening near you! 📅' },
        { rowId: 'customer_support', title: 'Customer Support', description: '🤝 Have questions or need help? We’re just a message away to assist you! 💬' }
      ]
    }
  ];

  const listMessage = {
    buttonText: 'Select an option',
    description: `🎟️✨ Welcome to the Museum! ✨🎟️
Your journey begins here! 🌟
Thank you for selecting your language. Let's make your experience memorable! 🎉

👇 Please choose from the options below:`,
    sections: sections,
    listType: 1
  };

  await client.sendListMessage(to, listMessage);
};

const handleEnglishOptions = async (client, to, selectedOption) => {
  try {
    switch (selectedOption) {
      case 'book_ticket':
        console.log('Handling book_ticket option');
        await handleVisitorSelection(client, to);
        break;
      case 'exhibitions_events':
        console.log('Handling exhibitions_events option');
        await client.sendText(to, '🎨 Stay in the loop with our exciting exhibitions and special events. Discover what\'s happening near you! 📅');
        break;
      case 'customer_support':
        console.log('Handling customer_support option');
        await handleUserMessage(client, to); // Ensure messageBody and to are provided correctly
        break;
      default:
        console.log('Unknown option selected:', selectedOption);
        await client.sendText(to, 'Invalid option. Please select from the list.');
    }
  } catch (error) {
    console.error('Error handling English option:', error);
  }
};

module.exports = { sendEnglishResponse, handleEnglishOptions };