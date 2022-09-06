import mailchimp from '@mailchimp/mailchimp_marketing';

mailchimp.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY,
    server: process.env.MAILCHIMP_API_SERVER // e.g. us1
});

export default async (req, res) => {
    // Check for post request
    if (req.method !== 'POST') {
        return res.status(405).send({ message: 'Only POST requests allowed' })
    }
    // check for basic auth header
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return res.status(401).send({ message: 'Missing Authorization Header' })
    }
    // verify auth credentials
    if (req.headers.authorization.split(' ')[1] !== process.env.API_ROUTE_SECRET) {
        return res.status(401).send({
            message: 'Invalid Authentication Credentials'
        })
    }

    // Check for token
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        await mailchimp.lists.addListMember(process.env.MAILCHIMP_AUDIENCE_ID, {
            email_address: email,
            status: 'subscribed'
        });

        return res.status(200).json({ error: '' });
    } catch (error) {
        return res.status(500).json({ error: error.message || error.toString() });
    }
};