# get all batsmen scores of india's matches from stats guru

from bs4 import BeautifulSoup as bs
import pandas as pd
import requests
import csv
import fileinput
import re

base_url = "http://stats.espncricinfo.com/ci/engine/stats/index.html"

proxies = {
  'http': 'http://172.16.114.12:3128',
  'https': 'http://172.16.114.12:3128',
}

headers = ["player","runs","mins","bf","4s","6s","sr","inns","match_type","opposition","ground","start_date"]

with open("./batsmen_scores.csv", "w") as f:
  wr = csv.writer(f)
  wr.writerow(headers)
  # check page numbers by opening link once and enter limit as max_page+1
  for i in range(1, 52):
    payload = {
      "class": "11",
      "filter": "advanced",
      "orderby": "start",
      "size": "200",
      "spanmin1": "01 Jan 2001",
      "spanval1": "span",
      "team": "6",
      "template": "results",
      "type": "batting",
      "view": "innings",
      "page": i
    }

    r = requests.get(base_url, params=payload, proxies=proxies)
    soup = bs(r.text, "html.parser")
    print i
    table = soup.find_all("table", class_="engineTable")[2]
    rows = table.find_all("tr", class_="data1")

    wr.writerows([[td.text.encode("utf-8") for td in row.find_all("td")] for row in rows])


with open("./batsmen_scores.csv", "r") as f:
  data = f.read()

# remove double commas and split opposition into two colmns
# add 0 to date day in case single digit.
with open("./batsmen_scores.csv", "w") as f:
  data = data.replace(" v ", ",")
  data = data.replace(",,", ",")
  data = re.sub(r"(,\n)", "\n", data)
  data = re.sub("(?<=,)()(?=[0-9] .*? [0-9][0-9][0-9][0-9])", "0", data)
  f.write(data);