# Feature: Prepare payment details
 
## 1. User goal
What do users want to achieve from being able to prepare the payment details? 
To allow pet owners to prepare payment details for a pet service for quicker future checkouts (Note: preparing payment details is NOT processing a payment).

## 2. Scope
Will this feature be safe for the user to save their payment details into? 
For this classroom mock endpoint, no login is required. The feature will handle mock catalogue lookups, return JSON responses with currency `sgd` and status `READY_FOR_PAYMENT`, and handle unknown services with HTTP 404 (`{"error":"Service not found"}`). Charging money, payment gateways, new tables, or new pages are NOT included.

## 3. Request
What HTTP method and URL are used? What input is needed?
- HTTP Method: POST
- URL: `/api/payment/prepare` (or equivalent endpoint)
- Input needed: Selected service ID or choice

## 4. Service catalogue
What are the available services for users to be able to purchase?
- Vaccination: 35
- Pet Grooming: 50
- Boarding: 80

## 5. Successful response
What HTTP status, JSON fields, values and types are required?
- HTTP Status: 200 OK
- JSON fields, values, and types: `currency` (String: "sgd"), `status` (String: "READY_FOR_PAYMENT"), and the service price chosen by the server.

## 6. Unsuccessful response
What happens when the requested service does not exist?
- The server returns an HTTP 404 status with the JSON response: `{"error":"Service not found"}`.

## 7. Acceptance criteria
- AC1: Given service ID 1 (Vaccination), when preparing payment, the system returns a successful response with price 35, currency `sgd`, and status `READY_FOR_PAYMENT`.
- AC2: Given service ID 2 (Pet Grooming), when preparing payment, the system returns a successful response with price 50, currency `sgd`, and status `READY_FOR_PAYMENT`.
- AC3: Given service ID 3 (Boarding), when preparing payment, the system returns a successful response with price 80, currency `sgd`, and status `READY_FOR_PAYMENT`.
- AC4: Given a successful request, the response is formatted as JSON containing the correct currency, status, and server-determined price.
- AC5: Given an unknown service ID (such as 999), the system returns HTTP 404 with `{"error":"Service not found"}`.

## 8. Open questions
What has not yet been agreed? Do not silently invent an answer.
- The specific details for actual payment processing, gateway integration, and new database tables, as these are explicitly out of scope for the current lesson.
