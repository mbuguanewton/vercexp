import config from 'config'
import axios from 'axios'

const slackWebhook = process.env.SLACK_WEBHOOK || config.get('slack.webhook')

export async function sendInfoToSlack(text) {
    const payload = {
        attachments: [
            {
                fallback: text.message,
                pretext: 'This is just in, you have some info',
                title: text.title,
                color: '#805AD5',
                fields: [
                    {
                        title: 'Message',
                        value: text.message,
                        short: false,
                    },
                    {
                        title: 'Values',
                        value: JSON.stringify(text.value),
                        short: false,
                    },
                    {
                        title: 'Project',
                        value: 'Aesops API',
                        short: true,
                    },
                    {
                        title: 'Environment',
                        value: process.env.NODE_ENV,
                        short: true,
                    },
                ],
            },
        ],
    }
    await axios.post(slackWebhook, payload, {
        headers: { 'Content-Type': 'application/json' },
    })
}

export async function sendToSlack(error) {
    const payload = {
        attachments: [
            {
                fallback:
                    error.message ||
                    error.description ||
                    'Something went wrong!',
                pretext: error.message || error.description,
                title: error.toString(),
                color: '#F35A00',
                fields: [
                    {
                        title: 'Error Stack',
                        value: error.stack,
                        short: false,
                    },
                    {
                        title: 'Project',
                        value: 'Aesops Backend',
                        short: true,
                    },
                    {
                        title: 'Environment',
                        value: process.env.NODE_ENV,
                        short: true,
                    },
                ],
            },
        ],
    }
    await axios.post(slackWebhook, payload, {
        headers: { 'Content-Type': 'application/json' },
    })
}
