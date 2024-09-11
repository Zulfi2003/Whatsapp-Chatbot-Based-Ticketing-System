let adults = 0;
let children = 0;
let userState = {}; // Initialize user state

const handleVisitorSelection = async (client, to, messageBody) => {
    await client.sendText(to, 'How many adults will be visiting?');
const listener = client.onMessage(async (message) => {
    const to = message.from; // Sender ID
    console.log('syncing message');
    console.log('body', message.body);

    // Retrieve currentStep dynamically from userState every time a message is received
    const currentStep = userState[to]?.step || 'awaiting_adults'; // Default to awaiting_adults if not set

    if (currentStep === 'awaiting_adults') {
        const numAdults = parseInt(message.body, 10);
        console.log('numAdults', numAdults);
        if (!isNaN(numAdults) && numAdults > 0) {
            adults = numAdults;
            console.log('adults', adults);
            await client.sendText(to, `You have selected ${adults} adult(s). How many children will be visiting?`);
            userState[to] = { step: 'awaiting_children', adults }; // Update state to awaiting_children
        } else {
            await client.sendText(to, 'Please enter a valid number of adults.');
        }
    } else if (currentStep === 'awaiting_children') {
        console.log('in awaiting_children step');
        const numChildren = parseInt(message.body, 10);
        if (!isNaN(numChildren) && numChildren >= 0) {
            children = numChildren;
            console.log('children', children);
            await client.sendText(to, `You have selected ${adults} adult(s) and ${children} children.`);
            await client.sendText(to, 'Visitor selection completed. Thank you!');
            delete userState[to];
            // userState[to] = { step: 'completed' }; // Update state to completed
        } else {
            await client.sendText(to, 'Please enter a valid number of children.');
        }
    }
    // } else if (currentStep === 'completed') {
    //     await client.sendText(to, 'Visitor selection completed. Thank you!');
    //     delete userState[to]; // Clear state after completion
    // }
});
};

module.exports = { handleVisitorSelection };