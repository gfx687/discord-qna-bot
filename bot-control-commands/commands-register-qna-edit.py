import requests
import json

with open('bot-control-commands/secrets.json', 'r') as file:
    data = json.load(file)

url = f"https://discord.com/api/v10/applications/{data['APPLICATION_ID']}/commands"

json_payload = {
    "name": "qna-edit",
    "type": 1,  # slash command
    "description": "Edit existing question's answer.",
    "dm_permission": False,
    # "default_member_permissions": 0,
    "options": [
        {
            "name": "question",
            "description": "Enter target question. NOTE: Command does not allow for partial match, write full question.",
            "type": 3,  # see ApplicationCommandOptionType for types
            "required": True,
            "autocomplete": True
        },
    ],
}

headers = {
    "Authorization": "Bot " + data['BOT_TOKEN']
}

response = requests.post(url, headers=headers, json=json_payload)

print('Status Code:', response.status_code)
print('URL:', response.url)
print('Headers:\\n', response.headers)
print('Content-Type:', response.headers['Content-Type'])
print('Encoding:', response.encoding)
print('Text:\\n', response.text)  # Response body as a string

# Uncomment below line to print the entire content (for large contents, be cautious)
# print('Content:\\n', response.content)  # Response body as bytes

# print('JSON (if applicable):\\n', response.json())
print('Redirected:', response.history != [])
print('Cookies:', response.cookies)
print('Elapsed Time:', response.elapsed)
