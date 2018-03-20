# get all t20 stats of matches/players from ipl's site
'''
Available stats:
Batting:
  most-runs
  most-runs-over
  most-sixes
  most-sixes-innings
  highest-scores
  highest-strikerate
  highest-strikerate-innings
  highest-averages
  most-fifties
  most-centuries
  most-fours
  most-fours-innings
  most-fours
  fastest-fifties-innings
  fastest-centuries-innings
Bowling:
  most-wickets
  best-bowling-figures
  best-averages
  best-economy
  best-strikerates-innings
  best-strikerates
  most-runs-conceded-innings
  fastest-ball
  most-hat-tricks
  most-dot-balls-bowled-innings
  most-dot-balls-bowled
  most-maiden-overs-bowled
  most-four-wickets-innings
'''

# Example URL: https://www.iplt20.com/stats/2015/most-runs-over

from bs4 import BeautifulSoup as bs
import pandas as pd
import requests
from selenium import webdriver
from time import sleep
import pdb


base_url = "https://manas.sharma:jammingtheg@iplt20.com/stats/{0}/{1}/"
stat = "most-runs"

browser = webdriver.PhantomJS()

for year in range(2008, 2018):
  url = base_url.format(year, stat)
  # print url

  # r = requests.get(url)
  print url
  browser.get(url)
  sleep(2)
  alert = browser.switch_to_alert()

  # pdb.set_trace()
# 
  # html = browser.page_source
  # soup = bs(html, "html.parser")
  # # print soup
  # table = soup.find_all("table")[0]

  # with open (str(year) + "_" + stat.replace("-", "_") + ".xls") as f:
  #   f.write(str(table))
  # break
  # df = pd.read_html(url)[2]

  # with open("batsmen_scores.csv", "a") as f:
  #   df.to_csv(f, index=False, header=False)