import requests

url = "https://api.github.com/search/commits?q=a36d5830147958d8d6f771815f7df07ca3672bcb"

headers = {
  'Authorization': 'Token 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'
}

response = requests.request("GET", url, headers=headers)

print(response.text)