import requests
import json

with open('bot-control-commands/secrets.json', 'r') as file:
    data = json.load(file)

url = f"https://discord.com/api/v10/applications/{data['APPLICATION_ID']}/commands"

headers = {
    "Authorization": "Bot " + data['BOT_TOKEN']
}

response = requests.get(url, headers=headers)

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