import requests
import os

url = "https://api.github.com/search/commits?q=a36d5830147958d8d6f771815f7df07ca3672bcb"

headers = {
  'Authorization': 'Token ' + os.env['GITHUB_API_KEY']
}

response = requests.request("GET", url, headers=headers)

print(response.text)