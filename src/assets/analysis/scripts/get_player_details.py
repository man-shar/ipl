# get all batsmen scores of india's matches from stats guru

from bs4 import BeautifulSoup as bs
import pandas as pd
import requests
import json
import re
import sys

base_url = "http://stats.espncricinfo.com/ci/engine/stats/index.html"
proxies = {
  'http': 'http://172.16.114.12:3128',
  'https': 'http://172.16.114.12:3128',
}

all_info = {}

with open("player_links.json", "r+") as f:
  links = json.load(f)

for player in links:
  print player
  try:
    url = links[player]
    player_id = re.search("([0-9]*)(?=\.html)", url).groups()[0]
    all_info[player] = {}
    all_info[player]["id"] = player_id
    r = requests.get(url, proxies=proxies)
    soup = bs(r.text, "html.parser")

    basic_info = soup.find_all("p", class_="ciPlayerinformationtxt")
    for info in basic_info:
      info_title = info.find("b").string
      info_values = info.find_all("span")
      info_value = ""

      for value in info_values:
        info_value += value.text

      all_info[player][info_title] = info_value

      bnb = soup.find_all("table", class_="engineTable")
      bat = bnb[0]
      bowl = bnb[1]

    activities = ["batting", "bowling"]

    for i, table in enumerate([bat, bowl]):
      heads = []
      for th in table.find("thead").find_all("th"):
        if th.string == "":
          continue
        heads.append(th.string)

      all_info[player][activities[i]] = {}

      table_rows = table.find("tbody").find_all("tr")
      for table_row in table_rows:
        row_values = table_row.find_all("td")
        match_type = row_values[0].find("b").string

        all_info[player][activities[i]][match_type] = {};

        for j in range(1, len(row_values)):
          # print row_values[i].string
          all_info[player][activities[i]][match_type][heads[j]] = row_values[j].string.strip()

    with open("./player_details.json", "w+") as f:
      json.dump(all_info, f, indent=2)

  except:
    print "error in: " + player
    with(open("log.txt", "a")) as log:
      log.write(player + "\n")
      log.write("Unexpected error:" + str(sys.exc_info()) + "\n")
