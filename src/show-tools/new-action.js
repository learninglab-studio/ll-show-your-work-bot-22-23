const { findRecordByValue, findRecordById, addRecord } = require('../utilities/airtable-tools')
const { magenta, gray, yellow, blue, divider, red, darkgray } = require('../utilities/mk-loggers')
const modalNewActionBlocks = require('./blocks/modal-new-action')

module.exports = async ({ command, client, say, ack }) => {
    await ack()
    darkgray(`user ${command.user_id} has requested a new action 1\n${JSON.stringify(command, null, 4)}`)
    await say(`OK <@${command.user_id}>, let's create that action.`)
    if (command.text && command.text !== ""){
        try {
            const personResult = await findRecordByValue({
                baseId: process.env.AIRTABLE_22_23_BASE,
                table: "Users",
                field: "DevSlackId",
                value: command.user_id
            })
            // magenta(personResult)
            const airtableResult = await addRecord({
                baseId: process.env.AIRTABLE_22_23_BASE,
                table: "Actions",
                record: {
                    Name: command.text,
                    // command.user_id,
                    // command.channel_id,
                }
            })
            // yellow(airtableResult)
            
            say(`saved that action, find it here if you want: ${process.env.AIRTABLE_ACTION_LINK_TEMPLATE}/${airtableResult.id}?blocks=hide`)
        } catch (error) {
            say(`sorry, you are not a registered user ${command.user_id}`)
        } 
    } else {
        say("modal to come")
        const theView = {
            trigger_id: command.trigger_id,
            view: {
              type: 'modal',
              callback_id: 'modal_action_submission',
              title: {
                type: 'plain_text',
                text: 'New Action'
              },
              "blocks": modalNewActionBlocks({command, }),
            submit: {
                type: 'plain_text',
                text: 'Submit'
              }
            }
          }
        const result = await client.views.open(theView);
    }
    
    
    // await client.chat.postMessage({text: "not ready to do that just yet", channel: command.user_id})
}


