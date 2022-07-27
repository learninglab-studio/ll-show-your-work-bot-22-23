const { App } = require('@slack/bolt');
const airtableTools = require(`./src/utilities/airtable-tools`);
const { blue, darkgray, gray, magenta, yellow, divider, red } = require('./src/utilities/mk-loggers')
const { appHome, projectProposal, projectHackMd, newActionView, handleActionViewSubmission } = require(`./src/show-tools`)
const mw = require('./src/utilities/slack-middleware')
const messageHandler = require('./src/show-tools/message-handler')
const handleReaction = require('./src/show-tools/handle-reaction')

require('dotenv').config()

// Initializes your app with your bot token and signing secret
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true, // add this
    appToken: process.env.SLACK_APP_TOKEN // add this
});

app.message('hello', async ({ message, say }) => {
    await say(`Hey there <@${message.user}>!`);
});

app.message(/.*/, mw.noBot, messageHandler.parseAllNonBot);

app.view(/action_submission/, handleActionViewSubmission)

app.view(/.*/, async ({ body, view, ack }) => { 
    ack();
    yellow('got any view')
    darkgray(divider, "view", view)
    // darkgray(divider, "body", body)
});

app.event(/.*/, async ({ event }) => { darkgray(event) });
app.event("reaction_added", handleReaction);
app.event('app_home_opened', appHome);

app.action(/.*/, async ({ payload, context, body, ack }) => {
    await ack();
    darkgray(divider, `ACTION PAYLOAD`, divider, payload);
    darkgray(divider, `ACTION BODY`, divider, body);
})

app.command("/projectproposal", projectProposal);
app.command("/projecthackmd", projectHackMd);
app.command("/action", newActionView);

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  red('⚡️ Bolt app is running!');
})();