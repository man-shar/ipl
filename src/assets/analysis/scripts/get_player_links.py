# get all batsmen scores of india's matches from stats guru

from bs4 import BeautifulSoup as bs
import pandas as pd
import requests
import json

base_url = "http://stats.espncricinfo.com/ci/engine/stats/index.html"
proxies = {
  'http': 'http://172.16.114.12:3128',
  'https': 'http://172.16.114.12:3128',
}

links = {};

for i in range(1, 52):
  url = "http://stats.espncricinfo.com/ci/engine/stats/index.html?class=11;filter=advanced;orderby=start;size=200;spanmin1=1+Jan+2001;spanval1=span;team=6;template=results;type=batting;view=innings;page={0}".format(i)

  r = requests.get(url, proxies=proxies)
  soup = bs(r.text, "html.parser")
  print i
  for tr in soup.find_all("tr", class_="data1"):
    node = tr.find("a", class_="data-link");
    links[str(node.text)] = "http://www.espncricinfo.com" + str(node["href"]);
    # links[] = 
  # df = pd.read_html(url)[2]

  with open("player_links.json", "w") as f:
    json.dump(links, f, indent=2)