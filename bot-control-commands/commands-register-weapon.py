# pylint: disable=C0103 # snake_case name for script

import json

import requests

with open('bot-control-commands/secrets.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

url = f"https://discord.com/api/v10/applications/{
    data['APPLICATION_ID']}/guilds/{data['GUILD_ID']}/commands"

json_payload = {
    "name": "weapon",
    "type": 1,  # slash command
    "description": "Search for weapon's mod tree info.",
    "dm_permission": False,
    "options": [
        {
            "name": "weapon-name",
            "description": "Enter weapon or tool name.",
            "type": 3,  # see ApplicationCommandOptionType for types
            "required": True,
            "autocomplete": True
        },
        {
            "name": "tier",
            "description": "(Optional) Specify tier you want to see.",
            "type": 3,  # see ApplicationCommandOptionType for types
            "required": False,
            "autocomplete": False
        }
    ],
}

headers = {
    "Authorization": "Bot " + data['BOT_TOKEN']
}

response = requests.post(url, headers=headers, json=json_payload, timeout=5)

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