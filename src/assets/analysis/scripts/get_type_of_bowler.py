import requests
import json
from bs4 import BeautifulSoup as bs

links = json.load(open("./bowlers_links.json"));
bowler_types = {}

proxies = {
  'http': 'http://manas.sharma:jammingtheg@202.141.80.22:3128',
  'https': 'http://manas.sharma:jammingtheg@202.141.80.22:3128',
}

def get_node_with_type(nodes):
  for node in nodes:
    if node.select("b")[0].string == "Bowling style":
      return node

  return None


for bowler in links:
  r = requests.get(links[bowler], proxies=proxies)
  soup = bs(r.text, "html.parser")
  print bowler
  node = get_node_with_type(soup.select(".ciPlayerinformationtxt"))
  if node:
    bowler_type = node.select("span")[0].string
    print bowler_type
    bowler_types[bowler] = bowler_type

# uncomment to write to file.
json.dump(bowler_types, open("bowler_types.json", "w"), indent=2)