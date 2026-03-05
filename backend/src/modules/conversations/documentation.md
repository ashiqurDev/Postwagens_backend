# Conversations API Documentation

This documentation provides details about the API endpoints for the Conversations module.

## 1. Send Message

This endpoint allows a user to send a message to another user. If a conversation between the two users does not exist, it will be created automatically.

- **URL:** `/api/v1/conversations/messages`
- **Method:** `POST`
- **Authentication:** Required (user must be logged in)
- **Request Body:**

  - The request body should be a `multipart/form-data` object with the following fields:

| Field          | Type     | Description                                                                                             | Required |
| -------------- | -------- | ------------------------------------------------------------------------------------------------------- | -------- |
| `participantBId` | `string` | The ID of the user to whom the message is being sent.                                                  | Yes      |
| `text`         | `string` | The text content of the message.                                                                        | No       |
| `listingId`    | `string` | The ID of the listing this message is associated with (optional).                                       | No       |
| `media`        | `file`   | A media file (image or video) to be sent with the message (optional).                                   | No       |

- **Example `curl` Request (with media):**

  ```bash
  curl -X POST \
    http://localhost:5000/api/v1/conversations/messages \
    -H 'Authorization: Bearer <YOUR_AUTH_TOKEN>' \
    -F 'participantBId=60d5f1f0e7a4b00015b3b3b3' \
    -F 'text=Check out this picture!' \
    -F 'media=@/path/to/your/image.jpg'
  ```

- **Example `curl` Request (text only):**

  ```bash
  curl -X POST \
    http://localhost:5000/api/v1/conversations/messages \
    -H 'Authorization: Bearer <YOUR_AUTH_TOKEN>' \
    -H 'Content-Type: application/json' \
    -d '{
          "participantBId": "60d5f1f0e7a4b00015b3b3b3",
          "text": "Hello, I am interested in your listing.",
          "listingId": "60d5f1f0e7a4b00015b3b3b4"
        }'
  ```

- **Success Response:**

  - **Status Code:** `201 Created`
  - **Body:**

    ```json
    {
      "success": true,
      "message": "Message sent successfully",
      "data": {
        "conversationId": "60d5f1f0e7a4b00015b3b3b5",
        "senderId": "60d5f1f0e7a4b00015b3b3b2",
        "text": "Hello, I am interested in your listing.",
        "listing": "60d5f1f0e7a4b00015b3b3b4",
        "sentAt": "2024-05-18T12:00:00.000Z",
        "_id": "60d5f1f0e7a4b00015b3b3b6",
        "__v": 0
      }
    }
    ```

## 2. Get Conversations for User

This endpoint retrieves all conversations for the currently logged-in user.

- **URL:** `/api/v1/conversations`
- **Method:** `GET`
- **Authentication:** Required (user must be logged in)
- **Success Response:**

  - **Status Code:** `200 OK`
  - **Body:**

    ```json
    {
      "success": true,
      "message": "Conversations retrieved successfully",
      "data": [
        {
          "_id": "60d5f1f0e7a4b00015b3b3b5",
          "participantAId": {
            "_id": "60d5f1f0e7a4b00015b3b3b2",
            "name": "John Doe"
          },
          "participantBId": {
            "_id": "60d5f1f0e7a4b00015b3b3b3",
            "name": "Jane Doe"
          },
          "createdAt": "2024-05-18T12:00:00.000Z",
          "updatedAt": "2024-05-18T12:00:00.000Z",
          "__v": 0,
          "hasUnreadMessages": true
        }
      ]
    }
    ```

## 3. Get Messages for a Conversation

This endpoint retrieves all messages for a specific conversation.

- **URL:** `/api/v1/conversations/:conversationId/messages`
- **Method:** `GET`
- **Authentication:** Required (user must be logged in and a participant of the conversation)
- **URL Parameters:**

  - `conversationId` (string, required): The ID of the conversation.

- **Success Response:**

  - **Status Code:** `200 OK`
  - **Body:**

    ```json
    {
      "success": true,
      "message": "Messages retrieved successfully",
      "data": [
        {
          "_id": "60d5f1f0e7a4b00015b3b3b6",
          "conversationId": "60d5f1f0e7a4b00015b3b3b5",
          "senderId": "60d5f1f0e7a4b00015b3b3b2",
          "text": "Hello, I am interested in your listing.",
          "listing": "60d5f1f0e7a4b00015b3b3b4",
          "sentAt": "2024-05-18T12:00:00.000Z",
          "__v": 0
        }
      ]
    }
    ```

## 4. Mark Messages as Read

This endpoint marks all unread messages in a conversation as read for the currently logged-in user.

- **URL:** `/api/v1/conversations/:conversationId/read`
- **Method:** `PATCH`
- **Authentication:** Required (user must be logged in and a participant of the conversation)
- **URL Parameters:**

  - `conversationId` (string, required): The ID of the conversation.

- **Success Response:**

  - **Status Code:** `200 OK`
  - **Body:**

    ```json
    {
      "success": true,
      "message": "Messages marked as read successfully",
      "data": null
    }
    ```
