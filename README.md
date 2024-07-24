
# AllCast - Domain Name Payment Feature

## Tech Stack

Front-end: React
Back-end: Node JS
Payment Gateway: Paystack (test environment)
Hosting: Heroku

API on Heroku : [https://allcast-a214f93321f5.herokuapp.com/](https://allcast-a214f93321f5.herokuapp.com/)

Front End : [https://allcastui-5213db184bc7.herokuapp.com/](https://allcastui-5213db184bc7.herokuapp.com/)


## Installation
### Backend

Clone project from - [https://github.com/Mercyware/AllCast/tree/master](https://github.com/Mercyware/AllCast/tree/master)

In the project directory, run the command

```bash
  npm install
```

### Environment Variable Setup
Add a new file named ".env" to add environment variables
Add the following configurations in the file

`PORT=3000
NODE_ENV=dev
PAYSTACK_SECRET_KEY=your-paystack-secret
PAYSTACK_BASE_URL=https://api.paystack.co
`
You are ready to run the code
Run npm start or npm run dev in the terminal

```bash
  npm start
```
or

```bash
  npm run dev
```

There are few tests that can be tested. Run

```bash
  npm test
```


# Architectural, Design and Implemetation Decisions
The code focus solely on validating the user domain name and the email provided.
There are 4 APIs

1. GET : `{baseURL}/api/domain/availability?domain=self.com`

The API helps the user to check for the availability of a domain name. This looks throw a json file that stores all purchased and booked domain in the system.

ND: The API does not validate the domain in a public domain database. All explored API requires subscriptions.

Example response
```
{
    "message": "Validation successful",
    "result": {
        "domain": "self.com",
        "available": true,
        "price": 20000,
        "currency": "NGN"
    }
}
```

2. POST `{baseURL}/api/domain/book`

The API allow customers to book a particular domain. This API will check for the availability of a domain and store it in a JSON file, setting the status to pending. 
Booking allow customer to take hold the domain while the prepare to make payment.

NB: In a real-life scenario, a cron job shold run to clear up booked domain that are not paid for at interval

Example request
```
curl --location 'http://localhost:3000/api/domain/book' \
--header 'Content-Type: application/json' \
--data-raw '{
    "domain":"www.self.com",
    "email": "a@a.com"
}'
 ```

Example response
```
{
    "message": "Domain booked successfully",
    "booking": {
        "id": "89daa12a-2111-4f6c-b5f3-5afc82d4af46",
        "domain": "self.com",
        "email": "a@a.com",
        "status": "pending",
        "payment_reference_id": null,
        "createdAt": "2024-07-23T21:38:00.393Z",
        "updatedAt": "2024-07-23T21:38:00.393Z"
    }
}
```

3. POST `{baseURL}/api/payment/checkout`
The Payment API allow the user to make payment for already booked domain. The API will call the Paystack API, do necessary validation and update the domain status to paid if the payment is successful.

Example request
```
curl --location 'http://localhost:3000/api/payment/checkout' \
--header 'Content-Type: application/json' \
--data-raw '{
    "transaction_id": "89daa12a-2111-4f6c-b5f3-5afc82d4af46",
    "amount": 2000,
    "email": "a@a.com"
}'
```
Example response
```
{
    "booking": {
        "id": "89daa12a-2111-4f6c-b5f3-5afc82d4af46",
        "domain": "xxx.com",
        "email": "a@a.com",
        "status": "paid",
        "payment_reference_id": "efbeoknwey",
        "createdAt": "2024-07-23T21:38:00.393Z",
        "updatedAt": "2024-07-23T21:38:00.393Z"
    }
}
```


4. GET `{baseURL}/api/payment/verify/:payment_reference_id`
The verify payment API to help verify payment with payment_reference_id

Example response
```
{
    "status": true,
    "message": "Verification successful",
    "data": {
        "id": 4008262293,
        "domain": "test",
        "status": "abandoned",
        "reference": "efbeoknwey",
        "receipt_number": null,
        "amount": 200000,
        "message": null,
        "gateway_response": "The transaction was not completed",
        "paid_at": null,
        "created_at": "2024-07-23T22:08:53.000Z",
        "channel": "card",
        "currency": "NGN",
        "ip_address": "102.219.153.221, 172.70.90.128, 172.31.63.81",
        "metadata": "",
        "log": null,
        "fees": null,
        "fees_split": null,
        "authorization": {},
        "customer": {
            "id": 175946071,
            "first_name": null,
            "last_name": null,
            "email": "a@a.com",
            "customer_code": "CUS_myhp4p6pdaxfslp",
            "phone": null,
            "metadata": null,
            "risk_action": "default",
            "international_format_phone": null
        },
        "plan": null,
        "split": {},
        "order_id": null,
        "paidAt": null,
        "createdAt": "2024-07-23T22:08:53.000Z",
        "requested_amount": 200000,
        "pos_transaction_data": null,
        "source": null,
        "fees_breakdown": null,
        "connect": null,
        "transaction_date": "2024-07-23T22:08:53.000Z",
        "plan_object": {},
        "subaccount": {}
    }
}
```

